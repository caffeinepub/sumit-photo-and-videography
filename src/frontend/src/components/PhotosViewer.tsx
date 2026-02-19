import { blobToUrl } from '../lib/blob-utils';
import type { Photo } from '../backend';

interface PhotosViewerProps {
  photos: Photo[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function PhotosViewer({ photos, isLoading, error }: PhotosViewerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <p className="text-sm text-destructive">Failed to load photos</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">No photos available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
          <img
            src={blobToUrl(photo.blob)}
            alt={photo.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-semibold truncate">{photo.name}</h3>
              {photo.description && (
                <p className="text-sm text-white/80 truncate">{photo.description}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{photo.category}</span>
                {Number(photo.likeCount) > 0 && (
                  <span className="text-xs">❤️ {Number(photo.likeCount)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
