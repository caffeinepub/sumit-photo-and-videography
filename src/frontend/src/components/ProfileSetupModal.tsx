import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useCreateNewAuthenticatedUser, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const createUser = useCreateNewAuthenticatedUser();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (showProfileSetup && !isInitializing) {
      setIsInitializing(true);
      createUser.mutate(undefined, {
        onError: (error) => {
          console.error('Failed to initialize user:', error);
          toast.error('Failed to initialize user profile');
          setIsInitializing(false);
        },
        onSuccess: () => {
          setIsInitializing(false);
        },
      });
    }
  }, [showProfileSetup, isInitializing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    saveProfile.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          toast.success('Profile created successfully!');
          setName('');
        },
        onError: (error) => {
          console.error('Failed to save profile:', error);
          toast.error('Failed to save profile');
        },
      }
    );
  };

  return (
    <Dialog open={showProfileSetup && !isInitializing}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogDescription>Please enter your name to complete your profile setup.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={saveProfile.isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
