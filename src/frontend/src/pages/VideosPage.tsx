import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Play } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

export default function VideosPage() {
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <section className="relative overflow-hidden py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-gradient-to-r from-primary to-accent p-4">
                  <Video className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>
              <h1 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
                Video Gallery
              </h1>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-md">
              <Alert>
                <Lock className="h-5 w-5" />
                <AlertTitle className="text-lg">Authentication Required</AlertTitle>
                <AlertDescription>
                  Please log in to access the video gallery.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => login()}
                disabled={loginStatus === 'logging-in'}
                className="mt-6 w-full"
              >
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Log In'}
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-primary to-accent p-4">
                <Video className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
              Video Gallery
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Watch our cinematic video collection
            </p>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="w-full sm:w-auto">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[200px] border-2 hover:border-primary transition-colors">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Video Collection
              </CardTitle>
              <CardDescription>
                Explore our curated video collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Video className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-2">
                  Video gallery coming soon
                </p>
                <p className="text-sm text-muted-foreground">
                  Admin can upload videos from the admin panel
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
