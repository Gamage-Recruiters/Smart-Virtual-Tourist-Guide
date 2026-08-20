import React, { useState } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const AGGREGATED_METRICS_MATRIX = {
  '7d': [
    { metric: 'International Arrivals (Air)', current: '14,250', target: '12,000', yieldLKR: '45.8M', status: 'Optimal' },
    { metric: 'Regional Eco-Lodging Bookings', current: '3,840',  target: '4,000',  yieldLKR: '18.2M', status: 'Nominal' },
    { metric: 'Digital Heritage Pass Sales',  current: '9,120',  target: '8,500',  yieldLKR: '32.4M', status: 'Optimal' },
    { metric: 'SME Tour Micro-Transactions', current: '22,600', target: '20,000', yieldLKR: '14.1M', status: 'Optimal' },
    { metric: 'Cross-Border Transport Passes', current: '5,110',  target: '6,500',  yieldLKR: '8.5M',  status: 'At Risk' },
  ],
  '30d': [
    { metric: 'International Arrivals (Air)', current: '62,400',  target: '55,000',  yieldLKR: '198.4M', status: 'Optimal' },
    { metric: 'Regional Eco-Lodging Bookings', current: '15,900',  target: '16,000',  yieldLKR: '74.5M',  status: 'Nominal' },
    { metric: 'Digital Heritage Pass Sales',  current: '38,200',  target: '35,000',  yieldLKR: '134.8M', status: 'Optimal' },
    { metric: 'SME Tour Micro-Transactions', current: '94,100',  target: '90,000',  yieldLKR: '58.2M',  status: 'Optimal' },
    { metric: 'Cross-Border Transport Passes', current: '21,400',  target: '26,000',  yieldLKR: '35.1M',  status: 'At Risk' },
  ],
  '90d': [
    { metric: 'International Arrivals (Air)', current: '192,500', target: '180,000', yieldLKR: '612.5M', status: 'Optimal' },
    { metric: 'Regional Eco-Lodging Bookings', current: '49,200',  target: '48,000',  yieldLKR: '224.1M', status: 'Optimal' },
    { metric: 'Digital Heritage Pass Sales',  current: '114,800', target: '110,000', yieldLKR: '412.0M', status: 'Optimal' },
    { metric: 'SME Tour Micro-Transactions', current: '284,000', target: '275,000', yieldLKR: '174.6M', status: 'Optimal' },
    { metric: 'Cross-Border Transport Passes', current: '68,300',  target: '78,000',  yieldLKR: '110.4M', status: 'Nominal' },
  ],
};

const REVENUE_BY_SECTOR = [
  { sector: 'Accommodations & Lodging', valueLKR: '245.8M', pct: 88 },
  { sector: 'Local Tour Operators & Guides', valueLKR: '134.2M', pct: 64 },
  { sector: 'Artisan & Cultural Retail', valueLKR: '68.5M',   pct: 38 },
];

const ECONOMIC_IMPACT_DISTRIBUTION = [
  { label: 'SME Direct Yield',   pct: 58 },
  { label: 'Indirect Supply',    pct: 27 },
  { label: 'Community Funds',    pct: 15 },
];

const SME_PARTICIPATION_METRICS = [
  { region: 'Western Province',  registeredSMEs: 1420, activeAds: '92%', impactScore: 'Optimal',  ok: true  },
  { region: 'Southern Province', registeredSMEs: 980,  activeAds: '74%', impactScore: 'Disrupted', ok: false },
  { region: 'Central Province',  registeredSMEs: 740,  activeAds: '88%', impactScore: 'Optimal',  ok: true  },
  { region: 'Eastern Province',  registeredSMEs: 510,  activeAds: '81%', impactScore: 'Nominal',  ok: true  },
];

const FINANCIAL_ANOMALIES_FEED = [
  { channel: 'Digital Multi-Vendor Hubs', detail: 'SME payout processing bottleneck flagged; minor transactional delays.', critical: false },
  { channel: 'Regional Point of Sale (POS)', detail: 'Localized payment gateway outage in coastal zones. Offline backup active.', critical: true },
  { channel: 'Foreign Exchange Corridors', detail: 'Spread variations exceeding standard thresholds; daily reconciliation ongoing.', critical: false },
];

const KEY_PERFORMANCE_ITEMS = [
  { label: 'Aggregated Revenue (YTD)', value: 'LKR 524.1M', sub: '+12.3% vs last phase' },
  { label: 'Total Aggregated Footfall', value: '108,000',       sub: 'Verified digital footprints' },
  { label: 'Active SME Providers',     value: '3,650',       sub: '98 active on-boarded today', warn: true },
  { label: 'Direct Economic Multiplier', value: '1.42x',      sub: 'Per-capita impact coefficient', last: true },
];

