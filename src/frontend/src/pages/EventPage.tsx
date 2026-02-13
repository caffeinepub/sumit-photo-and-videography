import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetEvent, useIsEventPasswordProtected, useValidateEventPassword, useToggleShortlist, useHasUserShortlistedImage } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, Calendar, ArrowLeft, Lock, Heart, Download, DownloadCloud } from 'lucide-react';
import { blobToUrl, downloadImage, downloadAllImages } from '../lib/blob-utils';
import EventPasswordPrompt from '../components/EventPasswordPrompt';
import { toast } from 'sonner';
import type { EventImage } from '../backend';

function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" onClick={() => navigate({ to: '/events' })} className="mb-8 glass hover:bg-accent/10">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4">
        <div className="rounded-full bg-accent/10 p-10">
          <Lock className="h-24 w-24 text-accent" />
        </div>
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-3xl font-bold tracking-tight">Authentication Required</h2>
          <p className="text-xl text-muted-foreground">
            Please log in to view this content
          </p>
          <p className="text-base text-muted-foreground">
            Event details are available to registered users only.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => login()}
          disabled={loginStatus === 'logging-in'}
          className="px-8 py-6 text-lg font-semibold transition-all hover:shadow-glow-md"
        >
          {loginStatus === 'logging-in' ? 'Logging in...' : 'Log In to Continue'}
        </Button>
      </div>
    </div>
  );
}

function ShortlistButton({ eventId, imageId }: { eventId: bigint; imageId: string }) {
  const { data: isShortlisted = false } = useHasUserShortlistedImage(eventId, imageId);
  const toggleShortlist = useToggleShortlist();

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleShortlist.mutateAsync({ eventId, imageId });
      toast.success(isShortlisted ? 'Removed from shortlist' : 'Added to shortlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update shortlist');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleToggle}
            disabled={toggleShortlist.isPending}
            className={`absolute left-3 top-3 z-30 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-xl border-2 ${
              isShortlisted
                ? 'bg-accent border-accent text-white shadow-glow-md scale-110'
                : 'bg-white border-white text-gray-900 hover:bg-white hover:scale-110 hover:shadow-2xl'
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                isShortlisted ? 'fill-current animate-pulse' : ''
              }`}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-black/90 text-white border-accent/50">
          <p>{isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DownloadButton({ image }: { image: EventImage }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const filename = `${image.name.replace(/[^a-z0-9]/gi, '_')}.jpg`;
      await downloadImage(image.blob, filename);
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`absolute right-3 top-3 z-30 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-xl border-2 ${
              isDownloading
                ? 'bg-accent border-accent text-white animate-pulse shadow-glow-md'
                : 'bg-white border-white text-gray-900 hover:bg-white hover:scale-110 hover:shadow-2xl'
            }`}
          >
            <Download className={`h-5 w-5 ${isDownloading ? 'animate-bounce' : ''}`} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-black/90 text-white border-accent/50">
          <p>Download Image</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DownloadAllButton({ images, eventName }: { images: EventImage[]; eventName: string }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownloadAll = async () => {
    if (isDownloading || images.length === 0) return;
    
    setIsDownloading(true);
    setProgress(0);
    
    try {
      await downloadAllImages(
        images,
        eventName,
        (current, total) => {
          const percentage = Math.round((current / total) * 100);
          setProgress(percentage);
        }
      );
      toast.success(`Successfully downloaded ${images.length} images`);
    } catch (error) {
      console.error('Batch download error:', error);
      toast.error('Failed to download all images');
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  };

  if (images.length === 0) return null;

  return (
    <Button
      onClick={handleDownloadAll}
      disabled={isDownloading}
      size="lg"
      className="glass-strong hover:shadow-glow-md transition-all hover-lift"
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Downloading {progress}%
        </>
      ) : (
        <>
          <DownloadCloud className="mr-2 h-5 w-5" />
          Download All ({images.length})
        </>
      )}
    </Button>
  );
}

