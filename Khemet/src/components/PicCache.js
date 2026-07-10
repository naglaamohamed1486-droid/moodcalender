import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
export async function setPlaceImages(id, { coverImage, gallery }) {
  const result = {
    coverImage: "",
    gallery: [],
  };

  if (coverImage) {
    result.coverImage = await uploadImage(coverImage);
  }

  if (gallery && gallery.length > 0) {
    result.gallery = await Promise.all(
      gallery.map((img) => uploadImage(img))
    );
  }

  return result;
}
export async function getPlaceImages(id) {
  try {
    const coverRef = ref(storage, `places/${id}/cover`);
    const coverImage = await getDownloadURL(coverRef).catch(() => "");
    const galleryPromises = Array.from({ length: 10 }, (_, i) =>
      getDownloadURL(ref(storage, `places/${id}/gallery_${i}`)).catch(() => null)
    );
    const gallery = (await Promise.all(galleryPromises)).filter(Boolean);

    return { coverImage, gallery };
  } catch {
    return { coverImage: "", gallery: [] };
  }
}

export async function deletePlaceImages(id) {
  try {
    await deleteObject(ref(storage, `places/${id}/cover`)).catch(() => {});
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        deleteObject(ref(storage, `places/${id}/gallery_${i}`)).catch(() => {})
      )
    );
  } catch {
    
  }
}


import { uploadImage } from "../cloudinaryService";

export async function setUserProfilePic(userId, base64) {
  return await uploadImage(base64);
}

export async function getUserProfilePic(url) {
  return url || null;
}
