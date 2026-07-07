import { Card, CardContent } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Analytics' };

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your video creation and export activity.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Videos Created" value="0" change="" />
        <StatCard label="Exports This Month" value="0" change="" />
        <StatCard label="Template Usage" value="0" change="" />
      </div>

      <Card className="mt-6">
        <CardContent className="flex items-center justify-center py-16 text-center text-sm text-muted-foreground">
          Analytics charts will appear here once you start creating videos.
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-3xl font-bold tracking-tight">{value}</div>
        {change && <div className="mt-1 text-xs text-green-600">{change}</div>}
      </CardContent>
    </Card>
  );
}
