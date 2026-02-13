import { useState } from 'react';
import { useGetAllVideosSorted } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { SortedOrder } from '../backend';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Video as VideoIcon, Lock } from 'lucide-react';
import SEOHead from '../components/SEOHead';

function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-10 px-4">
      <div className="rounded-full bg-primary/15 p-12 shadow-glow-md">
        <Lock className="h-28 w-28 text-primary" />
      </div>
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-4xl font-bold tracking-tight">Authentication Required</h2>
        <p className="text-2xl text-muted-foreground">
          Please log in to view this content
        </p>
        <p className="text-lg text-muted-foreground">
          The video gallery is available to registered users only.
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

export default function VideosPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  
  const [sortOrder, setSortOrder] = useState<SortedOrder>(SortedOrder.newestFirst);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { data: videos = [], isLoading } = useGetAllVideosSorted(sortOrder);

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead page="videos" />
        <div className="relative container mx-auto px-4 py-12 min-h-screen">
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'url(/assets/generated/cinematic-video-hero.dim_800x600.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
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
      <SEOHead page="videos" />
      <div className="relative container mx-auto px-4 py-12 min-h-screen">
        {/* Cinematic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'url(/assets/generated/cinematic-video-hero.dim_800x600.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-texture" />
        </div>
        
        <div className="relative mb-12 animate-fade-in">
          <h1 className="mb-4 text-6xl font-bold tracking-tight md:text-7xl bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text text-transparent">
            Video Gallery
          </h1>
          <p className="text-muted-foreground text-2xl mb-10">Watch our cinematic storytelling</p>
          <div className="flex items-center gap-4">
            <label className="text-base font-semibold">Sort by:</label>
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as SortedOrder)}
            >
              <SelectTrigger className="w-[200px] glass transition-all hover:border-accent hover:shadow-glow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong">
                <SelectItem value={SortedOrder.newestFirst}>Newest First</SelectItem>
                <SelectItem value={SortedOrder.oldestFirst}>Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden glass">
                <CardContent className="p-0">
                  <Skeleton className="aspect-video w-full animate-shimmer" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="relative flex min-h-[500px] flex-col items-center justify-center gap-8">
            <div className="rounded-full bg-primary/15 p-10 shadow-glow-md">
              <VideoIcon className="h-24 w-24 text-primary" />
            </div>
            <p className="text-2xl text-muted-foreground font-medium">No videos available yet.</p>
          </div>
        ) : (
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => {
              const videoUrl = video.blob.getDirectURL();
              return (
                <Card
                  key={video.id}
                  className="group cursor-pointer overflow-hidden glass transition-all hover:shadow-glow-lg hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedVideo(videoUrl)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <video
                        src={videoUrl}
                        className="h-full w-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 transition-all duration-500 group-hover:bg-black/70">
                        <div className="rounded-full bg-accent/95 p-6 transition-all duration-500 group-hover:scale-125 group-hover:bg-accent shadow-glow-lg">
                          <Play className="h-14 w-14 text-accent-foreground" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="mb-3 font-bold tracking-tight text-xl">{video.name}</h3>
                      {video.description && (
                        <p className="line-clamp-2 text-base text-muted-foreground leading-relaxed">{video.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-5xl glass-strong border-border/50 shadow-glow-lg">
            {selectedVideo && (
              <div className="animate-scale-in">
                <video 
                  src={selectedVideo} 
                  controls 
                  className="h-auto w-full rounded-2xl shadow-2xl" 
                  autoPlay 
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
