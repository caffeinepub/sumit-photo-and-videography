import { useState } from 'react';
import {
  useGetAllSpecialMomentsSorted,
  useCreateSpecialMoment,
  useUploadSpecialMomentImage,
  useDeleteSpecialMomentImage,
} from '../../hooks/useQueries';
import { SortedOrder, SpecialMomentDTO, SpecialMomentCreateRequest } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, Plus, Trash2, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import { blobToUrl } from '../../lib/blob-utils';

interface MomentFormData {
  name: string;
  date: string;
}

interface UploadProgress {
  [key: string]: number;
}

export default function SpecialMomentManagementSection() {
  const [sortOrder] = useState<SortedOrder>(SortedOrder.newestFirst);
  const { data: specialMoments = [], isLoading } = useGetAllSpecialMomentsSorted(sortOrder);
  const createSpecialMoment = useCreateSpecialMoment();
  const uploadSpecialMomentImage = useUploadSpecialMomentImage();
  const deleteSpecialMomentImage = useDeleteSpecialMomentImage();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<SpecialMomentDTO | null>(null);
  const [formData, setFormData] = useState<MomentFormData>({
    name: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      date: new Date().toISOString().split('T')[0],
    });
    setSelectedFiles([]);
    setUploadProgress({});
  };

  const handleCreateMoment = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      const dateTime = new Date(formData.date).getTime() * 1000000;
      const request: SpecialMomentCreateRequest = {
        name: formData.name,
        date: BigInt(dateTime),
      };

      await createSpecialMoment.mutateAsync(request);
      toast.success('Special moment created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create special moment');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast.error('Only image files are allowed');
    }
    
    setSelectedFiles(imageFiles);
  };

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.85
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleUploadImages = async () => {
    if (!selectedMoment) {
      toast.error('Please select a special moment first');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsUploading(true);
    const newProgress: UploadProgress = {};
    selectedFiles.forEach((file) => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);

    try {
      for (const file of selectedFiles) {
        try {
          const compressedBlob = await compressImage(file);
          const arrayBuffer = await compressedBlob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          const externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: percentage,
            }));
          });

          await uploadSpecialMomentImage.mutateAsync({
            specialMomentId: selectedMoment.id,
            name: file.name,
            blob: externalBlob,
          });

          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: 100,
          }));
        } catch (error: any) {
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
        }
      }

      toast.success('Images uploaded successfully');
      setSelectedFiles([]);
      setUploadProgress({});
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (specialMomentId: bigint, imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteSpecialMomentImage.mutateAsync({ specialMomentId, imageId });
      toast.success('Image deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete image');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-bold">Special Moments Management</h2>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Create Special Moment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Special Moment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter special moment name"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateMoment} disabled={createSpecialMoment.isPending} className="w-full">
                {createSpecialMoment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Special Moment'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {specialMoments.length === 0 ? (
        <Alert>
          <AlertDescription>No special moments created yet. Create your first special moment to get started.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {specialMoments.map((moment) => {
            const momentDate = new Date(Number(moment.date) / 1000000);
            return (
              <Card key={moment.id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        <CardTitle>{moment.name}</CardTitle>
                      </div>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {momentDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Images ({moment.images.length})</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMoment(moment);
                          document.getElementById(`file-input-${moment.id}`)?.click();
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Images
                      </Button>
                      <input
                        id={`file-input-${moment.id}`}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleFileSelect(e);
                          setSelectedMoment(moment);
                        }}
                      />
                    </div>

                    {selectedMoment?.id === moment.id && selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Selected files: {selectedFiles.length}</p>
                        {selectedFiles.map((file) => (
                          <div key={file.name} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="truncate">{file.name}</span>
                              <span>{uploadProgress[file.name] || 0}%</span>
                            </div>
                            <Progress value={uploadProgress[file.name] || 0} />
                          </div>
                        ))}
                        <Button
                          onClick={handleUploadImages}
                          disabled={isUploading}
                          className="w-full"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Upload Images'
                          )}
                        </Button>
                      </div>
                    )}

                    {moment.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {moment.images.map((image) => {
                          const imageUrl = blobToUrl(image.blob);
                          return (
                            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg">
                              <img
                                src={imageUrl}
                                alt={image.name}
                                className="h-full w-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => handleDeleteImage(moment.id, image.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">No images uploaded yet</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
