// Utility functions for working with ExternalBlob from blob-storage

/**
 * Convert ExternalBlob to a displayable URL
 * Uses the direct URL for streaming and caching
 */
export function blobToUrl(blob: any): string {
  if (!blob) return '';
  
  // Use the direct URL method from ExternalBlob
  if (typeof blob.getDirectURL === 'function') {
    return blob.getDirectURL();
  }
  
  return '';
}

/**
 * Convert ExternalBlob to Uint8Array when needed
 */
export async function blobToBytes(blob: any): Promise<Uint8Array> {
  if (!blob) return new Uint8Array();
  
  if (typeof blob.getBytes === 'function') {
    return await blob.getBytes();
  }
  
  return new Uint8Array();
}

/**
 * Download a single image
 */
export async function downloadImage(blob: any, filename: string): Promise<void> {
  try {
    const bytes = await blobToBytes(blob);
    // Convert Uint8Array to regular array for Blob constructor
    const byteArray = Array.from(bytes);
    const blobObj = new Blob([new Uint8Array(byteArray)], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blobObj);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}
