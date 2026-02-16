import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Video, Calendar, Sparkles, Award, Users, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import SEOHead from '../components/SEOHead';

export default function HomePage() {
  return (
    <>
      <SEOHead page="home" />
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url(/assets/generated/cinematic-hero-bg.dim_1200x800.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-primary/5" />
          <div className="absolute inset-0 bg-texture" />

          <div className="relative container mx-auto px-4 py-24 md:py-32">
            <div className="mx-auto max-w-4xl text-center space-y-8 animate-fade-in">
              <div className="inline-block">
                <div className="rounded-2xl bg-gradient-to-r from-accent/20 to-primary/20 px-6 py-3 backdrop-blur-sm border border-accent/30">
                  <p className="text-sm font-semibold text-accent">Professional Photography & Videography</p>
                </div>
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl gradient-heading">
                Capturing Your Most Precious Moments
              </h1>
              
              <p className="mx-auto max-w-2xl text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Transform your special occasions into timeless memories with our expert photography and videography services
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/photos">
                  <Button 
                    size="lg" 
                    className="px-8 py-7 text-lg font-semibold bg-gradient-to-r from-accent to-primary hover:shadow-glow-lg transition-all group"
                  >
                    View Gallery
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/business-info">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="px-8 py-7 text-lg font-semibold border-2 border-accent/50 hover:bg-accent/10 hover:border-accent hover:shadow-glow-sm transition-all"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="relative py-24">
          <div className="absolute inset-0 bg-texture opacity-50" />
          <div className="relative container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-heading">
                Our Services
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Professional services tailored to capture your unique story
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="glass hover-lift transition-all hover:shadow-glow-lg group animate-fade-in border-accent/20">
                <CardHeader>
                  <div className="rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-4 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Photography</CardTitle>
                  <CardDescription className="text-base">
                    Professional photo shoots for all occasions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass hover-lift transition-all hover:shadow-glow-lg group animate-fade-in border-primary/20" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-4 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Video className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Videography</CardTitle>
                  <CardDescription className="text-base">
                    Cinematic videos that tell your story
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass hover-lift transition-all hover:shadow-glow-lg group animate-fade-in border-accent/20" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <div className="rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-4 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Event Coverage</CardTitle>
                  <CardDescription className="text-base">
                    Complete coverage for weddings and events
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass hover-lift transition-all hover:shadow-glow-lg group animate-fade-in border-primary/20" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-4 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Special Moments</CardTitle>
                  <CardDescription className="text-base">
                    Capturing life's most precious memories
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="relative py-24">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url(/assets/generated/why-choose-us-bg.dim_1200x400.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          
          <div className="relative container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-heading">
                Why Choose Us
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Excellence in every frame, dedication in every project
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <Card className="glass-strong hover-lift transition-all hover:shadow-glow-lg border-accent/30 animate-fade-in">
                <CardContent className="pt-8 text-center space-y-4">
                  <div className="rounded-full bg-gradient-to-br from-accent/20 to-primary/20 p-5 w-fit mx-auto">
                    <Award className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold">Professional Quality</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    High-end equipment and expert techniques for stunning results
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong hover-lift transition-all hover:shadow-glow-lg border-primary/30 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardContent className="pt-8 text-center space-y-4">
                  <div className="rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-5 w-fit mx-auto">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Experienced Team</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Years of expertise in capturing perfect moments
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong hover-lift transition-all hover:shadow-glow-lg border-accent/30 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardContent className="pt-8 text-center space-y-4">
                  <div className="rounded-full bg-gradient-to-br from-accent/20 to-primary/20 p-5 w-fit mx-auto">
                    <Sparkles className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold">Creative Vision</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Unique perspectives that make your memories unforgettable
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url(/assets/generated/cta-banner.dim_800x300.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10" />
          
          <div className="relative container mx-auto px-4">
            <Card className="glass-strong border-accent/40 shadow-glow-lg max-w-4xl mx-auto animate-fade-in">
              <CardContent className="py-16 text-center space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold gradient-heading">
                  Ready to Capture Your Story?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Let's create beautiful memories together. Contact us today to discuss your photography and videography needs.
                </p>
                <Link to="/business-info">
                  <Button 
                    size="lg" 
                    className="px-10 py-7 text-lg font-semibold bg-gradient-to-r from-accent to-primary hover:shadow-glow-lg transition-all group"
                  >
                    Get in Touch
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
