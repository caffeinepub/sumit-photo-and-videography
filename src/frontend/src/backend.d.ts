import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    blob: ExternalBlob;
    name: string;
    description: string;
    uploadTime: Time;
}
export interface PhotoVideoUploadRequest {
    blob: ExternalBlob;
    name: string;
    description: string;
}
export type Time = bigint;
export interface VideoFilter {
    endDate?: Time;
    searchText?: string;
    startDate?: Time;
}
export interface SpecialMomentFilter {
    endDate?: Time;
    searchText?: string;
    startDate?: Time;
}
export interface SpecialMomentCreateRequest {
    date: Time;
    name: string;
}
export interface PhotoFilter {
    endDate?: Time;
    searchText?: string;
    startDate?: Time;
}
export interface EventDTO {
    id: bigint;
    date: Time;
    name: string;
    description: string;
    passwordProtected: boolean;
    images: Array<EventImage>;
}
export interface SpecialMomentDTO {
    id: bigint;
    date: Time;
    name: string;
    images: Array<SpecialMomentImage>;
}
export interface UploadResult {
    message: string;
    success: boolean;
}
export interface Visitor {
    principal: Principal;
    timestamp: Time;
}
export interface SpecialMomentImage {
    id: string;
    blob: ExternalBlob;
    name: string;
    uploadTime: Time;
}
export interface MultiPhotoUploadRequest {
    photos: Array<PhotoVideoUploadRequest>;
}
export interface Photo {
    id: string;
    likeCount: bigint;
    blob: ExternalBlob;
    name: string;
    description: string;
    uploadTime: Time;
}
export interface EventImage {
    id: string;
    blob: ExternalBlob;
    name: string;
    description: string;
    uploadTime: Time;
}
export interface UserShortlistDTO {
    eventId: bigint;
    user: Principal;
    images: Array<string>;
}
export interface SpecialMomentImageUploadRequest {
    specialMomentId: bigint;
    blob: ExternalBlob;
    name: string;
}
export interface EventFilter {
    endDate?: Time;
    searchText?: string;
    startDate?: Time;
}
export interface EventCreateRequest {
    date: Time;
    name: string;
    description: string;
}
export interface EventImageUploadRequest {
    eventId: bigint;
    blob: ExternalBlob;
    name: string;
    description: string;
}
export interface FooterContent {
    instagram: string;
    facebook: string;
    youtube: string;
    contactDetails: string;
}
export interface UserProfile {
    name: string;
}
export enum SortedOrder {
    newestFirst = "newestFirst",
    oldestFirst = "oldestFirst"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEvent(request: EventCreateRequest): Promise<bigint>;
    createNewAuthenticatedUser(): Promise<boolean>;
    createSpecialMoment(request: SpecialMomentCreateRequest): Promise<bigint>;
    deleteEvent(eventId: bigint): Promise<void>;
    deleteEventImage(eventId: bigint, imageId: string): Promise<void>;
    deletePhoto(id: string): Promise<void>;
    deleteSpecialMoment(specialMomentId: bigint): Promise<void>;
    deleteSpecialMomentImage(specialMomentId: bigint, imageId: string): Promise<void>;
    deleteVideo(id: string): Promise<void>;
    getAllEventsSorted(order: SortedOrder): Promise<Array<EventDTO>>;
    getAllPhotosSorted(order: SortedOrder): Promise<Array<Photo>>;
    getAllShortlistedImagesForUser(explicitUser: Principal, eventId: bigint): Promise<Array<string>>;
    getAllShortlistsForAdmin(): Promise<Array<UserShortlistDTO>>;
    getAllSpecialMomentsSorted(order: SortedOrder): Promise<Array<SpecialMomentDTO>>;
    getAllVideosSorted(order: SortedOrder): Promise<Array<Video>>;
    getAppVersion(): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEvent(eventId: bigint): Promise<EventDTO>;
    getEventImages(eventId: bigint, order: SortedOrder): Promise<Array<EventImage>>;
    getFilteredEvents(order: SortedOrder, filter: EventFilter): Promise<Array<EventDTO>>;
    getFilteredPhotos(order: SortedOrder, filter: PhotoFilter): Promise<Array<Photo>>;
    getFilteredSpecialMoments(order: SortedOrder, filter: SpecialMomentFilter): Promise<Array<SpecialMomentDTO>>;
    getFilteredVideos(order: SortedOrder, filter: VideoFilter): Promise<Array<Video>>;
    getFooterContent(): Promise<FooterContent>;
    getLikedPhotos(user: Principal): Promise<Array<string>>;
    getPasswordProtectedEvents(): Promise<Array<bigint>>;
    getPhotoLikeCount(photoId: string): Promise<bigint>;
    getShortlistCountForImage(eventId: bigint, imageId: string): Promise<bigint>;
    getShortlistedImagesForUser(eventId: bigint): Promise<Array<string>>;
    getSpecialMoment(specialMomentId: bigint): Promise<SpecialMomentDTO>;
    getSpecialMomentsImages(specialMomentId: bigint, order: SortedOrder): Promise<Array<SpecialMomentImage>>;
    getTotalLikeCountForUser(user: Principal): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserShortlistAcrossEvents(): Promise<Array<UserShortlistDTO>>;
    getVisitors(pagination: {
        limit: bigint;
        start: bigint;
    }): Promise<Array<Visitor>>;
    hasUserLikedPhoto(photoId: string): Promise<boolean>;
    hasUserLikedPhotoExplicit(user: Principal, photoId: string): Promise<boolean>;
    hasUserShortlistedImage(explicitUser: Principal, eventId: bigint, imageId: string): Promise<boolean>;
    hasUserShortlistedImageForCaller(eventId: bigint, imageId: string): Promise<boolean>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isEventPasswordProtected(eventId: bigint): Promise<boolean>;
    recordVisitor(): Promise<void>;
    removeEventPassword(eventId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setEventPassword(eventId: bigint, password: string): Promise<void>;
    togglePhotoLike(photoId: string): Promise<boolean>;
    toggleShortlist(eventId: bigint, imageId: string): Promise<boolean>;
    updateEvent(eventId: bigint, request: EventCreateRequest): Promise<void>;
    updateFooterContent(content: FooterContent): Promise<void>;
    uploadEventImage(request: EventImageUploadRequest): Promise<UploadResult>;
    uploadMultiplePhotos(request: MultiPhotoUploadRequest): Promise<Array<UploadResult>>;
    uploadPhoto(request: PhotoVideoUploadRequest): Promise<UploadResult>;
    uploadSpecialMomentImage(request: SpecialMomentImageUploadRequest): Promise<UploadResult>;
    uploadVideo(request: PhotoVideoUploadRequest): Promise<UploadResult>;
    validateEventPassword(eventId: bigint, password: string): Promise<boolean>;
}
