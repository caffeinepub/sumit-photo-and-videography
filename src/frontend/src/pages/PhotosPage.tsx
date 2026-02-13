import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllPhotosSorted } from '../hooks/useQueries';
import { SortedOrder } from '../backend';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Image as ImageIcon } from 'lucide-react';
import { PhotoActions } from '../components/PhotoActions';
import SEOHead from '../components/SEOHead';
import type { Photo } from '../backend';

export default function PhotosPage() {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<SortedOrder>(SortedOrder.newestFirst);
  const { data: photos = [], isLoading, error } = useGetAllPhotosSorted(sortOrder);

  const handlePhotoClick = (photoId: string) => {
    navigate({ to: '/photos/$photoId', params: { photoId } });
  };

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
        
        <div className="relative mb-12 animate-fade-in">
          <h1 className="mb-4 text-6xl font-bold tracking-tight md:text-7xl bg-gradient-to-br from-foreground via-accent to-primary bg-clip-text text-transparent">
            Photo Gallery
          </h1>
          <p className="text-muted-foreground text-2xl mb-10">Explore our collection of captured moments</p>
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

        {error && (
          <div className="relative mb-8 p-5 glass-strong border border-destructive/50 rounded-xl">
            <p className="text-destructive font-medium text-lg">Error loading photos. Please try refreshing the page.</p>
          </div>
        )}

        {isLoading ? (
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden glass">
                <CardContent className="p-0">
                  <Skeleton className="aspect-square w-full animate-shimmer" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="relative flex min-h-[500px] flex-col items-center justify-center gap-8">
            <div className="rounded-full bg-accent/15 p-10 shadow-glow-md">
              <ImageIcon className="h-24 w-24 text-accent" />
            </div>
            <p className="text-2xl text-muted-foreground font-medium">No photos available yet.</p>
            <p className="text-lg text-muted-foreground">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo, index) => {
              const imageUrl = photo.blob.getDirectURL();
              return (
                <Card
                  key={photo.id}
                  className="group overflow-hidden glass transition-all hover:shadow-glow-lg hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0">
                    <div
                      className="relative aspect-square cursor-pointer overflow-hidden bg-muted"
                      onClick={() => handlePhotoClick(photo.id)}
                    >
                      <img
                        src={imageUrl}
                        alt={photo.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-3 font-bold tracking-tight text-xl">{photo.name}</h3>
                      {photo.description && (
                        <p className="mb-5 line-clamp-2 text-base text-muted-foreground leading-relaxed">{photo.description}</p>
                      )}
                      <PhotoActions photo={photo} />
                    </div>
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
