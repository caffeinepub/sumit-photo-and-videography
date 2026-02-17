import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PhotoUploadSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photo Management
          </CardTitle>
          <CardDescription>
            Upload and manage photos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Upload className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              Photo upload functionality coming soon
            </p>
            <Button disabled>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
