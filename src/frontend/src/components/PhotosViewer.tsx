import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';

interface PhotosViewerProps {
  photos?: any[];
  emptyMessage?: string;
}

export default function PhotosViewer({ photos = [], emptyMessage = 'No photos available' }: PhotosViewerProps) {
  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Camera className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              {emptyMessage}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square bg-muted flex items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
