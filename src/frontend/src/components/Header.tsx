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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-strong shadow-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 transition-all hover:opacity-90 group">
          <div className="rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-2.5 transition-all group-hover:from-accent/30 group-hover:to-primary/30 group-hover:scale-110 group-hover:shadow-glow-sm">
            <Camera className="h-6 w-6 text-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
            Sumit Photo & Videography
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link 
            to="/" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-accent after:to-primary after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Home
          </Link>
          <Link 
            to="/photos" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-accent after:to-primary after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Photo Gallery
          </Link>
          <Link 
            to="/videos" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-accent after:to-primary after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Video Gallery
          </Link>
          <Link 
            to="/events" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-accent after:to-primary after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Events
          </Link>
          <Link 
            to="/special-moments" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-accent after:to-primary after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Special Moments
          </Link>
          <Link 
            to="/business-info" 
            className="text-sm font-semibold transition-all hover:text-accent [&.active]:text-accent relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-accent after:to-primary after:transition-all hover:after:w-full [&.active]:after:w-full"
          >
            Contact
          </Link>
          {showAdminLink && (
            <Link 
              to="/admin" 
              className="text-sm font-semibold transition-all hover:text-primary [&.active]:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all hover:after:w-full [&.active]:after:w-full"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            className={`px-6 py-2 font-semibold transition-all ${
              isAuthenticated
                ? 'hover:bg-accent/10 hover:text-accent hover:border-accent/50'
                : 'bg-gradient-to-r from-accent to-primary hover:shadow-glow-md'
            }`}
          >
            {buttonText}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden rounded-lg p-2 transition-all hover:bg-accent/10 hover:text-accent"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 glass-strong md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-6">
            <Link
              to="/"
              className="rounded-lg px-4 py-3 text-base font-semibold transition-all hover:bg-accent/10 hover:text-accent [&.active]:bg-accent/15 [&.active]:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/photos"
              className="rounded-lg px-4 py-3 text-base font-semibold transition-all hover:bg-accent/10 hover:text-accent [&.active]:bg-accent/15 [&.active]:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Photo Gallery
            </Link>
            <Link
              to="/videos"
              className="rounded-lg px-4 py-3 text-base font-semibold transition-all hover:bg-accent/10 hover:text-accent [&.active]:bg-accent/15 [&.active]:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Video Gallery
            </Link>
            <Link
              to="/events"
              className="rounded-lg px-4 py-3 text-base font-semibold transition-all hover:bg-accent/10 hover:text-accent [&.active]:bg-accent/15 [&.active]:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/special-moments"
              className="rounded-lg px-4 py-3 text-base font-semibold transition-all hover:bg-accent/10 hover:text-accent [&.active]:bg-accent/15 [&.active]:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Special Moments
            </Link>
            <Link
              to="/business-info"
              className="rounded-lg px-4 py-3 text-base font-semibold transition-all hover:bg-accent/10 hover:text-accent [&.active]:bg-accent/15 [&.active]:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {showAdminLink && (
              <Link
                to="/admin"
                className="rounded-lg px-4 py-3 text-base font-semibold transition-all hover:bg-primary/10 hover:text-primary [&.active]:bg-primary/15 [&.active]:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="mt-4 pt-4 border-t border-border/40">
              <Button
                onClick={() => {
                  handleAuth();
                  setMobileMenuOpen(false);
                }}
                disabled={disabled}
                variant={isAuthenticated ? 'outline' : 'default'}
                className={`w-full font-semibold transition-all ${
                  isAuthenticated
                    ? 'hover:bg-accent/10 hover:text-accent hover:border-accent/50'
                    : 'bg-gradient-to-r from-accent to-primary hover:shadow-glow-md'
                }`}
              >
                {buttonText}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
