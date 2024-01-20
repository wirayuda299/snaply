"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: false,
        default: '',
    },
    bio: {
        type: String,
        required: false,
        default: '',
    },
    website: {
        type: String,
        required: false,
        default: '',
    },
    followers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    followings: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    posts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    groups: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Group',
        },
    ],
    groupMembers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Group',
        },
    ],
    meetups: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Meetup',
        },
    ],
}, {
    timestamps: true,
});
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;
//# sourceMappingURL=user.model.js.map