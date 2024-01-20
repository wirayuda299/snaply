"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const meetupSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String,
            ref: 'Tag',
        },
    ],
    author: {
        type: String,
        ref: 'User',
    },
});
const meetupModel = (0, mongoose_1.model)('Meetup', meetupSchema);
exports.default = meetupModel;
//# sourceMappingURL=meetup.model.js.map