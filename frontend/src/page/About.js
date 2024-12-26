import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();  // Hook to navigate to different pages

  const handleExploreClick = () => {
    navigate("/");  // Redirects to the Home page
  };

  return (
    <div className="p-2 md:p-4">
      {/* About Us Section */}
      <div className="text-center my-8">
        <h1 className="text-4xl md:text-6xl font-bold text-green-700">
          About <span className="text-red-500">Us</span>
        </h1>
        <p className="py-3 text-lg text-gray-700">
          Discover who we are and why we are committed to providing the freshest
          produce with the fastest delivery right to your home.
        </p>
      </div>

      {/* Our Mission Section */}
      <div className="bg-slate-300 p-4 md:p-8 rounded-lg my-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Our Mission
        </h2>
        <p className="py-2 text-base text-gray-700">
          At our core, we are dedicated to making healthy eating accessible,
          convenient, and affordable. Our mission is to ensure that every
          household has access to fresh fruits and vegetables without stepping
          out of their homes.
        </p>
      </div>

      {/* Why Choose Us Section */}
      <div className="my-8">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3443/3443357.png"
              alt="Fast Delivery"
              className="w-16 h-16 mx-auto"
            />
            <h3 className="text-xl font-semibold text-red-500 text-center mt-3">
              Fast Delivery
            </h3>
            <p className="text-gray-600 mt-2 text-center">
              Get your order delivered within hours, ensuring ultimate freshness.
            </p>
          </div>

          <div className="bg-white p-4 shadow-md rounded-lg">
            <img
              src="/fresh.png"
              alt="Fresh Produce"
              className="w-16 h-16 mx-auto"
            />
            <h3 className="text-xl font-semibold text-red-500 text-center mt-3">
              Freshness Guaranteed
            </h3>
            <p className="text-gray-600 mt-2 text-center">
              We source the best fruits and vegetables directly from farms.
            </p>
          </div>

          <div className="bg-white p-4 shadow-md rounded-lg">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2546/2546446.png"
              alt="Customer Support"
              className="w-16 h-16 mx-auto"
            />
            <h3 className="text-xl font-semibold text-red-500 text-center mt-3">
              24/7 Support
            </h3>
            <p className="text-gray-600 mt-2 text-center">
              Our dedicated team is here to assist you anytime, anywhere.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-slate-300 p-4 md:p-8 rounded-lg my-8">
        <h2 className="text-3xl font-bold text-slate-900">Meet the Team</h2>
        <div className="flex flex-wrap gap-5 justify-center mt-6">
          <div className="text-center">
            <img
              src="/rishabh.png"
              alt="Team Member"
              className="w-24 h-24 rounded-full mx-auto"
            />
            <p className="font-semibold text-lg mt-2"> Rishabh Gautam</p>
            <p className="text-gray-500 text-sm">Full-Stack Developer</p>
          </div>
          
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="text-center my-8">
        <h2 className="text-3xl font-bold text-green-700">Ready to Get Started?</h2>
        <p className="py-3 text-gray-700">
          Join us in the journey to make healthy eating convenient and enjoyable.
        </p>
        <button
          onClick={handleExploreClick}
          className="font-bold bg-red-500 text-slate-200 px-6 py-3 rounded-md"
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default About;
