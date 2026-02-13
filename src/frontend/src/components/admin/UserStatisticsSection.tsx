import { useState } from 'react';
import { useGetAllPhotosSorted } from '../../hooks/useQueries';
import { SortedOrder } from '../../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function UserStatisticsSection() {
  const { data: photos = [], isLoading } = useGetAllPhotosSorted(SortedOrder.newestFirst);

  // Calculate statistics
  const totalLikes = photos.reduce((sum, photo) => sum + Number(photo.likeCount), 0);
  const averageLikes = photos.length > 0 ? (totalLikes / photos.length).toFixed(1) : '0';
  const mostLikedPhotos = [...photos].sort((a, b) => Number(b.likeCount) - Number(a.likeCount)).slice(0, 10);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{photos.length}</div>
            <p className="text-xs text-muted-foreground">Photos in gallery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
            <p className="text-xs text-muted-foreground">Across all photos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Likes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageLikes}</div>
            <p className="text-xs text-muted-foreground">Per photo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Liked Photos</CardTitle>
        </CardHeader>
        <CardContent>
          {mostLikedPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No photos have been liked yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Preview</TableHead>
                  <TableHead>Photo Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostLikedPhotos.map((photo) => (
                  <TableRow key={photo.id}>
                    <TableCell>
                      <img
                        src={photo.blob.getDirectURL()}
                        alt={photo.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{photo.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {photo.description || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        <span className="font-semibold">{Number(photo.likeCount)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
