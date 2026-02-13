import { useState, useEffect } from 'react';
import { useGetFooterContent, useUpdateFooterContent } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function FooterEditSection() {
  const { data: footerContent } = useGetFooterContent();
  const updateFooter = useUpdateFooterContent();
  const [contactDetails, setContactDetails] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');

  useEffect(() => {
    if (footerContent) {
      setContactDetails(footerContent.contactDetails);
      setFacebook(footerContent.facebook || '');
      setInstagram(footerContent.instagram || '');
      setYoutube(footerContent.youtube || '');
    }
  }, [footerContent]);

  const handleSave = async () => {
    if (!contactDetails.trim()) {
      toast.error('Contact details cannot be empty');
      return;
    }

    try {
      await updateFooter.mutateAsync({
        contactDetails: contactDetails.trim(),
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
      });
      toast.success('Footer updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update footer');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Footer Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="contact-details">Contact Email</Label>
          <Input
            id="contact-details"
            type="email"
            value={contactDetails}
            onChange={(e) => setContactDetails(e.target.value)}
            placeholder="kumarsumitmahto2@gmail.com"
            className="mt-2"
          />
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-medium">Social Media Links</h3>
          
          <div>
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://www.facebook.com/yourpage"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://www.instagram.com/yourprofile"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="youtube">YouTube URL</Label>
            <Input
              id="youtube"
              type="url"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              placeholder="https://www.youtube.com/yourchannel"
              className="mt-2"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={updateFooter.isPending}>
          {updateFooter.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}
