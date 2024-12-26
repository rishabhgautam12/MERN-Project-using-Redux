import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "../redux/productSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CardFeature = ({ image, name, price, category, loading, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector((state) => state.user);

  const handleAddCartProduct = (e) => {
    if (user.email) {
      dispatch(
        addCartItem({
          _id: id,
          name: name,
          price: price,
          category: category,
          image: image,
        })
      );
    }
    else {
      toast("You have  not Login!");
      setTimeout(()=>{
        navigate("/login")

      },1000)
    }
  };

  return (
    <div className="w-full min-w-[200px] max-w-[200px] bg-white hover:shadow-lg drop-shadow pt-5 px-4 cursor-pointer flex flex-col">
      {image ? (
        <>
          <Link
            to={`/menu/${id}`}
            onClick={() => window.scrollTo({ top: "0", behavior: "smooth" })}
          >
            <div className="h-28 flex flex-col justify-center items-center">
              <img src={image} className="h-full" />
            </div>
            <h3 className="font-semibold text-slate-600 text-center capitalize text-lg mt-4 whitespace-nowrap overflow-hidden">
              {name}
            </h3>
            <p className="text-center text-slate-500  font-medium">
              {category}
            </p>
            <p className="text-center font-bold">
              <span className="text-red-500">₹</span>
              <span>{price}</span>
            </p>
          </Link>
          <button
            className="bg-yellow-500 py-1 my-2 rounded hover:bg-yellow-600 w-full"
            onClick={handleAddCartProduct}
          >
            Add Cart
          </button>
        </>
      ) : (
        <div className="min-h-[150px] flex justify-center items-center">
          <p>{loading}</p>
        </div>
      )}
    </div>
  );
};

export default CardFeature;
