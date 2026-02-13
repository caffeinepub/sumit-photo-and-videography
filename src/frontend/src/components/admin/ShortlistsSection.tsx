import { useState } from 'react';
import { useGetAllShortlistsForAdmin, useGetAllEventsSorted } from '../../hooks/useQueries';
import { SortedOrder } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Heart, User, Calendar, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ShortlistsSection() {
  const { data: shortlists = [], isLoading: isLoadingShortlists } = useGetAllShortlistsForAdmin();
  const { data: events = [], isLoading: isLoadingEvents } = useGetAllEventsSorted(SortedOrder.newestFirst);
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');

  const isLoading = isLoadingShortlists || isLoadingEvents;

  // Group shortlists by event
  const shortlistsByEvent = shortlists.reduce((acc, shortlist) => {
    const eventId = shortlist.eventId.toString();
    if (!acc[eventId]) {
      acc[eventId] = [];
    }
    acc[eventId].push(shortlist);
    return acc;
  }, {} as Record<string, typeof shortlists>);

  // Filter by selected event
  const filteredShortlistsByEvent = selectedEventFilter === 'all'
    ? shortlistsByEvent
    : { [selectedEventFilter]: shortlistsByEvent[selectedEventFilter] || [] };

  // Calculate statistics
  const totalUsers = new Set(shortlists.map(s => s.user.toString())).size;
  const totalShortlistedImages = shortlists.reduce((sum, s) => sum + s.images.length, 0);
  const eventsWithShortlists = Object.keys(shortlistsByEvent).length;

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
        <h2 className="text-2xl font-bold">User Shortlists</h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              Total Users
            </CardDescription>
            <CardTitle className="text-3xl">{totalUsers}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-accent" />
              Total Shortlisted Images
            </CardDescription>
            <CardTitle className="text-3xl">{totalShortlistedImages}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              Events with Shortlists
            </CardDescription>
            <CardTitle className="text-3xl">{eventsWithShortlists}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Event Filter */}
      {events.length > 0 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Filter by Event:</label>
          <Select value={selectedEventFilter} onValueChange={setSelectedEventFilter}>
            <SelectTrigger className="w-[300px] glass">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event.id.toString()} value={event.id.toString()}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {shortlists.length === 0 ? (
        <Alert className="glass">
          <Heart className="h-4 w-4" />
          <AlertDescription>No shortlists created yet. Users can shortlist event images by clicking the heart icon.</AlertDescription>
        </Alert>
      ) : Object.keys(filteredShortlistsByEvent).length === 0 ? (
        <Alert className="glass">
          <AlertDescription>No shortlists found for the selected event.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {Object.entries(filteredShortlistsByEvent).map(([eventId, eventShortlists]) => {
            const event = events.find(e => e.id.toString() === eventId);
            const eventName = event?.name || `Event ${eventId}`;
            const eventDate = event ? new Date(Number(event.date) / 1000000) : null;

            return (
              <Card key={eventId} className="glass-strong">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{eventName}</CardTitle>
                      {eventDate && (
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {eventDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <User className="h-3 w-3" />
                      {eventShortlists.length} {eventShortlists.length === 1 ? 'user' : 'users'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventShortlists.map((shortlist) => (
                      <div
                        key={shortlist.user.toString()}
                        className="rounded-lg border border-border/50 bg-background/30 p-4 transition-all hover:bg-background/50"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm text-muted-foreground">
                              {shortlist.user.toString().slice(0, 20)}...
                            </span>
                          </div>
                          <Badge variant="outline" className="gap-1">
                            <ImageIcon className="h-3 w-3" />
                            {shortlist.images.length} {shortlist.images.length === 1 ? 'image' : 'images'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {shortlist.images.map((imageId) => (
                            <Badge key={imageId} variant="secondary" className="font-mono text-xs">
                              {imageId.length > 30 ? `${imageId.slice(0, 30)}...` : imageId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
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
