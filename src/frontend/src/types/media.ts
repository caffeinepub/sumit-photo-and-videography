// Media types for Photos, Videos, and Events

export interface ExternalBlob {
    getBytes(): Promise<Uint8Array>;
    getDirectURL(): string;
}

export interface Photo {
    id: string;
    name: string;
    description: string;
    blob: ExternalBlob;
    uploadTime: bigint;
    likeCount: bigint;
    category: string;
}

export interface Video {
    id: string;
    name: string;
    description: string;
    blob: ExternalBlob;
    uploadTime: bigint;
}

export interface EventImage {
    id: string;
    name: string;
    description: string;
    blob: ExternalBlob;
    uploadTime: bigint;
    category: string;
}

export interface EventDTO {
    id: bigint;
    name: string;
    description: string;
    date: bigint;
    images: EventImage[];
    passwordProtected: boolean;
}

export enum SortedOrder {
    newestFirst = "newestFirst",
    oldestFirst = "oldestFirst"
}

export interface PhotoVideoUploadRequest {
    name: string;
    description: string;
    blob: ExternalBlob;
    category: string;
}

export interface EventCreateRequest {
    name: string;
    description: string;
    date: bigint;
    password: string | null;
}

export interface EventImageUploadRequest {
    eventId: bigint;
    name: string;
    description: string;
    blob: ExternalBlob;
    category: string;
}
