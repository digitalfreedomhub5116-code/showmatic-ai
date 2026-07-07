import { Card, CardContent, Button } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Assets' };

export default function AssetsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload and manage screenshots, logos, and product images.
          </p>
        </div>
        <Button>Upload Files</Button>
      </div>

      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl">🖼️</div>
          <h2 className="mt-4 text-lg font-semibold">No assets uploaded</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Upload logos, product screenshots, and images to use in your videos.
          </p>
          <div className="mt-6 w-full max-w-md rounded-lg border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
            Drag and drop files here, or click to browse
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
