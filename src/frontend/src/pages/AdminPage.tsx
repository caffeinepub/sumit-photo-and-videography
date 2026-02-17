import { useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrdersSection from '../components/admin/OrdersSection';
import PhotoUploadSection from '../components/admin/PhotoUploadSection';
import VideoUploadSection from '../components/admin/VideoUploadSection';
import EventManagementSection from '../components/admin/EventManagementSection';
import SpecialMomentManagementSection from '../components/admin/SpecialMomentManagementSection';
import ShortlistsSection from '../components/admin/ShortlistsSection';
import VisitorsSection from '../components/admin/VisitorsSection';
import FooterEditSection from '../components/admin/FooterEditSection';
import UserStatisticsSection from '../components/admin/UserStatisticsSection';
import AdminAccessHelper from '../components/AdminAccessHelper';

export default function AdminPage() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const { identity, login } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState('orders');

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md">
          <Alert>
            <Lock className="h-5 w-5" />
            <AlertTitle className="text-lg">Authentication Required</AlertTitle>
            <AlertDescription>
              Please log in to access the admin panel.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => login()}
            className="mt-6 w-full"
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
        <AdminAccessHelper />
      </div>
    );
  }

  // Admin user
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Admin Panel
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your studio content and settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 gap-2">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="moments">Moments</TabsTrigger>
          <TabsTrigger value="shortlists">Shortlists</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <OrdersSection />
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <PhotoUploadSection />
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <VideoUploadSection />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <EventManagementSection />
        </TabsContent>

        <TabsContent value="moments" className="space-y-6">
          <SpecialMomentManagementSection />
        </TabsContent>

        <TabsContent value="shortlists" className="space-y-6">
          <ShortlistsSection />
        </TabsContent>

        <TabsContent value="visitors" className="space-y-6">
          <VisitorsSection />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <UserStatisticsSection />
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <FooterEditSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
