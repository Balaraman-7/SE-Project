import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue }) => {
  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-700', text: 'text-blue-700', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-700', text: 'text-green-700', border: 'border-green-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-700', text: 'text-indigo-700', border: 'border-indigo-100' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-700', text: 'text-orange-700', border: 'border-orange-100' },
    red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-700', text: 'text-red-700', border: 'border-red-100' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-700', text: 'text-purple-700', border: 'border-purple-100' },
  };

  const c = colorMap[color] || colorMap.blue;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400';

  return (
    <div className={`bg-white rounded-xl border ${c.border} shadow-sm p-5 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.icon}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
