import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function UserStatisticsSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            User Statistics
          </CardTitle>
          <CardDescription>
            View user engagement and activity statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              No statistics available yet
            </p>
            <p className="text-sm text-muted-foreground">
              User statistics will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
