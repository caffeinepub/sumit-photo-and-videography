import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus, Lock, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEvent, useGetAllEvents } from '../../hooks/useQueries';
import { SortedOrder } from '../../types/media';
import { dateToTime, formatTime } from '../../lib/time-utils';
import { toast } from 'sonner';

// @ts-ignore - ExternalBlob is provided by blob-storage component
const ExternalBlob = window.ExternalBlob;

export default function EventManagementSection() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [password, setPassword] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createEvent = useCreateEvent();
  const { data: events = [] } = useGetAllEvents(SortedOrder.newestFirst);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCreate = async () => {
    if (!name.trim() || !description.trim() || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageBlob = undefined;
      
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(bytes);
      }

      await createEvent.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        date: dateToTime(date),
        password: password.trim() || undefined,
        image: imageBlob,
      });

      // Reset form
      setName('');
      setDescription('');
      setDate('');
      setPassword('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Create event error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Create Event
          </CardTitle>
          <CardDescription>
            Create a new event with optional password protection and cover image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name *</Label>
            <Input
              id="event-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter event name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Description *</Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-date">Event Date *</Label>
            <Input
              id="event-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password (Optional)
            </Label>
            <Input
              id="event-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty for public event"
            />
            <p className="text-xs text-muted-foreground">
              Set a password to make this event private
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Cover Image (Optional)
            </Label>
            <Input
              id="event-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="relative mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-48 object-contain rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleClearImage}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          <Button
            onClick={handleCreate}
            disabled={!name.trim() || !description.trim() || !date || createEvent.isPending}
            className="w-full"
          >
            {createEvent.isPending ? (
              <>Creating...</>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            {events.length} {events.length === 1 ? 'event' : 'events'} created
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No events created yet
            </p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold flex items-center gap-2">
                        {event.name}
                        {event.password && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatTime(event.date)}
                    </span>
                    <span>{event.images.length} images</span>
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
