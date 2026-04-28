import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";

const Allvehicles = ({ searchQuery, activeCategory, filters }) => {
  const [vehicles, setVehicles] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = API_BASE_URL;

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setUserFavorites(result.data.map((f) => f.id));
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/vehicles/public/approved`);
        const result = await response.json();
        if (result.success) {
          setVehicles(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (e, vehicleId) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add to favorites");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicleId }),
      });
      const result = await response.json();
      if (result.success) {
        if (result.isFavorite) {
          setUserFavorites((prev) => [...prev, vehicleId]);
        } else {
          setUserFavorites((prev) => prev.filter((id) => id !== vehicleId));
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const filteredVehicles = vehicles
    .filter((v) => {
      // Search Query Filter
      const matchesSearch =
        !searchQuery ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.pickup_location &&
          v.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category Filter (from top bar)
      const vehicleType = (v.type || "").trim().toLowerCase();
      const categoryType = (activeCategory || "").trim().toLowerCase();
      const matchesCategory =
        categoryType === "all" || vehicleType === categoryType;

      // Advanced Filters (from drawer)
      const matchesDrawerType =
        filters.type === "All" || vehicleType === filters.type.toLowerCase();

      const matchesLocation =
        !filters.location ||
        (v.pickup_location &&
          v.pickup_location
            .toLowerCase()
            .includes(filters.location.toLowerCase()));

      const price = parseInt(v.price_per_day, 10);
      const matchesPrice =
        price >= filters.minPrice &&
        (filters.maxPrice === "5000+"
          ? true
          : price <= parseInt(filters.maxPrice, 10));

      const matchesFuel =
        filters.fuelType === "All" ||
        (v.fuel_type &&
          v.fuel_type.toLowerCase() === filters.fuelType.toLowerCase());

      const matchesTransmission =
        filters.transmission === "All" ||
        (v.transmission &&
          v.transmission.toLowerCase() === filters.transmission.toLowerCase());

      const vSeats = parseInt(v.seating_capacity, 10) || 4;
      let matchesSeats = true;
      if (filters.seats !== "All") {
        if (filters.seats === "7+") {
          matchesSeats = vSeats >= 7;
        } else {
          matchesSeats = vSeats === parseInt(filters.seats, 10);
        }
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDrawerType &&
        matchesLocation &&
        matchesPrice &&
        matchesFuel &&
        matchesTransmission &&
        matchesSeats
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "Price: Low to High") {
        return parseInt(a.price_per_day, 10) - parseInt(b.price_per_day, 10);
      }
      if (filters.sortBy === "Price: High to Low") {
        return parseInt(b.price_per_day, 10) - parseInt(a.price_per_day, 10);
      }
      return 0; // Recommended / Default
    });

  useEffect(() => {
    console.log("Filters Applied:", filters);
    console.log("Filtered List Size:", filteredVehicles.length);
  }, [filters, activeCategory, searchQuery, vehicles]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };

  useEffect(() => {
    if (selectedVehicle) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    }
  }, [selectedVehicle]);

  if (loading)
    return (
      <div className="max-w-[1240px] mx-auto px-6 py-20 text-center text-gray-500 font-medium">
        Loading vehicles...
      </div>
    );

  return (
    <section className="w-full px-4 sm:px-8 py-12 font-['Plus_Jakarta_Sans']">
      <div className="bg-white rounded-[32px] p-10 border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-[32px] font-[800] text-black tracking-tight">
            {activeCategory} Vehicles
          </h2>
        </div>

        {/* Main Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
          {filteredVehicles.length === 0 ? (
            <p className="text-gray-400 text-center py-10 col-span-full">
              No vehicles found matching your criteria.
            </p>
          ) : (
            filteredVehicles.map((v) => (
              <div
                key={v.id}
                onClick={() => handleVehicleClick(v)}
                className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 p-3 xl:p-4 flex flex-row gap-3 xl:gap-4 h-[150px] xl:h-[170px] group cursor-pointer"
              >
                {/* Left side: Vehicle Image */}
                <div className="w-[110px] xl:w-[130px] h-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      v.image.startsWith("http")
                        ? v.image
                        : `${API_URL}${v.image}`
                    }
                    alt={v.name}
                    className="w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Right side: Vehicle Details */}
                <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
                  {/* Title & Favorite */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-[16px] xl:text-[18px] font-extrabold text-[#111] uppercase tracking-tight truncate pr-2">
                      {v.name}
                    </h3>
                    <button
                      className={`${userFavorites.includes(v.id) ? "text-red-500" : "text-gray-400"} hover:text-red-500 transition-colors flex-shrink-0 mt-0.5`}
                      onClick={(e) => handleToggleFavorite(e, v.id)}
                    >
                      <svg
                        className="w-5 h-5 xl:w-[22px] xl:h-[22px]"
                        viewBox="0 0 24 24"
                        fill={
                          userFavorites.includes(v.id) ? "currentColor" : "none"
                        }
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-1.5 text-[#888] mt-1 mb-auto">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-[14px] h-[14px] xl:w-4 xl:h-4 mt-[3px] flex-shrink-0"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <p className="text-[12px] xl:text-[13px] leading-[1.4] font-medium line-clamp-2">
                      {v.pickup_location || "Not specified"}
                    </p>
                  </div>

                  {/* Specs & Price Row */}
                  <div className="flex items-end justify-between mt-2">
                    <div className="flex items-center gap-2 xl:gap-3 text-[#888] pb-[2px]">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-[13px] h-[13px] xl:w-[15px] xl:h-[15px] opacity-80"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.77,7.23,17,4.46V3a1,1,0,0,0-1-1H4A1,1,0,0,0,3,3V19a3,3,0,0,0,3,3H15a3,3,0,0,0,3-3V11.41l2.77-2.77a1,1,0,0,0,0-1.41ZM7,20a1,1,0,1,1,1-1A1,1,0,0,1,7,20Zm7-1a1,1,0,0,1-1,1H9V18h4a1,1,0,0,1,1,1ZM15,16H6V4h9Zm2-4.59L15.59,10,16.29,9.29l1.41,1.41a1,1,0,0,0,1.41,0l.71-.71,1,1Z" />
                        </svg>
                        <span className="text-[11px] xl:text-[12px] font-semibold">
                          {v.fuel_type || "Petrol"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-[13px] h-[13px] xl:w-[15px] xl:h-[15px] opacity-80"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                          <path d="M3 20h18" />
                          <path d="M5 20v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
                          <path d="M8 14V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
                        </svg>
                        <span className="text-[11px] xl:text-[12px] font-semibold">
                          {v.seating_capacity || 4} Seats
                        </span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-[2px]">
                      <span className="text-[17px] xl:text-[20px] font-extrabold text-[#111]">
                        ₹{parseInt(v.price_per_day, 10)}
                      </span>
                      <span className="text-[11px] xl:text-[12px] text-[#888] font-semibold">
                        /Day
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-6 lg:p-10 overflow-y-auto bg-black/60 backdrop-blur-sm transition-all duration-300">
          {/* Backdrop (clickable area around modal) */}
          <div
            className="fixed inset-0 -z-10"
            onClick={handleCloseModal}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-fit my-auto animate-in fade-in zoom-in duration-300 border border-gray-100">
            {/* Close Button Top Right */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-[120] w-[40px] h-[40px] md:w-[46px] md:h-[46px] bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:scale-110 transition-all shadow-lg group"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Side: Vehicle Info & Features */}
            <div className="w-full lg:w-[56%] p-6 md:p-8 lg:p-10 flex flex-col bg-white">
              {/* Type Badge */}
              <div className="mb-4">
                <span className="px-4 py-1.5 bg-[#eef4ff] text-[#4f7fff] rounded-full text-[12px] font-bold uppercase tracking-wide">
                  {selectedVehicle.type}
                </span>
              </div>
              
              {/* Title & Rating */}
              <div className="mb-6">
                <h2 className="text-[36px] md:text-[42px] font-[900] text-[#111] leading-tight mb-2 uppercase tracking-tight">
                  {selectedVehicle.name}
                </h2>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 bg-[#f5f5f5] px-2.5 py-1 rounded-lg border border-gray-100">
                    <span className="text-[14px] font-bold text-black">4.6</span>
                    <svg className="w-3.5 h-3.5 text-black fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-[#999] font-semibold text-[13px] tracking-wide">(120+ reviews)</span>
                </div>
              </div>

              {/* Main Image with Carousel Controls */}
              <div className="relative flex items-center justify-center my-6 group min-h-[220px] md:min-h-[280px]">
                <button className="absolute left-0 w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-md hover:bg-gray-50 transition-all z-10 -ml-2">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <img
                  src={selectedVehicle.image.startsWith("http") ? selectedVehicle.image : `${API_URL}${selectedVehicle.image}`}
                  alt={selectedVehicle.name}
                  className="w-[80%] max-h-[240px] md:max-h-[300px] h-auto object-contain mix-blend-multiply"
                />

                <button className="absolute right-0 w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-md hover:bg-gray-50 transition-all z-10 -mr-2">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots */}
                <div className="absolute -bottom-6 flex gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1065ff]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]"></div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 pt-8 mt-10 border-t border-gray-50">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path d="M19.77,7.23,17,4.46V3a1,1,0,0,0-1-1H4A1,1,0,0,0,3,3V19a3,3,0,0,0,3,3H15a3,3,0,0,0,3-3V11.41l2.77-2.77a1,1,0,0,0,0-1.41ZM7,20a1,1,0,1,1,1-1A1,1,0,0,1,7,20Zm7-1a1,1,0,0,1-1,1H9V18h4a1,1,0,0,1,1,1ZM15,16H6V4h9Zm2-4.59L15.59,10,16.29,9.29l1.41,1.41a1,1,0,0,0,1.41,0l.71-.71,1,1Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold text-[#111]">{selectedVehicle.fuel_type}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fuel Type</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 11h2m-2-4h4m-4 8h4m-5 4h6a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold text-[#111]">{selectedVehicle.transmission_type || "Manual"}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Transmission</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold text-[#111]">{selectedVehicle.seating_capacity} Seats</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Capacity</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9a1 1 0 011-1h1m8-1h1a1 1 0 011 1v2.586a1 1 0 01-.293.707l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 015 12.586V10a1 1 0 011-1h6" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold text-[#111]">{selectedVehicle.type}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Body Type</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold text-[#111]">AC</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Air Condition</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold text-[#111]">Music</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">System</p>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="mt-10">
                <h3 className="text-[18px] font-bold text-[#111] mb-6">Gallery</h3>
                <div className="flex items-center gap-4">
                  {[selectedVehicle.image, selectedVehicle.image, selectedVehicle.image, selectedVehicle.image].map((img, idx) => (
                    <div
                      key={idx}
                      className={`w-[140px] h-[100px] rounded-[20px] bg-[#f8f8f8] p-3 flex items-center justify-center cursor-pointer transition-all border ${idx === 0 ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-100 hover:border-blue-200"}`}
                    >
                      <img
                        src={img.startsWith("http") ? img : `${API_URL}${img}`}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                  ))}
                  <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-md hover:bg-gray-50 transition-all shrink-0 hover:scale-105 active:scale-95">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Booking Area */}
            <div className="w-full lg:w-[44%] p-6 md:p-8 lg:p-10 lg:pt-14 bg-[#fbfbfb] border-l border-gray-100 flex flex-col">
              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-[36px] md:text-[42px] font-[900] text-[#111] tracking-tight">₹{selectedVehicle.price_per_day}</span>
                  <span className="text-[#888] font-bold text-[16px]">/Day</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[#ccc] line-through text-[14px] md:text-[16px] font-bold">₹{Math.round(selectedVehicle.price_per_day * 1.33)}</span>
                  <span className="text-[#28a745] text-[11px] font-extrabold bg-[#e8f5e9] px-2.5 py-0.5 rounded-full uppercase tracking-wider">25% OFF</span>
                </div>
              </div>

              {/* Pickup Location Card */}
              <div className="bg-white rounded-[20px] p-5 mb-4 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                <h4 className="text-[13px] font-[800] text-[#111] mb-3">Pickup Location</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f8f8f8] flex items-center justify-center">
                      <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <p className="text-[14px] font-bold text-[#555] leading-snug">
                      {selectedVehicle.pickup_location || "12, 4th Cross Street, Puducherry"}
                    </p>
                  </div>
                  <button className="text-[13px] font-bold text-[#4f7fff] hover:underline">Change</button>
                </div>
              </div>

              {/* Select Dates Card */}
              <div className="bg-white rounded-[20px] p-5 mb-4 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                <h4 className="text-[13px] font-[800] text-[#111] mb-4">Select Dates</h4>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-[#f8f8f8] border border-gray-100 rounded-xl p-3">
                    <p className="text-[9px] font-extrabold text-[#aaa] uppercase mb-1">Pick-up Date</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-[800] text-[#111]">24 May 2024</span>
                      <svg className="w-4 h-4 text-[#888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#f8f8f8] border border-gray-100 rounded-xl p-3">
                    <p className="text-[9px] font-extrabold text-[#aaa] uppercase mb-1">Drop-off Date</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-[800] text-[#111]">26 May 2024</span>
                      <svg className="w-4 h-4 text-[#888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] font-bold text-[#555]">
                  Duration: <span className="text-[#1065ff]">2 Days</span>
                </p>
              </div>

              {/* Price Summary Card */}
              <div className="bg-white rounded-[20px] p-5 mb-4 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                <h4 className="text-[13px] font-[800] text-[#111] mb-4">Price Summary</h4>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#888] font-bold">₹{selectedVehicle.price_per_day} x 2 Days</span>
                    <span className="text-[#111] font-[800]">₹{selectedVehicle.price_per_day * 2}</span>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#28a745] font-bold">Discount (25%)</span>
                    <span className="text-[#28a745] font-[800]">- ₹{Math.round(selectedVehicle.price_per_day * 2 * 0.25)}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                  <span className="text-[15px] font-[800] text-[#111]">Total Amount</span>
                  <span className="text-[22px] font-[900] text-[#111]">₹{Math.round(selectedVehicle.price_per_day * 2 * 0.75)}</span>
                </div>
              </div>

              {/* Service Badges */}
              <div className="bg-[#f0f5ff] rounded-[20px] p-4 mb-6 flex justify-between">
                <div className="flex flex-col items-center gap-1 text-center flex-1 border-r border-blue-100 px-1">
                  <div className="w-8 h-8 flex items-center justify-center text-[#4f7fff]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-[9px] font-[800] text-black uppercase leading-tight">Free<br/>Cancellation</p>
                </div>
                <div className="flex flex-col items-center gap-1 text-center flex-1 border-r border-blue-100 px-1">
                  <div className="w-8 h-8 flex items-center justify-center text-[#4f7fff]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[9px] font-[800] text-black uppercase leading-tight">No Hidden<br/>Charges</p>
                </div>
                <div className="flex flex-col items-center gap-1 text-center flex-1 px-1">
                  <div className="w-8 h-8 flex items-center justify-center text-[#4f7fff]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-[9px] font-[800] text-black uppercase leading-tight">24/7<br/>Support</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-[0.7] h-[54px] rounded-[16px] bg-white border border-gray-200 flex items-center justify-center gap-2 text-[14px] font-[800] text-[#111] hover:bg-gray-50 transition-all shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save
                </button>
                <a
                  href={`tel:${selectedVehicle.mobile_number}`}
                  onClick={async () => {
                    try {
                      await fetch(`${API_URL}/api/vehicles/log-call`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          userId: localStorage.getItem("userId"),
                          vehicleId: selectedVehicle.id,
                        }),
                      });
                    } catch (err) { console.error(err); }
                  }}
                  className="flex-1 bg-[#1065ff] hover:bg-[#0051e0] h-[54px] rounded-[16px] flex flex-col items-center justify-center text-white transition-all shadow-[0_4px_15px_rgba(16,101,255,0.2)] group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-[900]">Book Now</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M3 12h18" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold opacity-80">₹{Math.round(selectedVehicle.price_per_day * 2 * 0.75)} for 2 days</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Allvehicles;
