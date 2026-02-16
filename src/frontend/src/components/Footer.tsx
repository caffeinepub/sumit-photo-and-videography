import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';
import { Mail, Heart } from 'lucide-react';
import { useGetFooterContent } from '../hooks/useQueries';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  const { data: footerContent } = useGetFooterContent();

  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'sumit-photo-videography'
  );

  return (
    <footer className="relative mt-20 border-t border-border/40 glass-strong">
      {/* Vibrant gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent opacity-60" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              Sumit Photo & Videography
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Capturing life's precious moments with creativity and passion. Professional photography and videography services for all occasions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="text-base text-muted-foreground transition-all hover:text-accent hover:translate-x-1"
              >
                Home
              </Link>
              <Link 
                to="/photos" 
                className="text-base text-muted-foreground transition-all hover:text-accent hover:translate-x-1"
              >
                Photo Gallery
              </Link>
              <Link 
                to="/special-moments" 
                className="text-base text-muted-foreground transition-all hover:text-accent hover:translate-x-1"
              >
                Special Moments
              </Link>
              <Link 
                to="/business-info" 
                className="text-base text-muted-foreground transition-all hover:text-accent hover:translate-x-1"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-foreground">Connect With Us</h4>
            {footerContent?.contactDetails && (
              <a
                href={`mailto:${footerContent.contactDetails}`}
                className="flex items-center gap-3 text-base text-muted-foreground transition-all hover:text-accent group"
              >
                <div className="rounded-lg bg-accent/15 p-2 transition-all group-hover:bg-accent/25 group-hover:scale-110">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform">{footerContent.contactDetails}</span>
              </a>
            )}
            <div className="flex gap-4 pt-2">
              {footerContent?.facebook && (
                <a
                  href={footerContent.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-primary/15 p-3 text-primary transition-all hover:bg-primary/25 hover:scale-110 hover:shadow-glow-sm"
                  aria-label="Facebook"
                >
                  <SiFacebook className="h-6 w-6" />
                </a>
              )}
              {footerContent?.instagram && (
                <a
                  href={footerContent.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-accent/15 p-3 text-accent transition-all hover:bg-accent/25 hover:scale-110 hover:shadow-glow-sm"
                  aria-label="Instagram"
                >
                  <SiInstagram className="h-6 w-6" />
                </a>
              )}
              {footerContent?.youtube && (
                <a
                  href={footerContent.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-destructive/15 p-3 text-destructive transition-all hover:bg-destructive/25 hover:scale-110 hover:shadow-glow-sm"
                  aria-label="YouTube"
                >
                  <SiYoutube className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Sumit Photo & Videography. All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              Built with{' '}
              <Heart className="h-4 w-4 text-accent animate-pulse" fill="currentColor" />{' '}
              using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent transition-all hover:text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
