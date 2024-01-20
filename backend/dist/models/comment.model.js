"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    author: {
        type: String,
        ref: 'User',
    },
    comment: String,
    likes: [
        {
            type: String,
            ref: 'User',
        },
    ],
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
    },
    parentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
        required: false,
    },
}, {
    timestamps: true,
});
const commentModel = (0, mongoose_1.model)('Comment', commentSchema);
exports.default = commentModel;
//# sourceMappingURL=comment.model.js.map