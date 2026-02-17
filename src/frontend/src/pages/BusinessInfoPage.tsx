import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Mail, Phone, MapPin } from 'lucide-react';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';
import { Button } from '@/components/ui/button';

export default function BusinessInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-primary to-accent p-4">
                <Info className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
              Business Information
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Get in touch with us for professional photography and videography services
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Contact Us
            </h2>
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription>
                  kumarsumitmahto2@gmail.com
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Phone</CardTitle>
                <CardDescription>
                  Contact us via email for phone details
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Location</CardTitle>
                <CardDescription>
                  Serving clients nationwide
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Follow Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Stay connected on social media
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              asChild
            >
              <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                <SiFacebook className="h-5 w-5" />
                Facebook
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              asChild
            >
              <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
                <SiInstagram className="h-5 w-5" />
                Instagram
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              asChild
            >
              <a href="https://www.youtube.com/yourchannel" target="_blank" rel="noopener noreferrer">
                <SiYoutube className="h-5 w-5" />
                YouTube
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional photography and videography for all occasions
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Wedding Photography</CardTitle>
                <CardDescription>
                  Capture your special day with beautiful memories
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Coverage</CardTitle>
                <CardDescription>
                  Professional coverage for corporate and social events
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portrait Sessions</CardTitle>
                <CardDescription>
                  Individual and family portrait photography
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Production</CardTitle>
                <CardDescription>
                  Cinematic videos for any occasion
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photo Editing</CardTitle>
                <CardDescription>
                  Professional retouching and enhancement
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Packages</CardTitle>
                <CardDescription>
                  Tailored solutions for your specific needs
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
