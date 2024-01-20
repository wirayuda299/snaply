"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_service_1 = __importDefault(require("./services/app.service"));
const app = new app_service_1.default(3002);
app.listen();
//# sourceMappingURL=index.js.map