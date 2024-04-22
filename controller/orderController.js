import db from "../db/database.js";

export const createOrder = async (req, res, next) => {
  const userId = req.user.id;
  const orderDetails = req.body;
  const products = req.body.products;

  try {
    console.log(userId);
    console.log(orderDetails);
    console.log(products);

    let p_total = 0,
      sub_total = 0,
      total = 0;

    for (let product of products) {
      p_total = (product.quantity*product.price) + product.discount;
      sub_total += p_total;
      // console.log(p_total)
      
    }
    // console.log(sub_total);

    res.status(200).json({
      success: true,
      data: orderDetails,
      message: "Your order Successfully created.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create order, Try again",
    });
  }
};
