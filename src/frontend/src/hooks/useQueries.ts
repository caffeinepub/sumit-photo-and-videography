import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Principal } from '@icp-sdk/core/principal';
import type {
  Photo,
  Video,
  PhotoVideoUploadRequest,
  MultiPhotoUploadRequest,
  SortedOrder,
  FooterContent,
  UserProfile,
  EventDTO,
  EventCreateRequest,
  EventImageUploadRequest,
  SpecialMomentDTO,
  SpecialMomentCreateRequest,
  SpecialMomentImageUploadRequest,
  Visitor,
  UserShortlistDTO,
} from '../backend';

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

export function useCreateNewAuthenticatedUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNewAuthenticatedUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
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

// Photo Queries
export function useGetAllPhotosSorted(order: SortedOrder) {
  const { actor, isFetching } = useActor();

  return useQuery<Photo[]>({
    queryKey: ['photos', order],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPhotosSorted(order);
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
    },
  });
}

export function useUploadMultiplePhotos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MultiPhotoUploadRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadMultiplePhotos(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

// Photo Like Queries
export function useTogglePhotoLike() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.togglePhotoLike(photoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['photoLikeStatus'] });
      queryClient.invalidateQueries({ queryKey: ['likedPhotos'] });
    },
  });
}

export function useHasUserLikedPhoto(photoId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['photoLikeStatus', photoId],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasUserLikedPhoto(photoId);
    },
    enabled: !!actor && !isFetching && !!identity && !identity.getPrincipal().isAnonymous(),
  });
}

export function useGetLikedPhotos(user?: Principal) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const principal = user || identity?.getPrincipal();

  return useQuery<string[]>({
    queryKey: ['likedPhotos', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getLikedPhotos(principal);
    },
    enabled: !!actor && !isFetching && !!principal && !principal.isAnonymous(),
  });
}

export function useGetTotalLikeCountForUser(user?: Principal) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const principal = user || identity?.getPrincipal();

  return useQuery<bigint>({
    queryKey: ['userLikeCount', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return BigInt(0);
      return actor.getTotalLikeCountForUser(principal);
    },
    enabled: !!actor && !isFetching && !!principal && !principal.isAnonymous(),
  });
}

// Video Queries
export function useGetAllVideosSorted(order: SortedOrder) {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos', order],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideosSorted(order);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: PhotoVideoUploadRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadVideo(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVideo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

// Event Queries
export function useGetAllEventsSorted(order: SortedOrder) {
  const { actor, isFetching } = useActor();

  return useQuery<EventDTO[]>({
    queryKey: ['events', order],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEventsSorted(order);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEvent(eventId: bigint, enabled: boolean = true) {
  const { actor, isFetching } = useActor();

  return useQuery<EventDTO>({
    queryKey: ['event', eventId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getEvent(eventId);
    },
    enabled: !!actor && !isFetching && enabled,
    retry: false,
  });
}

export function useIsEventPasswordProtected(eventId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['eventPasswordProtected', eventId.toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isEventPasswordProtected(eventId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useValidateEventPassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, password }: { eventId: bigint; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateEventPassword(eventId, password);
    },
    onSuccess: (isValid, variables) => {
      if (isValid) {
        queryClient.invalidateQueries({ queryKey: ['event', variables.eventId.toString()] });
      }
    },
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
    },
  });
}

export function useUpdateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, request }: { eventId: bigint; request: EventCreateRequest }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEvent(eventId, request);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId.toString()] });
    },
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useSetEventPassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, password }: { eventId: bigint; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setEventPassword(eventId, password);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['eventPasswordProtected', variables.eventId.toString()] });
    },
  });
}

export function useRemoveEventPassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeEventPassword(eventId);
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['eventPasswordProtected', eventId.toString()] });
    },
  });
}

export function useUploadEventImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: EventImageUploadRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadEventImage(request);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId.toString()] });
    },
  });
}

export function useDeleteEventImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, imageId }: { eventId: bigint; imageId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEventImage(eventId, imageId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId.toString()] });
    },
  });
}

// Special Moments Queries
export function useGetAllSpecialMomentsSorted(order: SortedOrder) {
  const { actor, isFetching } = useActor();

  return useQuery<SpecialMomentDTO[]>({
    queryKey: ['specialMoments', order],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSpecialMomentsSorted(order);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSpecialMoment(specialMomentId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<SpecialMomentDTO>({
    queryKey: ['specialMoment', specialMomentId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSpecialMoment(specialMomentId);
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useCreateSpecialMoment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: SpecialMomentCreateRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSpecialMoment(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialMoments'] });
    },
  });
}

export function useUploadSpecialMomentImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: SpecialMomentImageUploadRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadSpecialMomentImage(request);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['specialMoments'] });
      queryClient.invalidateQueries({ queryKey: ['specialMoment', variables.specialMomentId.toString()] });
    },
  });
}

export function useDeleteSpecialMomentImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ specialMomentId, imageId }: { specialMomentId: bigint; imageId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSpecialMomentImage(specialMomentId, imageId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['specialMoments'] });
      queryClient.invalidateQueries({ queryKey: ['specialMoment', variables.specialMomentId.toString()] });
    },
  });
}

// Event Image Shortlist Queries
export function useToggleShortlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, imageId }: { eventId: bigint; imageId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleShortlist(eventId, imageId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shortlistStatus', variables.eventId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userShortlists'] });
      queryClient.invalidateQueries({ queryKey: ['allShortlists'] });
    },
  });
}

export function useHasUserShortlistedImage(eventId: bigint, imageId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['shortlistStatus', eventId.toString(), imageId],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasUserShortlistedImageForCaller(eventId, imageId);
    },
    enabled: !!actor && !isFetching && !!identity && !identity.getPrincipal().isAnonymous(),
  });
}

export function useGetShortlistedImagesForUser(eventId: bigint) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['shortlistedImages', eventId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getShortlistedImagesForUser(eventId);
    },
    enabled: !!actor && !isFetching && !!identity && !identity.getPrincipal().isAnonymous(),
  });
}

export function useGetUserShortlistAcrossEvents() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserShortlistDTO[]>({
    queryKey: ['userShortlists'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserShortlistAcrossEvents();
    },
    enabled: !!actor && !isFetching && !!identity && !identity.getPrincipal().isAnonymous(),
  });
}

export function useGetAllShortlistsForAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<UserShortlistDTO[]>({
    queryKey: ['allShortlists'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShortlistsForAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetShortlistCountForImage(eventId: bigint, imageId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['shortlistCount', eventId.toString(), imageId],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getShortlistCountForImage(eventId, imageId);
    },
    enabled: !!actor && !isFetching,
  });
}

// Footer Content
export function useGetFooterContent() {
  const { actor, isFetching } = useActor();

  return useQuery<FooterContent>({
    queryKey: ['footerContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFooterContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateFooterContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: FooterContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFooterContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footerContent'] });
    },
  });
}

// Visitor Tracking
export function useRecordVisitor() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordVisitor();
    },
  });
}

export function useGetVisitors(start: number, limit: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Visitor[]>({
    queryKey: ['visitors', start, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVisitors({ start: BigInt(start), limit: BigInt(limit) });
    },
    enabled: !!actor && !isFetching,
  });
}
