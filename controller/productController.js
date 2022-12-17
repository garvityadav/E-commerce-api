const Product = require("../model/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser} = require("../utils/index");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;


const createProduct = async (req,res)=>{
    req.body.user = req.user.userID;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product});
}

const getAllProducts = async (req,res)=>{
const products = await Product.find({});
res.status(StatusCodes.CREATED).json({nbHits:products.length,products});
}

const getSingleProduct = async (req,res)=>{
const {id} = req.params;
const product = await Product.findById(id);
if(!product){
    throw new CustomError.NotFoundError(`No product for prod ID: ${id}`);
};
res.status(StatusCodes.OK).json({product});
}

const updateProduct = async (req,res)=>{
    const {id} = req.params;
    if(!id){
        throw new CustomError.BadRequestError("Id can't be blank");
    }
    const product = await Product.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
    if(!product){
        throw new CustomError.NotFoundError(`Can't find product of id: ${id}`);
    };
    res.status(StatusCodes.OK).json(product);

}

const deleteProduct = async (req,res)=>{
    const {id} = req.params;
    if(!id){
        throw new CustomError.BadRequestError("Id can't be blank");
    }
    const product = await Product.findById(id);
    if(!product){
        throw new CustomError.BadRequestError("Invalid Route");
    };
    product.remove();
    res.status(StatusCodes.OK).json("Deleted Successfully!");
}

const uploadImage = async (req,res)=>{
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { use_filename: true, folder: "e-commerce" }
      );
      fs.unlinkSync(req.files.image.tempFilePath);
      res.status(StatusCodes.CREATED).json({ image: { src: result.secure_url } });
}



module.exports = {
    createProduct, getAllProducts,
  getSingleProduct, updateProduct, deleteProduct, uploadImage
}
