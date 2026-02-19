// Utility functions for file uploads with ExternalBlob

/**
 * Convert a File to ExternalBlob for upload
 */
export async function fileToExternalBlob(file: File): Promise<any> {
  // @ts-ignore - ExternalBlob is provided by blob-storage component
  const ExternalBlob = window.ExternalBlob;
  
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  return ExternalBlob.fromBytes(bytes);
}

/**
 * Convert a File to ExternalBlob with upload progress tracking
 */
export async function fileToExternalBlobWithProgress(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<any> {
  // @ts-ignore - ExternalBlob is provided by blob-storage component
  const ExternalBlob = window.ExternalBlob;
  
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const blob = ExternalBlob.fromBytes(bytes);
  
  if (onProgress) {
    return blob.withUploadProgress(onProgress);
  }
  
  return blob;
}
