import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Billing' };

export default function BillingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your subscription and credits.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">Free</div>
                <div className="mt-1 text-sm text-muted-foreground">3 videos/month &middot; 720p export</div>
              </div>
              <Button>Upgrade</Button>
            </div>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="mt-1 text-sm text-muted-foreground">credits remaining this month</div>
              </div>
              <Button variant="outline">Buy Credits</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Billing History</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-8">
          No invoices yet.
        </CardContent>
      </Card>
    </div>
  );
}
