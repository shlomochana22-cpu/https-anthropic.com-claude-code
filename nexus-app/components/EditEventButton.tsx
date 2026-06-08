"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { updateEvent } from "@/lib/createEvent";
import type { NexusEvent } from "@/lib/events";

export function EditEventButton({ event }: { event: NexusEvent }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [venue, setVenue] = useState(event.venue);
  const [city, setCity] = useState(event.city);
  const [genre, setGenre] = useState(event.genre);
  const [occupancy, setOccupancy] = useState(event.occupancy);
  const [description, setDescription] = useState(event.description ?? "");

  const reset = () => {
    setTitle(event.title); setDate(event.date); setTime(event.time); setVenue(event.venue);
    setCity(event.city); setGenre(event.genre); setOccupancy(event.occupancy); setDescription(event.description ?? "");
    setError(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    const res = await updateEvent(event.id, { title, date, time, venue, city, genre, occupancy: Number(occupancy) || 0, description });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      setError(res.error || "השמירה נכשלה");
    }
  };

  const field = (label: string, value: string, onChange: (v: string) => void, type = "text") => (
    <div className="space-y-1">
      <label className="text-label-sm text-on-surface-variant">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface focus:border-primary-fixed outline-none" />
    </div>
  );

  return (
    <>
      <button onClick={() => { reset(); setOpen(true); }} className="inline-flex items-center gap-1.5 bg-surface-container-high border border-white/10 text-primary px-4 py-2 rounded-lg text-label-md hover:border-primary-fixed/40 active:scale-95 transition-all">
        <Icon name="edit" className="text-[18px]" /> עריכת אירוע
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative glass-card w-full max-w-md rounded-2xl p-5 border border-primary-fixed/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-primary">עריכת אירוע</h3>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-surface"><Icon name="close" /></button>
            </div>

            <div className="space-y-3">
              {field("שם האירוע", title, setTitle)}
              <div className="grid grid-cols-2 gap-3">
                {field("תאריך", date, setDate)}
                {field("שעה", time, setTime)}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field("מקום", venue, setVenue)}
                {field("עיר", city, setCity)}
              </div>
              {field("ז'אנר", genre, setGenre)}
              <div className="space-y-1">
                <label className="text-label-sm text-on-surface-variant">תפוסה (% שנמכר): {occupancy}%</label>
                <input type="range" min={0} max={100} value={occupancy} onChange={(e) => setOccupancy(Number(e.target.value))} className="w-full accent-[#bff520]" />
              </div>
              <div className="space-y-1">
                <label className="text-label-sm text-on-surface-variant">תיאור</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2.5 text-on-surface resize-none focus:border-primary-fixed outline-none" />
              </div>

              {error && <p className="text-error text-label-sm flex items-center gap-1"><Icon name="error" className="text-[15px]" fill /> {error}</p>}

              <button onClick={save} disabled={saving || !title.trim()} className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon-primary active:scale-95 transition-all disabled:opacity-40 disabled:shadow-none">
                <Icon name="save" /> {saving ? "שומר…" : "שמירת שינויים"}
              </button>
              <p className="text-[10px] text-on-surface-variant/60 text-center">לעריכת מחירי כרטיסים — בקרוב. כרגע ניתן לערוך את פרטי האירוע.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
