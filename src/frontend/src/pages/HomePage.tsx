import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Camera, Video, ArrowRight, Sparkles, Award, Clock, Zap, Users, Heart } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function HomePage() {
  return (
    <>
      <SEOHead page="home" />
      <div className="flex flex-col">
        {/* Cinematic Hero Section with Striking Wallpaper */}
        <section className="relative flex min-h-[850px] items-center justify-center overflow-hidden">
          {/* Background Image with Cinematic Overlay */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/assets/generated/cinematic-hero-bg.dim_1200x800.jpg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-accent/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute inset-0 bg-texture" />
          </div>
          
          <div className="container relative z-10 mx-auto px-4 text-center animate-fade-in">
            <div className="mb-12 inline-block animate-modern-float">
              <img
                src="/assets/generated/sumit-logo-transparent.dim_200x200.png"
                alt="Sumit Photo and Videography"
                className="mx-auto h-48 w-48 drop-shadow-2xl transition-transform hover:scale-110 filter brightness-110"
              />
            </div>
            
            <h1 className="mb-10 text-6xl font-bold tracking-tight md:text-7xl lg:text-8xl bg-gradient-to-br from-foreground via-accent to-primary bg-clip-text text-transparent drop-shadow-2xl animate-glow">
              Sumit Photo and Videography
            </h1>
            
            <p className="mx-auto mb-14 max-w-3xl text-2xl text-muted-foreground md:text-3xl leading-relaxed font-light">
              Capturing life's precious moments through professional photography and videography services. Creating
              memories that last forever with elegance and artistry.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Button asChild size="lg" className="group transition-all hover:shadow-glow-lg text-lg px-10 py-7 animate-modern-glow">
                <Link to="/photos">
                  <Camera className="mr-3 h-6 w-6 transition-transform group-hover:scale-125" />
                  View Photo Gallery
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group glass transition-all hover:border-accent hover:text-accent hover:shadow-glow-md text-lg px-10 py-7">
                <Link to="/videos">
                  <Video className="mr-3 h-6 w-6 transition-transform group-hover:scale-125" />
                  View Video Gallery
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section with Cinematic Design */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-texture" />
          <div 
            className="absolute inset-0 opacity-8"
            style={{ backgroundImage: 'url(/assets/generated/cinematic-workspace-bg.dim_1200x400.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/93 via-background/82 to-accent/12" />
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="mb-24 text-center animate-fade-in">
              <h2 className="mb-8 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl bg-gradient-to-br from-foreground to-accent bg-clip-text text-transparent">
                Our Services
              </h2>
              <p className="mx-auto max-w-3xl text-2xl text-muted-foreground leading-relaxed">
                Professional photography and videography tailored to your unique vision
              </p>
            </div>
            
            <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
              <div className="group relative overflow-hidden rounded-3xl glass-strong p-12 transition-all hover:shadow-glow-lg hover-lift">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/12 rounded-full blur-3xl transition-all group-hover:bg-accent/25 group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-10 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-accent/18 transition-all group-hover:bg-accent/30 group-hover:scale-125 shadow-glow-sm">
                    <Camera className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="mb-6 text-4xl font-bold tracking-tight">Photography</h3>
                  <p className="mb-10 text-muted-foreground leading-relaxed text-xl">
                    Professional photography services for weddings, events, portraits, and more. We capture every moment
                    with precision, creativity, and an artistic eye that brings your story to life.
                  </p>
                  <Button asChild variant="ghost" className="group/btn text-accent hover:text-accent hover:bg-accent/15 text-lg">
                    <Link to="/photos">
                      Explore Photos 
                      <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover/btn:translate-x-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-3xl glass-strong p-12 transition-all hover:shadow-glow-lg hover-lift">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/12 rounded-full blur-3xl transition-all group-hover:bg-primary/25 group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-10 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/18 transition-all group-hover:bg-primary/30 group-hover:scale-125 shadow-glow-sm">
                    <Video className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="mb-6 text-4xl font-bold tracking-tight">Videography</h3>
                  <p className="mb-10 text-muted-foreground leading-relaxed text-xl">
                    Cinematic videography that tells your story. From weddings to corporate events, we create stunning
                    visual narratives that capture emotion, movement, and unforgettable moments.
                  </p>
                  <Button asChild variant="ghost" className="group/btn text-primary hover:text-primary hover:bg-primary/15 text-lg">
                    <Link to="/videos">
                      Explore Videos 
                      <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover/btn:translate-x-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section with Cinematic Background */}
        <section className="relative py-32 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/assets/generated/why-choose-us-bg.dim_1200x400.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/93 via-card/88 to-accent/25" />
          <div className="absolute inset-0 bg-texture" />
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="mb-24 text-center">
              <h2 className="mb-8 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl bg-gradient-to-br from-foreground to-accent bg-clip-text text-transparent">
                Why Choose Us
              </h2>
              <p className="mx-auto max-w-3xl text-2xl text-muted-foreground leading-relaxed">
                Excellence in every frame, dedication in every project
              </p>
            </div>
            
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              <div className="group text-center p-10 rounded-3xl glass transition-all hover:shadow-glow-md hover-lift">
                <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-accent/18 transition-all group-hover:bg-accent/30 group-hover:scale-125 shadow-glow-sm">
                  <Sparkles className="h-12 w-12 text-accent" />
                </div>
                <h3 className="mb-5 text-3xl font-bold tracking-tight">Creative Excellence</h3>
                <p className="text-muted-foreground leading-relaxed text-xl">
                  Artistic vision combined with technical expertise
                </p>
              </div>
              
              <div className="group text-center p-10 rounded-3xl glass transition-all hover:shadow-glow-md hover-lift">
                <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-accent/18 transition-all group-hover:bg-accent/30 group-hover:scale-125 shadow-glow-sm">
                  <Award className="h-12 w-12 text-accent" />
                </div>
                <h3 className="mb-5 text-3xl font-bold tracking-tight">Professional Quality</h3>
                <p className="text-muted-foreground leading-relaxed text-xl">
                  High-end equipment and post-production excellence
                </p>
              </div>
              
              <div className="group text-center p-10 rounded-3xl glass transition-all hover:shadow-glow-md hover-lift">
                <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-accent/18 transition-all group-hover:bg-accent/30 group-hover:scale-125 shadow-glow-sm">
                  <Clock className="h-12 w-12 text-accent" />
                </div>
                <h3 className="mb-5 text-3xl font-bold tracking-tight">Timely Delivery</h3>
                <p className="text-muted-foreground leading-relaxed text-xl">
                  Fast turnaround without compromising quality
                </p>
              </div>
              
              <div className="group text-center p-10 rounded-3xl glass transition-all hover:shadow-glow-md hover-lift">
                <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-accent/18 transition-all group-hover:bg-accent/30 group-hover:scale-125 shadow-glow-sm">
                  <Zap className="h-12 w-12 text-accent" />
                </div>
                <h3 className="mb-5 text-3xl font-bold tracking-tight">Innovative Approach</h3>
                <p className="text-muted-foreground leading-relaxed text-xl">
                  Latest techniques and creative storytelling
                </p>
              </div>
              
              <div className="group text-center p-10 rounded-3xl glass transition-all hover:shadow-glow-md hover-lift">
                <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-accent/18 transition-all group-hover:bg-accent/30 group-hover:scale-125 shadow-glow-sm">
                  <Users className="h-12 w-12 text-accent" />
                </div>
                <h3 className="mb-5 text-3xl font-bold tracking-tight">Client Focused</h3>
                <p className="text-muted-foreground leading-relaxed text-xl">
                  Your vision is our priority, always
                </p>
              </div>
              
              <div className="group text-center p-10 rounded-3xl glass transition-all hover:shadow-glow-md hover-lift">
                <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-accent/18 transition-all group-hover:bg-accent/30 group-hover:scale-125 shadow-glow-sm">
                  <Heart className="h-12 w-12 text-accent" />
                </div>
                <h3 className="mb-5 text-3xl font-bold tracking-tight">Passion Driven</h3>
                <p className="text-muted-foreground leading-relaxed text-xl">
                  We love what we do, and it shows
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with Cinematic Banner */}
        <section className="relative py-32 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/assets/generated/cta-banner.dim_800x300.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-primary/22 to-background/93" />
          <div className="absolute inset-0 bg-texture" />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto max-w-4xl glass-strong rounded-3xl p-16 md:p-20 shadow-glow-lg">
              <h2 className="mb-10 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl bg-gradient-to-br from-foreground to-accent bg-clip-text text-transparent">
                Ready to Capture Your Moments?
              </h2>
              <p className="mx-auto mb-14 max-w-2xl text-2xl text-muted-foreground leading-relaxed">
                Let's work together to create beautiful memories that you'll cherish forever. Get in touch today and let's
                bring your vision to life!
              </p>
              <Button asChild size="lg" className="group transition-all hover:shadow-glow-lg animate-modern-glow text-xl px-12 py-8">
                <a href="mailto:kumarsumitmahto2@gmail.com">
                  Contact Us 
                  <ArrowRight className="ml-3 h-7 w-7 transition-transform group-hover:translate-x-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
