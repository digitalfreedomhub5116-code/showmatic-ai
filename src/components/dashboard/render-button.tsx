'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

interface RenderButtonProps {
  projectId: string;
  status: string;
}

export function RenderButton({ projectId, status }: RenderButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isRendering = status === 'rendering';
  const isRendered = status === 'rendered';

  async function handleRender() {
    setLoading(true);
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error('Render failed:', e);
    } finally {
      setLoading(false);
    }
  }

  if (isRendering) {
    return (
      <Button disabled>
        <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
        Rendering...
      </Button>
    );
  }

  return (
    <Button onClick={handleRender} disabled={loading}>
      {loading ? 'Starting...' : isRendered ? 'Re-render' : 'Render Video'}
    </Button>
  );
}
