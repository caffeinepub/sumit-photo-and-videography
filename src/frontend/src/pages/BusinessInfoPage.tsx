import { Mail } from 'lucide-react';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';
import { useGetFooterContent } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEOHead from '../components/SEOHead';

export default function BusinessInfoPage() {
  const { data: footerContent, isLoading } = useGetFooterContent();

  return (
    <>
      <SEOHead page="contact" />
      <div className="min-h-screen">
        <div className="absolute inset-0 bg-texture pointer-events-none" />
        
        {/* Hero Section */}
        <section className="relative border-b border-border/30 py-24 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: 'url(/assets/generated/portfolio-showcase.dim_800x600.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/10 to-background" />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl bg-gradient-to-br from-foreground to-accent bg-clip-text text-transparent">
              About Our Services
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground leading-relaxed">
              Professional photography and videography services for all your special moments
            </p>
          </div>
        </section>

        {/* Services Overview */}
        <section className="relative py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-4xl font-bold tracking-tight">Our Services</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="glass-strong transition-all hover:shadow-glow-sm hover-lift">
                <CardHeader>
                  <CardTitle className="text-2xl">Wedding Photography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Capture your special day with stunning wedding photography that tells your unique love story.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong transition-all hover:shadow-glow-sm hover-lift">
                <CardHeader>
                  <CardTitle className="text-2xl">Event Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Professional coverage for corporate events, parties, and celebrations of all kinds.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong transition-all hover:shadow-glow-sm hover-lift">
                <CardHeader>
                  <CardTitle className="text-2xl">Portrait Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Individual and family portraits that capture personality and create lasting memories.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong transition-all hover:shadow-glow-sm hover-lift">
                <CardHeader>
                  <CardTitle className="text-2xl">Video Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    High-quality video production services for events, promotions, and special occasions.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong transition-all hover:shadow-glow-sm hover-lift">
                <CardHeader>
                  <CardTitle className="text-2xl">Commercial Photography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Professional product and commercial photography to showcase your business.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong transition-all hover:shadow-glow-sm hover-lift">
                <CardHeader>
                  <CardTitle className="text-2xl">Photo Editing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Expert photo editing and retouching services to perfect your images.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="relative border-y border-border/30 py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-accent/10" />
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-8 text-4xl font-bold tracking-tight">Our Story</h2>
              <p className="mb-6 text-xl text-muted-foreground leading-relaxed">
                Sumit Photo and Videography has been capturing precious moments for years, bringing creativity and
                professionalism to every project. We believe that every moment deserves to be preserved beautifully.
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our passion for photography and videography drives us to deliver exceptional results that exceed
                expectations. We work closely with our clients to understand their vision and bring it to life through
                our lens.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="relative py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-12 text-center text-4xl font-bold tracking-tight">Get In Touch</h2>
              
              {isLoading ? (
                <div className="text-center text-muted-foreground text-lg">Loading contact information...</div>
              ) : (
                <Card className="glass-strong">
                  <CardContent className="pt-8">
                    <div className="space-y-8">
                      {/* Email */}
                      <div className="flex items-center justify-center gap-4">
                        <div className="rounded-xl bg-accent/15 p-3">
                          <Mail className="h-6 w-6 text-accent" />
                        </div>
                        <a
                          href={`mailto:${footerContent?.contactDetails || 'kumarsumitmahto2@gmail.com'}`}
                          className="text-xl hover:text-accent transition-colors font-medium"
                        >
                          {footerContent?.contactDetails || 'kumarsumitmahto2@gmail.com'}
                        </a>
                      </div>

                      {/* Social Media */}
                      {(footerContent?.facebook || footerContent?.instagram || footerContent?.youtube) && (
                        <div className="border-t border-border/30 pt-8">
                          <p className="mb-6 text-center text-base font-semibold text-muted-foreground">
                            Follow us on social media
                          </p>
                          <div className="flex items-center justify-center gap-8">
                            {footerContent?.facebook && (
                              <a
                                href={footerContent.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 text-muted-foreground transition-all hover:text-accent hover:scale-110"
                                aria-label="Facebook"
                              >
                                <div className="rounded-xl bg-accent/10 p-3 transition-all hover:bg-accent/20">
                                  <SiFacebook className="h-8 w-8" />
                                </div>
                                <span className="text-sm font-medium">Facebook</span>
                              </a>
                            )}
                            {footerContent?.instagram && (
                              <a
                                href={footerContent.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 text-muted-foreground transition-all hover:text-accent hover:scale-110"
                                aria-label="Instagram"
                              >
                                <div className="rounded-xl bg-accent/10 p-3 transition-all hover:bg-accent/20">
                                  <SiInstagram className="h-8 w-8" />
                                </div>
                                <span className="text-sm font-medium">Instagram</span>
                              </a>
                            )}
                            {footerContent?.youtube && (
                              <a
                                href={footerContent.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 text-muted-foreground transition-all hover:text-accent hover:scale-110"
                                aria-label="YouTube"
                              >
                                <div className="rounded-xl bg-accent/10 p-3 transition-all hover:bg-accent/20">
                                  <SiYoutube className="h-8 w-8" />
                                </div>
                                <span className="text-sm font-medium">YouTube</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="mt-10 text-center">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Ready to capture your special moments? Reach out to us today and let's create something beautiful
                  together.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
