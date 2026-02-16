import { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

export default function RouterNotFoundRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the path matches /photos/<id> pattern
    const photoDetailPattern = /^\/photos\/[^/]+$/;
    if (photoDetailPattern.test(location.pathname)) {
      // Redirect to photos page with query parameter indicating redirect
      const url = new URL(window.location.href);
      url.pathname = '/photos';
      url.searchParams.set('redirected', 'photo-detail');
      window.location.href = url.toString();
    }
  }, [location.pathname, navigate]);

  return (
    <div className="relative container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-texture" />
      </div>
      <div className="relative text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Page Not Found</h1>
        <p className="text-xl text-muted-foreground">
          Redirecting you to the gallery...
        </p>
      </div>
    </div>
  );
}
