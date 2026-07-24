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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';

export default function VentasChart({
  data,
}: {
  data: { fecha: string; total: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas últimos 30 días</CardTitle>
        <CardDescription>Evolución diaria de ingresos.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="rgb(var(--color-border-default))" />

              <XAxis
                dataKey="fecha"
                tick={{
                  fill: 'rgb(var(--color-text-secondary))',
                  fontSize: 11,
                }}
              />

              <YAxis
                tick={{
                  fill: 'rgb(var(--color-text-secondary))',
                  fontSize: 11,
                }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="total"
                stroke="rgb(var(--color-action-secondary))"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
