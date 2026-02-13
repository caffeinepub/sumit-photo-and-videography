import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, X, Camera } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

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

  // Show admin link if user is admin (don't hide while loading)
  const showAdminLink = isAdmin === true;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 glass-strong">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 transition-all hover:opacity-80 group">
          <div className="rounded-xl bg-accent/15 p-2 transition-all group-hover:bg-accent/25 group-hover:scale-110">
            <Camera className="h-6 w-6 text-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight">Sumit Photo & Videography</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link 
            to="/" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Home
          </Link>
          <Link 
            to="/photos" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Photo Gallery
          </Link>
          <Link 
            to="/videos" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Video Gallery
          </Link>
          <Link 
            to="/events" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Events
          </Link>
          <Link 
            to="/special-moments" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Special Moments
          </Link>
          <Link 
            to="/business-info" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            About
          </Link>
          {showAdminLink && (
            <Link 
              to="/admin" 
              className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full [&.active]:after:w-full"
            >
              Admin
            </Link>
          )}
          <Button 
            onClick={handleAuth} 
            disabled={disabled} 
            variant={isAuthenticated ? 'outline' : 'default'}
            className="transition-all hover:shadow-glow-sm font-semibold"
          >
            {buttonText}
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden transition-all hover:text-accent hover:scale-110" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border/30 glass-strong md:hidden animate-fade-in">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-6">
            <Link
              to="/"
              className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/photos"
              className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Photo Gallery
            </Link>
            <Link
              to="/videos"
              className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Video Gallery
            </Link>
            <Link
              to="/events"
              className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/special-moments"
              className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Special Moments
            </Link>
            <Link
              to="/business-info"
              className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            {showAdminLink && (
              <Link
                to="/admin"
                className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'} className="mt-2 font-semibold">
              {buttonText}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
