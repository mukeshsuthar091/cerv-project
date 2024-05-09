import db from "../db/database.js";

export const getOrders = async (req, res, next) => {
    const status = req.query.status;
    const userId = req.user.id;
    const role = req.user.role;

    // console.log(status, userId, role);

    try {
        if (!status) {
            return res.status(400).json({
                success: false,
                message:
                    "Please ensure that required fields are supplied correctly!",
            });
        }

        if (status !== "current" && status !== "past") {
            return res.status(400).json({
                success: false,
                message:
                    "Please ensure that required fields are supplied correctly!",
            });
        }

        let orders, data;

        if (status === "current") {

            if (role == 2) {

                [orders] = await db.execute(
                    `SELECT 
                        o.*, 
                        (SELECT 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', u.id,
                                    'name', u.name,
                                    'image', u.image,
                                    'address', ud.address
                                )
                            )
                        FROM 
                            users u
                        LEFT JOIN 
                            userDetails ud ON ud.user_id = u.id
                        WHERE 
                            u.id = o.caterer_id
                        ) AS catererInfo,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', ot.id,
                                'quantity', ot.quantity,
                                'order_id', ot.order_id,
                                'food_name', p.food_name,
                                'food_description', p.food_description,
                                'size', ot.size,
                                'price', ot.price,
                                'image', p.image,
                                'created_at', ot.created_at,
                                'updated_at', ot.updated_at
                            )
                        ) AS order_items
                    FROM 
                        orders o
                    LEFT JOIN 
                        order_items ot ON ot.order_id = o.id
                    LEFT JOIN 
                        products p ON p.id = ot.product_id
                    WHERE 
                        o.user_id = ?
                        AND o.status IN ('PENDING', 'ACCEPTED', 'PACKED', 'SHIPPED')
                    GROUP BY 
                        o.id, o.status`, [userId]
                )

                // data = orders;

            } else if (role == 1) {

                [orders] = await db.execute(
                    `SELECT 
                        o.*, 
                        (SELECT 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', u.id,
                                    'name', u.name,
                                    'image', u.image,
                                    'label', a.label,
                                    'address', a.address
                                )
                            )
                        FROM 
                            users u
                        LEFT JOIN 
                            addresses a ON a.id = o.address_id
                        WHERE 
                            u.id = o.user_id
                        ) AS userInfo,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', ot.id,
                                'quantity', ot.quantity,
                                'order_id', ot.order_id,
                                'food_name', p.food_name,
                                'food_description', p.food_description,
                                'size', ot.size,
                                'price', ot.price,
                                'image', p.image,
                                'created_at', ot.created_at,
                                'updated_at', ot.updated_at
                            )
                        ) AS order_items
                    FROM 
                        orders o
                    LEFT JOIN 
                        order_items ot ON o.id = ot.order_id
                    LEFT JOIN 
                        products p ON p.id = ot.product_id
                    WHERE 
                        o.caterer_id = ?
                        AND o.status IN ('PENDING', 'ACCEPTED', 'PACKED', 'SHIPPED')
                    GROUP BY 
                        o.id, o.status`, [userId]
                )

                // data = orders;

            }

        } else if (status === "past") {
            if (role == 2) {

                [orders] = await db.execute(
                    `SELECT 
                        o.*, 
                        (SELECT 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', u.id,
                                    'name', u.name,
                                    'image', u.image,
                                    'address', ud.address
                                )
                            )
                        FROM 
                            users u
                        LEFT JOIN 
                            userDetails ud ON ud.user_id = u.id
                        WHERE 
                            u.id = o.caterer_id
                        ) AS catererInfo,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', ot.id,
                                'quantity', ot.quantity,
                                'order_id', ot.order_id,
                                'food_name', p.food_name,
                                'food_description', p.food_description,
                                'size', ot.size,
                                'price', ot.price,
                                'image', p.image,
                                'created_at', ot.created_at,
                                'updated_at', ot.updated_at
                            )
                        ) AS order_items
                    FROM 
                        orders o
                    LEFT JOIN 
                        order_items ot ON ot.order_id = o.id
                    LEFT JOIN 
                        products p ON p.id = ot.product_id
                    WHERE 
                        o.user_id = ?
                        AND o.status IN ('REJECTED', 'CANCELLED', 'DELIVERED')
                    GROUP BY 
                        o.id, o.status`, [userId]
                )

                // data = orders;

            } else if (role == 1) {

                [orders] = await db.execute(
                    `SELECT 
                        o.*, 
                        (SELECT 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', u.id,
                                    'name', u.name,
                                    'image', u.image,
                                    'label', a.label,
                                    'address', a.address
                                )
                            )
                        FROM 
                            users u
                        LEFT JOIN 
                            addresses a ON a.id = o.address_id
                        WHERE 
                            u.id = o.user_id
                        ) AS userInfo,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', ot.id,
                                'quantity', ot.quantity,
                                'order_id', ot.order_id,
                                'food_name', p.food_name,
                                'food_description', p.food_description,
                                'size', ot.size,
                                'price', ot.price,
                                'image', p.image,
                                'created_at', ot.created_at,
                                'updated_at', ot.updated_at
                            )
                        ) AS order_items
                    FROM 
                        orders o
                    LEFT JOIN 
                        order_items ot ON o.id = ot.order_id
                    LEFT JOIN 
                        products p ON p.id = ot.product_id
                    WHERE 
                        o.caterer_id = ?
                        AND o.status IN ('REJECTED', 'CANCELLED', 'DELIVERED')
                    GROUP BY 
                        o.id, o.status`, [userId]
                )

                // data = orders;
            }

        }

        res.status(201).json({
            success: true,
            message: "Get order succeed.",
            data: orders,
        });
    } catch (error) {
        res.status(error.status_code || 500).json({
            success: false,
            error: error.message,
            message: "Some thing went wrong!",
        });
    }
};

