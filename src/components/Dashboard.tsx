import React, { useMemo, Suspense } from 'react';
import type { Laptop } from '../types';
import { getStats, getAveragePriceByCompany, getRamDistribution, formatCurrency } from '../utils';
import { BarChart3, Laptop2, IndianRupee, TrendingUp } from 'lucide-react';

// Lazy load Recharts components
const LazyBarChart = React.lazy(() =>
  import('recharts').then(module => ({ default: module.BarChart }))
);
const LazyBar = React.lazy(() =>
  import('recharts').then(module => ({ default: module.Bar }))
);
const LazyXAxis = React.lazy(() =>
  import('recharts').then(module => ({ default: module.XAxis }))
);
const LazyYAxis = React.lazy(() =>
  import('recharts').then(module => ({ default: module.YAxis }))
);
const LazyTooltip = React.lazy(() =>
  import('recharts').then(module => ({ default: module.Tooltip }))
);
const LazyResponsiveContainer = React.lazy(() =>
  import('recharts').then(module => ({ default: module.ResponsiveContainer }))
);

interface DashboardProps {
  data: Laptop[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = useMemo(() => getStats(data), [data]);
  const companyPrices = useMemo(() => getAveragePriceByCompany(data).slice(0, 8), [data]);
  const ramDist = useMemo(() => getRamDistribution(data), [data]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-5 rounded-2xl shadow-lg hover:bg-slate-800/60 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Laptop2 size={24} className="text-blue-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-900/50 px-2 py-1 rounded-full">Total</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalLaptops}</div>
          <div className="text-sm text-slate-400">Unique models tracked</div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-5 rounded-2xl shadow-lg hover:bg-slate-800/60 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <IndianRupee size={24} className="text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-900/50 px-2 py-1 rounded-full">Avg Price</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400 mb-1">{formatCurrency(stats.avgPrice)}</div>
          <div className="text-sm text-slate-400">Across all categories</div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-5 rounded-2xl shadow-lg hover:bg-slate-800/60 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
              <BarChart3 size={24} className="text-violet-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-900/50 px-2 py-1 rounded-full">Market Leader</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.mostPopularBrand}</div>
          <div className="text-sm text-slate-400">Most frequent brand</div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-5 rounded-2xl shadow-lg hover:bg-slate-800/60 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors">
              <TrendingUp size={24} className="text-rose-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-900/50 px-2 py-1 rounded-full">Top Tier</span>
          </div>
          <div className="text-xl font-bold text-white mb-1 truncate" title={stats.mostExpensive?.price.toString()}>
            {stats.mostExpensive ? formatCurrency(stats.mostExpensive.price) : 'N/A'}
          </div>
          <div className="text-sm text-slate-400 truncate w-full" title={`${stats.mostExpensive?.company} ${stats.mostExpensive?.typeName}`}>
            {stats.mostExpensive ? `${stats.mostExpensive.company} ${stats.mostExpensive.typeName}` : '-'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Price Chart */}
        <Suspense fallback={<div>Loading chart...</div>}>
          <LazyResponsiveContainer width="100%" height={300}>
            <LazyBarChart data={companyPrices} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <LazyXAxis type="number" />
              <LazyYAxis type="category" dataKey="label" />
              <LazyTooltip formatter={(value: number) => formatCurrency(value)} />
              <LazyBar dataKey="value" fill="#4ade80" />
            </LazyBarChart>
          </LazyResponsiveContainer>
        </Suspense>

<<<<<<< HEAD
        {/* RAM Distribution Chart */}
        <Suspense fallback={<div>Loading chart...</div>}>
          <LazyResponsiveContainer width="100%" height={300}>
            <LazyBarChart data={ramDist} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <LazyXAxis dataKey="label" />
              <LazyYAxis />
              <LazyTooltip />
              <LazyBar dataKey="value" fill="#6366f1" />
            </LazyBarChart>
          </LazyResponsiveContainer>
        </Suspense>
=======
        <div className="space-y-6">
          {/* RAM Distribution */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-indigo-400" />
              RAM Configuration Market Share
            </h3>
            <div className="flex items-end justify-between h-48 space-x-2">
              {ramDist.map((item, index) => {
                const maxVal = Math.max(...ramDist.map(r => r.value));
                const heightPct = (item.value / maxVal) * 100;
                return (
                  <div key={item.label} className="flex-1 flex flex-col justify-end group">
                    <div 
                      className="w-full bg-indigo-500/80 hover:bg-indigo-400 rounded-t-sm transition-all duration-700 ease-out relative"
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                        {item.value} units
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 text-center mt-2 font-medium">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights Text */}
          <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/20 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Dataset Highlights</h3>
            <div className="space-y-4 text-slate-300">
              <p className="text-sm leading-relaxed border-l-2 border-indigo-500 pl-4">
                The dataset is dominated by <span className="text-white font-semibold">{stats.mostPopularBrand}</span>, representing a significant portion of the market share.
              </p>
              <p className="text-sm leading-relaxed border-l-2 border-emerald-500 pl-4">
                Premium workstations reach up to <span className="text-white font-semibold">{formatCurrency(stats.mostExpensive?.price || 0)}</span>, while budget options start as low as <span className="text-white font-semibold">{formatCurrency(Math.min(...data.map(d => d.price)))}</span>.
              </p>
            </div>
          </div>
        </div>
>>>>>>> parent of 9d62fde (3)
      </div>
    </div>
  );
};

export default Dashboard;
