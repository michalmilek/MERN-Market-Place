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
const Bid = require("../models/bidModel");
const authMiddleware = require("../middlewares/authMiddleware");
router.post("/place-new-bid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBid = new Bid({
            bidAmount: req.body.bidAmount,
            message: req.body.message,
            mobile: req.body.mobile,
            product: req.body.product,
            seller: req.body.seller,
            buyer: req.body.buyer,
        });
        yield newBid.save();
        res
            .status(201)
            .json({ success: true, message: "Bid placed succesfully", newBid });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
router.get("/get-all-bids", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product, seller } = req.body;
        let filters = {};
        if (product) {
            filters.product = product;
        }
        if (seller) {
            filters.seller = seller;
        }
        const bids = yield Bid.find(filters)
            .populate("product")
            .populate("buyer")
            .populate("seller")
            .sort({ bidAmount: -1 });
        res.status(200).json({ success: true, data: bids });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}));
router.get("/get-all-bids-for-product", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product } = req.query;
        const bids = yield Bid.find({ product: product })
            .populate("product")
            .populate("buyer")
            .populate("seller")
            .sort({ bidAmount: -1 });
        res.status(200).json({ success: true, data: bids });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}));
router.get("/get-all-user-bids", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const bids = yield Bid.find({ buyer: userId })
            .populate("product")
            .populate("buyer")
            .populate("seller")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bids });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}));
router.delete("/delete-bid/:bidId", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bidId = req.params.bidId;
        const bid = yield Bid.findByIdAndDelete(bidId);
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
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}));
module.exports = router;
//# sourceMappingURL=bidsRoute.js.map