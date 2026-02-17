import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Home, ShieldCheck, Camera, Video, Calendar, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 text-xl font-bold transition-colors hover:text-primary"
          >
            <Camera className="h-6 w-6" />
            Studio Portal
          </button>
        </div>

        <nav className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/' })}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/photos' })}
              className="gap-2"
            >
              <Camera className="h-4 w-4" />
              Photos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/videos' })}
              className="gap-2"
            >
              <Video className="h-4 w-4" />
              Videos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/events' })}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Events
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/admin' })}
              className="gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate({ to: '/' })}>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/photos' })}>
                  <Camera className="mr-2 h-4 w-4" />
                  Photos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/videos' })}>
                  <Video className="mr-2 h-4 w-4" />
                  Videos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/events' })}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Events
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
          >
            {text}
          </Button>
        </nav>
      </div>
    </header>
  );
}
