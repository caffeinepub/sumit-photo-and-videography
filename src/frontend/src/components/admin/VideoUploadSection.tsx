import { useState } from 'react';
import { useGetAllVideosSorted, useUploadVideo, useDeleteVideo } from '../../hooks/useQueries';
import { SortedOrder, ExternalBlob } from '../../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Trash2, Upload } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface VideoUpload {
  file: File;
  name: string;
  description: string;
  progress: number;
}

export default function VideoUploadSection() {
  const [uploads, setUploads] = useState<VideoUpload[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: videos = [] } = useGetAllVideosSorted(SortedOrder.newestFirst);
  const uploadVideo = useUploadVideo();
  const deleteVideo = useDeleteVideo();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newUploads = files.map((file) => ({
      file,
      name: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
      progress: 0,
    }));
    setUploads((prev) => [...prev, ...newUploads]);
    e.target.value = '';
  };

  const handleUpload = async (index: number) => {
    const upload = uploads[index];
    if (!upload.name.trim()) {
      toast.error('Please enter a name for the video');
      return;
    }

    try {
      const arrayBuffer = await upload.file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploads((prev) =>
          prev.map((u, i) => (i === index ? { ...u, progress: percentage } : u))
        );
      });

      await uploadVideo.mutateAsync({
        name: upload.name,
        description: upload.description,
        blob,
      });

      toast.success('Video uploaded successfully!');
      setUploads((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
      setUploads((prev) =>
        prev.map((u, i) => (i === index ? { ...u, progress: 0 } : u))
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteVideo.mutateAsync(deleteId);
      toast.success('Video deleted successfully!');
      setDeleteId(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete video');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Videos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="video-files">Select Videos</Label>
            <Input
              id="video-files"
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileSelect}
              className="mt-2"
            />
          </div>

          {uploads.map((upload, index) => (
            <Card key={index}>
              <CardContent className="space-y-4 pt-6">
                <div className="flex gap-4">
                  <video
                    src={URL.createObjectURL(upload.file)}
                    className="h-24 w-24 rounded object-cover"
                    preload="metadata"
                  />
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={upload.name}
                        onChange={(e) =>
                          setUploads((prev) =>
                            prev.map((u, i) => (i === index ? { ...u, name: e.target.value } : u))
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={upload.description}
                        onChange={(e) =>
                          setUploads((prev) =>
                            prev.map((u, i) => (i === index ? { ...u, description: e.target.value } : u))
                          )
                        }
                        rows={2}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Size: {formatFileSize(upload.file.size)}</p>
                  </div>
                </div>
                {upload.progress > 0 && (
                  <div className="space-y-2">
                    <Progress value={upload.progress} />
                    <p className="text-sm text-muted-foreground">{upload.progress}% uploaded</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpload(index)}
                    disabled={uploadVideo.isPending || upload.progress > 0}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setUploads((prev) => prev.filter((_, i) => i !== index))}
                    disabled={upload.progress > 0}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Videos ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-4">
                  <video
                    src={video.blob.getDirectURL()}
                    className="mb-2 aspect-video w-full rounded object-cover"
                    preload="metadata"
                  />
                  <h4 className="mb-1 font-semibold">{video.name}</h4>
                  {video.description && (
                    <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(video.id)}
                    disabled={deleteVideo.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
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