export default function EventPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  
  const { eventId } = useParams({ from: '/events/$eventId' });
  const navigate = useNavigate();
  const eventIdBigInt = BigInt(eventId);

  const [isPasswordValidated, setIsPasswordValidated] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordError, setPasswordError] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<EventImage | null>(null);

  const { data: isPasswordProtected, isLoading: isCheckingPassword } = useIsEventPasswordProtected(eventIdBigInt);
  const { data: event, isLoading: isLoadingEvent, error: eventError } = useGetEvent(
    eventIdBigInt,
    isAuthenticated && (!isPasswordProtected || isPasswordValidated)
  );
  const validatePassword = useValidateEventPassword();

  useEffect(() => {
    if (isAuthenticated && isPasswordProtected && !isPasswordValidated) {
      setShowPasswordPrompt(true);
    }
  }, [isAuthenticated, isPasswordProtected, isPasswordValidated]);

  const handlePasswordSubmit = async (password: string): Promise<boolean> => {
    setPasswordError(undefined);
    try {
      const isValid = await validatePassword.mutateAsync({ eventId: eventIdBigInt, password });
      if (isValid) {
        setIsPasswordValidated(true);
        setShowPasswordPrompt(false);
        return true;
      } else {
        setPasswordError('Incorrect password. Please try again.');
        return false;
      }
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to validate password');
      return false;
    }
  };

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  if (isCheckingPassword || (isLoadingEvent && (!isPasswordProtected || isPasswordValidated))) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  if (showPasswordPrompt && isPasswordProtected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate({ to: '/events' })} className="mb-8 glass hover:bg-accent/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Card className="w-full max-w-md glass-strong">
            <CardHeader className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/15">
                <Lock className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="text-2xl">Password Protected Event</CardTitle>
              <CardDescription className="text-base">This event requires a password to access</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <EventPasswordPrompt
          isOpen={showPasswordPrompt}
          onPasswordSubmit={handlePasswordSubmit}
          isValidating={validatePassword.isPending}
          error={passwordError}
        />
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate({ to: '/events' })} className="mb-8 glass hover:bg-accent/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Card className="w-full max-w-md glass-strong">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Event Not Found</CardTitle>
              <CardDescription className="text-base">
                {eventError instanceof Error && eventError.message.includes('Password required')
                  ? 'This event is password protected'
                  : 'The event you are looking for does not exist or has been removed.'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const eventDate = new Date(Number(event.date) / 1000000);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="absolute inset-0 bg-texture pointer-events-none" />
      
      <Button variant="ghost" onClick={() => navigate({ to: '/events' })} className="relative mb-8 glass hover:bg-accent/10">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <Card className="relative mb-10 glass-strong">
        <CardHeader>
          <CardTitle className="text-4xl tracking-tight">{event.name}</CardTitle>
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
          <p className="text-muted-foreground text-lg leading-relaxed">{event.description}</p>
        </CardContent>
      </Card>

      <div className="relative mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Event Gallery</h2>
          <p className="text-base text-muted-foreground font-medium">
            {event.images.length} {event.images.length === 1 ? 'image' : 'images'}
          </p>
        </div>
        <DownloadAllButton images={event.images} eventName={event.name} />
      </div>

      {event.images.length > 0 ? (
        <div className="relative grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {event.images.map((image, index) => {
            const imageUrl = blobToUrl(image.blob);
            return (
              <div
                key={image.id}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl glass transition-all hover:shadow-glow-md hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedImage(image)}
              >
                <ShortlistButton eventId={eventIdBigInt} imageId={image.id} />
                <DownloadButton image={image} />
                <img 
                  src={imageUrl} 
                  alt={image.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium truncate drop-shadow-lg">{image.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-border/50 glass">
          <p className="text-muted-foreground text-lg font-medium">No images available for this event</p>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute right-6 top-6 z-50 text-white hover:text-accent transition-colors text-4xl font-light"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="relative max-h-full max-w-full">
            <img 
              src={blobToUrl(selectedImage.blob)} 
              alt="Full size" 
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl" 
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const handleDownload = async () => {
                    try {
                      const filename = `${selectedImage.name.replace(/[^a-z0-9]/gi, '_')}.jpg`;
                      await downloadImage(selectedImage.blob, filename);
                      toast.success('Download started');
                    } catch (error) {
                      console.error('Download error:', error);
                      toast.error('Failed to download image');
                    }
                  };
                  handleDownload();
                }}
                className="flex items-center gap-2 rounded-full bg-white text-gray-900 px-6 py-3 backdrop-blur-md transition-all hover:bg-white hover:scale-110 hover:shadow-2xl shadow-xl border-2 border-white"
              >
                <Download className="h-5 w-5" />
                <span className="font-semibold">Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
