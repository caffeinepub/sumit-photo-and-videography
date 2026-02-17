import { Button } from '@/components/ui/button';
import { Heart, Download } from 'lucide-react';

interface PhotoActionsProps {
  photoId: string;
  isLiked?: boolean;
  onLike?: () => void;
  onDownload?: () => void;
  variant?: 'default' | 'large';
}

export default function PhotoActions({
  photoId,
  isLiked = false,
  onLike,
  onDownload,
  variant = 'default',
}: PhotoActionsProps) {
  const size = variant === 'large' ? 'default' : 'sm';

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size={size}
        onClick={onLike}
        className="gap-2"
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
        {variant === 'large' && (isLiked ? 'Liked' : 'Like')}
      </Button>
      <Button
        variant="outline"
        size={size}
        onClick={onDownload}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        {variant === 'large' && 'Download'}
      </Button>
    </div>
  );
}
