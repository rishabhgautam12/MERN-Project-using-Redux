const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 5050;

//mongodb connection
//console.log(process.env.MONGODB_URL)
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connect to database"))
  .catch(() => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
  cart: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      image: String,
      name: String,
      price: Number,
      qty: Number,
      total: Number,
    },
  ],
  addresses: [
    {
      name: String, // e.g., "Home", "Work"
      flat_no: String,
      building: String,
      colony: String,
      floor_no: String,
      phone: String,
      isDefault: { type: Boolean, default: false },
    },
  ],
});

//model
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/add-address", async (req, res) => {
  const { userId, address } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (user) {
      if (address.isDefault) {
        // Set all other addresses to non-default
        user.addresses.forEach((addr) => (addr.isDefault = false));
      }
      user.addresses.push(address);
      await user.save();
      res.send({
        message: "Address added successfully",
        addresses: user.addresses,
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

app.put("/update-address/:userId/:addressId", async (req, res) => {
  const { userId, addressId } = req.params;
  const { updatedAddress } = req.body; // The updated address data from the request body

  try {
    // Step 1: Find the user by userId
    const user = await userModel.findById(userId);

    // If user not found, return an error
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Step 2: Find the specific address using the addressId from the user's addresses array
    const address = user.addresses.id(addressId); // Mongoose method to get the subdocument by addressId

    // If the address is not found, return an error
    if (!address) {
      return res.status(404).send({ message: "Address not found" });
    }

    // Step 3: Update the address fields individually (Direct assignment)
    if (updatedAddress.name) address.name = updatedAddress.name;
    if (updatedAddress.phone) address.phone = updatedAddress.phone;
    if (updatedAddress.flat_no) address.flat_no = updatedAddress.flat_no;
    if (updatedAddress.floor_no) address.floor_no = updatedAddress.floor_no;
    if (updatedAddress.building) address.building = updatedAddress.building;
    if (updatedAddress.colony) address.colony = updatedAddress.colony;
    if (updatedAddress.isDefault !== undefined)
      address.isDefault = updatedAddress.isDefault;

    // Optionally, handle the 'isDefault' field:
    if (updatedAddress.isDefault) {
      // If the address being updated is marked as the default, reset the 'isDefault' flag for other addresses
      user.addresses.forEach((addr) => {
        if (addr._id.toString() !== addressId) addr.isDefault = false;
      });
    }

    // Step 4: Save the updated user document to the database
    await user.save();

    // Step 5: Return the updated addresses array to the client
    res.send({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    console.error("Error updating address:", err);
    res
      .status(500)
      .send({ message: "An error occurred while updating the address" });
  }
});

app.post("/delete-address", async (req, res) => {
  const { userId, addressId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (user) {
      user.addresses = user.addresses.filter(
        (addr) => addr._id.toString() !== addressId
      );
      await user.save();
      res.send({
        message: "Address deleted successfully",
        addresses: user.addresses,
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

app.get("/get-addresses/:userId", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (user) {
      console.log(user.addresses);

      res.send(user.addresses);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//signup api
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: email });

    if (result) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const data = new userModel(req.body);
      await data.save();
      res.send({ message: "Successfully signed up", alert: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//login api
const validator = require("validator");
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate email and password
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .send({ message: "Invalid email format", alert: false });
    }
    const result = await userModel.findOne({ email: email });

    if (result) {
      const isPasswordCorrect = password === result.password;
      if (isPasswordCorrect) {
        const dataSend = {
          _id: result._id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,

          image: result.image,
        };
        console.log(dataSend);
        res.send({
          message: "login is successfully",
          alert: true,
          data: dataSend,
        });
      } else {
        res.status(401).send({ message: "Invalid password", alert: false });
      }
    } else {
      const data = new userModel(req.body);
      await data.save();
      res.send({
        message: "Email is not available, Please signup",
        alert: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//product section
const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product", schemaProduct);

//save product in database
//api
app.post("/uploadProduct", async (req, res) => {
  console.log(req.body);
  const data = productModel(req.body);
  const datasave = await data.save();
  res.send({ message: "upload successfully" });
});

//
app.get("/product", async (req, res) => {
  const data = await productModel.find({});
  res.send(JSON.stringify(data));
});

app.post("/update-cart", async (req, res) => {
  const { userId, cart } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (user) {
      user.cart = cart;
      await user.save();
      res.send({ message: "Cart updated successfully", cart: user.cart });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

app.get("/get-cart/:userId", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (user) {
      res.send(user.cart);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    name: String,
    phone: String,
    flat_no: String,
    floor_no: String,
    building: String,
    colony: String,
  },
  cartItems: [
    {
      name: String,
      price: Number,
      qty: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("booking", bookingSchema);

/******payment get way */
console.log(process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.post("/checkout-payment", async (req, res) => {
  const { userId, items, address } = req.body; // Destructure the request body

  try {
    // Calculate total amount
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    if (totalAmount < 50) {
      return res
        .status(400)
        .json({ message: "Total amount must be at least ₹50" });
    }

    // Stripe parameters for the session
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: "shr_1QTJpsFxlzMy7kYbOi6UszOK" }],
      line_items: items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.qty,
      })),
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    // Create Stripe session
    const session = await stripe.checkout.sessions.create(params);

    // Save booking in database
    const booking = new Booking({
      userId,
      cartItems: items,
      address,
      totalAmount,
      paymentStatus: "completed", // Set to "pending" initially
    });

    await booking.save();

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = []; // Clear the cart array
    await user.save();

    // Respond with the Stripe session ID
    res.status(200).json({ 
      paymentStatus: "completed", sessionId: session.id });
  } catch (err) {
    console.error("Error in /checkout-payment:", err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
});

app.get("/admin/bookings", async (req, res) => {
  try {
    // Fetch bookings and populate user details
    const bookings = await Booking.find({});

    if (!bookings) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings); // Send bookings to the frontend
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

//server is running
app.listen(PORT)
  .then(() => console.log(`Server running on ${PORT}`))
  .catch((err) => console.error(err));

