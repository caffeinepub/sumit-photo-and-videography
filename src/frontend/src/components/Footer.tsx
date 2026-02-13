import { Mail, Heart } from 'lucide-react';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';
import { useGetFooterContent } from '../hooks/useQueries';

export default function Footer() {
  const { data: footerContent } = useGetFooterContent();

  return (
    <footer className="border-t border-border/30 glass-strong">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-3 text-base text-muted-foreground transition-colors hover:text-foreground group">
            <div className="rounded-lg bg-accent/15 p-2 transition-all group-hover:bg-accent/25 group-hover:scale-110">
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <a 
              href={`mailto:${footerContent?.contactDetails || 'kumarsumitmahto2@gmail.com'}`} 
              className="hover:text-accent transition-colors font-medium"
            >
              {footerContent?.contactDetails || 'kumarsumitmahto2@gmail.com'}
            </a>
          </div>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-8">
            {footerContent?.facebook && (
              <a
                href={footerContent.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-all hover:text-accent hover:scale-125 hover:drop-shadow-glow"
                aria-label="Facebook"
              >
                <SiFacebook className="h-7 w-7" />
              </a>
            )}
            {footerContent?.instagram && (
              <a
                href={footerContent.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-all hover:text-accent hover:scale-125 hover:drop-shadow-glow"
                aria-label="Instagram"
              >
                <SiInstagram className="h-7 w-7" />
              </a>
            )}
            {footerContent?.youtube && (
              <a
                href={footerContent.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-all hover:text-accent hover:scale-125 hover:drop-shadow-glow"
                aria-label="YouTube"
              >
                <SiYoutube className="h-7 w-7" />
              </a>
            )}
          </div>

          <div className="h-px w-40 bg-gradient-to-r from-transparent via-border to-transparent" />

          <p className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
            © 2025. Built with <Heart className="h-4 w-4 text-accent fill-accent animate-pulse" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold hover:text-accent transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}


