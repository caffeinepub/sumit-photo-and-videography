import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Camera, Video, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function PortfolioPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-primary to-accent p-4">
                <Briefcase className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
              Our Portfolio
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Showcasing our finest photography and videography work
            </p>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Featured Work
            </h2>
            <p className="text-lg text-muted-foreground">
              A selection of our best projects
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Photography</CardTitle>
                <CardDescription>
                  Professional photography services for all occasions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate({ to: '/photos' })}
                >
                  View Photos
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Videography</CardTitle>
                <CardDescription>
                  Cinematic video production and editing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate({ to: '/videos' })}
                >
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  Capturing special moments at your events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate({ to: '/events' })}
                >
                  View Events
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional quality and exceptional service
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Professional Quality</CardTitle>
                <CardDescription>
                  High-end equipment and expert techniques
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Creative Vision</CardTitle>
                <CardDescription>
                  Unique perspectives and artistic approach
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reliable Service</CardTitle>
                <CardDescription>
                  On-time delivery and professional conduct
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flexible Packages</CardTitle>
                <CardDescription>
                  Customizable options for every budget
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Turnaround</CardTitle>
                <CardDescription>
                  Fast editing and delivery of final products
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>
                  Dedicated to exceeding your expectations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Ready to Work Together?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Get in touch to discuss your project
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/business-info' })}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
