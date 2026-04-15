import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  X, Plus, Upload, Film, Image as ImageIcon, 
  Car, Clock, ShieldCheck, AlertCircle, 
  TrendingUp, CheckCircle2, MoreVertical, Settings, LogOut,
  MapPin, Fuel, User, Gauge, Calendar, ExternalLink
} from "lucide-react";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    callbackClicks: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialVehicleState = {
    type: "Car",
    name: "",
    model_year: "",
    registration_number: "",
    rc_book: null,
    seating_capacity: "",
    fuel_type: "",
    mileage: "",
    price_per_day: "",
    price_per_hour: "",
    price_per_km: "",
    max_km_per_day: "",
    pickup_location: "",
    landmark: "",
  };
  const [vehicle, setVehicle] = useState(initialVehicleState);
  const [media, setMedia] = useState([]);

  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/api";

  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const res = await axios.get(`${API_BASE}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data.vehicles);

      const counts = { pending: 0, approved: 0 };
      res.data.vehicles.forEach((v) => {
        if (v.status === "Waiting for Approval") counts.pending++;
        if (v.status === "Approved") counts.approved++;
      });
      setStats({
        total: res.data.vehicles.length,
        ...counts,
        callbackClicks: 12,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.keys(vehicle).forEach((key) => {
      if (key !== "rc_book") formData.append(key, vehicle[key]);
    });
    if (vehicle.rc_book) formData.append("rc_book", vehicle.rc_book);
    Array.from(media).forEach((file) => formData.append("media", file));

    try {
      await axios.post(`${API_BASE}/vehicles/add`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setVehicle(initialVehicleState);
      setMedia([]);
      fetchDashboard();
    } catch (err) {
      alert("Error adding vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Car size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Owner Portal
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowModal(true)}
                className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5"
              >
                <Plus size={18} /> Add Vehicle
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, Owner</h1>
            <p className="text-slate-500 mt-1 font-medium italic">Manage your fleet and track earnings in one place.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="md:hidden w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
          >
            <Plus size={20} /> Add New Vehicle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Vehicles" value={stats.total} icon={<Car size={24} />} color="blue" trend="+2 this month" />
          <StatCard title="Pending Check" value={stats.pending} icon={<Clock size={24} />} color="amber" trend="Needs attention" />
          <StatCard title="Approved" value={stats.approved} icon={<ShieldCheck size={24} />} color="emerald" trend="Active" />
          <StatCard title="Call Clicks" value={stats.callbackClicks} icon={<TrendingUp size={24} />} color="indigo" trend="Potentials" />
        </div>

        <section>
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              Your Fleet <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{vehicles.length}</span>
            </h2>
          </div>

          {vehicles.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 flex flex-col items-center justify-center text-center">
              <Car size={40} className="text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No vehicles listed yet</h3>
              <button 
                onClick={() => setShowModal(true)}
                className="mt-6 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold transition-all"
              >
                List Your First Vehicle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} navigate={navigate} onDetails={() => setSelectedVehicle(v)} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ADD VEHICLE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] animate-in slide-in-from-bottom-8 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-2xl font-extrabold text-slate-900">Add New Vehicle</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddVehicle} className="overflow-y-auto px-8 py-8 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-[0.85rem] font-bold text-slate-700 uppercase tracking-wider ml-1">Vehicle Type</label>
                  <select
                    className="w-full bg-slate-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl p-4 text-slate-800 font-semibold transition-all outline-none"
                    value={vehicle.type}
                    onChange={(e) => setVehicle({ ...vehicle, type: e.target.value })}
                  >
                    <option>Car</option><option>Bike</option><option>Bus</option><option>Van</option><option>Mini Van</option><option>Mini Bus</option><option>Tempo Traveller</option>
                  </select>
                </div>
                <InputField label="Vehicle Name" placeholder="e.g. Maruti Swift" value={vehicle.name} onChange={v => setVehicle({ ...vehicle, name: v })} />
                <InputField label="Model Year" type="number" placeholder="e.g. 2022" value={vehicle.model_year} onChange={v => setVehicle({ ...vehicle, model_year: v })} />
                <InputField label="Registration Number" placeholder="e.g. PY01AB1234" value={vehicle.registration_number} onChange={v => setVehicle({ ...vehicle, registration_number: v })} />
                <InputField label="Seating Capacity" type="number" placeholder="Count" value={vehicle.seating_capacity} onChange={v => setVehicle({ ...vehicle, seating_capacity: v })} />
                <InputField label="Fuel Type" placeholder="Petrol/Diesel" value={vehicle.fuel_type} onChange={v => setVehicle({ ...vehicle, fuel_type: v })} />
                <InputField label="Price Per Day (₹)" type="number" value={vehicle.price_per_day} onChange={v => setVehicle({ ...vehicle, price_per_day: v })} />
                <InputField label="Price Per Hour (₹)" type="number" value={vehicle.price_per_hour} onChange={v => setVehicle({ ...vehicle, price_per_hour: v })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <UploadZone label="RC Book (Mandatory)" icon={<ShieldCheck size={28} />} file={vehicle.rc_book} onChange={f => setVehicle({ ...vehicle, rc_book: f })} />
                <UploadZone label="Vehicle Photos & Videos" icon={<ImageIcon size={28} />} multiple count={media.length} onChange={f => setMedia(f)} />
              </div>
              <div className="pt-4 flex gap-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 border border-slate-200">Close</button>
                <button type="submit" disabled={loading} className="flex-[2] bg-slate-900 border-b-4 border-slate-950 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all shadow-xl disabled:bg-slate-300">
                  {loading ? "Launching..." : "Launch Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL DETAILS MODAL */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedVehicle(null)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="absolute top-6 right-6 z-20">
              <button 
                onClick={() => setSelectedVehicle(null)} 
                className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:bg-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar">
              {/* Media Gallery */}
              <div className="relative h-96 bg-slate-100">
                {selectedVehicle.vehicle_images?.length > 0 ? (
                  <div className="flex h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                    {selectedVehicle.vehicle_images.map((img, idx) => (
                      <div key={idx} className="min-w-full h-full snap-start relative">
                        {img.media_type === "image" ? (
                          <img src={`http://localhost:5000${img.media_url}`} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <video src={`http://localhost:5000${img.media_url}`} className="w-full h-full object-cover" muted loop autoPlay />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 flex-col">
                    <ImageIcon size={64} />
                    <span className="font-bold mt-4 tracking-widest uppercase text-xs">No media images uploaded</span>
                  </div>
                )}
                {/* Image Counter Badge */}
                {selectedVehicle.vehicle_images?.length > 1 && (
                  <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-[0.65rem] font-black uppercase tracking-[0.2em]">
                    1 / {selectedVehicle.vehicle_images.length} Media
                  </div>
                )}
              </div>

              {/* Vehicle Content */}
              <div className="p-10 space-y-12">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{selectedVehicle.name}</h2>
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100 italic">
                        {selectedVehicle.type} • {selectedVehicle.model_year}
                      </span>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                        selectedVehicle.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        selectedVehicle.status === "Rejected" ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {selectedVehicle.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Market Price</p>
                    <p className="text-4xl font-black text-blue-600 italic tracking-tighter">₹{selectedVehicle.price_per_day}<span className="text-lg font-normal not-italic text-slate-400 ml-1">/d</span></p>
                  </div>
                </div>

                {/* Specs Hub */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <DetailBox icon={<User size={18} />} label="Seating" value={`${selectedVehicle.seating_capacity} Persons`} />
                  <DetailBox icon={<Fuel size={18} />} label="Fuel Type" value={selectedVehicle.fuel_type} />
                  <DetailBox icon={<Gauge size={18} />} label="Mileage" value={`${Math.floor(selectedVehicle.mileage)} KM/L`} />
                  <DetailBox icon={<Plus size={18} />} label="Hourly Rate" value={`₹{selectedVehicle.price_per_hour}/HR`} />
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Identity & RC</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-800 uppercase text-xs">{selectedVehicle.registration_number}</p>
                        <a 
                          href={`http://localhost:5000${selectedVehicle.rc_book_url}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-blue-600 text-[0.65rem] font-black uppercase tracking-wider hover:underline flex items-center gap-1 mt-0.5"
                        >
                          View RC Document <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Pickup Location</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-800 text-xs italic">{selectedVehicle.pickup_location || "Not Provided"}</p>
                        <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">{selectedVehicle.landmark || "No Landmark"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policies */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Usage Limits</h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-slate-100 px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600">Max {selectedVehicle.max_km_per_day} KM / day</span>
                    <span className="bg-slate-100 px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600">₹{selectedVehicle.price_per_km}/KM extra charge</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                  {selectedVehicle.status === "Rejected" && (
                    <button 
                      onClick={() => navigate(`/register?vehicleId=${selectedVehicle.id}`)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.15em] py-5 rounded-2xl shadow-xl shadow-red-100 transition-all text-sm"
                    >
                      Update & Resubmit Fleet
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedVehicle(null)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.15em] py-5 rounded-2xl transition-all text-sm"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <LogOut size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 font-['Outfit']">Logging Out?</h2>
            <p className="text-slate-500 font-medium mb-8">Are you sure you want to end your session?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-100"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function DetailBox({ icon, label, value }) {
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-3xl group hover:border-blue-200 transition-colors">
      <div className="text-blue-500 mb-3 group-hover:scale-110 transition-transform origin-left">{icon}</div>
      <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  const colors = {
    blue: "bg-blue-600 shadow-blue-200",
    amber: "bg-amber-500 shadow-amber-200",
    emerald: "bg-emerald-500 shadow-emerald-200",
    indigo: "bg-indigo-600 shadow-indigo-200"
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center text-white shadow-lg`}>{icon}</div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
          <TrendingUp size={12} className="text-emerald-500" /> {trend}
        </span>
      </div>
    </div>
  );
}

