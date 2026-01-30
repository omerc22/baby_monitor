'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { clsx } from 'clsx';

interface HistoryChartProps {
    title: string;
    data: any[];
    dataKey: string;
    color: string;
    unit: string;
}

export function HistoryChart({ title, data, dataKey, color, unit }: HistoryChartProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                {title}
                <span className="text-xs font-normal text-slate-500 px-2 py-1 bg-slate-100 rounded-full">Last 24h</span>
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="log_time"
                            tick={{ fontSize: 12, fill: '#64748B' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#64748B' }}
                            tickLine={false}
                            axisLine={false}
                            unit={unit}
                            width={40}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#64748B', marginBottom: '4px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            fill={`url(#gradient-${dataKey})`}
                            strokeWidth={3}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
