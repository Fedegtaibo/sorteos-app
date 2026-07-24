'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';

const COLORS = [
  'rgb(var(--color-action-primary))',
  'rgb(var(--color-status-information))',
  'rgb(var(--color-action-secondary))',
  'rgb(var(--color-status-success))',
  'rgb(var(--color-status-error))',
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
    <Card>
      <CardHeader>
        <CardTitle>Distribución de entregas</CardTitle>
        <CardDescription>Estado actual de las entregas.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-72">
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

              <Tooltip
                contentStyle={{
                  backgroundColor:
                    'rgb(var(--color-background-surface))',
                  border:
                    '1px solid rgb(var(--color-border-default))',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-md)',
                  color: 'rgb(var(--color-text-primary))',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                }}
                labelStyle={{
                  color: 'rgb(var(--color-text-primary))',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-4)',
                }}
                itemStyle={{
                  fontFamily: 'inherit',
                  fontWeight: 600,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
