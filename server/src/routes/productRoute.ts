import {Request, Response} from 'express'
const router = require('express').Router()
const Product = require('../models/productModel')
const User = require("../models/userModel");
const authMiddleware = require('../middlewares/authMiddleware')
const cloudinary = require('../config/cloudinaryConfig')
import multer from 'multer'
import mongoose from 'mongoose'


interface Filters {
  seller?: string;
  status?: string;
}

router.post("/add-product", async function (req: Request, res: Response) {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

router.post("/get-all-products", async (req: Request, res: Response) => {
  try {
    const { status, category, age, productName } = req.body;

    const query = Product.find().populate("seller");

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

    const products = await query.sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});




router.get("/product/:id", async function (req: Request, res: Response) {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      "seller",
      "name email"
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Product fetched succesfully", product });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

router.put("/edit-product/:id", async function (req: Request, res: Response) {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    return res
      .status(200)
      .json({ success: true, message: "Product updated successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
});




router.delete(
  "/delete-product/:id",
  async function (req: Request, res: Response) {
    try {
      await Product.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal server error." });
    }
  }
);

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
})

router.post("/upload-image-to-product", authMiddleware, multer({storage: storage}).single('file'), async (req: Request, res: Response) => {
  try {
    const result = await cloudinary.uploader.upload((req.file as any).path, {
      folder: "marketPlace"
    })
const productId = req.body.productId;
await Product.findByIdAndUpdate(productId, {
  $push: {images: result.secure_url}
})

    res.status(200).json({success: true, message: "Image uploaded succesfully", result})
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});


router.put("/update-status/:id", async function (req: Request, res: Response) {
  try {
    const { status } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
    );
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
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
});



module.exports = router