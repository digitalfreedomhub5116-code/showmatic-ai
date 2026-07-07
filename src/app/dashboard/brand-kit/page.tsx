import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Brand Kit' };

export default function BrandKitPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brand Kit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define your brand identity. Colors, fonts, and logo are applied to every video.
          </p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Brand Colors</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <ColorSwatch label="Primary" color="#7C3AED" />
            <ColorSwatch label="Secondary" color="#06B6D4" />
            <ColorSwatch label="Background" color="#FFFFFF" />
            <ColorSwatch label="Text" color="#0F172A" />
          </CardContent>
        </Card>

        {/* Fonts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Heading Font</div>
              <div className="mt-1 font-semibold">Inter</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Body Font</div>
              <div className="mt-1 font-semibold">Inter</div>
            </div>
          </CardContent>
        </Card>

        {/* Logo */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-10 text-center text-sm text-muted-foreground">
              Drag and drop your logo here, or click to upload
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ColorSwatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <div className="h-12 rounded-lg shadow-sm" style={{ backgroundColor: color }} />
      <div className="text-xs text-muted-foreground">{color}</div>
    </div>
  );
}
