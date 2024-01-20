"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tagSchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true,
    },
    postIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
});
const tagModel = (0, mongoose_1.model)('Tag', tagSchema);
exports.default = tagModel;
//# sourceMappingURL=tag.model.js.map