"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bidSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    seller: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    buyer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    bidAmount: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model("bids", bidSchema);
//# sourceMappingURL=bidModel.js.map