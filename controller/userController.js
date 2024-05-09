import joiPkg from "joi";
const { ValidationError } = joiPkg;

import db from "../db/database.js";

//  ----------------------

export const getAllCaterer = async (req, res, next) => {
    try {
        const [caterers] = await db.execute(`
    SELECT
      u.id,
      u.image,
      u.name,
      u.email,
      ud.address,
      ud.rate_avg,
      ud.rate_count,
      ud.cost_per_plat
    FROM
        users u
    LEFT JOIN
        userDetails ud ON u.id = ud.user_id
    WHERE
        u.role = 1`);

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
      u.id,
      u.image,
      u.name,
      u.email,
      ud.address,
      ud.rate_avg,
      ud.rate_count,
      ud.cost_per_plat
    FROM
        users u
    LEFT JOIN
        userDetails ud ON u.id = ud.user_id
    WHERE
        u.role = 1 AND u.id = ?`,
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
            `SELECT 
                sc.id,
                sc.name,
                COUNT(p.id) AS product_count,
                sc.created_at,
                sc.updated_at,
                JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', p.id,
                            'image', p.image,
                            'food_name', p.food_name,
                            'food_description', p.food_description,
                            'size', ps.size,
                            'price', ps.price,
                            'created_at', p.created_at,
                            'updated_at', p.updated_at
                        )
                    )
                AS products
            FROM 
                sub_categories sc
            LEFT JOIN 
                products p ON sc.id = p.sub_category_id
            LEFT JOIN 
                prices ps ON ps.product_id = p.id
            WHERE 
                sc.category_id = ?
            GROUP BY 
                sc.id, sc.name, sc.created_at, sc.updated_at`,
            [categoryId]
        );

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
            `SELECT id, image, food_name, food_description
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

export const checkout = async (req, res, next) => {
    const userId = req.user.id;
    const payload = req.body;

    try {
        // console.log(payload);

        if (
            !payload.catererId ||
            !payload.addressId ||
            !payload.status ||
            !payload.order_type ||
            !payload.payment_method ||
            !payload.service_charge ||
            !payload.delivery_fee ||
            !payload.subtotal ||
            !payload.tax_charge ||
            !payload.total_amount ||
            !payload.delivery_datetime ||
            payload.order_items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please ensure that required fields are supplied correctly!",
            });
        }
        // console.log("Error: ", payload);

        if (
            payload.payment_method !== "COD" &&
            payload.payment_method !== "ONLINE"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please ensure that payment_methods are supplied correctly!",
            });
        }

        if (
            (payload.promo_discount && !payload.couponId) ||
            (!payload.promo_discount && payload.couponId)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please ensure that required fields are supplied correctly!",
            });
        }

        if (!payload.promo_discount && !payload.couponId) {
            payload.promo_discount = "";
            payload.couponId = "";
        }

        let hasData = true;
        payload.order_items.map((item) => {
            if (!item.quantity || !item.productId) {
                return (hasData = false);
            }
        });

        if (hasData === false) {
            return res.status(400).json({
                success: false,
                message:
                    "Please ensure that required fields are supplied correctly!",
            });
        }

        const {
            catererId,
            couponId,
            addressId,
            status,
            order_type,
            payment_method,
            service_charge,
            delivery_fee,
            promo_discount,
            subtotal,
            tax_charge,
            total_amount,
            delivery_datetime,
        } = payload;

        const sql =
            "INSERT INTO orders(user_id, caterer_id, coupon_id, address_id, status, order_type, payment_method, service_charge, delivery_fee, promo_discount, subtotal, tax_charge, total_amount, delivery_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const values = [
            userId,
            catererId,
            couponId,
            addressId,
            status,
            order_type,
            payment_method,
            service_charge,
            delivery_fee,
            promo_discount,
            subtotal,
            tax_charge,
            total_amount,
            delivery_datetime,
        ];

        const order = await db.execute(sql, values);

        for (let item of payload.order_items) {
            const sql =
                "INSERT INTO order_items(quantity, order_id, product_id) VALUES (?, ?, ?)";
            const values = [item.quantity, order[0].insertId, item.productId];

            await db.execute(sql, values);
        }

        res.status(200).json({
            success: true,
            message: "Order created successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong!",
        });
    }
};
