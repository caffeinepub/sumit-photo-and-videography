import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PhotosPage from './pages/PhotosPage';
import VideosPage from './pages/VideosPage';
import AdminPage from './pages/AdminPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import SpecialMomentsPage from './pages/SpecialMomentsPage';
import SpecialMomentPage from './pages/SpecialMomentPage';
import BusinessInfoPage from './pages/BusinessInfoPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import SitemapPage from './pages/SitemapPage';
import RobotsPage from './pages/RobotsPage';
import RouterNotFoundRedirect from './components/RouterNotFoundRedirect';
import { useRecordVisitor } from './hooks/useQueries';

function Layout() {
  const recordVisitor = useRecordVisitor();

  useEffect(() => {
    // Record visitor when the app loads
    recordVisitor.mutate();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ProfileSetupModal />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: RouterNotFoundRedirect,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const photosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/photos',
  component: PhotosPage,
});

const videosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/videos',
  component: VideosPage,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventsPage,
});

const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventId',
  component: EventDetailPage,
});

const specialMomentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/special-moments',
  component: SpecialMomentsPage,
});

const specialMomentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/special-moments/$specialMomentId',
  component: SpecialMomentPage,
});

const businessInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business-info',
  component: BusinessInfoPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap.xml',
  component: SitemapPage,
});

const robotsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/robots.txt',
  component: RobotsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  photosRoute,
  videosRoute,
  eventsRoute,
  eventDetailRoute,
  specialMomentsRoute,
  specialMomentDetailRoute,
  businessInfoRoute,
  adminRoute,
  sitemapRoute,
  robotsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
