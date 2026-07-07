'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

interface CreateProjectButtonProps {
  templateId: string;
  templateName: string;
}

export function CreateProjectButton({ templateId, templateName }: CreateProjectButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${templateName} - ${new Date().toLocaleDateString()}`,
          templateId,
        }),
      });

      if (res.ok) {
        const { project } = await res.json();
        router.push(`/dashboard/projects/${project.id}`);
      }
    } catch (e) {
      console.error('Failed to create project:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" onClick={handleCreate} disabled={loading}>
      {loading ? '...' : 'Use'}
    </Button>
  );
}
