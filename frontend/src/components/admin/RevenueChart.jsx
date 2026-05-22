import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 1200 },
  { name: 'Feb', revenue: 3500 },
  { name: 'Mar', revenue: 7200 },
  { name: 'Apr', revenue: 3500 },
  { name: 'May', revenue: 2500 },
  { name: 'Jun', revenue: 6800 },
  { name: 'Jul', revenue: 4800 },
  { name: 'Aug', revenue: 0 },
];

const RevenueChart = () => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            activeDot={{ r: 6, fill: "#ffffff", stroke: "#8B5CF6", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;