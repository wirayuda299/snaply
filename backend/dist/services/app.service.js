"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const db_controller_1 = __importDefault(require("../controllers/db.controller"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const post_route_1 = __importDefault(require("../routes/post.route"));
const comment_route_1 = __importDefault(require("../routes/comment.route"));
const group_route_1 = __importDefault(require("../routes/group.route"));
const meetup_route_1 = __importDefault(require("../routes/meetup.route"));
const middleware_1 = __importDefault(require("../middleware/middleware"));
class AppService {
    port;
    app;
    corsAllowUrl = process.env.CLIENT_URL;
    // Set CORS headers
    setCorsHeaders = (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', this.corsAllowUrl);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
    };
    database = new db_controller_1.default(process.env.DATABASE_URL);
    constructor(port = parseInt(process.env.PORT) || 3001) {
        this.port = port;
        if (!this.port || isNaN(this.port)) {
            throw new Error('Invalid port number');
        }
        this.app = (0, express_1.default)();
        this.app.use((0, helmet_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(this.setCorsHeaders);
        this.app.use((0, compression_1.default)());
        this.app.disable('x-powered-by');
        this.app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
        this.app.use('/api/user', user_route_1.default);
        this.app.use('/api/post', middleware_1.default.validate, post_route_1.default);
        this.app.use('/api/comment', middleware_1.default.validate, comment_route_1.default);
        this.app.use('/api/group', middleware_1.default.validate, group_route_1.default);
        this.app.use('/api/meetup', middleware_1.default.validate, meetup_route_1.default);
    }
    listen() {
        this.app.listen(this.port, async () => {
            try {
                await this.database.connectToDb();
                console.log(`⚡️[server]: Server is running at https://localhost:${this.port}`);
            }
            catch (error) {
                console.error(`Failed to start server: ${error}`);
            }
        });
    }
    connectDb() {
        return this.database.connectToDb();
    }
}
exports.default = AppService;
//# sourceMappingURL=app.service.js.map