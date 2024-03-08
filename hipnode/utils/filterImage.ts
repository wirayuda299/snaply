export const filterImage = async (file: File) => {
	try {
		// eslint-disable-next-line camelcase
		const X_RapidAPI_KEY = process.env.NEXT_PUBLIC_X_RapidAPI_KEY;
		// eslint-disable-next-line camelcase
		const X_RapidAPI_HOST = process.env.NEXT_PUBLIC_X_RapidAPI_HOST;

		// eslint-disable-next-line camelcase
		if (!X_RapidAPI_KEY || !X_RapidAPI_HOST || !file) return;

		const data = new FormData();
		data.append('image', file, file.name);

		const options = {
			method: 'POST',
			headers: {
				// eslint-disable-next-line camelcase
				'X-RapidAPI-Key': X_RapidAPI_KEY,
				// eslint-disable-next-line camelcase
				'X-RapidAPI-Host': X_RapidAPI_HOST,
			},
			body: data,
		};
		const getResult = await fetch(
			'https://nsfw-images-detection-and-classification.p.rapidapi.com/adult-content-file',
			options
		);
		return await getResult.json();
	} catch (error) {
		throw error;
	}
};
