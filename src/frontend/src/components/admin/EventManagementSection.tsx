import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EventManagementSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Management
          </CardTitle>
          <CardDescription>
            Create and manage events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              Event management functionality coming soon
            </p>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
