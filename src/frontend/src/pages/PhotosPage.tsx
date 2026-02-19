import { useState } from 'react';
import { useGetAllPhotos } from '../hooks/useQueries';
import { SortedOrder } from '../types/media';
import PhotosViewer from '../components/PhotosViewer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera } from 'lucide-react';

export default function PhotosPage() {
  const [sortOrder, setSortOrder] = useState<SortedOrder>(SortedOrder.newestFirst);
  const { data: photos = [], isLoading, error } = useGetAllPhotos(sortOrder);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Camera className="h-8 w-8" />
              Photos Gallery
            </h1>
            <p className="text-muted-foreground mt-1">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'} available
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

        <PhotosViewer photos={photos} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
