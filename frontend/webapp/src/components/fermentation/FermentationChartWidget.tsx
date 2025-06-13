import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Download,
  Maximize2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FermentationChartWidgetProps {
  title: string;
  data: Array<{
    date: string;
    gravity: number;
    temperature: number;
    abv: number;
  }>;
}

export function FermentationChartWidget({ title, data }: FermentationChartWidgetProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState<'gravity' | 'temperature' | 'abv'>('gravity');

  const getMetricConfig = (metric: string) => {
    switch (metric) {
      case 'gravity':
        return {
          color: '#8B5CF6',
          name: 'Gravedad Específica',
          unit: 'SG'
        };
      case 'temperature':
        return {
          color: '#F59E0B',
          name: 'Temperatura',
          unit: '°C'
        };
      case 'abv':
        return {
          color: '#10B981',
          name: 'ABV',
          unit: '%'
        };
      default:
        return {
          color: '#6B7280',
          name: 'Valor',
          unit: ''
        };
    }
  };

  const metricConfig = getMetricConfig(selectedMetric);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-600 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <Download className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between mb-4">
        {/* Selector de métrica */}
        <div className="flex space-x-1">
          {['gravity', 'temperature', 'abv'].map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric as any)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                selectedMetric === metric
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {getMetricConfig(metric).name}
            </button>
          ))}
        </div>

        {/* Selector de rango temporal */}
        <div className="flex space-x-1">
          {['24h', '7d', '14d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                timeRange === range
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3,3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: any) => [
                `${value} ${metricConfig.unit}`,
                metricConfig.name
              ]}
            />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={metricConfig.color}
              strokeWidth={2}
              dot={{ fill: metricConfig.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: metricConfig.color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-xs text-gray-400">Actual</div>
          <div className="text-lg font-bold text-white">
            {data[data.length - 1]?.[selectedMetric]?.toFixed(selectedMetric === 'gravity' ? 3 : 1)} 
            <span className="text-xs text-gray-400 ml-1">{metricConfig.unit}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-gray-400">Máximo</div>
          <div className="text-lg font-bold text-white">
            {Math.max(...data.map(d => d[selectedMetric])).toFixed(selectedMetric === 'gravity' ? 3 : 1)}
            <span className="text-xs text-gray-400 ml-1">{metricConfig.unit}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-gray-400">Mínimo</div>
          <div className="text-lg font-bold text-white">
            {Math.min(...data.map(d => d[selectedMetric])).toFixed(selectedMetric === 'gravity' ? 3 : 1)}
            <span className="text-xs text-gray-400 ml-1">{metricConfig.unit}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}