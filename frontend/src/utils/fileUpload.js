import { supabase } from "../utils/supabaseClient.js";

const uploadFileToSupabase = async (file, folderName) => {
  if (!file) return "";

  // 1. Generate a unique file name
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const filePath = `${folderName}/${fileName}`;

  // 2. Upload the raw binary file to your 'vehicle-assets' bucket
  const {error } = await supabase.storage
    .from('vehicle-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error(`Supabase upload error for ${file.name}:`, error.message);
    return "";
  }

  // 3. Extract the public, downloadable web link string
  const { data: publicUrlData } = supabase.storage
    .from('vehicle-assets')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl; //the string URL for MongoDB!
};

export default uploadFileToSupabase;