import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EventsPage() {
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [filter, setFilter] = useState<string>('all');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-primary to-accent p-4">
                <Calendar className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
              Events
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Browse event galleries and special occasions
            </p>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="w-full sm:w-auto">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[200px] border-2 hover:border-primary transition-colors">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[200px] border-2 hover:border-primary transition-colors">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="public">Public Only</SelectItem>
                  <SelectItem value="protected">Protected Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Collection
              </CardTitle>
              <CardDescription>
                Explore our event galleries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-2">
                  No events available yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Admin can create events from the admin panel
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
