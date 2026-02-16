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
import OrdersSection from '../components/admin/OrdersSection';
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
          <Alert className="glass-strong border-2 border-primary/60 shadow-glow-md">
            <Lock className="h-6 w-6 text-primary" />
            <AlertTitle className="text-xl">Authentication Required</AlertTitle>
            <AlertDescription className="text-base">
              Please log in to access the admin panel.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => login()}
            className="mt-6 w-full bg-gradient-to-r from-accent to-primary hover:shadow-glow-md font-semibold"
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="absolute inset-0 bg-texture pointer-events-none" />
        <AdminAccessHelper />
      </div>
    );
  }

  // Admin user
  return (
    <div className="relative container mx-auto px-4 py-12 min-h-screen">
      <div className="absolute inset-0 bg-texture pointer-events-none" />
      
      <div className="relative mb-12 animate-fade-in">
        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl gradient-heading">
          Admin Panel
        </h1>
        <p className="text-muted-foreground text-xl">Manage your photography and videography business</p>
      </div>

      <Tabs defaultValue="photos" className="relative space-y-8">
        <TabsList className="glass-strong border-accent/30 p-2 flex-wrap h-auto gap-2">
          <TabsTrigger value="photos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/20 data-[state=active]:to-primary/20 data-[state=active]:text-accent font-semibold">Photos</TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/20 data-[state=active]:to-primary/20 data-[state=active]:text-accent font-semibold">Videos</TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/20 data-[state=active]:to-primary/20 data-[state=active]:text-accent font-semibold">Events</TabsTrigger>
          <TabsTrigger value="special-moments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/20 data-[state=active]:to-primary/20 data-[state=active]:text-accent font-semibold">Special Moments</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/20 data-[state=active]:to-primary/20 data-[state=active]:text-accent font-semibold">Orders</TabsTrigger>
          <TabsTrigger value="shortlists" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/20 data-[state=active]:to-primary/20 data-[state=active]:text-accent font-semibold">Shortlists</TabsTrigger>
          <TabsTrigger value="statistics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/20 data-[state=active]:to-primary/20 data-[state=active]:text-accent font-semibold">Statistics</TabsTrigger>
          <TabsTrigger value="visitors" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/20 data-[state=active]:to-primary/20 data-[state=active]:text-accent font-semibold">Visitors</TabsTrigger>
          <TabsTrigger value="footer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/20 data-[state=active]:to-primary/20 data-[state=active]:text-accent font-semibold">Footer</TabsTrigger>
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

        <TabsContent value="orders">
          <OrdersSection />
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
