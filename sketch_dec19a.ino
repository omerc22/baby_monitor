#include <SoftwareSerial.h>
#include "DHT.h"

// PINS
#define DHTPIN 2
#define DHTTYPE DHT11
#define SOUND_PIN A0
#define ESP_RX 10
#define ESP_TX 11

// settings can be adjusted here
#define PERIOD_LENGTH 60000         // DATA COLLECTION HANDLED WITHIN 1(60(seconds) * 10^3 ms) MINUTE.
#define MEASURE_START 40000         // START OF DATA COLLECTION 00:40 ( in 1 period ) 
#define MEASURE_END 50000          // END OF DATA COLLECTION 00:40 
#define SOUND_SAMPLE_INTERVAL 50   // 50ms delay for sound capture
#define DHT_SAMPLE_INTERVAL 1000    // 1 sec delay for temperature sensor
#define MAX_SOUND_SAMPLES 50        // (MEASURE_END-MEASURE_START) / SOUND_SAMPLE_INTERVAL (just limited to 50 for now)
#define MAX_DHT_SAMPLES 10          // (MEASURE_END-MEASURE_START) / DHT_SAMPLE_INTERVAL


// WIFI SETTINGS 
const String ssid = "";
const String password = "";
const String server = "";
const int port = 80;


SoftwareSerial ESPserial(ESP_RX, ESP_TX);
DHT dht(DHTPIN, DHTTYPE);

unsigned long periodStart = 0; // to determine the period

void setup() {
    Serial.begin(9600);
    ESPserial.begin(9600);
    dht.begin();
    
    connectToWiFi(); // wifi connection function

    periodStart = millis(); 
}

void loop() {

    unsigned long currentTime = millis() - periodStart;
    
    // 9:40 - 9:50 arası ölçüm zamanı
    if (currentTime >= MEASURE_START && currentTime <= MEASURE_END) {
        float temperature, humidity;
        float soundLevel;

        Serial.print("Sensor measurement started. Estimated collection time: "); Serial.print(MEASURE_END - MEASURE_START); Serial.println(" ms");
        if (collectSoundData(&soundLevel) && collectDHTData(&temperature, &humidity)) {
            sendData(temperature, humidity, soundLevel);
        }
        else{
          Serial.println("Check sensors.");
        }
        
        // Periyodu sıfırla
        Serial.print("Temperature: "); Serial.print(temperature); Serial.print("\t");
        Serial.print("Humidity: "); Serial.print(humidity); Serial.print("\t");
        Serial.print("Sound Level: "); Serial.print(soundLevel); Serial.println(" dB");
        periodStart = millis();
    }
}

// reads a set of temperature and humidity values,
// and calculates the avg of it.
bool collectDHTData(float *temperature, float *humidity) {
    float tempSum = 0, humSum = 0;
    int valid = 0;
    
    for (int i = 0; i < MAX_DHT_SAMPLES; i++) {
        float h = dht.readHumidity();
        float t = dht.readTemperature();
        
        // checking if DHT does send valid data
        if (!isnan(h) && !isnan(t)) {
            humSum += h;
            tempSum += t;
            valid++;
        }
        
        delay(DHT_SAMPLE_INTERVAL);
    }
    
    if (valid > 0) {
        *temperature = tempSum / valid;
        *humidity = humSum / valid; 
        return true;
    } else {
        Serial.println("DHT11 did not provide any data.");
        return false;
    }
}

bool collectSoundData(float *soundLevel) {
    float soundLevels[MAX_SOUND_SAMPLES];
    float soundSum = 0;
    float minSound = 200;
    float maxSound = 0;
    int sampleCount = 0;
    
    // collects sound level data
    for (int i = 0; i < MAX_SOUND_SAMPLES; i++) {
        float currentSound = soundCalibration();
        soundLevels[i] = currentSound;
        soundSum += currentSound;
        

        // min-max
        if (currentSound < minSound) 
          minSound = currentSound;
        if (currentSound > maxSound) 
          maxSound = currentSound;
        
        sampleCount++;
        delay(SOUND_SAMPLE_INTERVAL);
    }
    
  
    if (sampleCount > 0) {
  
        // If there is a huge difference between maximum and minimum values
        // program assumes it's noisy right now and assigns the maximum data to soundLevel

        // if not, average of samples will be asigned to soundLevel.
      if ((maxSound - minSound) < 30) { 
        *soundLevel = soundSum / sampleCount;
        Serial.print("Avg sound sent");
      } else {
        *soundLevel = maxSound;
         Serial.print("Max sound sent");
         //Serial.print(maxSound); Serial.println(" dB");
      }

    return true;
}

    
    return false;
}
// calibrates sound to reference values
float soundCalibration() {
    unsigned long startMillis = millis();
    const int sampleWindow = SOUND_SAMPLE_INTERVAL;
    unsigned int peakToPeak = 0;
    unsigned int signalMax = 0;
    unsigned int signalMin = 1024;
    unsigned int sample;
    
    while (millis() - startMillis < sampleWindow) {
        sample = analogRead(SOUND_PIN);
        if (sample < 1024) {
            if (sample > signalMax) {
                signalMax = sample;
            } else if (sample < signalMin) {
                signalMin = sample;
            }
        }
    }
    
    peakToPeak = signalMax - signalMin;
    float dBSPLPeak = 74 + 20.0 * log10((float)abs(peakToPeak) / 256.0);
    
    return !isinf(dBSPLPeak) ? dBSPLPeak : 30.2;
}
// wifi connection 
void connectToWiFi() {
    sendATCommand("AT", 1000, "OK");
    sendATCommand("AT+CWMODE=1", 1000, "OK"); // makes ESP8266 station/receiver/client 
    sendATCommand("AT+CWJAP=\"" + ssid + "\",\"" + password + "\"", 10000, "OK"); // starts connection to wifi network
    sendATCommand("AT+CIPMUX=0", 1000, "OK"); // single connection mode
}

// sending temp, humidity and sound levels
void sendData(float temperature, float humidity, float sound_level) {
    String data = "temperature=" + String(temperature, 2) + 
                     "&humidity=" + String(humidity, 2) + 
                     "&sound_level=" + String(sound_level, 2);

    String httpRequest = "POST /baby_monitor/add_record.php HTTP/1.1\r\n";
    httpRequest += "Host: " + server + "\r\n";
    httpRequest += "Content-Type: application/x-www-form-urlencoded\r\n";
    httpRequest += "Content-Length: " + String(data.length()) + "\r\n";
    httpRequest += "\r\n";
    httpRequest += data;

    sendATCommand("AT+CIPSTART=\"TCP\",\"" + server + "\"," + String(port), 5000, "OK");
    sendATCommand("AT+CIPSEND=" + String(httpRequest.length()), 1000, ">");
    ESPserial.print(httpRequest);
    delay(2000);
    sendATCommand("AT+CIPCLOSE", 1000, "OK");
}


// sending command to ESP8266

void sendATCommand(String command, int timeout, String expectedResponse) {
    ESPserial.println(command);
    long int time = millis();
    while (millis() - time < timeout) {
        while (ESPserial.available()) {
            String response = ESPserial.readString();
            Serial.print(response);
            if (response.indexOf(expectedResponse) != -1) {
                return;
            }
        }
    }
}