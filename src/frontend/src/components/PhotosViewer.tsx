import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoActions } from './PhotoActions';
import type { Photo } from '../backend';

interface PhotosViewerProps {
  photo: Photo;
  onClose: () => void;
}

export default function PhotosViewer({ photo, onClose }: PhotosViewerProps) {
  const imageUrl = photo.blob.getDirectURL();

  // Handle escape key to close viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when viewer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-7xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="absolute -top-12 right-0 z-10 h-10 w-10 rounded-full glass hover:shadow-glow-md transition-all"
          aria-label="Close viewer"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Photo Container */}
        <div className="glass-strong rounded-2xl overflow-hidden shadow-glow-lg flex-1 flex flex-col">
          {/* Image */}
          <div className="flex-1 flex items-center justify-center p-4 bg-black/20">
            <img
              src={imageUrl}
              alt={photo.name}
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
            />
          </div>

          {/* Photo Info */}
          <div className="p-6 space-y-4 border-t border-border/50">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-br from-foreground via-accent to-primary bg-clip-text text-transparent">
                {photo.name}
              </h2>
              {photo.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {photo.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <PhotoActions photo={photo} variant="large" />
              <p className="text-sm text-muted-foreground">
                Press ESC to close
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
