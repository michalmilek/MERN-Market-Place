"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    status: {
        type: String,
        default: "active"
    },
    profilePicture: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});
const User = mongoose_1.default.model("users", userSchema);
module.exports = User;
//# sourceMappingURL=userModel.js.map