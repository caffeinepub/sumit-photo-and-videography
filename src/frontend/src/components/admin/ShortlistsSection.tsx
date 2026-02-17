import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function ShortlistsSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            User Shortlists
          </CardTitle>
          <CardDescription>
            View user shortlists and favorites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              No shortlists available yet
            </p>
            <p className="text-sm text-muted-foreground">
              User shortlists will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
