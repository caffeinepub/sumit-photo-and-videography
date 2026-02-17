import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FooterEditSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Footer Settings
          </CardTitle>
          <CardDescription>
            Edit footer content and social media links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="kumarsumitmahto2@gmail.com"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              type="url"
              placeholder="https://www.facebook.com/yourpage"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              type="url"
              placeholder="https://www.instagram.com/yourprofile"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube URL</Label>
            <Input
              id="youtube"
              type="url"
              placeholder="https://www.youtube.com/yourchannel"
              disabled
            />
          </div>
          <Button disabled>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
