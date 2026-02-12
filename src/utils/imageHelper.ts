import { imageGallery } from '../data/imageGallery';

const CUSTOM_IMAGES_KEY = 'toko_nusa_indah_custom_images';

export function getCustomImages(): Record<string, string> {
  const stored = localStorage.getItem(CUSTOM_IMAGES_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function saveCustomImage(key: string, base64Data: string): void {
  const customImages = getCustomImages();
  customImages[key] = base64Data;
  localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(customImages));
}

export function uploadCustomImage(base64Data: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const key = `custom_${timestamp}_${random}`;
  saveCustomImage(key, base64Data);
  return key;
}

export function deleteCustomImage(key: string): void {
  const customImages = getCustomImages();
  delete customImages[key];
  localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(customImages));
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getImageUrl(imageKey: string): string {
  if (imageKey.startsWith('http://') || imageKey.startsWith('https://') || imageKey.startsWith('data:')) {
    return imageKey;
  }
  
  const customImages = getCustomImages();
  if (customImages[imageKey]) {
    return customImages[imageKey];
  }
  
  return imageGallery[imageKey] || imageGallery.noodles;
}

export function getAvailableImageKeys(): string[] {
  const presetKeys = Object.keys(imageGallery);
  const customKeys = Object.keys(getCustomImages());
  return [...presetKeys, ...customKeys];
}

export function isValidImageKey(key: string): boolean {
  const customImages = getCustomImages();
  return key in imageGallery || key in customImages;
}
