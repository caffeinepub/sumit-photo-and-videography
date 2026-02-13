import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetSpecialMoment } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, Calendar, ArrowLeft, Download, DownloadCloud, Sparkles } from 'lucide-react';
import { blobToUrl, downloadImage, downloadAllImages } from '../lib/blob-utils';
import { toast } from 'sonner';
import type { SpecialMomentImage } from '../backend';

function DownloadButton({ image }: { image: SpecialMomentImage }) {
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

function DownloadAllButton({ images, momentName }: { images: SpecialMomentImage[]; momentName: string }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownloadAll = async () => {
    if (isDownloading || images.length === 0) return;
    
    setIsDownloading(true);
    setProgress(0);
    
    try {
      await downloadAllImages(
        images,
        momentName,
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

export default function SpecialMomentPage() {
  const { specialMomentId } = useParams({ from: '/special-moments/$specialMomentId' });
  const navigate = useNavigate();
  const specialMomentIdBigInt = BigInt(specialMomentId);

  const { data: moment, isLoading, error } = useGetSpecialMoment(specialMomentIdBigInt);
  const [selectedImage, setSelectedImage] = useState<SpecialMomentImage | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !moment) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate({ to: '/special-moments' })} className="mb-8 glass hover:bg-accent/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Special Moments
        </Button>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Card className="w-full max-w-md glass-strong">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Special Moment Not Found</CardTitle>
              <CardDescription className="text-base">
                The special moment you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const momentDate = new Date(Number(moment.date) / 1000000);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="absolute inset-0 bg-texture pointer-events-none" />
      
      <Button variant="ghost" onClick={() => navigate({ to: '/special-moments' })} className="relative mb-8 glass hover:bg-accent/10">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Special Moments
      </Button>

      <Card className="relative mb-10 glass-strong">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-accent" />
            <CardTitle className="text-4xl tracking-tight">{moment.name}</CardTitle>
          </div>
          <CardDescription className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-accent" />
            {momentDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="relative mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Gallery</h2>
          <p className="text-base text-muted-foreground font-medium">
            {moment.images.length} {moment.images.length === 1 ? 'image' : 'images'}
          </p>
        </div>
        <DownloadAllButton images={moment.images} momentName={moment.name} />
      </div>

      {moment.images.length > 0 ? (
        <div className="relative grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {moment.images.map((image, index) => {
            const imageUrl = blobToUrl(image.blob);
            return (
              <div
                key={image.id}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl glass transition-all hover:shadow-glow-md hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedImage(image)}
              >
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
          <p className="text-muted-foreground text-lg font-medium">No images available for this special moment</p>
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
