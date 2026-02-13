import { useState, useEffect } from 'react';
import { useGetAllPhotosSorted, useUploadMultiplePhotos, useDeletePhoto } from '../../hooks/useQueries';
import { SortedOrder, ExternalBlob } from '../../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Trash2, Upload, X, Image as ImageIcon, Heart } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface PhotoUpload {
  id: string;
  file: File;
  name: string;
  description: string;
  progress: number;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

export default function PhotoUploadSection() {
  const [uploads, setUploads] = useState<PhotoUpload[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: photos = [] } = useGetAllPhotosSorted(SortedOrder.newestFirst);
  const uploadMultiplePhotos = useUploadMultiplePhotos();
  const deletePhoto = useDeletePhoto();

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      uploads.forEach((upload) => {
        if (upload.previewUrl) {
          URL.revokeObjectURL(upload.previewUrl);
        }
      });
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newUploads: PhotoUpload[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      name: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
      progress: 0,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
    }));
    setUploads((prev) => [...prev, ...newUploads]);
    e.target.value = '';
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => {
      const upload = prev.find((u) => u.id === id);
      if (upload?.previewUrl) {
        URL.revokeObjectURL(upload.previewUrl);
      }
      return prev.filter((u) => u.id !== id);
    });
  };

  const handleUploadAll = async () => {
    const pendingUploads = uploads.filter((u) => u.status === 'pending');
    
    if (pendingUploads.length === 0) {
      toast.error('No photos to upload');
      return;
    }

    // Validate all uploads have names
    const invalidUploads = pendingUploads.filter((u) => !u.name.trim());
    if (invalidUploads.length > 0) {
      toast.error('Please enter names for all photos');
      return;
    }

    try {
      // Mark all as uploading
      setUploads((prev) =>
        prev.map((u) =>
          pendingUploads.some((p) => p.id === u.id)
            ? { ...u, status: 'uploading' as const }
            : u
        )
      );

      // Process files and create blobs with progress tracking
      const photoRequests = await Promise.all(
        pendingUploads.map(async (upload) => {
          const arrayBuffer = await upload.file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          
          const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === upload.id ? { ...u, progress: percentage } : u
              )
            );
          });

          return {
            name: upload.name,
            description: upload.description,
            blob,
          };
        })
      );

      // Upload all photos in batch
      const results = await uploadMultiplePhotos.mutateAsync({
        photos: photoRequests,
      });

      // Check results
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`${successCount} photo${successCount > 1 ? 's' : ''} uploaded successfully!`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} photo${failCount > 1 ? 's' : ''} failed to upload`);
      }

      // Clean up completed uploads
      setUploads((prev) => {
        const completedIds = pendingUploads.map((u) => u.id);
        const remaining = prev.filter((u) => !completedIds.includes(u.id));
        
        // Revoke URLs for completed uploads
        prev.forEach((u) => {
          if (completedIds.includes(u.id) && u.previewUrl) {
            URL.revokeObjectURL(u.previewUrl);
          }
        });
        
        return remaining;
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photos');
      
      // Reset status to pending for failed uploads
      setUploads((prev) =>
        prev.map((u) =>
          u.status === 'uploading'
            ? { ...u, status: 'pending' as const, progress: 0 }
            : u
        )
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePhoto.mutateAsync(deleteId);
      toast.success('Photo deleted successfully!');
      setDeleteId(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete photo');
    }
  };

  const pendingCount = uploads.filter((u) => u.status === 'pending').length;
  const uploadingCount = uploads.filter((u) => u.status === 'uploading').length;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="photo-files">Select Multiple Photos</Label>
            <Input
              id="photo-files"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="mt-2"
              disabled={uploadingCount > 0}
            />
            <p className="mt-1 text-sm text-muted-foreground">
              Select one or more images to upload
            </p>
          </div>

          {uploads.length > 0 && (
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {uploads.length} photo{uploads.length > 1 ? 's' : ''} selected
                  {uploadingCount > 0 && ` (${uploadingCount} uploading...)`}
                </span>
              </div>
              <Button
                onClick={handleUploadAll}
                disabled={uploadingCount > 0 || pendingCount === 0}
                size="sm"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload All ({pendingCount})
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {uploads.map((upload) => (
              <Card key={upload.id} className={upload.status === 'uploading' ? 'border-primary' : ''}>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={upload.previewUrl}
                        alt="Preview"
                        className="h-24 w-24 rounded object-cover"
                      />
                      {upload.status === 'uploading' && (
                        <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={upload.name}
                          onChange={(e) =>
                            setUploads((prev) =>
                              prev.map((u) =>
                                u.id === upload.id ? { ...u, name: e.target.value } : u
                              )
                            )
                          }
                          disabled={upload.status === 'uploading'}
                          placeholder="Enter photo name"
                        />
                      </div>
                      <div>
                        <Label>Description (optional)</Label>
                        <Textarea
                          value={upload.description}
                          onChange={(e) =>
                            setUploads((prev) =>
                              prev.map((u) =>
                                u.id === upload.id ? { ...u, description: e.target.value } : u
                              )
                            )
                          }
                          disabled={upload.status === 'uploading'}
                          rows={2}
                          placeholder="Enter photo description"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        File: {upload.file.name} ({(upload.file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeUpload(upload.id)}
                      disabled={upload.status === 'uploading'}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {upload.progress > 0 && upload.status === 'uploading' && (
                    <div className="space-y-2">
                      <Progress value={upload.progress} />
                      <p className="text-sm text-muted-foreground">
                        Uploading: {upload.progress}%
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Photos ({photos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No photos uploaded yet</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <CardContent className="p-4">
                    <img
                      src={photo.blob.getDirectURL()}
                      alt={photo.name}
                      className="mb-2 aspect-square w-full rounded object-cover"
                    />
                    <h4 className="mb-1 font-semibold">{photo.name}</h4>
                    {photo.description && (
                      <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                        {photo.description}
                      </p>
                    )}
                    <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      <span>{Number(photo.likeCount)} likes</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(photo.id)}
                      disabled={deletePhoto.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
