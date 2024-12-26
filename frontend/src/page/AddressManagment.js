import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const AddressManagement = () => {
  const user = useSelector((state) => state.user);
  const [addresses, setAddresses] = useState([]);
  const [addressID,setAddressId] = useState()
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    flat_no: "",
    floor_no: "",
    building: "",
    colony: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setFormState({
      name: "",
      phone: "",
      flat_no: "",
      floor_no: "",
      building: "",
      colony: "",
    });
    setIsEditing(false);
  };

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
        } else {
          console.error("Invalid address data format:", addressData);
          throw new Error("Invalid address data format.");
        }
      } catch (err) {
        console.error("Error in fetching addresses:", err);
        toast.error(err.message || "An error occurred while fetching addresses.");
      }
    };
  
    fetchAddresses();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleAddAddress = async () => {
    // Check if all fields are filled
    if (Object.values(formState).some((field) => !field)) {
      toast.error("Please fill out all fields.");
      return;
    }

    // Phone validation: Check if the phone field is valid
    const phoneRegex = /^[0-9]{10}$/; // Assumes a 10-digit phone number
    if (!phoneRegex.test(formState.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/add-address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id, address: formState }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses);
        toast.success("Address added!");
        resetForm(); // Reset the form after successful add
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to add address.");
    }
  };

  
  const handleUpdateAddress = async () => {
    // Check if all fields are filled
    if (Object.values(formState).some((field) => !field)) {
      toast.error("Please fill out all fields.");
      return;
    }

     // Phone validation: Check if the phone field is valid
     const phoneRegex = /^[0-9]{10}$/; // Assumes a 10-digit phone number
     if (!phoneRegex.test(formState.phone)) {
       toast.error("Please enter a valid 10-digit phone number.");
       return;
     }
  
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/update-address/${user._id}/${addressID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,  // Send the userId along with the address data
            updatedAddress: formState, // Send the address data directly
          }),
        }
      );
  
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses);
        toast.success("Address updated!");
        resetForm(); // Reset the form after successful update
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update address.");
    }
  };
  
  

  const handleEditAddress = (address) => {
    setAddressId(address._id);
    setFormState({
      name: address.name || "",
      phone: address.phone || "",
      flat_no: address.flat_no || "",
      floor_no: address.floor_no || "",
      building: address.building || "",
      colony: address.colony || "",
    });
    setIsEditing(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/delete-address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, addressId }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses);
        toast.success("Address deleted!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to delete address.");
    }
  };
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Addresses</h2>
      <div className="mb-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="border p-3 rounded-md mb-3 flex justify-between items-center"
          >
            <div>
              <p>{address.name}</p>
              <p>Mob:{address.phone}</p>
              <p>Flat no:{address.flat_no}</p>
              <p>
                Floor no:{address.floor_no}, {address.building} - {address.colony}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                onClick={() => handleEditAddress(address)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => handleDeleteAddress(address._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-bold mb-2">
        {isEditing ? "Edit Address" : "Add New Address"}
      </h3>
      <form className="grid gap-3 max-w-md">
        {isEditing && 
        <input
        type="hidden"
        name="_id"
        value={addressID}
        placeholder="ID"
        className="border p-2 rounded"
      />}
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          value={formState.phone}
          onChange={handleInputChange}
          placeholder="Phone Number"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="flat_no"
          value={formState.flat_no}
          onChange={handleInputChange}
          placeholder="Flat No"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="floor_no"
          value={formState.floor_no}
          onChange={handleInputChange}
          placeholder="Floor No"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="building"
          value={formState.building}
          onChange={handleInputChange}
          placeholder="Building"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="colony"
          value={formState.colony}
          onChange={handleInputChange}
          placeholder="Colony"
          className="border p-2 rounded"
        />
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={isEditing ? handleUpdateAddress : handleAddAddress}
        >
          {isEditing ? "Update Address" : "Add Address"}
        </button>
      </form>
    </div>
  );
};

export default AddressManagement;