function VehicleCard({ vehicle, navigate, onDetails }) {
  const statusColors = {
    "Approved": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Rejected": "bg-red-50 text-red-700 border-red-100",
    "Waiting for Approval": "bg-amber-50 text-amber-700 border-amber-100"
  };

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        {vehicle.vehicle_images?.length > 0 ? (
          <div className="w-full h-full">
            {vehicle.vehicle_images[0].media_type === "image" ? (
              <img src={`http://localhost:5000${vehicle.vehicle_images[0].media_url}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={vehicle.name} />
            ) : (
              <video src={`http://localhost:5000${vehicle.vehicle_images[0].media_url}`} className="w-full h-full object-cover" muted loop autoPlay />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <ImageIcon size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${statusColors[vehicle.status] || "bg-white/80"}`}>{vehicle.status}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 to-transparent p-6 pt-12">
           <div className="flex justify-between items-end text-white">
             <p className="text-3xl font-black italic">₹{vehicle.price_per_day}<span className="text-sm font-normal not-italic text-slate-300 ml-1">/day</span></p>
           </div>
        </div>
      </div>
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-6 text-slate-900 font-black">
          <div><h3 className="text-2xl leading-none mb-1">{vehicle.name}</h3><p className="text-slate-400 text-xs font-bold uppercase tracking-widest uppercase italic">{vehicle.type} • {vehicle.model_year}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <VehicleSpec label="Registration" value={vehicle.registration_number} />
          <VehicleSpec label="Capacity" value={`${vehicle.seating_capacity} Seats`} />
        </div>
        {vehicle.status === "Rejected" && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3 text-red-600 text-sm font-medium"><AlertCircle size={18} className="shrink-0" /><p>{vehicle.rejection_reason || "Rejected."}</p></div>
        )}
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="text-slate-400 text-[0.65rem] font-black uppercase tracking-widest">₹{vehicle.price_per_hour}/HR</div>
          <button onClick={onDetails} className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest hover:text-blue-700"><Settings size={14} /> Full Details</button>
        </div>
      </div>
    </div>
  );
}

function VehicleSpec({ label, value }) {
  return (
    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
      <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-extrabold text-slate-800 break-words">{value}</p>
    </div>
  );
}

function InputField({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[0.85rem] font-bold text-slate-700 uppercase tracking-wider ml-1">{label}</label>
      <input type={type} required placeholder={placeholder} className="w-full bg-slate-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl p-4 text-slate-800 font-semibold transition-all outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function UploadZone({ label, icon, file, multiple, count, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[0.85rem] font-bold text-slate-700 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative group">
        <input type="file" multiple={multiple} accept={multiple ? "image/*,video/*" : "image/*"} required={!file && !count} onChange={(e) => multiple ? onChange(e.target.files) : onChange(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-50/50 rounded-3xl p-8 transition-all flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 shadow-sm mb-3 font-bold uppercase">{icon}</div>
          <p className="text-sm font-bold text-slate-700 italic uppercase">{multiple ? (count > 0 ? `${count} Selected` : "Drop assets") : (file ? file.name : "RC Document")}</p>
        </div>
      </div>
    </div>
  );
}
