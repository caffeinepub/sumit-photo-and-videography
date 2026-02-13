import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useTogglePhotoLike, useHasUserLikedPhoto } from '../hooks/useQueries';
import { downloadImage } from '../lib/blob-utils';
import type { Photo } from '../backend';

interface PhotoActionsProps {
  photo: Photo;
  variant?: 'default' | 'large';
}

export function PhotoActions({ photo, variant = 'default' }: PhotoActionsProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: isLiked = false } = useHasUserLikedPhoto(photo.id);
  const toggleLike = useTogglePhotoLike();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please log in to like photos');
      return;
    }

    try {
      await toggleLike.mutateAsync(photo.id);
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to update like');
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const filename = `${photo.name.replace(/[^a-z0-9]/gi, '_')}.jpg`;
      await downloadImage(photo.blob, filename);
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    } finally {
      setIsDownloading(false);
    }
  };

  const isLarge = variant === 'large';

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size={isLarge ? 'lg' : 'sm'}
        onClick={handleLike}
        disabled={toggleLike.isPending}
        className={`flex items-center gap-2 transition-all hover:scale-110 hover:bg-accent/15 ${
          isLarge ? 'text-lg px-6 py-6' : ''
        }`}
      >
        <Heart
          className={`transition-all ${
            isLarge ? 'h-6 w-6' : 'h-5 w-5'
          } ${
            isLiked ? 'fill-accent text-accent scale-110 drop-shadow-glow' : 'text-muted-foreground hover:text-accent'
          }`}
        />
        <span className={`font-semibold ${isLarge ? 'text-lg' : 'text-sm'}`}>
          {Number(photo.likeCount)}
        </span>
      </Button>
      <Button
        variant="ghost"
        size={isLarge ? 'lg' : 'sm'}
        onClick={handleDownload}
        disabled={isDownloading}
        className={`flex items-center gap-2 transition-all hover:scale-110 hover:bg-accent/15 ${
          isLarge ? 'text-lg px-6 py-6' : ''
        }`}
        title="Download image"
      >
        <Download
          className={`transition-all ${
            isLarge ? 'h-6 w-6' : 'h-5 w-5'
          } ${
            isDownloading ? 'animate-pulse text-accent' : 'text-muted-foreground hover:text-accent'
          }`}
        />
      </Button>
    </div>
  );
}
