import { useState } from 'react';
import { useGetAllEventsSorted } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { SortedOrder } from '../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Image, Lock } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { blobToUrl } from '../lib/blob-utils';
import SEOHead from '../components/SEOHead';

function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-10 px-4">
      <div className="rounded-full bg-accent/15 p-12 shadow-glow-md">
        <Lock className="h-28 w-28 text-accent" />
      </div>
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-4xl font-bold tracking-tight">Authentication Required</h2>
        <p className="text-2xl text-muted-foreground">
          Please log in to view this content
        </p>
        <p className="text-lg text-muted-foreground">
          The events section is available to registered users only.
        </p>
      </div>
      <Button
        size="lg"
        onClick={() => login()}
        disabled={loginStatus === 'logging-in'}
        className="px-10 py-7 text-xl font-semibold transition-all hover:shadow-glow-lg animate-modern-glow"
      >
        {loginStatus === 'logging-in' ? 'Logging in...' : 'Log In to Continue'}
      </Button>
    </div>
  );
}

export default function EventsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  
  const [sortOrder, setSortOrder] = useState<SortedOrder>(SortedOrder.newestFirst);
  const { data: events = [], isLoading, error } = useGetAllEventsSorted(sortOrder);

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead page="events" />
        <div className="relative container mx-auto px-4 py-12 min-h-screen">
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'url(/assets/generated/cinematic-event-hero.dim_800x600.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            <div className="absolute inset-0 bg-texture" />
          </div>
          <LoginPrompt />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead page="events" />
      <div className="relative container mx-auto px-4 py-12 min-h-screen">
        {/* Cinematic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'url(/assets/generated/cinematic-event-hero.dim_800x600.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-texture" />
        </div>
        
        <div className="relative mb-12 animate-fade-in">
          <h1 className="mb-4 text-6xl font-bold tracking-tight md:text-7xl bg-gradient-to-br from-foreground via-accent to-primary bg-clip-text text-transparent">
            Events
          </h1>
          <p className="text-muted-foreground text-2xl mb-10">Browse our photography and videography events</p>
        </div>

        {error && (
          <div className="relative mb-8 p-5 glass-strong border border-destructive/50 rounded-xl">
            <p className="text-destructive font-medium text-lg">Error loading events. Please try refreshing the page.</p>
          </div>
        )}

        <div className="relative mb-8 flex items-center justify-between">
          <p className="text-lg text-muted-foreground font-medium">
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </p>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortedOrder)}
          >
            <SelectTrigger className="w-[200px] glass transition-all hover:border-accent hover:shadow-glow-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="glass-strong">
              <SelectItem value={SortedOrder.newestFirst}>Newest First</SelectItem>
              <SelectItem value={SortedOrder.oldestFirst}>Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="relative flex min-h-[500px] items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
          </div>
        ) : events.length === 0 ? (
          <div className="relative flex min-h-[500px] flex-col items-center justify-center gap-8">
            <div className="rounded-full bg-accent/15 p-10 shadow-glow-md">
              <Calendar className="h-24 w-24 text-accent" />
            </div>
            <p className="text-2xl text-muted-foreground font-medium">No events available yet.</p>
            <p className="text-lg text-muted-foreground">Check back soon for new events!</p>
          </div>
        ) : (
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => {
              const thumbnailUrl = event.images.length > 0 ? blobToUrl(event.images[0].blob) : null;
              const eventDate = new Date(Number(event.date) / 1000000);

              return (
                <Card 
                  key={event.id.toString()} 
                  className="overflow-hidden glass transition-all hover:shadow-glow-lg hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {thumbnailUrl ? (
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={thumbnailUrl}
                        alt={event.name}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                        loading="lazy"
                      />
                      {event.passwordProtected && (
                        <Badge className="absolute right-4 top-4 glass-strong text-white hover:bg-black/90 border-accent/50 shadow-glow-sm">
                          <Lock className="mr-1.5 h-4 w-4" />
                          Protected
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="relative flex aspect-video w-full items-center justify-center bg-muted">
                      <Image className="h-20 w-20 text-muted-foreground/50" />
                      {event.passwordProtected && (
                        <Badge className="absolute right-4 top-4 glass-strong text-white hover:bg-black/90 border-accent/50 shadow-glow-sm">
                          <Lock className="mr-1.5 h-4 w-4" />
                          Protected
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-1 tracking-tight text-2xl">{event.name}</CardTitle>
                      {event.passwordProtected && (
                        <Lock className="h-6 w-6 flex-shrink-0 text-accent" />
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-accent" />
                      {eventDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 line-clamp-2 text-base text-muted-foreground leading-relaxed">{event.description}</p>
                    <div className="mb-6 flex items-center gap-2 text-base text-muted-foreground">
                      <Image className="h-5 w-5 text-accent" />
                      <span className="font-medium">{event.images.length} {event.images.length === 1 ? 'image' : 'images'}</span>
                    </div>
                    <Link to="/events/$eventId" params={{ eventId: event.id.toString() }}>
                      <Button className="w-full transition-all hover:shadow-glow-sm font-semibold text-base py-6">
                        {event.passwordProtected ? 'Access Event' : 'View Event'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
