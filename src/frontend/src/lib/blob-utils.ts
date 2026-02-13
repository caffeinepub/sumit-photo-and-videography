import { ExternalBlob } from '../backend';

/**
 * Convert ExternalBlob to displayable URL using getDirectURL() method
 */
export function blobToUrl(blob: ExternalBlob): string {
  return blob.getDirectURL();
}

/**
 * Convert ExternalBlob to Uint8Array when needed
 */
export async function blobToBytes(blob: ExternalBlob): Promise<Uint8Array> {
  return blob.getBytes();
}

/**
 * Convert image blob to JPEG format using canvas
 * Memory-efficient conversion that preserves quality
 */
async function convertToJPEG(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      try {
        // Create canvas with image dimensions
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert to JPEG blob with high quality (0.95)
        canvas.toBlob(
          (jpegBlob) => {
            // Clean up
            URL.revokeObjectURL(url);
            canvas.width = 0;
            canvas.height = 0;
            
            if (jpegBlob) {
              resolve(jpegBlob);
            } else {
              reject(new Error('Failed to convert image to JPEG'));
            }
          },
          'image/jpeg',
          0.95
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Download an image from ExternalBlob converted to JPEG format
 * Uses memory-efficient streaming and canvas conversion
 */
export async function downloadImage(blob: ExternalBlob, filename: string): Promise<void> {
  try {
    // Ensure filename has .jpg extension
    const jpegFilename = filename.replace(/\.[^.]+$/, '') + '.jpg';
    
    // Fetch the image data
    const url = blob.getDirectURL();
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    const imageBlob = await response.blob();
    
    // Convert to JPEG if not already
    let finalBlob: Blob;
    if (imageBlob.type === 'image/jpeg') {
      finalBlob = imageBlob;
    } else {
      finalBlob = await convertToJPEG(imageBlob);
    }
    
    // Create object URL for download
    const downloadUrl = URL.createObjectURL(finalBlob);
    
    // Create temporary anchor element for download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = jpegFilename;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }, 100);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download image');
  }
}

/**
 * Generic image type for batch downloads
 * Supports both EventImage and SpecialMomentImage
 */
interface DownloadableImage {
  id: string;
  name: string;
  blob: ExternalBlob;
}

/**
 * Download all images as JPEG files in batch
 * Memory-optimized with sequential processing and progress tracking
 * Works with both EventImage and SpecialMomentImage types
 */
export async function downloadAllImages(
  images: DownloadableImage[],
  collectionName: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  if (images.length === 0) {
    throw new Error('No images to download');
  }

  const sanitizedCollectionName = collectionName.replace(/[^a-z0-9]/gi, '_');
  const total = images.length;
  
  // Process images sequentially to avoid memory overload
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    
    try {
      // Generate filename with collection name and index
      const filename = `${sanitizedCollectionName}_${i + 1}_${image.name.replace(/[^a-z0-9]/gi, '_')}.jpg`;
      
      // Download individual image
      await downloadImage(image.blob, filename);
      
      // Update progress
      if (onProgress) {
        onProgress(i + 1, total);
      }
      
      // Small delay between downloads to prevent browser throttling
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error(`Failed to download image ${i + 1}:`, error);
      // Continue with next image even if one fails
    }
  }
}
