import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function VisitorsSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Site Visitors
          </CardTitle>
          <CardDescription>
            View visitor statistics and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              No visitor data available yet
            </p>
            <p className="text-sm text-muted-foreground">
              Visitor statistics will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
