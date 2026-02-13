import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Lock } from 'lucide-react';
import PhotoUploadSection from '../components/admin/PhotoUploadSection';
import VideoUploadSection from '../components/admin/VideoUploadSection';
import FooterEditSection from '../components/admin/FooterEditSection';
import EventManagementSection from '../components/admin/EventManagementSection';
import SpecialMomentManagementSection from '../components/admin/SpecialMomentManagementSection';
import UserStatisticsSection from '../components/admin/UserStatisticsSection';
import VisitorsSection from '../components/admin/VisitorsSection';
import ShortlistsSection from '../components/admin/ShortlistsSection';
import AdminAccessHelper from '../components/AdminAccessHelper';
import { useNavigate } from '@tanstack/react-router';

export default function AdminPage() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const { identity, login } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="absolute inset-0 bg-texture pointer-events-none" />
        <div className="relative mx-auto max-w-md">
          <Alert className="glass-strong border-accent/50">
            <Lock className="h-6 w-6 text-accent" />
            <AlertTitle className="text-xl">Authentication Required</AlertTitle>
            <AlertDescription className="text-base">
              Please log in to access the admin panel.
            </AlertDescription>
          </Alert>
          <div className="mt-8 flex gap-4">
            <Button onClick={() => login()} className="flex-1 font-semibold">
              Log In
            </Button>
            <Button onClick={() => navigate({ to: '/' })} variant="outline" className="flex-1 glass font-semibold">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but not admin - show helper
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <div className="absolute inset-0 bg-texture pointer-events-none" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-accent bg-clip-text text-transparent mb-3">
              Admin Panel Access
            </h1>
            <p className="text-muted-foreground text-lg">
              You need administrator privileges to access this section
            </p>
          </div>
          <AdminAccessHelper />
          <div className="mt-8">
            <Button onClick={() => navigate({ to: '/' })} variant="outline" className="w-full glass font-semibold">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Admin user - show admin panel
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="absolute inset-0 bg-texture pointer-events-none" />
      
      <div className="relative mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-accent bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <p className="mt-3 text-muted-foreground text-xl">Manage your photos, videos, events, special moments, and site content</p>
      </div>
      <Tabs defaultValue="photos" className="relative w-full">
        <TabsList className="grid w-full grid-cols-8 glass-strong h-auto p-1">
          <TabsTrigger value="photos" className="font-semibold">Photos</TabsTrigger>
          <TabsTrigger value="videos" className="font-semibold">Videos</TabsTrigger>
          <TabsTrigger value="events" className="font-semibold">Events</TabsTrigger>
          <TabsTrigger value="special-moments" className="font-semibold">Special Moments</TabsTrigger>
          <TabsTrigger value="shortlists" className="font-semibold">Shortlists</TabsTrigger>
          <TabsTrigger value="statistics" className="font-semibold">Statistics</TabsTrigger>
          <TabsTrigger value="visitors" className="font-semibold">Visitors</TabsTrigger>
          <TabsTrigger value="footer" className="font-semibold">Footer</TabsTrigger>
        </TabsList>
        <TabsContent value="photos">
          <PhotoUploadSection />
        </TabsContent>
        <TabsContent value="videos">
          <VideoUploadSection />
        </TabsContent>
        <TabsContent value="events">
          <EventManagementSection />
        </TabsContent>
        <TabsContent value="special-moments">
          <SpecialMomentManagementSection />
        </TabsContent>
        <TabsContent value="shortlists">
          <ShortlistsSection />
        </TabsContent>
        <TabsContent value="statistics">
          <UserStatisticsSection />
        </TabsContent>
        <TabsContent value="visitors">
          <VisitorsSection />
        </TabsContent>
        <TabsContent value="footer">
          <FooterEditSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
