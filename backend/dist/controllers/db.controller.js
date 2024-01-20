"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Database {
    databaseUrl;
    constructor(databaseUrl) {
        this.databaseUrl = databaseUrl;
    }
    async connectToDb() {
        try {
            const mongoose = await import('mongoose');
            if (!this.databaseUrl)
                return new Error('Database url is required');
            await mongoose.connect(this.databaseUrl);
            console.log('success connect to db 🎉');
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = Database;
//# sourceMappingURL=db.controller.js.map