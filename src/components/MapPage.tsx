'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { COMPANIES } from '@/lib/companies';
import { useState } from 'react';
import { MapPin } from 'lucide-react';

// 修正 Leaflet 預設 marker icon 路徑
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapPage() {
  const [filter, setFilter] = useState<'all' | 'life' | 'property'>('all');

  const filtered = COMPANIES.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'life') return /壽|人壽|郵|保誠|安聯|全球|合作|台銀/i.test(c.name);
    return /產/i.test(c.name);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><MapPin size={24} /> 保險公司地圖</h1>
          <p className="text-sm opacity-60">全台 {COMPANIES.length} 家保險公司總部分佈（紅=高申訴率）</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm">
          <option value="all">全部 ({COMPANIES.length})</option>
          <option value="life">壽險</option>
          <option value="property">產險</option>
        </select>
      </div>
      <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 h-[600px]">
        <MapContainer center={[23.8, 121]} zoom={8} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((c) => {
            const isHighComplaint = c.complaintRate > 0.5;
            const color = isHighComplaint ? '#dc2626' : '#059669';
            return (
              <Marker
                key={c.id}
                position={[c.latitude, c.longitude]}
                icon={L.divIcon({
                  className: 'custom-marker',
                  html: `<div style="background:${color};color:white;padding:2px 6px;border-radius:4px;font-size:11px;font-weight:600;white-space:nowrap;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)">${c.shortName}</div>`,
                  iconSize: [60, 22],
                  iconAnchor: [30, 11],
                })}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold mb-1">{c.name}</div>
                    <div className="text-xs text-slate-600 mb-2">{c.headquarters}</div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>申訴率：</div>
                      <div className={isHighComplaint ? 'text-red-600 font-bold' : ''}>{c.complaintRate} 件/萬</div>
                      <div>業務量：</div>
                      <div>{c.totalPolicies} 萬件</div>
                      <div>創立：</div>
                      <div>{c.foundedYear}</div>
                      <div>電話：</div>
                      <div>{c.contactPhone}</div>
                    </div>
                    <a href={c.websiteUrl} target="_blank" rel="noreferrer" className="text-emerald-600 text-xs underline mt-2 inline-block">官網 →</a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      <div className="text-xs opacity-60">
        💡 資料來源：金管會保險局、保發中心公開統計。座標為示意值。
      </div>
    </div>
  );
}