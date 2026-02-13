import { useState } from 'react';
import { useGetVisitors, useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import type { Visitor } from '../../backend';

const ITEMS_PER_PAGE = 20;

export default function VisitorsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: isAdmin } = useIsCallerAdmin();

  const start = currentPage * ITEMS_PER_PAGE;
  const { data: visitors = [], isLoading } = useGetVisitors(start, ITEMS_PER_PAGE);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getVisitorRole = (visitor: Visitor): 'admin' | 'user' | 'guest' => {
    if (visitor.principal.isAnonymous()) {
      return 'guest';
    }
    // For simplicity, we'll mark the current admin as admin
    // In a real scenario, you'd check against a list of admin principals
    return 'user';
  };

  const getRoleBadgeVariant = (role: 'admin' | 'user' | 'guest') => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'user':
        return 'secondary';
      case 'guest':
        return 'outline';
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (visitors.length === ITEMS_PER_PAGE) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>Site Visitors</CardTitle>
        </div>
        <CardDescription>View all visitors who have accessed the site</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : visitors.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>No visitors recorded yet</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>Principal ID</TableHead>
                    <TableHead className="w-[120px]">Role</TableHead>
                    <TableHead className="w-[200px]">Visit Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.map((visitor, index) => {
                    const role = getVisitorRole(visitor);
                    return (
                      <TableRow key={`${visitor.timestamp}-${index}`}>
                        <TableCell className="font-medium">{start + index + 1}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {visitor.principal.isAnonymous()
                            ? 'Anonymous'
                            : visitor.principal.toString().slice(0, 20) + '...'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(role)} className="capitalize">
                            {role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimestamp(visitor.timestamp)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {start + 1} - {start + visitors.length} visitors
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={visitors.length < ITEMS_PER_PAGE || isLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

