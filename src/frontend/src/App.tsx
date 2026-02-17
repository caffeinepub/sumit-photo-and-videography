import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import PhotosPage from './pages/PhotosPage';
import VideosPage from './pages/VideosPage';
import EventsPage from './pages/EventsPage';
import FavoritesPage from './pages/FavoritesPage';
import PortfolioPage from './pages/PortfolioPage';
import BusinessInfoPage from './pages/BusinessInfoPage';
import SpecialMomentsPage from './pages/SpecialMomentsPage';
import SpecialMomentPage from './pages/SpecialMomentPage';
import MediaGroupPage from './pages/MediaGroupPage';
import EventDetailPage from './pages/EventDetailPage';
import EventPage from './pages/EventPage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import RouterNotFoundRedirect from './components/RouterNotFoundRedirect';

function Layout() {
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

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
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

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/favorites',
  component: FavoritesPage,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolio',
  component: PortfolioPage,
});

const businessInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business-info',
  component: BusinessInfoPage,
});

const specialMomentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/special-moments',
  component: SpecialMomentsPage,
});

const specialMomentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/special-moments/$id',
  component: SpecialMomentPage,
});

const mediaGroupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/media-group/$id',
  component: MediaGroupPage,
});

const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$id',
  component: EventDetailPage,
});

const eventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/event/$id',
  component: EventPage,
});

const photoDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/photos/$id',
  component: PhotoDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  photosRoute,
  videosRoute,
  eventsRoute,
  favoritesRoute,
  portfolioRoute,
  businessInfoRoute,
  specialMomentsRoute,
  specialMomentRoute,
  mediaGroupRoute,
  eventDetailRoute,
  eventRoute,
  photoDetailRoute,
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
