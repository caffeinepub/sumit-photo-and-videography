import { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetAllPhotosSorted } from '../hooks/useQueries';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import { SortedOrder } from '../backend';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { PhotoActions } from '../components/PhotoActions';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '../components/SEOHead';

export default function PhotoDetailPage() {
  const navigate = useNavigate();
  const { photoId } = useParams({ from: '/photos/$photoId' });
  const { data: photos = [], isLoading } = useGetAllPhotosSorted(SortedOrder.newestFirst);

  const currentIndex = photos.findIndex((p) => p.id === photoId);
  const currentPhoto = currentIndex >= 0 ? photos[currentIndex] : null;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < photos.length - 1;

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      const prevPhoto = photos[currentIndex - 1];
      navigate({ to: '/photos/$photoId', params: { photoId: prevPhoto.id } });
    }
  }, [hasPrevious, currentIndex, photos, navigate]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      const nextPhoto = photos[currentIndex + 1];
      navigate({ to: '/photos/$photoId', params: { photoId: nextPhoto.id } });
    }
  }, [hasNext, currentIndex, photos, navigate]);

  const goBack = useCallback(() => {
    navigate({ to: '/photos' });
  }, [navigate]);

  // Swipe navigation
  useSwipeNavigation({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, goBack]);

  if (isLoading) {
    return (
      <>
        <SEOHead page="photos" />
        <div className="relative container mx-auto px-4 py-12 min-h-screen">
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'url(/assets/generated/cinematic-gallery-bg.dim_1200x600.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            <div className="absolute inset-0 bg-texture" />
          </div>
          <div className="relative max-w-6xl mx-auto space-y-8">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!currentPhoto) {
    return (
      <>
        <SEOHead page="photos" />
        <div className="relative container mx-auto px-4 py-12 min-h-screen">
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'url(/assets/generated/cinematic-gallery-bg.dim_1200x600.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            <div className="absolute inset-0 bg-texture" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl font-bold text-foreground">Photo not found</h1>
            <p className="text-xl text-muted-foreground">
              The photo you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={goBack}
              size="lg"
              className="glass hover:shadow-glow-md transition-all"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Photo Gallery
            </Button>
          </div>
        </div>
      </>
    );
  }

  const imageUrl = currentPhoto.blob.getDirectURL();

  return (
    <>
      <SEOHead page="photos" />
      <div className="relative container mx-auto px-4 py-12 min-h-screen">
        {/* Cinematic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'url(/assets/generated/cinematic-gallery-bg.dim_1200x600.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-texture" />
        </div>

        <div className="relative max-w-6xl mx-auto space-y-8 animate-fade-in">
          {/* Back Button */}
          <Button
            onClick={goBack}
            variant="ghost"
            size="lg"
            className="glass hover:shadow-glow-sm transition-all"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Gallery
          </Button>

          {/* Photo Container */}
          <div className="relative group">
            {/* Previous Button */}
            {hasPrevious && (
              <Button
                onClick={goToPrevious}
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-full glass opacity-0 group-hover:opacity-100 transition-all hover:shadow-glow-md hover:scale-110"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Photo */}
            <div className="glass-strong rounded-2xl overflow-hidden shadow-glow-lg">
              <img
                src={imageUrl}
                alt={currentPhoto.name}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Next Button */}
            {hasNext && (
              <Button
                onClick={goToNext}
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-full glass opacity-0 group-hover:opacity-100 transition-all hover:shadow-glow-md hover:scale-110"
                aria-label="Next photo"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}
          </div>

          {/* Photo Info */}
          <div className="glass-strong rounded-2xl p-8 space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-br from-foreground via-accent to-primary bg-clip-text text-transparent">
                {currentPhoto.name}
              </h1>
              {currentPhoto.description && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {currentPhoto.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <PhotoActions photo={currentPhoto} variant="large" />
              <div className="text-sm text-muted-foreground">
                Photo {currentIndex + 1} of {photos.length}
              </div>
            </div>
          </div>

          {/* Navigation Hint */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Use arrow keys or swipe to navigate between photos</p>
            <p className="text-xs">Press ESC to return to gallery</p>
          </div>
        </div>
      </div>
    </>
  );
}
