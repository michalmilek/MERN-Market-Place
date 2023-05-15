import { Request, Response } from "express";
const router = require("express").Router();
const Bid = require("../models/bidModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/place-new-bid", async (req: Request, res: Response) => {
  try {
    const newBid = new Bid({
      bidAmount: req.body.bidAmount,
      message: req.body.message,
      mobile: req.body.mobile,
      product: req.body.product,
      seller: req.body.seller,
      buyer: req.body.buyer,
    });

    await newBid.save();

    res
      .status(201)
      .json({ success: true, message: "Bid placed succesfully", newBid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get(
  "/get-all-bids",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { product, seller } = req.body;
      let filters: any = {};
      if (product) {
        filters.product = product;
      }

      if (seller) {
        filters.seller = seller;
      }
      const bids = await Bid.find(filters)
        .populate("product")
        .populate("buyer")
        .populate("seller")
        .sort({ bidAmount: -1 });

      res.status(200).json({ success: true, data: bids });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);


router.get(
  "/get-all-bids-for-product",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { product } = req.query;
      const bids = await Bid.find({ product: product })
        .populate("product")
        .populate("buyer")
        .populate("seller")
        .sort({ bidAmount: -1 });
      res.status(200).json({ success: true, data: bids });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);


router.get(
  "/get-all-user-bids",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId;
      const bids = await Bid.find({ buyer: userId })
        .populate("product")
        .populate("buyer")
        .populate("seller")
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: bids });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.delete(
  "/delete-bid/:bidId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const bidId = req.params.bidId as string;
      const bid = await Bid.findByIdAndDelete(bidId);
      if (!bid) {
        return res.status(404).json({
          success: false,
          message: "Bid not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Bid deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);




module.exports = router;
