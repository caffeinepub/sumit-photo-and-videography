import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { Camera, Video, Calendar, Heart, Briefcase, Info } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              Sumit Photo and Videography
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Your complete photography and videography management platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/photos' })}
                className="gap-2"
              >
                <Camera className="h-5 w-5" />
                Browse Photos
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/videos' })}
                className="gap-2"
              >
                <Video className="h-5 w-5" />
                Watch Videos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Explore Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need in one place
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => navigate({ to: '/photos' })}>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Photos</CardTitle>
                <CardDescription>
                  Browse our stunning photo gallery with categories and favorites
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => navigate({ to: '/videos' })}>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Videos</CardTitle>
                <CardDescription>
                  Watch our cinematic video collection and highlights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => navigate({ to: '/events' })}>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  View event galleries and special occasion photography
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => navigate({ to: '/favorites' })}>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Favorites</CardTitle>
                <CardDescription>
                  Access your liked photos and curated collections
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => navigate({ to: '/portfolio' })}>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>
                  Explore our featured works and professional showcase
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => navigate({ to: '/business-info' })}>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600">
                  <Info className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Business Info</CardTitle>
                <CardDescription>
                  Learn more about our services and get in touch
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Explore our galleries and discover beautiful moments captured
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/photos' })}
              className="gap-2"
            >
              <Camera className="h-5 w-5" />
              View Photo Gallery
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
