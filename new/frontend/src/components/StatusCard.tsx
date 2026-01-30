import { clsx } from 'clsx';
import { Thermometer, Droplets, Volume2 } from 'lucide-react';

interface StatusCardProps {
    type: 'temperature' | 'humidity' | 'sound';
    value: number | string;
}

export function StatusCard({ type, value }: StatusCardProps) {
    let status: 'safe' | 'alert' | 'warmth' | 'cold' = 'safe';
    let message = 'Normal';
    let Icon = Thermometer;
    let unit = '°C';
    let label = 'Temperature';

    // Parse value for logic checks
    const numValue = typeof value === 'number' ? value : parseFloat(String(value));
    const isValid = !isNaN(numValue);

    // Logic based on user requirements
    if (type === 'temperature') {
        label = 'Temperature';
        unit = '°C';
        Icon = Thermometer;
        if (isValid) {
            if (numValue < 18) {
                status = 'cold';
                message = 'Low Temperature';
            } else if (numValue > 30) {
                status = 'alert';
                message = 'High Temperature';
            }
        }
    } else if (type === 'humidity') {
        label = 'Humidity';
        unit = '%';
        Icon = Droplets;
        if (isValid) {
            if (numValue < 30) {
                status = 'warmth';
                message = 'Low Humidity';
            } else if (numValue > 70) {
                status = 'warmth';
                message = 'High Humidity';
            }
        }
    } else if (type === 'sound') {
        label = 'Sound Level';
        unit = 'dB';
        Icon = Volume2;
        if (isValid) {
            if (numValue > 55) {
                status = 'alert';
                message = 'Baby is Crying!';
            }
        }
    }

    // Styles mapping
    const styles = {
        safe: {
            container: 'bg-white border-indigo-100/50 text-secondary hover:border-indigo-200',
            icon: 'text-indigo-500 bg-indigo-50',
            value: 'text-slate-700',
        },
        alert: {
            container: 'bg-rose-50 border-rose-200 text-rose-700 shadow-rose-100',
            icon: 'text-rose-500 bg-rose-100',
            value: 'text-rose-700',
        },
        warmth: {
            container: 'bg-amber-50 border-amber-200 text-amber-700 shadow-amber-100',
            icon: 'text-amber-500 bg-amber-100',
            value: 'text-amber-700',
        },
        cold: {
            container: 'bg-blue-50 border-blue-200 text-blue-700 shadow-blue-100',
            icon: 'text-blue-500 bg-blue-100',
            value: 'text-blue-700',
        },
    };

    const currentStyle = styles[status];

    return (
        <div className={clsx(
            "relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300",
            "shadow-sm hover:shadow-md",
            currentStyle.container
        )}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">{label}</h3>
                    <p className="text-xs opacity-75 mt-1 font-medium">{status === 'safe' ? 'Stable' : 'Attention Needed'}</p>
                </div>
                <div className={clsx("p-3 rounded-xl", currentStyle.icon)}>
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
            </div>

            <div className="flex items-baseline gap-1">
                <span className={clsx("text-4xl font-extrabold tracking-tight", currentStyle.value)}>
                    {value}
                </span>
                <span className="text-lg font-medium opacity-70">{unit}</span>
            </div>

            {status !== 'safe' && (
                <div className="mt-4 flex items-center gap-2 animate-pulse">
                    <span className="inline-block w-2 h-2 rounded-full bg-current"></span>
                    <span className="text-sm font-bold">{message}</span>
                </div>
            )}
        </div>
    );
}
