const serverEndpoint = process.env.SERVER_URL;

export async function uploadFile(file: File) {
  try {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch(`${serverEndpoint}/upload`, {
      method: "POST",
      body: data,
    });

    const image = await res.json();
    return image;
  } catch (error) {
    throw error;
  }
}
