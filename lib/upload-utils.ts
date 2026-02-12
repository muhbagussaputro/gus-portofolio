// Shared upload utilities untuk admin pages
export interface UploadOptions {
  category: string;
  slug: string;
  index?: number;
  fileType: 'image' | 'video' | 'document';
}

export async function uploadSingleFile(
  file: File, 
  options: UploadOptions
): Promise<string> {
  const formData = new FormData();
  const ext = file.name.split('.').pop();
  
  // Generate filename based on type
  const customFileName = options.index 
    ? `${options.slug}_${options.index}.${ext}`
    : `${options.slug}_logo.${ext}`;
  
  // For education/experience, use simple category/slug
  // For projects, category already contains project/category-slug
  const folderPath = options.category.includes('/') 
    ? options.category // Already full path like "project/web-app"
    : `${options.category}/${options.slug}`; // Simple path like "education/slug"
  
  formData.append('file', file);
  formData.append('custom_name', customFileName);
  formData.append('folder_path', folderPath);
  formData.append('type', options.fileType);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  if (result.success) {
    return result.data.file_url;
  }
  throw new Error(result.error || 'Upload failed');
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}