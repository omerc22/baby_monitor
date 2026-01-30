'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Pencil, Save, X, User, Calendar, FileText, Baby } from 'lucide-react';
import { clsx } from 'clsx';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function BabyInfoCard() {
    const { data, error, isLoading, mutate } = useSWR('/api/proxy/get/babyinfo?id=1', fetcher);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', birth_date: '', notes: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const baby = Array.isArray(data) ? data[0] : data;
        if (baby && !isEditing) {
            setFormData({
                name: baby.name || baby.Name || '',
                birth_date: baby.birth_date || baby.BirthDate || '',
                notes: baby.notes || baby.Notes || '',
            });
        }
    }, [data, isEditing]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const queryParams = new URLSearchParams({
                name: formData.name,
                birth_date: formData.birth_date,
                notes: formData.notes
            });

            await fetch(`/api/proxy/update/baby?${queryParams}`, {
                method: 'POST',
            });

            const newData = Array.isArray(data) ? [{ ...data[0], ...formData }] : { ...(data || {}), ...formData };
            await mutate(newData, false);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to save', err);
            alert('Failed to save baby info');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-6 bg-white rounded-2xl border animate-pulse h-64"></div>;
    if (error) return <div className="p-6 bg-red-50 text-red-500 rounded-2xl border">Error loading baby info</div>;

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full bg-gradient-to-br from-white to-slate-50">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Baby className="w-5 h-5" />
                    </div>
                    Baby Information
                </h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
                            title="Cancel"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full"
                            title="Save"
                        >
                            <Save className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-4 flex-1">
                {/* Name Field */}
                <div className="group">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                            />
                        ) : (
                            <p className="text-lg font-medium text-slate-700">{formData.name || 'Unknown Baby'}</p>
                        )}
                    </div>
                </div>

                {/* Date Field */}
                <div className="group">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Birth Date</label>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        {isEditing ? (
                            <input
                                type="date"
                                value={formData.birth_date ? formData.birth_date.split('T')[0] : ''}
                                onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                            />
                        ) : (
                            <p className="text-lg font-medium text-slate-700">
                                {formData.birth_date ? new Date(formData.birth_date).toLocaleDateString() : 'Not Set'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Notes Field */}
                <div className="group">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Important Notes</label>
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors mt-1" />
                        {isEditing ? (
                            <textarea
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none min-h-[100px]"
                            />
                        ) : (
                            <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg w-full min-h-[80px]">
                                {formData.notes || 'No notes available.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
