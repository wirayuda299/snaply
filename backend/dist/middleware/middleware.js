"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Middleware {
    static async validate(req, res, next) {
        try {
            const header = req.headers.authorization?.split(" ")[1];
            if (!header) {
                return res.status(403).json({ message: 'UnAuthorized' }).end();
            }
            return next();
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: 'Internal Server Error', error: true })
                .end();
        }
    }
}
exports.default = Middleware;
//# sourceMappingURL=middleware.js.map