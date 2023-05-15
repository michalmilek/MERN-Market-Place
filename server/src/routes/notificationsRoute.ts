import { Request, Response } from "express";
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Notification = require("../models/notificationsModel");

router.post("/notify", authMiddleware, async (req: Request, res: Response) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.status(201).json({
      success: true,
      message: "Notification created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get(
  "/notifications",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const notifications = await Notification.find({
        user: req.query.userId,
      }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: "Notifications have been successfully retrieved.",
        data: notifications,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.delete(
  "/delete-notification/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const notificationId = req.params.id;
      const deletedNotification = await Notification.findOneAndDelete({
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
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.patch(
  "/notifications/mark-all-as-read",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      await Notification.updateMany(
        { user: req.query.userId, seen: false },
        { $set: { seen: true } }
      );

      res.status(200).json({
        success: true,
        message: "All notifications have been marked as read.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.patch(
  "/notifications/:id/mark-as-read",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const notification = await Notification.findOne({
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
      await notification.save();

      res.status(200).json({
        success: true,
        message: "Notification has been marked as read.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

module.exports = router;
