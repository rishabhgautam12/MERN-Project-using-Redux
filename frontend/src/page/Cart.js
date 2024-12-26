import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CartProduct from "../component/CartProduct";
import emptyCartImage from "../assest/empty.gif";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const productCartItem = useSelector((state) => state.product.cartItem);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );
  const totalQty = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  );

  // Fetch user addresses from the backend
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?._id) {
        console.log("No user ID found, skipping fetch.");
        return;
      }

      try {
        console.log(`Fetching addresses for user ID: ${user._id}`);

        const res = await fetch(
          `${process.env.REACT_APP_SERVER_DOMIN}/get-addresses/${user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          // If response status is not OK, log the status and throw error
          console.error("Error fetching addresses, status:", res.status);
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch addresses");
        }

        const addressData = await res.json();
        console.log("Address Data:", addressData); // Check the response format

        if (Array.isArray(addressData)) {
          setAddresses(addressData); // Set the addresses if they are in array format
          setSelectedAddress(addressData[0] || null);
          // Select first address by default
        } else {
          console.error("Invalid address data format:", addressData);
          throw new Error("Invalid address data format.");
        }
      } catch (err) {
        console.error("Error in fetching addresses:", err);
        toast.error(
          err.message || "An error occurred while fetching addresses."
        );
      }
    };

    fetchAddresses();
  }, [user]); // Trigger when the user changes
  // Run effect when user changes (e.g., login)

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select or add an address.");
      return;
    }

    if (user.email) {
      const stripePromise = await loadStripe(
        process.env.REACT_APP_STRIPE_PUBLIC_KEY
      );
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/checkout-payment`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            items: productCartItem,
            address: selectedAddress,
          }),
        }
      );
      if (res.statusCode === 500) return;

      const { paymentStatus,sessionId } = await res.json();

    if (!sessionId) {
      throw new Error("Failed to create Stripe session.");
    }

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.error("Stripe Checkout Error:", error.message);
    }
    } else {
      toast.error("You are not logged in!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <>
      <div className="p-2 md:p-4">
        <h2 className="text-lg md:text-2xl font-bold text-slate-600">
          Your Cart Items
        </h2>

        {productCartItem[0] ? (
          <div className="my-4 flex gap-3">
            {/* Display the cart items */}
            <div className="w-full max-w-3xl ">
              {productCartItem.map((el) => (
                <CartProduct
                  key={el._id}
                  id={el._id}
                  name={el.name}
                  image={el.image}
                  category={el.category}
                  qty={el.qty}
                  total={el.total}
                  price={el.price}
                />
              ))}
            </div>

            {/* Address Section */}
            <div className="w-full max-w-md">
              <h2 className="bg-blue-500 text-white p-2 text-lg">
                Select Address
              </h2>
              {addresses.length > 0 ? (
                <>
                  <div className="my-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border p-3 rounded-md mb-3 cursor-pointer ${
                          selectedAddress?._id === address._id
                            ? "bg-blue-100 border-blue-500"
                            : ""
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <p>{address.name}</p>
                        <p>Mob:{address.phone}</p>
                        <p>Flat no:{address.flat_no}</p>
                        <p>
                          Floor no:{address.floor_no}, 
                          {address.building} - {address.colony}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    onClick={() => navigate("/manage-addresses")}
                  >
                    Manage Addresses
                  </button>
                </>
              ) : (
                <div className="my-3 text-center">
                  <p className="text-slate-500">No address found!</p>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/manage-addresses")}
                  >
                    Add Address
                  </button>
                </div>
              )}
            </div>

            {/* Total Summary */}
            <div className="w-full max-w-md ml-auto">
              <h2 className="bg-blue-500 text-white p-2 text-lg">Summary</h2>
              <div className="flex w-full py-2 text-lg border-b">
                <p>Total Qty :</p>
                <p className="ml-auto w-32 font-bold">{totalQty}</p>
              </div>
              <div className="flex w-full py-2 text-lg border-b">
                <p>Total Price</p>
                <p className="ml-auto w-32 font-bold">
                  <span className="text-red-500">₹</span> {totalPrice}
                </p>
              </div>
              <button
                className="bg-red-500 w-full text-lg font-bold py-2 text-white"
                onClick={handlePayment}
              >
                Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center items-center flex-col">
            <img src={emptyCartImage} className="w-full max-w-sm" />
            <p className="text-slate-500 text-3xl font-bold">Empty Cart</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
