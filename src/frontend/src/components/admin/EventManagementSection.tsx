import { useState } from 'react';
import {
  useGetAllEventsSorted,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useUploadEventImage,
  useDeleteEventImage,
  useSetEventPassword,
  useRemoveEventPassword,
} from '../../hooks/useQueries';
import { SortedOrder, EventDTO, EventCreateRequest } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Edit, Calendar, Image as ImageIcon, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import { blobToUrl } from '../../lib/blob-utils';

interface EventFormData {
  name: string;
  description: string;
  date: string;
}

interface UploadProgress {
  [key: string]: number;
}

export default function EventManagementSection() {
  const [sortOrder] = useState<SortedOrder>(SortedOrder.newestFirst);
  const { data: events = [], isLoading } = useGetAllEventsSorted(sortOrder);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const uploadEventImage = useUploadEventImage();
  const deleteEventImage = useDeleteEventImage();
  const setPasswordMutation = useSetEventPassword();
  const removeEventPassword = useRemoveEventPassword();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDTO | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [eventPassword, setEventPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setSelectedFiles([]);
    setUploadProgress({});
  };

  const handleCreateEvent = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter an event name');
      return;
    }

    try {
      const dateTime = new Date(formData.date).getTime() * 1000000;
      const request: EventCreateRequest = {
        name: formData.name,
        description: formData.description,
        date: BigInt(dateTime),
      };

      await createEvent.mutateAsync(request);
      toast.success('Event created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent || !formData.name.trim()) {
      toast.error('Please enter an event name');
      return;
    }

    try {
      const dateTime = new Date(formData.date).getTime() * 1000000;
      const request: EventCreateRequest = {
        name: formData.name,
        description: formData.description,
        date: BigInt(dateTime),
      };

      await updateEvent.mutateAsync({ eventId: selectedEvent.id, request });
      toast.success('Event updated successfully');
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: bigint) => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all associated images.')) {
      return;
    }

    try {
      await deleteEvent.mutateAsync(eventId);
      toast.success('Event deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  const openEditDialog = (event: EventDTO) => {
    setSelectedEvent(event);
    const eventDate = new Date(Number(event.date) / 1000000);
    setFormData({
      name: event.name,
      description: event.description,
      date: eventDate.toISOString().split('T')[0],
    });
    setIsEditDialogOpen(true);
  };

  const openPasswordDialog = (event: EventDTO) => {
    setSelectedEvent(event);
    setEventPassword('');
    setShowPassword(false);
    setIsPasswordDialogOpen(true);
  };

  const handleSetPassword = async () => {
    if (!selectedEvent || !eventPassword.trim()) {
      toast.error('Please enter a password');
      return;
    }

    try {
      await setPasswordMutation.mutateAsync({ eventId: selectedEvent.id, password: eventPassword });
      toast.success('Password set successfully');
      setIsPasswordDialogOpen(false);
      setSelectedEvent(null);
      setEventPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to set password');
    }
  };

  const handleRemovePassword = async (eventId: bigint) => {
    if (!confirm('Are you sure you want to remove the password protection from this event?')) {
      return;
    }

    try {
      await removeEventPassword.mutateAsync(eventId);
      toast.success('Password removed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove password');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast.error('Only image files are allowed for events');
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
    if (!selectedEvent) {
      toast.error('Please select an event first');
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

          await uploadEventImage.mutateAsync({
            eventId: selectedEvent.id,
            name: file.name,
            description: '',
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

  const handleDeleteImage = async (eventId: bigint, imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteEventImage.mutateAsync({ eventId, imageId });
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
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter event name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter event description"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="date">Event Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateEvent} disabled={createEvent.isPending} className="w-full">
                {createEvent.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <Alert>
          <AlertDescription>No events created yet. Create your first event to get started.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const eventDate = new Date(Number(event.date) / 1000000);
            return (
              <Card key={event.id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{event.name}</CardTitle>
                        {event.passwordProtected && (
                          <Badge variant="secondary" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Protected
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {eventDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {event.passwordProtected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemovePassword(event.id)}
                          disabled={removeEventPassword.isPending}
                          title="Remove password"
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPasswordDialog(event)}
                          title="Set password"
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={deleteEvent.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{event.description}</p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Event Images ({event.images.length})</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          document.getElementById(`file-input-${event.id}`)?.click();
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Images
                      </Button>
                      <input
                        id={`file-input-${event.id}`}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleFileSelect(e);
                          setSelectedEvent(event);
                        }}
                      />
                    </div>

                    {selectedEvent?.id === event.id && selectedFiles.length > 0 && (
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

                    {event.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {event.images.map((image) => {
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
                                onClick={() => handleDeleteImage(event.id, image.id)}
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

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Event Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter event name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-date">Event Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <Button onClick={handleUpdateEvent} disabled={updateEvent.isPending} className="w-full">
              {updateEvent.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Event'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Event Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Set a password to protect this event. Users will need to enter the password to view event details and images.
              </AlertDescription>
            </Alert>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={eventPassword}
                  onChange={(e) => setEventPassword(e.target.value)}
                  placeholder="Enter password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={handleSetPassword} disabled={setPasswordMutation.isPending} className="w-full">
              {setPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Password...
                </>
              ) : (
                'Set Password'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
