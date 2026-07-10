export async function uploadImage(base64) {
  const formData = new FormData();

  formData.append("file", base64);
  formData.append("upload_preset", "xx3mj8hw");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/tahodrd4/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();
  return data.secure_url;
}