'use client';

import useSWR from 'swr';
import { StatusCard } from '@/components/StatusCard';
import { HistoryChart } from '@/components/HistoryChart';
import { BabyInfoCard } from '@/components/BabyInfoCard';
import { ExportWidget } from '@/components/ExportWidget';
import { Activity } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DashboardPage() {
  const { data: lastRecord, error: lastRecordError } = useSWR('/api/proxy/get/lastrecord', fetcher, {
    refreshInterval: 60000,
    fallbackData: { temperature: 0, humidity: 0, sound_level: 0 } // Prevent crash on initial load before fetch
  });

  const { data: graphData } = useSWR('/api/proxy/get/graphdata', fetcher, {
    refreshInterval: 60000
  });

  // Prepare graph data (ensure array)
  const chartData = Array.isArray(graphData) ? graphData : [];

  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Baby Monitor</h1>
          </div>
          <p className="text-secondary ml-1">Real-time Environment Dashboard</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">System Status</div>
          <div className="flex items-center gap-2 justify-end">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-emerald-600">Live Monitoring</span>
          </div>
        </div>
      </header>

      {/* Top Section: Status Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          type="temperature"
          value={lastRecord?.temperature ?? '--'}
        />
        <StatusCard
          type="humidity"
          value={lastRecord?.humidity ?? '--'}
        />
        <StatusCard
          type="sound"
          value={lastRecord?.sound_level ?? '--'}
        />
      </section>

      {/* Middle Section: Graphics */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoryChart
          title="Temperature History"
          data={chartData}
          dataKey="temperature"
          color="#6366F1" // Indigo
          unit="°C"
        />
        <HistoryChart
          title="Humidity History"
          data={chartData}
          dataKey="humidity"
          color="#10B981" // Emerald/Safe (or maybe use Cyan/Teal?) - Using Emerald for humidity
          unit="%"
        />
        {/* We could add sound history if needed, but the prompt only asked for Temp and Humidity history charts */}
      </section>

      {/* Bottom Section: Info & Export */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BabyInfoCard />
        <ExportWidget />
      </section>

      <footer className="text-center text-slate-400 text-sm py-8 border-t border-slate-100 mt-12">
        Baby Monitor Dashboard v1.0
      </footer>
    </main>
  );
}
