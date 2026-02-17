import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VideoUploadSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Management
          </CardTitle>
          <CardDescription>
            Upload and manage videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Upload className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              Video upload functionality coming soon
            </p>
            <Button disabled>
              <Upload className="mr-2 h-4 w-4" />
              Upload Videos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
