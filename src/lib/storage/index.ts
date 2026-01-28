import { supabase } from '@/lib/api/supabaseClient';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants';
import { generateId } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface UploadResult {
  path: string;
  error: string | null;
}

export interface SignedUrlResult {
  signedUrl: string;
  path: string;
  error: string | null;
}

export interface UploadedFileInfo {
  id: string;
  name: string;
  path: string;
  size: number;
  signedUrl?: string;
}

// ============================================================================
// Storage Bucket Names
// ============================================================================

export const STORAGE_BUCKETS = {
  DOCUMENTS: 'proposal-documents',
  AUDIO: 'proposal-audio',
} as const;

// ============================================================================
// Upload Functions
// ============================================================================

/**
 * Upload a single file to Supabase Storage
 */
export async function uploadFileToStorage(
  file: File,
  bucket: string,
  folderId: string
): Promise<UploadResult> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${generateId()}.${fileExt}`;
  const filePath = `${folderId}/${fileName}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file);

  if (error) {
    return { path: '', error: error.message };
  }

  return { path: filePath, error: null };
}

/**
 * Upload multiple files to Supabase Storage
 */
export async function uploadFilesToStorage(
  files: File[],
  bucket: string,
  folderId: string
): Promise<{ uploaded: UploadedFileInfo[]; errors: string[] }> {
  const uploaded: UploadedFileInfo[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const { path, error } = await uploadFileToStorage(file, bucket, folderId);

    if (error) {
      errors.push(`Failed to upload ${file.name}: ${error}`);
      continue;
    }

    uploaded.push({
      id: generateId(),
      name: file.name,
      path,
      size: file.size,
    });
  }

  return { uploaded, errors };
}

// ============================================================================
// Signed URL Functions
// ============================================================================

/**
 * Generate a signed URL for a single file path
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 */
export async function generateSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<SignedUrlResult> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    return { signedUrl: '', path, error: error.message };
  }

  return { signedUrl: data.signedUrl, path, error: null };
}

/**
 * Generate signed URLs for multiple file paths
 * @param bucket - The storage bucket name
 * @param paths - Array of file paths within the bucket
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 */
export async function generateSignedUrls(
  bucket: string,
  paths: string[],
  expiresIn: number = 3600
): Promise<{ urls: SignedUrlResult[]; errors: string[] }> {
  const urls: SignedUrlResult[] = [];
  const errors: string[] = [];

  // Use batch signed URL generation for efficiency
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, expiresIn);

  if (error) {
    errors.push(`Failed to generate signed URLs: ${error.message}`);
    return { urls, errors };
  }

  if (data) {
    data.forEach((item, index) => {
      if (item.error) {
        errors.push(`Failed to generate URL for ${paths[index]}: ${item.error}`);
      } else if (item.signedUrl) {
        urls.push({
          signedUrl: item.signedUrl,
          path: paths[index],
          error: null,
        });
      }
    });
  }

  return { urls, errors };
}

/**
 * Generate signed URLs for both documents and audio files
 * Uses the backend POST /storage/signed-urls endpoint
 */
export async function generateAllSignedUrls(
  documentPaths: string[],
  audioPaths: string[],
): Promise<{
  documentUrls: string[];
  audioUrls: string[];
  errors: string[];
}> {
  const errors: string[] = [];
  const documentUrls: string[] = [];
  const audioUrls: string[] = [];

  // Build storage paths with bucket prefixes
  const storagePaths: string[] = [
    ...documentPaths.map((p) => `${STORAGE_BUCKETS.DOCUMENTS}/${p}`),
    ...audioPaths.map((p) => `${STORAGE_BUCKETS.AUDIO}/${p}`),
  ];

  if (storagePaths.length === 0) {
    return { documentUrls, audioUrls, errors };
  }

  try {
    const response = await apiClient.post(
      API_ENDPOINTS.STORAGE_SIGNED_URLS,
      { storagePaths },
    ) as any;

    const signedUrls: { path: string; signedUrl: string | null; error?: string }[] =
      response?.signedUrls ?? response?.data?.signedUrls ?? [];

    for (const item of signedUrls) {
      if (!item.signedUrl) {
        errors.push(`Failed to generate signed URL for ${item.path}: ${item.error || 'unknown error'}`);
        continue;
      }

      if (item.path.startsWith(`${STORAGE_BUCKETS.DOCUMENTS}/`)) {
        documentUrls.push(item.signedUrl);
      } else if (item.path.startsWith(`${STORAGE_BUCKETS.AUDIO}/`)) {
        audioUrls.push(item.signedUrl);
      }
    }
  } catch (error: any) {
    errors.push(`Failed to generate signed URLs: ${error.message}`);
  }

  return { documentUrls, audioUrls, errors };
}

// ============================================================================
// Delete Functions
// ============================================================================

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFileFromStorage(
  bucket: string,
  path: string
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Delete multiple files from Supabase Storage
 */
export async function deleteFilesFromStorage(
  bucket: string,
  paths: string[]
): Promise<{ success: boolean; errors: string[] }> {
  const { error } = await supabase.storage.from(bucket).remove(paths);

  if (error) {
    return { success: false, errors: [error.message] };
  }

  return { success: true, errors: [] };
}

// ============================================================================
// Public URL Functions (for public buckets)
// ============================================================================

/**
 * Get public URL for a file (only works if bucket is public)
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
