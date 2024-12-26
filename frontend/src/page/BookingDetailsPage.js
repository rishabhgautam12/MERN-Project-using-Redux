import React, { useEffect, useState } from "react";
import axios from "axios";

const BookingDetailsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_DOMIN}/admin/bookings`);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center">Loading bookings...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Booking Details</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-200 w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Booking ID</th>
                <th className="border border-gray-300 px-4 py-2">User</th>
                <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                <th className="border border-gray-300 px-4 py-2">Payment Status</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">Items</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{booking._id}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.userId} 
                  </td>
                  <td className="border border-gray-300 px-4 py-2">₹{booking.totalAmount}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.paymentStatus}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.address.name}, {booking.address.phone},{" "}
                    Flat no:{booking.address.flat_no}, Floor no:{booking.address.floor_no},{" "}
                    {booking.address.building}, {booking.address.colony},{" "}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul>
                      {booking.cartItems.map((item, index) => (
                        <li key={index}>
                          {item.name} - Qty: {item.qty} - ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsPage;
