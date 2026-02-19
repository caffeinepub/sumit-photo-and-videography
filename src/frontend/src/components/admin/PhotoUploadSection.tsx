import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useUploadPhoto, useGetAllPhotos } from '../../hooks/useQueries';
import { SortedOrder } from '../../types/media';
import { blobToUrl } from '../../lib/blob-utils';
import { toast } from 'sonner';

// @ts-ignore - ExternalBlob is provided by blob-storage component
const ExternalBlob = window.ExternalBlob;

interface FileWithPreview {
  file: File;
  preview: string;
  name: string;
  description: string;
  category: string;
  progress: number;
  uploading: boolean;
}

export default function PhotoUploadSection() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = useUploadPhoto();
  const { data: photos = [] } = useGetAllPhotos(SortedOrder.newestFirst);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles((prev) => [
          ...prev,
          {
            file,
            preview: reader.result as string,
            name: file.name.replace(/\.[^/.]+$/, ''),
            description: '',
            category: 'portrait',
            progress: 0,
            uploading: false,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: 'name' | 'description' | 'category', value: string) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const handleUploadAll = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    const invalidFiles = files.filter((f) => !f.name.trim());
    if (invalidFiles.length > 0) {
      toast.error('Please provide names for all photos');
      return;
    }

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i];
      
      try {
        // Update uploading state
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, uploading: true, progress: 0 } : f))
        );

        const arrayBuffer = await fileData.file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage: number) => {
          setFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, progress: percentage } : f))
          );
        });

        await uploadPhoto.mutateAsync({
          name: fileData.name.trim(),
          description: fileData.description.trim(),
          blob,
          category: fileData.category,
        });

        // Remove uploaded file from list
        setFiles((prev) => prev.filter((_, idx) => idx !== i));
        i--; // Adjust index after removal
      } catch (error) {
        console.error('Upload error:', error);
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, uploading: false, progress: 0 } : f))
        );
      }
    }

    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload Photos
          </CardTitle>
          <CardDescription>
            Select multiple photos to upload to the gallery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo-files">Select Photos *</Label>
            <Input
              id="photo-files"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, WebP
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Selected Photos ({files.length})
                </Label>
                <Button
                  onClick={handleUploadAll}
                  disabled={isUploading || files.some((f) => !f.name.trim())}
                  size="sm"
                >
                  {isUploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload All
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {files.map((fileData, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <img
                          src={fileData.preview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                        />
                        {!fileData.uploading && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor={`name-${index}`} className="text-xs">
                            Photo Name *
                          </Label>
                          <Input
                            id={`name-${index}`}
                            value={fileData.name}
                            onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                            placeholder="Enter photo name"
                            disabled={fileData.uploading}
                            className="h-8"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label htmlFor={`category-${index}`} className="text-xs">
                              Category
                            </Label>
                            <Select
                              value={fileData.category}
                              onValueChange={(value) => handleFieldChange(index, 'category', value)}
                              disabled={fileData.uploading}
                            >
                              <SelectTrigger id={`category-${index}`} className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="portrait">Portrait</SelectItem>
                                <SelectItem value="landscape">Landscape</SelectItem>
                                <SelectItem value="event">Event</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor={`description-${index}`} className="text-xs">
                              Description
                            </Label>
                            <Input
                              id={`description-${index}`}
                              value={fileData.description}
                              onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                              placeholder="Optional"
                              disabled={fileData.uploading}
                              className="h-8"
                            />
                          </div>
                        </div>

                        {fileData.uploading && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Uploading...</span>
                              <span>{fileData.progress}%</span>
                            </div>
                            <Progress value={fileData.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Photos</CardTitle>
          <CardDescription>
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'} in gallery
          </CardDescription>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No photos uploaded yet
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.slice(0, 6).map((photo) => (
                <div key={photo.id} className="aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={blobToUrl(photo.blob)}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
