import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function RouterNotFoundRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: '/' });
  }, [navigate]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
