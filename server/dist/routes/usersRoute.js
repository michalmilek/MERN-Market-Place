"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = require('../middlewares/authMiddleware');
router.post('/register', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, name } = req.body;
        try {
            const userExists = yield User.findOne({ email });
            if (userExists) {
                return res
                    .status(409)
                    .send({ success: false, message: "User already exists" });
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = new User({ name: name, email: email, password: hashedPassword });
            yield newUser.save();
            return res.status(201).send({
                success: true,
                message: "User created",
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).send({
                success: false,
                message: 'Server error',
            });
        }
    });
});
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.jwt_secret, { expiresIn: "1h" });
        res.status(200).send({ success: true, message: "User succesfully logged in", accessToken: token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get('/get-current-user', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.body.userId);
        res.status(200).send({ success: true, message: "User fetched succesfully", data: user });
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }
}));
router.get("/get-all-users", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find({});
        res
            .status(200)
            .send({
            success: true,
            message: "All users fetched successfully",
            data: users,
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            message: "Error fetching all users: " + err.message,
        });
    }
}));
router.put("/update-user-status/:id", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const user = yield User.findByIdAndUpdate(req.params.id, { status });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: "User not found." });
        }
        return res.status(200).json({
            success: true,
            message: "User status updated successfully.",
            data: user,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating user status: " + err.message,
        });
    }
}));
module.exports = router;
//# sourceMappingURL=usersRoute.js.map