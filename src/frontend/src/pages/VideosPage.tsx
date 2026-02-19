import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllVideos } from '../hooks/useQueries';
import { SortedOrder } from '../types/media';
import { blobToUrl } from '../lib/blob-utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, LogIn } from 'lucide-react';

export default function VideosPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const [sortOrder, setSortOrder] = useState<SortedOrder>(SortedOrder.newestFirst);
  const { data: videos = [], isLoading, error } = useGetAllVideos(sortOrder);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Video className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Videos Gallery</h1>
            <p className="text-muted-foreground">
              Please log in to view our video collection
            </p>
          </div>
          <Button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            size="lg"
          >
            {loginStatus === 'logging-in' ? (
              'Logging in...'
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Log In to View Videos
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Video className="h-8 w-8" />
              Videos Gallery
            </h1>
            <p className="text-muted-foreground mt-1">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} available
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortedOrder)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SortedOrder.newestFirst}>Newest First</SelectItem>
                <SelectItem value={SortedOrder.oldestFirst}>Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading videos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-sm text-destructive">Failed to load videos</p>
              <p className="text-xs text-muted-foreground">{error.message}</p>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No videos available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="space-y-3 border rounded-lg p-4 bg-card">
                <video
                  controls
                  className="w-full aspect-video rounded-lg bg-black"
                  src={blobToUrl(video.blob)}
                >
                  Your browser does not support the video tag.
                </video>
                <div>
                  <h3 className="font-semibold">{video.name}</h3>
                  {video.description && (
                    <p className="text-sm text-muted-foreground mt-1">{video.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
