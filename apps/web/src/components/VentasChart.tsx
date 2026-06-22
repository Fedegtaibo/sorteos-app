'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function VentasChart({
  data,
}: {
  data: { fecha: string; total: number }[];
}) {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-black text-white">
        Ventas últimos 30 días
      </h2>

      <p className="mt-2 text-sm text-zinc-500">
        Evolución diaria de ingresos.
      </p>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#27272a" />

            <XAxis
              dataKey="fecha"
              tick={{ fill: '#71717a', fontSize: 11 }}
            />

            <YAxis
              tick={{ fill: '#71717a', fontSize: 11 }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="total"
              stroke="#fbbf24"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}