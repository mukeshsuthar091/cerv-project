import joiPkg from "joi";
const { ValidationError } = joiPkg;

import db from "../db/database.js";

//  ----------------------

export const getAllCaterer = async (req, res, next) => {
  try {
    const [caterers] = await db.execute(`
    SELECT
      users.id,
      users.image,
      users.name,
      users.email,
      userDetails.address,
      COALESCE(ROUND(avg(ratings.rating_value), 1), 0) AS rating,
      userDetails.cost_per_plat
    FROM
        users
    LEFT JOIN
        ratings ON users.id = ratings.user_id
    LEFT JOIN
        userDetails ON users.id = userDetails.user_id
    WHERE
        users.role = 1
    GROUP BY
        users.id, users.name, users.email, userDetails.address`);

    console.log(caterers);

    res.status(200).json({
      success: true,
      data: caterers,
      message: "Successfully retrieved caterer's data",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve caterer's data",
    });
  }
};

export const getSingleCaterer = async (req, res, next) => {
  const catererId = req.params.catererId;

  try {
    const [catererDetails] = await db.execute(
      `SELECT
          users.id,
          users.image,
          users.name, 
          users.email, 
          userDetails.address, 
          COALESCE(ROUND(avg(ratings.rating_value), 1), 0) AS rating,
          userDetails.bio, 
          userDetails.food_category, 
          userDetails.order_type
      FROM
          users
      LEFT JOIN
          ratings ON users.id = ratings.user_id
      LEFT JOIN
          userDetails ON users.id = userDetails.user_id
      WHERE 
          users.role = 1 AND users.id = ?
      GROUP BY 
          users.id`,
      [catererId]
    );


    const [categories] = await db.execute(
      `SELECT 
      categories.id, 
      categories.name 
      FROM categories
      WHERE categories.user_id = ?`,
      [catererId]
    );

    const newData = {
      ...catererDetails[0],
      rating: parseFloat(catererDetails[0].rating),
      food_types: categories,
    };

    console.log(newData);

    res.status(200).json({
      success: true,
      data: newData,
      message: "Successfully retrieved caterer's data",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve caterer's data",
    });
  }
};

export const getAllSubCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  // console.log(categoryId)

  try {
    const [subCategories] = await db.execute(
      `SELECT sub_categories.id AS sub_category_id,
          sub_categories.name AS sub_category_name,
          COUNT(products.id) AS product_count
      FROM sub_categories
      LEFT JOIN 
          products ON sub_categories.id = products.sub_category_id
      WHERE 
          sub_categories.category_id = ?
      GROUP BY 
          sub_categories.id, sub_categories.name`,
      [categoryId]
    );

    // console.log(subCategories);

    res.status(200).json({
      success: true,
      data: subCategories,
      message: "Successfully retrieved caterer's data",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve sub-categories.",
    });
  }
};

export const getAllProducts = async (req, res, next) => {
  const subCategoryId = req.params.subCategoryId;
  console.log(subCategoryId);

  try {
    const [products] = await db.execute(
      `SELECT id, food_name, food_description
      FROM products
      WHERE sub_category_id = ?`,
      [subCategoryId]
    );

    const productsWithPrices = [];

    for (let product of products) {
      const [prices] = await db.execute(
        `SELECT id, size, price
        FROM prices
        WHERE product_id = ?;`,
        [product.id]
      );

      productsWithPrices.push({ ...product, prices: [...prices] });
    }

    console.log(JSON.stringify(productsWithPrices, null, 2));

    res.status(200).json({
      success: true,
      data: productsWithPrices,
      message: "Successfully retrieved product with prices.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve products.",
    });
  }
};
