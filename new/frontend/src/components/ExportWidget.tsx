'use client';

import { FileDown, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';

export function ExportWidget() {
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        const res = await fetch('/api/proxy/get/graphdata');
        if (!res.ok) throw new Error('Failed to download data');
        const data = await res.json();
        // API returns list of records
        return data;
    };

    const handleDownloadCSV = async () => {
        try {
            setIsLoading(true);
            const data = await fetchData();
            if (!Array.isArray(data)) { alert('No data available'); return; }

            const headers = ['ID', 'Temperature', 'Humidity', 'Sound Level', 'Time'];
            const csvContent = [
                headers.join(','),
                ...data.map((row: any) => [
                    row.id,
                    row.temperature,
                    row.humidity,
                    row.sound_level,
                    row.log_time
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'baby_monitor_data.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            alert('Export Failed');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            setIsLoading(true);
            const data = await fetchData();
            if (!Array.isArray(data)) { alert('No data available'); return; }

            const doc = new jsPDF();
            doc.text("Baby Monitor - Environment Log", 14, 15);

            const tableData = data.map((row: any) => [
                new Date(row.log_time).toLocaleString(),
                `${row.temperature}°C`,
                `${row.humidity}%`,
                `${row.sound_level}dB`
            ]);

            autoTable(doc, {
                head: [['Time', 'Temperature', 'Humidity', 'Sound']],
                body: tableData,
                startY: 20,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [99, 102, 241] } // Indigo-500
            });

            doc.save("baby_monitor_report.pdf");
        } catch (e) {
            alert('Export Failed');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center gap-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Export Data</h3>
            <p className="text-sm text-slate-500 mb-4">Download historical environmental data for analysis.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                    onClick={handleDownloadCSV}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-indigo-200 transition-all font-semibold text-slate-600 hover:text-indigo-600"
                >
                    <FileText className="w-5 h-5" />
                    Download CSV
                </button>

                <button
                    onClick={handleDownloadPDF}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all font-semibold"
                >
                    <FileDown className="w-5 h-5" />
                    Download PDF
                </button>
            </div>
        </div>
    );
}
