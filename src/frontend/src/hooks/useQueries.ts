import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, UserRole, PhotoVideoUploadRequest, VideoUploadRequest, EventCreateRequest, Photo, Video, EventDTO } from '../backend';
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderStatus,
  UpdateOrderStatusRequest,
} from '../types/orders';
import { SortedOrder } from '../types/media';
import { Principal } from '@icp-sdk/core/principal';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin Access Control
export function useInitializeAccessControl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeAccessControl();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      toast.success('Admin access initialized successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to initialize admin access');
    },
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, role }: { principal: string; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      const principalObj = Principal.fromText(principal);
      return actor.assignCallerUserRole(principalObj, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      toast.success('Role assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign role');
    },
  });
}

// Photos
export function useGetAllPhotos(sortOrder: SortedOrder = SortedOrder.newestFirst) {
  const { actor, isFetching } = useActor();

  return useQuery<Photo[]>({
    queryKey: ['photos', sortOrder],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // Backend doesn't have getPhotos method yet, return empty array
        return [];
      } catch (error) {
        console.error('Error fetching photos:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: PhotoVideoUploadRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadPhoto(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast.success('Photo uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload photo');
    },
  });
}

// Videos
export function useGetAllVideos(sortOrder: SortedOrder = SortedOrder.newestFirst) {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos', sortOrder],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // Backend doesn't have getVideos method yet, return empty array
        return [];
      } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: VideoUploadRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadVideo(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload video');
    },
  });
}

// Events
export function useGetAllEvents(sortOrder: SortedOrder = SortedOrder.newestFirst) {
  const { actor, isFetching } = useActor();

  return useQuery<EventDTO[]>({
    queryKey: ['events', sortOrder],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // Backend doesn't have getEvents method yet, return empty array
        return [];
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: EventCreateRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEvent(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    },
  });
}

// Order Queries
export function useGetOrdersByStatus(status: OrderStatus | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders', status],
    queryFn: async () => {
      if (!actor) return [];
      // Backend doesn't have getOrders method yet, return empty array
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateOrderRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create order');
    },
  });
}

export function useUpdateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, request }: { id: number; request: UpdateOrderRequest }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet
      throw new Error('Order update not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, request }: { id: number; request: UpdateOrderStatusRequest }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet
      throw new Error('Order status update not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useDeleteOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet
      throw new Error('Order deletion not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