export const cancelOrder = async (req, res, next) => {
    const orderId = req.body.orderId;

    try {
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message:
                    "Please ensure that required fields are supplied correctly!",
            });
        }

        let sql = `
                SELECT 
                    o.id,
                    o.caterer_id,
                    o.address_id,
                    o.status,
                    o.order_type,
                    o.payment_method,
                    o.service_charge,
                    o.delivery_fee,
                    o.promo_discount,
                    o.subtotal,
                    o.tax_charge,
                    o.total_amount,
                    o.delivery_datetime,
                    o.created_at,
                    o.updated_at,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', p.id,
                            'type', p.type,
                            'transaction_id', p.transaction_id,
                            'paymentIntent', p.paymentIntent,
                            'client_secret', p.client_secret,
                            'ephemeral_key', p.ephemeral_key,
                            'customer_id', p.customer_id, 
                            'amount', p.amount, 
                            'charge', p.charge, 
                            'status', p.status, 
                            'createdAt', p.createdAt, 
                            'updatedAt', p.updatedAt
                            ) 
                    ) AS payments
            FROM orders o
            LEFT JOIN payments p ON p.orderId = o.id
            WHERE o.id = ?
            GROUP BY o.id`;

        const [order] = await db.execute(sql, [orderId]);

        console.log("order: ", order[0].status);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No order data found!",
            });
        }

        if (order[0].status === "CANCELLED") {
            return res.status(404).json({
                success: false,
                message: "Order is already cancelled!",
            });
        }

        await db.execute(`UPDATE orders SET status = ? WHERE id = ?`, [
            "CANCELLED",
            orderId,
        ]);

        await db.execute(`UPDATE orders SET status = ? WHERE id = ?`, [
            "CANCELLED",
            orderId,
        ]);

        res.status(201).json({
            success: true,
            message: "Get order succeed.",
            data: order[0],
        });
    } catch (error) {
        res.status(error.status_code || 500).json({
            success: false,
            error: error.message,
            message: "Some thing went wrong!",
        });
    }
};

export const postReview = async (req, res, next) => {
    const userId = req.user.id;
    const { orderId, rate, message } = req.body;

    try {
        if (!orderId || !rate || !message) {
            return res.status(400).json({
                success: false,
                message:
                    "Please ensure that required fields are supplied correctly!",
            });
        }

        const [order] = await db.execute(
            `
            SELECT *
            FROM orders
            WHERE orders.id = ?`,
            [orderId]
        );

        const [catererDetail] = await db.execute(
            `SELECT * FROM userDetails WHERE user_id = ?`,
            [order[0].caterer_id]
        );

        if (!catererDetail) {
            return res.status(404).json({
                success: false,
                message: "No order data found!",
            });
        }

        let rate_count = catererDetail[0].rate_count;
        let rate_avg = catererDetail[0].rate_avg;

        const avg_rate = (rate + rate_avg * rate_count) / (rate_count + 1);

        await db.execute(
            `UPDATE orders SET rate = ?, rate_description = ? WHERE orders.id = ?`,
            [rate, message, orderId]
        );

        rate_avg = avg_rate.toFixed(2);
        rate_count += 1;

        await db.execute(
            `UPDATE userDetails SET rate_avg = ?, rate_count = ? WHERE user_id = ?`,
            [rate_avg, rate_count, order[0].caterer_id]
        );

        res.status(201).json({
            success: true,
            message: "Post review succeed.",
        });
    } catch (error) {
        res.status(error.status_code || 500).json({
            success: false,
            error: error.message,
            message: "Some thing went wrong!",
        });
    }
};

export const acceptOrder = async (req, res, next) => {
    const userId = req.user.id;
};
