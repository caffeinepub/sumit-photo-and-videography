import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useGetEvent } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, Calendar, ArrowLeft, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { blobToUrl } from '../lib/blob-utils';

export default function EventDetailPage() {
  const { eventId } = useParams({ from: '/events/$eventId' });
  const { data: event, isLoading } = useGetEvent(BigInt(eventId));
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Event not found.</p>
      </div>
    );
  }

  const eventDate = new Date(Number(event.date) / 1000000);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/events">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{event.name}</h1>
        <div className="mb-4 flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-5 w-5" />
          <span>
            {eventDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <p className="text-lg text-muted-foreground">{event.description}</p>
      </div>

      {event.images.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">No images available for this event.</p>
        </div>
      ) : (
        <>
          <h2 className="mb-4 text-2xl font-semibold">Event Gallery ({event.images.length} images)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {event.images.map((image, index) => {
              const imageUrl = blobToUrl(image.blob);
              return (
                <div
                  key={image.id}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted transition-transform hover:scale-105"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={imageUrl}
                    alt={image.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          {selectedImageIndex !== null && event.images[selectedImageIndex] && (
            <div className="relative flex h-full w-full items-center justify-center bg-black">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-10 text-white hover:bg-white/20"
                onClick={() => setSelectedImageIndex(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={blobToUrl(event.images[selectedImageIndex].blob)}
                alt={event.images[selectedImageIndex].name}
                className="max-h-[95vh] max-w-full object-contain"
              />
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev !== null && prev > 0 ? prev - 1 : event.images.length - 1
                    )
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev !== null && prev < event.images.length - 1 ? prev + 1 : 0
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
