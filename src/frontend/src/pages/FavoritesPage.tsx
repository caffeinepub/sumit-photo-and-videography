import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Lock } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FavoritesPage() {
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
                  <Heart className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>
              <h1 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
                Favorites
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
                  Please log in to view your favorite photos.
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
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-primary to-accent p-4">
                <Heart className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
              Your Favorites
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Photos you've liked
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Favorite Photos
              </CardTitle>
              <CardDescription>
                Your curated collection of liked photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-2">
                  No favorites yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Like photos to add them to your favorites
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
