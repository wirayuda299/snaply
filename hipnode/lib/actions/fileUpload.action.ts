const serverEndpoint = process.env.SERVER_URL;

export async function uploadFile(file: File) {
	try {
		const data = new FormData();
		data.append('file', file);

		const res = await fetch(`${serverEndpoint}/upload`, {
			method: 'POST',
			body: data,
		});

		const image = await res.json();
		console.log(image);

		if (image.error) {
			throw new Error(image.message);
		}
		return image;
	} catch (error) {
		throw error;
	}
}
