export default class Database {
	constructor(private databaseUrl?: Readonly<string>) {}

	async connectToDb() {
		try {
			const mongoose = await import('mongoose');
			if (!this.databaseUrl) throw new Error('Database url is required');

			await mongoose.connect(this.databaseUrl, {
				retryWrites: true,
				retryReads: true,
			});
			console.log('success connect to db 🎉');
		} catch (error) {
			throw error;
		}
	}
}
