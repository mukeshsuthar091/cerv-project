import joiPkg from "joi";
const { ValidationError } = joiPkg;
import { v2 as cloudinary } from "cloudinary";

import db from "../db/database.js";
import uploader from "../uploads/uploader.js";
import extractPublicID from "../uploads/extract_Public_ID.js";

//  ----------------------


export const getAllCategories = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [categories] = await db.execute(
      `SELECT 
          categories.id, 
          categories.name,
          categories.image
      FROM categories
      WHERE categories.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: categories,
      message: "Successfully retrieved categories.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve categories, Try again",
    });
  }
};



export const createCategory = async (req, res, next) => {
  const userId = req.user.id;
  const category_name = req.body.name;

  let category_img_path = null;
  if(req.file && req.file.path){
    category_img_path = req.file.path;
  }
  console.log("files: ", req.files);
  console.log("body: ", req.body);

  try {
    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required data.",
      });
    }

    const [category] = await db.execute(
      `INSERT INTO categories(user_id, name) VALUES (?, ?)`,
      [userId, category_name]
    );
    const category_id = category.insertId;

    if (category_id && category_img_path) {
      let imageResult = await uploader(category_img_path);
      const [category_img_url = ""] = imageResult ?? [];

      console.log("category_img_url: ", category_img_url)


      if (category_img_url) {
        await db.execute("UPDATE categories SET image = ? WHERE id = ?", [
          category_img_url,
          category_id,
        ]);
      }
    }

    res.status(200).json({
      success: true,
      message: "Category created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to create category, Try Again.",
    });
  }
};


export const updateCategory = async (req, res, next) => {
  const userId = req.user.id;
  const categoryId = req.params.categoryId;
  const category_name = req.body.name;

  console.log("files: ", req.files);
  console.log("body: ", req.body);

  let category_img_path = null;
  if(req.file && req.file.path){
    category_img_path = req.file.path;
  }

  try {
    await db.execute(
      `UPDATE categories
      SET name = ?
      WHERE id = ? AND user_id = ?`,
      [category_name, categoryId, userId]
    );

    if (category_img_path) {
      const [category] = await db.execute(
        `SELECT image FROM categories WHERE id = ?`,
        [categoryId]
      );

      const publicID = await extractPublicID(category[0].image || "");

      const result = await cloudinary.api.delete_resources([publicID || ""], {
        type: "upload",
        resource_type: "image",
      });

      const [category_img_url = ""] = (await uploader(category_img_path)) ?? [];

      console.log("category_img_url: ", category_img_url)

      if (category_img_url) {
        await db.execute("UPDATE categories SET image = ? WHERE id = ?", [
          category_img_url,
          categoryId,
        ]);
      }
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to update category, Try Again.",
    });
  }
};



export const deleteCategory = async (req, res, next) => {
  const userId = req.user.id;
  const categoryId = req.params.categoryId;

  try {
    await db.execute(`DELETE FROM categories WHERE id = ? AND user_id = ?`, [
      categoryId,
      userId,
    ]);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete category, Try again.",
    });
  }
};


export const getAllSubCategories = async (req, res, next) => {
  const userId = req.user.id;
  const categoryId = req.params.categoryId;

  try {
    const [subCategories] = await db.execute(
      `SELECT 
          sub_categories.id, 
          sub_categories.category_id,
          sub_categories.name,
          sub_categories.image
      FROM sub_categories
      WHERE sub_categories.user_id = ? AND sub_categories.category_id = ?`,
      [userId, categoryId]
    );

    res.status(200).json({
      success: true,
      data: subCategories,
      message: "Successfully retrieved sub-categories.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve sub-categories, Try again",
    });
  }
};


export const createSubCategory = async (req, res, next) => {
  const userId = req.user.id;
  const categoryId = req.params.categoryId;
  const subCategory_name = req.body.name;
  console.log("files: ", req.files);
  console.log("body: ", req.body);

  let subCategory_img_path = null;
  if(req.file && req.file.path){
    subCategory_img_path = req.file.path;
  }

  try {
    if (!subCategory_name) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required data.",
      });
    }
    const [subCategory] = await db.execute(
      `INSERT INTO sub_categories(user_id, category_id, name) VALUES (?, ?, ?)`,
      [userId, categoryId, subCategory_name]
    );
    const subCategory_id = subCategory.insertId;

    if (subCategory_id && subCategory_img_path) {
      let imageResult = await uploader(subCategory_img_path);
      const [subCategory_img_url = ""] = imageResult ?? [];

      console.log("subCategory_img_url: ", subCategory_img_url);


      if (subCategory_img_url) {
        await db.execute("UPDATE sub_categories SET image = ? WHERE id = ?", [
          subCategory_img_url,
          subCategory_id,
        ]);
      }
    }

    res.status(200).json({
      success: true,
      message: "Category sub-created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to create sub-category, Try Again.",
    });
  }
};


export const updateSubCategory = async (req, res, next) => {
  const userId = req.user.id;
  const subCategoryId = req.params.subCategoryId;
  const subCategory_name = req.body.name;
  let subCategory_img_path = null;
  if(req.file && req.file.path){
    subCategory_img_path = req.file.path;
  }

  console.log("files: ", req.files);
  console.log("body: ", req.body);


  try {
    await db.execute(
      `UPDATE sub_categories
      SET name = ?
      WHERE id = ? AND user_id = ?`,
      [subCategory_name, subCategoryId, userId]
    );

    if (subCategory_img_path) {
      const [subCategory] = await db.execute(
        `SELECT image FROM sub_categories WHERE id = ?`,
        [subCategoryId]
      );

      const publicID = await extractPublicID(subCategory[0].image || "");

      const result = await cloudinary.api.delete_resources([publicID || ""], {
        type: "upload",
        resource_type: "image",
      });

      const [subCategory_img_url = ""] = (await uploader(subCategory_img_path)) ?? [];
      
      console.log("subCategory_img_url: ", subCategory_img_url);

      if (subCategory_img_url) {
        await db.execute("UPDATE sub_categories SET image = ? WHERE id = ?", [
          subCategory_img_url,
          subCategoryId,
        ]);
      }
    }

    res.status(200).json({
      success: true,
      message: "Sub-category updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to update sub-category, Try Again.",
    });
  }
};


export const deleteSubCategory = async (req, res, next) => {
  const userId = req.user.id;
  const subCategoryId = req.params.subCategoryId;

  try {
    // await db.beginTransaction();

    // Delete products associated with the sub-category
    // await db.execute(
    //   `DELETE FROM products WHERE sub_category_id = ? AND user_id = ?`,
    //   [subCategoryId, userId]
    // );

    // Delete the sub-category
    await db.execute(
      `DELETE FROM sub_categories WHERE id = ? AND user_id = ?`,
      [subCategoryId, userId]
    );

    // Commit the transaction
    // await db.commit();

    res.status(200).json({
      success: true,
      message: "Sub-category and associated products deleted successfully.",
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
    // await db.rollback();

    res.status(500).json({
      success: false,
      error: error.message,
      message:
        "Failed to delete sub-category and associated products. Try again.",
    });
  }
};



export const createProduct = async (req, res, next) => {
  const userId = req.user.id;
  const categoryId = req.params.categoryId;
  const subCategoryId = req.params.subCategoryId;
  const { name, description } = req.body;
  const prices = req.body.prices;
  let product_img_path = null;
  if(req.file && req.file.path){
    product_img_path = req.file.path;
  }

  console.log("files: ", req.files);
  console.log("body: ", req.body);

  try {
    if (!name || !description || !prices) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required data.",
      });
    }

    const [product] = await db.execute(
      `INSERT INTO products(user_id, category_id, sub_category_id, food_name, food_description) VALUES (?, ?, ?, ?, ?)`,
      [userId, categoryId, subCategoryId, name, description]
    );
    const product_id = product.insertId;

    console.log(product_id);
    if (product_id && product_img_path) {
      let imageResult = await uploader(product_img_path);
      const [product_img_url = ""] = imageResult ?? [];

      console.log("product_img_url: ", product_img_url)

      if (product_img_url) {
        await db.execute("UPDATE products SET image = ? WHERE id = ?", [
          product_img_url,
          product_id,
        ]);
      }
    }

    let total_price = 0,
      avg_price = 0;

    let price_arr_length = prices.length;

    for (let price of prices) {
      total_price += price.price;
      await db.execute(
        `INSERT INTO prices(product_id, size, price) VALUES (?, ?, ?)`,
        [product_id, price.size, price.price]
      );
    }

    avg_price = (total_price / price_arr_length).toFixed(2);
    await db.execute(`UPDATE products SET avg_price = ? WHERE id = ?`, [
      avg_price,
      product_id,
    ]);

    let [result] = await db.execute(
      `SELECT avg(prices.price) as avg_price
      FROM products
      LEFT JOIN prices on products.id = prices.product_id
      WHERE products.user_id = ?`,
      [userId]
    );


    let costPerPlat = parseFloat(result[0].avg_price).toFixed(2);
    await db.execute(
      `UPDATE userDetails SET cost_per_plat = ? WHERE user_id = ?`,
      [costPerPlat, userId]
    );

    res.status(200).json({
      success: true,
      message: "Successfully created products.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create product. Try again.",
    });
  }
};


export const getAllProducts = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const subCategoryId = req.params.subCategoryId;

  try {
    const [products] = await db.execute(
      `SELECT *
      FROM products
      WHERE sub_category_id = ?`,
      [subCategoryId]
    );

    res.status(200).json({
      success: true,
      data: products,
      message: "Successfully retrieved products.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve products, Try again",
    });
  }
};

export const getSingleProduct = async (req, res, next) => {
  const userId = req.user.id;
  const categoryId = req.params.categoryId;
  const subCategoryId = req.params.subCategoryId;
  const productId = req.params.productId;

  try {
    const [product] = await db.execute(
      `SELECT 
          products.id,
          products.food_name,
          products.food_description,
          products.avg_price,
          products.image
      FROM products
      WHERE sub_category_id = ? AND id = ?`,
      [subCategoryId, productId]
    );

    // console.log(product);
    const [prices] = await db.execute(
      `SELECT
          prices.id,
          prices.size,
          prices.price
      FROM prices
      WHERE prices.product_id = ?`,
      [productId]
    );

    const data = {
      ...product[0],
      prices: prices,
    };

    res.status(200).json({
      success: true,
      data: data,
      message: "Successfully retrieved products.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve products, Try again",
    });
  }
};


export const updateProduct = async (req, res, next) => {
  const userId = req.user.id;
  const categoryId = req.params.categoryId;
  const subCategoryId = req.params.subCategoryId;
  const productId = req.params.productId;
  const { name, description } = req.body;
  const prices = req.body.prices;
  // const product_img_path = (req.file && req.file.path) || null;
  let product_img_path = null;
  if(req.file && req.file.path){
    product_img_path = req.file.path;
  }

  console.log("files: ", req.files);
  console.log("body: ", req.body);

  try {
    if (!name || !description || !prices) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required data.",
      });
    }

    await db.execute(
      `UPDATE products
      SET 
        products.food_name = ?,
        products.food_description = ?
      WHERE products.id = ?`,
      [name, description, productId]
    );


    if (product_img_path) {
      const [product] = await db.execute(
        `SELECT image FROM products WHERE id = ?`,
        [productId]
      );

      console.log(product);
      const publicID = await extractPublicID(product[0].image || "");

      const result = await cloudinary.api.delete_resources([publicID || ""], {
        type: "upload",
        resource_type: "image",
      });

      const [product_img_url = ""] = (await uploader(product_img_path)) ?? [];
      
      console.log("product_img_url: ", product_img_url);

      if (product_img_url) {
        await db.execute("UPDATE products SET image = ? WHERE id = ?", [
          product_img_url,
          productId,
        ]);
      }
    }

    await db.execute(`DELETE FROM prices WHERE product_id = ?`, [productId]);

    let total_price = 0,
      avg_price = 0;
    let price_arr_length = prices.length;

    for (let price of prices) {
      total_price += price.price;
      await db.execute(
        `INSERT INTO prices(product_id, size, price) VALUES (?, ?, ?)`,
        [productId, price.size, price.price]
      );
    }

    avg_price = (total_price / price_arr_length).toFixed(2);
    await db.execute(`UPDATE products SET avg_price = ? WHERE id = ?`, [
      avg_price,
      productId,
    ]);

    let [result] = await db.execute(
      `SELECT avg(prices.price) as avg_price
      FROM products
      LEFT JOIN prices on products.id = prices.product_id
      WHERE products.user_id = ?`,
      [userId]
    );


    let costPerPlat = parseFloat(result[0].avg_price).toFixed(2);
    await db.execute(
      `UPDATE userDetails SET cost_per_plat = ? WHERE user_id = ?`,
      [costPerPlat, userId]
    );


  
    res.status(200).json({
      success: true,
      message: "Successfully updated product.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to updated product, Try again",
    });
  }
};


export const deleteProduct = async (req, res, next) => {
  const subCategoryId = req.params.subCategoryId;
  const categoryId = req.params.categoryId;
  const productId = req.params.productId;

  try {
    // await db.beginTransaction();

    await db.execute(`DELETE FROM prices WHERE product_id = ?`, [productId]);

    await db.execute(
      `DELETE FROM products WHERE sub_category_id = ? AND id = ?`,
      [subCategoryId, productId]
    );

    // Commit the transaction
    // await db.commit();

    res.status(200).json({
      success: true,
      message: "Products deleted successfully.",
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
    // await db.rollback();

    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete products. Try again.",
    });
  }
};
