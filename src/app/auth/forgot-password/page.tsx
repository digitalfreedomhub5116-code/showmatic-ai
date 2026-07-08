'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ShowmaticLogo } from '@/components/logo';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-50/50 to-white px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-8 flex justify-center">
            <ShowmaticLogo />
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-4xl">📧</div>
              <h2 className="mt-4 text-xl font-semibold">Check your email</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent password reset instructions.
              </p>
              <Link href="/auth/login" className="mt-6 block">
                <Button variant="outline" className="w-full">Back to login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-50/50 to-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <ShowmaticLogo />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset password</CardTitle>
            <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link href="/auth/login" className="font-medium text-foreground hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
