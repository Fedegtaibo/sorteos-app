'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#f59e0b',
  '#8b5cf6',
  '#22c55e',
  '#10b981',
  '#ef4444',
];

export default function EntregasChart({
  entregas,
}: {
  entregas: {
    pendientes: number;
    enviados: number;
    entregados: number;
    confirmados: number;
    reclamados: number;
  };
}) {
  const data = [
    { name: 'Pendientes', value: entregas.pendientes },
    { name: 'Enviados', value: entregas.enviados },
    { name: 'Entregados', value: entregas.entregados },
    { name: 'Confirmados', value: entregas.confirmados },
    { name: 'Reclamados', value: entregas.reclamados },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-black text-white">
        Distribución de entregas
      </h2>

      <p className="mt-2 text-sm text-zinc-500">
        Estado actual de los premios.
      </p>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}