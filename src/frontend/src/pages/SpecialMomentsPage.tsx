import { useState } from 'react';
import { useGetAllSpecialMomentsSorted } from '../hooks/useQueries';
import { SortedOrder } from '../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar, Image, Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { blobToUrl } from '../lib/blob-utils';
import SEOHead from '../components/SEOHead';

export default function SpecialMomentsPage() {
  const [sortOrder, setSortOrder] = useState<SortedOrder>(SortedOrder.newestFirst);
  const { data: specialMoments = [], isLoading, error } = useGetAllSpecialMomentsSorted(sortOrder);

  return (
    <>
      <SEOHead page="specialMoments" />
      <div className="relative container mx-auto px-4 py-12 min-h-screen">
        {/* Vibrant Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'url(/assets/generated/cinematic-special-moments-bg.dim_800x600.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-texture" />
        </div>
        
        <div className="relative mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-3">
              <Sparkles className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-6xl font-bold tracking-tight md:text-7xl gradient-heading">
              Special Moments
            </h1>
          </div>
          <p className="text-muted-foreground text-2xl mb-10">Capturing life's most precious memories</p>
        </div>

        {error && (
          <div className="relative mb-8 p-5 glass-strong border-2 border-destructive/60 rounded-xl">
            <p className="text-destructive font-medium text-lg">Error loading special moments. Please try refreshing the page.</p>
          </div>
        )}

        <div className="relative mb-8 flex items-center justify-between">
          <p className="text-lg text-muted-foreground font-medium">
            {specialMoments.length} {specialMoments.length === 1 ? 'moment' : 'moments'}
          </p>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortedOrder)}
          >
            <SelectTrigger className="w-[200px] control-surface">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="glass-strong border-accent/30">
              <SelectItem value={SortedOrder.newestFirst} className="hover:bg-accent/10 focus:bg-accent/15">Newest First</SelectItem>
              <SelectItem value={SortedOrder.oldestFirst} className="hover:bg-accent/10 focus:bg-accent/15">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="relative flex min-h-[500px] items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
          </div>
        ) : specialMoments.length === 0 ? (
          <div className="relative flex min-h-[500px] flex-col items-center justify-center gap-8">
            <div className="rounded-full bg-gradient-to-br from-accent/20 to-primary/20 p-10 shadow-glow-md">
              <Sparkles className="h-24 w-24 text-accent" />
            </div>
            <p className="text-2xl text-muted-foreground font-medium">No special moments available yet.</p>
            <p className="text-lg text-muted-foreground">Check back soon for new memories!</p>
          </div>
        ) : (
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {specialMoments.map((moment, index) => {
              const thumbnailUrl = moment.images.length > 0 ? blobToUrl(moment.images[0].blob) : null;
              const momentDate = new Date(Number(moment.date) / 1000000);

              return (
                <Card 
                  key={moment.id.toString()} 
                  className="overflow-hidden glass transition-all hover:shadow-glow-lg hover-lift animate-fade-in border-accent/20"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {thumbnailUrl ? (
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={thumbnailUrl}
                        alt={moment.name}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="relative flex aspect-video w-full items-center justify-center bg-muted">
                      <Image className="h-20 w-20 text-muted-foreground/50" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-1 tracking-tight text-2xl">{moment.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-accent" />
                      {momentDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 flex items-center gap-2 text-base text-muted-foreground">
                      <Image className="h-5 w-5 text-accent" />
                      <span className="font-medium">{moment.images.length} {moment.images.length === 1 ? 'image' : 'images'}</span>
                    </div>
                    <Link to="/special-moments/$specialMomentId" params={{ specialMomentId: moment.id.toString() }}>
                      <Button className="w-full bg-gradient-to-r from-accent to-primary hover:shadow-glow-sm font-semibold text-base py-6">
                        View Gallery
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
