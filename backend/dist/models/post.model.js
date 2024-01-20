"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: String,
    body: String,
    views: {
        type: Number,
        default: 0,
    },
    image: String,
    tags: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Tag',
        },
    ],
    share: {
        type: Number,
        default: 0,
    },
    country: {
        type: String,
        required: false,
    },
    groupId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Group',
        required: false,
    },
    likes: [
        {
            type: String,
            ref: 'User',
        },
    ],
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    author: {
        type: String,
        ref: 'User',
    },
    report: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Report',
        },
    ],
}, {
    timestamps: true,
});
const postModel = (0, mongoose_1.model)('Post', postSchema);
exports.default = postModel;
//# sourceMappingURL=post.model.js.map