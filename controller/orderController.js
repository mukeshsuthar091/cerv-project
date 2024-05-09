import db from "../db/database.js";

export const getOrders = async (req, res, next) => {
    const status = req.query.status;
    const userId = req.user.id;

    // console.log(status, userId);

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

        let orders, orderItems, data;

        if (status === "current") {
            let sql = `SELECT *
                FROM orders
                WHERE orders.user_id = ?
                AND orders.status IN ('PENDING', 'ACCEPTED', 'PACKED', 'SHIPPED')`;
            let values = [userId];

            [orders] = await db.execute(sql, values);

            sql = `SELECT * FROM order_items
                WHERE order_items.order_id = ?
                AND order_items.status IN ('PENDING', 'ACCEPTED', 'PACKED', 'SHIPPED')`;
            values = [orders[0].id];

            [orderItems] = await db.execute(sql, values);

            data = {
                ...orders[0],
                orderItems: orderItems,
            };

            console.log("order_items", data);
        } else if (status === "past") {
            let sql = `SELECT *
                FROM orders
                WHERE orders.user_id = ?
                AND orders.status IN ('REJECTED', 'CANCELLED', 'DELIVERED')`;
            let values = [userId];

            [orders] = await db.execute(sql, values);

            sql = `SELECT * FROM order_items
                WHERE order_items.order_id = ?
                AND order_items.status IN ('REJECTED', 'CANCELLED', 'DELIVERED')`;
            values = [orders[0].id];

            [orderItems] = await db.execute(sql, values);

            data = {
                ...orders[0],
                orderItems: orderItems,
            };

            console.log("order_items", data);
        }

        res.status(201).json({
            success: true,
            message: "Get order succeed.",
            data: data,
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

        if(!order){
            return res.status(404).json({
                success: false,
                message: 'No order data found!',
            })
        }

        if(order[0].status === 'CANCELLED'){
            return res.status(404).json({
                success: false,
                message: 'Order is already cancelled!',
            })
        }

        await db.execute(`UPDATE orders SET status = ? WHERE id = ?`, ['CANCELLED', orderId]);

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


export const postReview = async (req, res, next)=>{
    const userId = req.user.id;
    const { catererId, rate, message } = req.body;

    try {

        if (!catererId || !rate || !message){
            return res.status(400).json({
                success: false,
                message:
                    "Please ensure that required fields are supplied correctly!",
            });
        }

        
        const [catererDetail] = await db.execute(`SELECT * FROM userDetails WHERE user_id = ?`, [catererId]); 

        if(!catererDetail){
            return res.status(404).json({
                success: false,
                message: 'No order data found!',
            })
        }
        
        let rate_count = catererDetail[0].rate_count;
        let rate_avg = catererDetail[0].rate_avg;

        const avg_rate = (rate + (rate_avg * rate_count)) / (rate_count + 1);

        await db.execute(
                `INSERT INTO reviews (user_id, caterer_id, rate, message) VALUES (?, ?, ?, ?)`,
                [userId, catererId, rate, message]
            );
            
        rate_avg = avg_rate.toFixed(2);
        rate_count += 1;

        await db.execute(
                `UPDATE userDetails SET rate_avg = ?, rate_count = ? WHERE user_id = ?`,
                [rate_avg, rate_count, catererId]
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
}

