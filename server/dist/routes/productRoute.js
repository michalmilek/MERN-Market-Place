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
const Product = require("../models/productModel");
const authMiddleware = require("../middlewares/authMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const multer_1 = __importDefault(require("multer"));
router.post("/add-product", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newProduct = new Product(req.body);
            yield newProduct.save();
            res.status(201).json({
                success: true,
                message: "Product created successfully.",
                product: newProduct,
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    });
});
router.post("/get-all-products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, category, age, productName, sellerId } = req.body;
        const query = Product.find();
        if (status) {
            query.where("status").equals(status);
        }
        if (category && category.length > 0) {
            query.where("category").in(category);
        }
        if (age && age.length > 0) {
            const [minAge, maxAge] = age;
            query.where("age").gte(minAge).lte(maxAge);
        }
        if (productName) {
            query.where("name").regex(new RegExp(productName, "i"));
        }
        if (sellerId) {
            query.where("seller").equals(sellerId);
        }
        const products = yield query.sort({ createdAt: -1 }).populate("seller");
        res.status(200).json({
            success: true,
            data: products,
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
router.get("/product/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const productId = req.params.id;
            const product = yield Product.findById(productId).populate("seller", "name email");
            if (!product) {
                return res
                    .status(404)
                    .json({ success: false, message: "Product not found." });
            }
            return res
                .status(200)
                .json({ success: true, message: "Product fetched succesfully", product });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error." });
        }
    });
});
router.put("/edit-product/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Product.findByIdAndUpdate(req.params.id, req.body);
            return res
                .status(200)
                .json({ success: true, message: "Product updated successfully." });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, error: "Internal server error." });
        }
    });
});
router.delete("/delete-product/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Product.findByIdAndDelete(req.params.id);
            return res
                .status(200)
                .json({ success: true, message: "Product deleted successfully." });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, error: "Internal server error." });
        }
    });
});
const storage = multer_1.default.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});
router.post("/upload-image-to-product", authMiddleware, (0, multer_1.default)({ storage: storage }).single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary.uploader.upload(req.file.path, {
            folder: "marketPlace"
        });
        const productId = req.body.productId;
        yield Product.findByIdAndUpdate(productId, {
            $push: { images: result.secure_url }
        });
        res.status(200).json({ success: true, message: "Image uploaded succesfully", result });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
}));
router.put("/update-status/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { status } = req.body;
            const updatedProduct = yield Product.findByIdAndUpdate(req.params.id, { status });
            if (!updatedProduct) {
                return res
                    .status(404)
                    .json({ success: false, error: "Product not found." });
            }
            return res
                .status(200)
                .json({
                success: true,
                message: "Product status updated successfully.",
                updatedProduct,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, error: "Internal server error." });
        }
    });
});
module.exports = router;
//# sourceMappingURL=productRoute.js.map