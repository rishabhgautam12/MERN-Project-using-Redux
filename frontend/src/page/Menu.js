import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AllProduct from '../component/AllProduct'
import { addCartItem } from '../redux/productSlice'
import toast from "react-hot-toast";

const Menu = () => {
  const {filterby} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const productData = useSelector(state => state.product.productList)
  const user = useSelector((state) => state.user);

  
  const productDisplay = productData.filter(el => el._id === filterby)[0]
  console.log(productDisplay)

  const handleAddCartProduct = () => {
    if (user.email) {
      dispatch(
        addCartItem({
          _id:productDisplay.id,
          name: productDisplay.name,
          price: productDisplay.price,
          category: productDisplay.category,
          image: productDisplay.image,
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

  const handleBuy = ()=>{
    if (user.email) {
      dispatch(
        addCartItem({
          _id:productDisplay.id,
          name: productDisplay.name,
          price: productDisplay.price,
          category: productDisplay.category,
          image: productDisplay.image,
        })
      );
      navigate("/cart")
    }
    else {
      toast("You have  not Login!");
      setTimeout(()=>{
        navigate("/login")

      },1000)
    }
  }

  return (
    <div className='p-2 md:p-4'>
      <div className='w-full max-w-3xl m-auto md:flex bg-white'>
        <div className='max-w-sm overflow-hidden w-full p-5'>
          <img src={productDisplay.image}  className='hover:scale-105 transition-all h-full'/>
        </div>
        <div className='flex flex-col gap-1'>
        <h3 className='font-semibold text-slate-600 capitalize text-2xl md:text-4xl'>{productDisplay.name}</h3>
        <p className=" text-slate-500  font-medium text-2xl">{productDisplay.category}</p>
        <p className=" font-bold md:text-2xl">
            <span className="text-red-500">₹</span>
            <span>{productDisplay.price}</span>
          </p>
          <div className='flex gap-3'>
          <button className='bg-yellow-500 py-1 my-2 rounded hover:bg-yellow-600 min-w-[100px]' onClick={handleBuy}>Buy</button>
          <button className='bg-yellow-500 py-1 my-2 rounded hover:bg-yellow-600 min-w-[100px]' onClick={handleAddCartProduct}>Add Cart</button>
          </div>
          <div className=''>
            <p className='text-slate-600 font-medium'>Description :</p>
            <p>{productDisplay.description}</p>
          </div>
        </div>

      </div>

      <AllProduct heading={"Related Product"} />
    </div>
  )
}

export default Menu