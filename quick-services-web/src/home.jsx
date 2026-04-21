import React from "react";
import { FaCar, FaMotorcycle, FaBus, FaSearch } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-2 rounded-full">
            <FaCar />
          </div>
          <h1 className="font-bold text-lg">Quick Services</h1>
        </div>

        <ul className="flex gap-8 text-gray-600 font-medium">
          <li className="text-black border-b-2 border-black">Home</li>
          <li>Vehicles</li>
          <li>Bookings</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>

        <button className="border px-4 py-2 rounded-full">
          Login / Signup
        </button>
      </nav>

      {/* Hero Section */}
      <div className="px-10 py-12 grid grid-cols-2 gap-10 items-center">
        
        {/* Left */}
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Drive. Ride. <br /> Explore.
          </h1>

          <p className="text-gray-500 mt-4">
            Find the perfect vehicle for your journey, anytime, anywhere.
          </p>

          {/* Search */}
          <div className="flex items-center bg-white rounded-full shadow mt-6 p-2 w-[400px]">
            <FaSearch className="ml-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search your dream car..."
              className="flex-1 px-3 outline-none"
            />
            <button className="bg-black text-white p-3 rounded-full">
              <IoMdSettings />
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-6 mt-8 bg-white p-4 rounded-xl shadow w-fit">
            <div className="flex flex-col items-center">
              <div className="bg-black text-white p-4 rounded-full">
                <FaCar />
              </div>
              <span className="text-sm mt-1">All</span>
            </div>

            <div className="flex flex-col items-center">
              <FaMotorcycle size={30} />
              <span className="text-sm">Bike</span>
            </div>

            <div className="flex flex-col items-center">
              <FaCar size={30} />
              <span className="text-sm">Car</span>
            </div>

            <div className="flex flex-col items-center">
              <FaBus size={30} />
              <span className="text-sm">Bus</span>
            </div>
          </div>
        </div>

        {/* Right Images */}
        <div className="flex justify-center items-center gap-6">
          <img
            src="https://imgd.aeplcdn.com/664x374/n/cw/ec/54399/swift-exterior-right-front-three-quarter.jpeg"
            alt="car"
            className="w-80"
          />
          <img
            src="https://cdn.pixabay.com/photo/2016/11/29/05/08/scooter-1867502_1280.png"
            alt="scooter"
            className="w-52"
          />
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-6 px-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold">Best Price</h3>
          <p className="text-gray-500 text-sm">Get the best prices</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold">Trusted Service</h3>
          <p className="text-gray-500 text-sm">Safe and reliable rides</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold">24/7 Support</h3>
          <p className="text-gray-500 text-sm">We are here to help you</p>
        </div>
      </div>

      {/* Nearby Vehicles */}
      <div className="px-10 mt-10">
        <h2 className="text-xl font-semibold mb-4">Nearby Vehicles</h2>

        <div className="grid grid-cols-3 gap-6">
          
          {/* Card */}
          <div className="bg-white p-4 rounded-xl shadow">
            <img
              src="https://imgd.aeplcdn.com/664x374/n/cw/ec/54399/swift-exterior-right-front-three-quarter.jpeg"
              alt=""
            />
            <h3 className="font-bold mt-2">SWIFT</h3>
            <p className="text-gray-500 text-sm">₹1500/day</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <img
              src="https://cdn.pixabay.com/photo/2016/11/29/05/08/scooter-1867502_1280.png"
              alt=""
            />
            <h3 className="font-bold mt-2">VESPA</h3>
            <p className="text-gray-500 text-sm">₹250/day</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <img
              src="https://cdn.pixabay.com/photo/2017/01/06/19/15/car-1957037_1280.jpg"
              alt=""
            />
            <h3 className="font-bold mt-2">BMW</h3>
            <p className="text-gray-500 text-sm">₹2500/day</p>
          </div>

        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-4 gap-6 px-10 mt-10 mb-10">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          Search Vehicle
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          Book & Pay
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          Enjoy Ride
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          Return & Relax
        </div>
      </div>

    </div>
  );
};

export default Home;