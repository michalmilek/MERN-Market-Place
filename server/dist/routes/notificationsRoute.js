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
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Notification = require("../models/notificationsModel");
router.post("/notify", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newNotification = new Notification(req.body);
        yield newNotification.save();
        res.status(201).json({
            success: true,
            message: "Notification created successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}));
router.get("/notifications", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield Notification.find({
            user: req.query.userId,
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Notifications have been successfully retrieved.",
            data: notifications,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}));
router.delete("/delete-notification/:id", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationId = req.params.id;
        const deletedNotification = yield Notification.findOneAndDelete({
            _id: notificationId,
            user: req.query.userId,
        });
        if (!deletedNotification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }
        res.status(200).json({
            success: true,
            message: "Notification has been successfully deleted.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}));
router.patch("/notifications/mark-all-as-read", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notification.updateMany({ user: req.query.userId, seen: false }, { $set: { seen: true } });
        res.status(200).json({
            success: true,
            message: "All notifications have been marked as read.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}));
router.patch("/notifications/:id/mark-as-read", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield Notification.findOne({
            _id: req.params.id,
            user: req.query.userId,
        });
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        notification.seen = true;
        yield notification.save();
        res.status(200).json({
            success: true,
            message: "Notification has been marked as read.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}));
router.patch("/notifications/:id/mark-as-unread", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield Notification.findOne({
            _id: req.params.id,
            user: req.query.userId,
        });
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        notification.seen = false;
        yield notification.save();
        res.status(200).json({
            success: true,
            message: "Notification has been marked as unread.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}));
module.exports = router;
//# sourceMappingURL=notificationsRoute.js.map