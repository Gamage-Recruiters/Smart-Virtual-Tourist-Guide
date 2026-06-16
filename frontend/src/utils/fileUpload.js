import { supabase } from "../utils/supabaseClient.js";
import imageCompression from 'browser-image-compression';

const uploadFileToSupabase = async (file, folderName) => {
  if (!file) return "";

  let fileToUpload = file;

  // Automatically compress images down to ~200KB-500KB if it's a photo asset
  if (folderName === 'photos' && file.type.startsWith('image/')) {
    const options = {
      maxSizeMB: 1.0,       // Max output file size target (500KB)
      maxWidthOrHeight: 1200, // Maximum resolution box constraint
      useWebWorker: true,
      initialQuality: 0.85
    };
    try {
      fileToUpload = await imageCompression(file, options);
    } catch (compressError) {
      console.error("Compression processing failed, using original file:", compressError);
    }
  }

  // Generate a unique file name
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const filePath = `${folderName}/${fileName}`;

  // Upload the raw binary file to your 'vehicle-assets' bucket
  const {error } = await supabase.storage
    .from('vehicle-assets')
    .upload(filePath, fileToUpload, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error(`Supabase upload error for ${file.name}:`, error.message);
    return "";
  }

  // Extract the public, downloadable web link string
  const { data: publicUrlData } = supabase.storage
    .from('vehicle-assets')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl; //the string URL for MongoDB!
};

export default uploadFileToSupabase;