const REPORT_META_LABELS = [
  { label: 'Primary Data Feed', value: 'Unified Tourism API' },
  { label: 'SME Share Volume',  value: 'LKR 303.9M Total' },
  { label: 'Data Quality Index', value: '99.4% Verified' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Topbar() {
  return (
    <div className="h-14 flex items-center px-10 border-b-2 border-black bg-[#0a1931]">
      <span className="text-[14px] font-semibold text-white tracking-[0.03em] uppercase">
        Tourism Intelligence & Economic Impact Registry
      </span>
    </div>
  );
}

function KpiStrip() {
  return (
    <div className="grid grid-cols-4 bg-white border border-[#cfdbe7] shadow-sm">
      {KEY_PERFORMANCE_ITEMS.map((k, i) => (
        <div key={i} className={`py-5 px-6 ${k.last ? '' : 'border-r border-[#cfdbe7]'}`}>
          <div className="text-[10px] text-[#4a5e7b] uppercase tracking-[0.08em] mb-2 font-mono font-bold">
            {k.label}
          </div>
          <div className={`text-[28px] font-bold tracking-[-0.02em] leading-none ${k.warn ? 'text-black underline decoration-[#1d4ed8] decoration-2' : 'text-[#0a1931]'}`}>
            {k.value}
          </div>
          <div className={`text-[11px] mt-2 font-medium ${k.warn ? 'text-[#1e40af]' : 'text-[#5c7291]'}`}>
            {k.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

function DataAggregationMatrix({ range, onRangeChange }) {
  const data = AGGREGATED_METRICS_MATRIX[range];
  return (
    <div className="bg-white border border-[#cfdbe7] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-[11px] text-[#0a1931] uppercase tracking-[0.08em] font-mono font-bold mb-4">
          <span>Tourism Data Aggregation Matrix</span>
          <div className="flex border border-[#cfdbe7]">
            {['7d', '30d', '90d'].map(r => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-3 py-1 text-[11px] font-mono font-bold tracking-[0.04em] cursor-pointer transition-colors
                  ${range === r
                    ? 'bg-[#0a1931] text-white'
                    : 'bg-[#f4f8fc] text-[#4a5e7b] hover:bg-[#e2edf7]'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="h-65 overflow-y-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b-2 border-[#0a1931]">
                {['Aggregation Stream', 'Volume Count', 'Baseline Target', 'Gross Yield', 'Index'].map((h, i) => (
                  <th
                    key={i}
                    className={`text-[10px] text-[#4a5e7b] font-mono uppercase tracking-[0.07em] font-bold pb-2 ${i > 2 ? 'text-right' : 'text-left'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-[#e2edf7] hover:bg-[#f8fafc] transition-colors">
                  <td className="py-3 font-semibold text-black">{row.metric}</td>
                  <td className="py-3 font-mono text-[11px] text-[#0a1931]">{row.current}</td>
                  <td className="py-3 font-mono text-[11px] text-[#5c7291]">{row.target}</td>
                  <td className="py-3 text-right font-mono text-[11px] font-bold text-black">LKR {row.yieldLKR}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 border-2 ${
                      row.status === 'Optimal' ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]' :
                      row.status === 'Nominal' ? 'bg-[#fefce8] text-[#854d0e] border-[#fef08a]' :
                      'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t-2 border-[#0a1931] mt-5 pt-4 grid grid-cols-3 gap-4 bg-[#f4f8fc] p-3 -mx-6 -mb-6">
        {REPORT_META_LABELS.map((m, i) => (
          <div key={i} className={i < 2 ? 'border-r border-[#cfdbe7] pr-4' : ''}>
            <div className="text-[9px] text-[#4a5e7b] uppercase tracking-[0.07em] font-mono font-bold mb-0.5">{m.label}</div>
            <div className="text-[13px] text-[#0a1931] font-bold">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectorRevenueReporting() {
  return (
    <div className="bg-white border border-[#cfdbe7] p-6 shadow-sm">
      <div className="text-[11px] text-[#0a1931] uppercase tracking-[0.08em] font-mono font-bold mb-4">
        Sector Revenue Reporting
      </div>
      <div className="flex flex-col gap-4">
        {REVENUE_BY_SECTOR.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-[12px] mb-1.5 font-medium">
              <span className="text-black font-semibold">{item.sector}</span>
              <span className="text-[#0a1931] font-mono text-[11px] font-bold">LKR {item.valueLKR}</span>
            </div>
            <div className="h-2 bg-[#e2edf7] rounded-full overflow-hidden">
              <div className="h-full bg-[#1d4ed8]" style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EconomicImpactMetrics() {
  return (
    <div className="bg-white border border-[#cfdbe7] p-6 shadow-sm">
      <div className="text-[11px] text-[#0a1931] uppercase tracking-[0.08em] font-mono font-bold mb-4">
        Economic Impact Breakdown
      </div>
      <div className="grid grid-cols-3 gap-2">
        {ECONOMIC_IMPACT_DISTRIBUTION.map((m, i) => (
          <div key={i} className="bg-[#f4f8fc] border border-[#cfdbe7] px-2 py-3 text-center">
            <div className="text-[22px] font-bold text-black tracking-[-0.02em] font-mono">{m.pct}%</div>
            <div className="text-[9px] text-[#4a5e7b] mt-1 uppercase font-mono font-bold tracking-[0.06em]">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmeParticipationTelemetry() {
  return (
    <div className="bg-white border border-[#cfdbe7] p-6 shadow-sm">
      <div className="text-[11px] text-[#0a1931] uppercase tracking-[0.08em] font-mono font-bold mb-4">
        SME Participation Matrix
      </div>
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr className="border-b-2 border-[#0a1931]">
            {['Province Registry', 'Registered SMEs', 'Adoption Rate', 'Impact Index'].map((h, i) => (
              <th
                key={i}
                className={`text-[10px] text-[#4a5e7b] font-mono uppercase tracking-[0.07em] font-bold pb-2 ${i === 3 ? 'text-right' : 'text-left'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SME_PARTICIPATION_METRICS.map((p, i) => (
            <tr key={i} className={i < SME_PARTICIPATION_METRICS.length - 1 ? 'border-b border-[#e2edf7]' : ''}>
              <td className="py-2.5 font-semibold text-black">{p.region}</td>
              <td className="py-2.5 font-mono text-[11px] text-[#0a1931]">{p.registeredSMEs}</td>
              <td className="py-2.5 text-[#4a5e7b] font-mono text-[11px] font-medium">{p.activeAds}</td>
              <td className="py-2.5 text-right">
                <span className="inline-flex items-center gap-1.5 justify-end w-full">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${p.ok ? 'bg-[#16a34a]' : 'bg-[#dc2626]'}`} />
                  <span className={`font-mono font-bold text-[11px] ${p.ok ? 'text-black' : 'text-[#991b1b]'}`}>{p.impactScore}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FinancialAnomaliesFeed() {
  return (
    <div className="bg-[#f8fafc] border border-[#cfdbe7] border-l-4 border-l-black p-6 shadow-sm">
      <div className="flex items-center justify-between text-[11px] text-[#0a1931] uppercase tracking-[0.08em] font-mono font-bold mb-4">
        <span>Anomalies & Operational Flags</span>
        <span className="text-[#b91c1c] font-black">Action Required</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {FINANCIAL_ANOMALIES_FEED.map((inc, i) => (
          <div
            key={i}
            className={`px-3 py-2.5 bg-white border border-l-[3px] shadow-xs
              ${inc.critical
                ? 'border-[#fca5a5] border-l-[#dc2626]'
                : 'border-[#cfdbe7] border-l-[#0a1931]'
              }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-mono tracking-[0.02em] font-bold text-black">{inc.channel}</span>
              <span className={`text-[9px] font-mono tracking-[0.06em] font-bold uppercase ${inc.critical ? 'text-[#dc2626]' : 'text-[#0a1931]'}`}>
                {inc.critical ? '● CRITICAL' : '○ PENDING'}
              </span>
            </div>
            <p className="text-[11px] text-[#4a5e7b] font-medium m-0 leading-relaxed">{inc.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ───────────────────────────────────────────────────────

export default function governmentDashboard() {
  const [range, setRange] = useState('7d');

  const handleExportCSV = () => {
    const currentMatrixData = AGGREGATED_METRICS_MATRIX[range];
    
    const headers = ['Aggregation Stream', 'Volume Count', 'Baseline Target', 'Gross Yield', 'Performance Status'];
    const rows = currentMatrixData.map(item => [item.metric, item.current, item.target, `LKR ${item.yieldLKR}`, item.status]);
    
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `tourism_matrix_performance_report_${range}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-black font-sans antialiased">
      <Topbar />
      <div className="p-8 px-10 flex flex-col gap-6">
        
        {/* Metric Header Controller */}
        <div className="flex justify-between items-center border-b border-[#cfdbe7] pb-4">
          <h1 className="text-[20px] font-bold text-[#0a1931] tracking-tight">
            Economic Performance Executive Summary
          </h1>
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-[#cfdbe7] hover:border-black hover:bg-[#f4f8fc] text-[#0a1931] text-[11px] font-mono font-bold tracking-[0.04em] uppercase transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Export Aggregation Data ({range})
          </button>
        </div>

        <KpiStrip />
        
        <div className="grid grid-cols-[1fr_340px] gap-6">
          <DataAggregationMatrix range={range} onRangeChange={setRange} />
          <div className="flex flex-col gap-6">
            <SectorRevenueReporting />
            <EconomicImpactMetrics />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <SmeParticipationTelemetry />
          <FinancialAnomaliesFeed />
        </div>
      </div>
    </div>
  );
}