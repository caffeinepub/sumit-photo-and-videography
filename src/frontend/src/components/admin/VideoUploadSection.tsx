import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useUploadVideo, useGetAllVideos } from '../../hooks/useQueries';
import { SortedOrder } from '../../types/media';
import { blobToUrl } from '../../lib/blob-utils';
import { toast } from 'sonner';

// @ts-ignore - ExternalBlob is provided by blob-storage component
const ExternalBlob = window.ExternalBlob;

interface FileWithMetadata {
  file: File;
  name: string;
  description: string;
  progress: number;
  uploading: boolean;
}

export default function VideoUploadSection() {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadVideo = useUploadVideo();
  const { data: videos = [] } = useGetAllVideos(SortedOrder.newestFirst);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const newFiles = selectedFiles.map((file) => ({
      file,
      name: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
      progress: 0,
      uploading: false,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Reset input
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: 'name' | 'description', value: string) => {
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
      toast.error('Please provide names for all videos');
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

        await uploadVideo.mutateAsync({
          name: fileData.name.trim(),
          description: fileData.description.trim(),
          blob,
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
            <Video className="h-5 w-5" />
            Upload Videos
          </CardTitle>
          <CardDescription>
            Select multiple videos to upload to the gallery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-files">Select Videos *</Label>
            <Input
              id="video-files"
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: MP4, WebM, MOV
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Selected Videos ({files.length})
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
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{fileData.file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(fileData.file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`video-name-${index}`} className="text-xs">
                            Video Name *
                          </Label>
                          <Input
                            id={`video-name-${index}`}
                            value={fileData.name}
                            onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                            placeholder="Enter video name"
                            disabled={fileData.uploading}
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`video-description-${index}`} className="text-xs">
                            Description
                          </Label>
                          <Textarea
                            id={`video-description-${index}`}
                            value={fileData.description}
                            onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                            placeholder="Optional description"
                            disabled={fileData.uploading}
                            rows={2}
                            className="resize-none"
                          />
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

                      {!fileData.uploading && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
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
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>
            {videos.length} {videos.length === 1 ? 'video' : 'videos'} in gallery
          </CardDescription>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No videos uploaded yet
            </p>
          ) : (
            <div className="space-y-3">
              {videos.slice(0, 5).map((video) => (
                <div key={video.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Video className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{video.name}</p>
                    {video.description && (
                      <p className="text-sm text-muted-foreground truncate">{video.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
