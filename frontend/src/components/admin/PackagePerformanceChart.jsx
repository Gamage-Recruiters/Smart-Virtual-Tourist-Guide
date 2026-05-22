import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Beach', value: 65 },
  { name: 'Adventure', value: 70 },
  { name: 'Cultural', value: 85 },
  { name: 'Wildlife', value: 12 },
  { name: 'Cruise', value: 50 },
];

const PackagePerformanceChart = () => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          barSize={12}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#E5E7EB" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" fill="#9F7AEA" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PackagePerformanceChart;