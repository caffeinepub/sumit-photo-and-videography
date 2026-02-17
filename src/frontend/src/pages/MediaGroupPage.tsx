import { useParams } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function MediaGroupPage() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate({ to: '/' })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Media Group #{id}
              </CardTitle>
              <CardDescription>
                View this media collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-2">
                  Media group details coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
