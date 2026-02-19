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
    category: string;
}
export interface OrderField {
    itemName: string;
    quantity: bigint;
    unitPrice: bigint;
}
export type Time = bigint;
export interface EventImage {
    id: string;
    blob: ExternalBlob;
    name: string;
    description: string;
    category: string;
    uploadTime: Time;
}
export interface EventDTO {
    id: bigint;
    date: Time;
    password?: string;
    name: string;
    description: string;
    images: Array<EventImage>;
}
export interface EventCreateRequest {
    date: Time;
    password?: string;
    name: string;
    description: string;
    image?: ExternalBlob;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: OrderStatus;
    orderDate: Time;
    fulfillDate: Time;
    numberOfDvd: bigint;
    items: Array<OrderField>;
    numberOfPrints: bigint;
    payment: PaymentFields;
}
export interface PaymentFields {
    total: bigint;
    remainingDue: bigint;
    advance: bigint;
}
export interface VideoUploadRequest {
    blob: ExternalBlob;
    name: string;
    description: string;
}
export interface CreateOrderRequest {
    customerName: string;
    orderDate: Time;
    fulfillDate: Time;
    numberOfDvd: bigint;
    items: Array<OrderField>;
    numberOfPrints: bigint;
    payment: PaymentFields;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
    phone: string;
}
export interface Photo {
    id: string;
    likeCount: bigint;
    blob: ExternalBlob;
    name: string;
    description: string;
    category: string;
    uploadTime: Time;
}
export enum OrderStatus {
    Cancelled = "Cancelled",
    Fulfilled = "Fulfilled",
    Pending = "Pending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEvent(eventData: EventCreateRequest): Promise<EventDTO>;
    createOrder(orderData: CreateOrderRequest): Promise<Order>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    uploadPhoto(photoData: PhotoVideoUploadRequest): Promise<Photo>;
    uploadVideo(videoData: VideoUploadRequest): Promise<Video>;
}
