export default class Database {
	constructor(private databaseUrl?: Readonly<string>) {}

	async connectToDb() {
		try {
			const mongoose = await import('mongoose');
			if (!this.databaseUrl) return new Error('Database url is required');

			await mongoose.connect(this.databaseUrl);
			console.log('success connect to db 🎉');
		} catch (error) {
			throw error;
		}
	}
}
