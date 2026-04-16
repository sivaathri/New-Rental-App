import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  X, Plus, Upload, Film, Image as ImageIcon, 
  Car, Clock, ShieldCheck, AlertCircle, 
  TrendingUp, CheckCircle2, MoreVertical, Settings, LogOut,
  MapPin, Fuel, User, Gauge, Calendar, ExternalLink, Zap, Star
} from "lucide-react";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, callbackClicks: 0 });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/api";

  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");
    try {
      const res = await axios.get(`${API_BASE}/vehicles`, { headers: { Authorization: `Bearer ${token}` } });
      setVehicles(res.data.vehicles);
      const counts = { pending: 0, approved: 0 };
      res.data.vehicles.forEach((v) => {
        if (v.status === "Waiting for Approval") counts.pending++;
        if (v.status === "Approved") counts.approved++;
      });
      setStats({ total: res.data.vehicles.length, ...counts, callbackClicks: 124 });
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchDashboard(); }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans']">
      {/* Premium Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform">
              <Zap size={24} className="fill-blue-500 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">PONDY RENTALS</h1>
              <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Owner Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[0.65rem] hover:bg-blue-600 transition-all shadow-xl shadow-slate-100"
            >
              Add Vehicle
            </button>
            <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />
            <button onClick={() => setShowLogoutConfirm(true)} className="p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 space-y-16">
        {/* Animated Greeting Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight animate-in fade-in slide-in-from-left-8 duration-700">
              Welcome back, <span className="text-blue-600">Owner</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium italic opacity-80">Track your fleet performance and asset valuation in real-time.</p>
          </div>
          <div className="flex gap-4 p-2 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="px-6 py-4 text-center">
              <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Assets</p>
              <p className="text-2xl font-black text-slate-900">{stats.total}</p>
            </div>
            <div className="w-[1px] bg-slate-100" />
            <div className="px-6 py-4 text-center">
              <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Earned So Far</p>
              <p className="text-2xl font-black text-blue-600">₹45k</p>
            </div>
          </div>
        </div>

        {/* Vibrant Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <StatCard title="Active Listings" value={stats.approved} icon={<CheckCircle2 size={24} />} color="indigo" />
          <StatCard title="Verification Sent" value={stats.pending} icon={<Clock size={24} />} color="amber" />
          <StatCard title="Consumer Clicks" value={stats.callbackClicks} icon={<TrendingUp size={24} />} color="emerald" />
          <StatCard title="Platform Rating" value="4.9" icon={<Star size={24} />} color="blue" />
        </div>

        {/* Fleet Management Section */}
        <section className="space-y-10 group/fleet">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2 h-10 bg-blue-600 rounded-full" />
              <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">My Fleet Management</h3>
            </div>
          </div>

          {vehicles.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 animate-float">
                <Car size={48} />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Your Garage is Empty</h4>
              <p className="text-slate-400 font-medium mt-2 mb-10 max-w-sm">Start your rental journey by listing your first vehicle and begin earning today.</p>
              <button 
                onClick={() => navigate('/register')}
                className="bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-2xl"
              >
                List First Vehicle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} onDetails={() => setSelectedVehicle(v)} />
              ))}
              <button 
                onClick={() => navigate('/register')}
                className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Plus size={32} />
                </div>
                <span className="font-black uppercase tracking-widest text-xs">Register New Asset</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* LUXURY DETAILS MODAL */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setSelectedVehicle(null)} />
          <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-500 border border-white/20">
            {/* Gallery Section */}
            <div className="relative h-[450px] bg-slate-950">
              <button 
                onClick={() => setSelectedVehicle(null)} 
                className="absolute top-8 right-8 z-30 w-14 h-14 bg-white/10 backdrop-blur-3xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl border border-white/20"
              >
                <X size={28} />
              </button>
              {selectedVehicle.vehicle_images?.length > 0 ? (
                <div className="flex h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                  {selectedVehicle.vehicle_images.map((img, idx) => (
                    <div key={idx} className="min-w-full h-full snap-start border-l border-white/5 relative">
                      {img.media_type === "image" ? (
                        <img src={`http://localhost:5000${img.media_url}`} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <video src={`http://localhost:5000${img.media_url}`} className="w-full h-full object-cover" muted loop autoPlay />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-900">
                  <ImageIcon size={64} className="opacity-20 mb-4" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">No Asset Media Found</span>
                </div>
              )}
              {selectedVehicle.vehicle_images?.length > 1 && (
                <div className="absolute bottom-10 left-10 flex gap-2">
                  <div className="px-5 py-2.5 bg-white/10 backdrop-blur-3xl rounded-full text-white text-[0.65rem] font-black uppercase tracking-[0.2em] border border-white/10">
                    Gallery Assets: {selectedVehicle.vehicle_images.length}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-12 lg:p-16 space-y-16">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase">{selectedVehicle.name}</h2>
                    <div className="flex items-center gap-4">
                      <div className="px-5 py-2 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-2">
                        <Zap size={14} className="text-blue-600 fill-blue-600" />
                        <span className="text-[0.65rem] font-black uppercase tracking-widest text-blue-600">{selectedVehicle.type} • {selectedVehicle.model_year}</span>
                      </div>
                      <div className={`px-5 py-2 rounded-2xl border flex items-center gap-2 ${
                        selectedVehicle.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        selectedVehicle.status === "Rejected" ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          selectedVehicle.status === "Approved" ? "bg-emerald-600" :
                          selectedVehicle.status === "Rejected" ? "bg-red-600" : "bg-amber-600"
                        }`} />
                        <span className="text-[0.65rem] font-black uppercase tracking-widest">{selectedVehicle.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 leading-none">Standard Rate</p>
                  <p className="text-6xl font-black text-blue-600 italic tracking-tighter leading-none">₹{Math.floor(selectedVehicle.price_per_day)}<span className="text-xl font-normal not-italic text-slate-400 ml-2">/day</span></p>
                </div>
              </div>

              {/* Advanced Specifications Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <DetailCard icon={<User size={20} />} label="Capacity" value={`${selectedVehicle.seating_capacity || 0} SEATS`} />
                <DetailCard icon={<Fuel size={20} />} label="Fuel System" value={selectedVehicle.fuel_type || 'N/A'} />
                <DetailCard icon={<Gauge size={20} />} label="Fuel Economy" value={`${Math.floor(selectedVehicle.mileage || 0)} KM/L`} />
                <DetailCard icon={<Clock size={20} />} label="Hourly Lease" value={`₹${Math.floor(selectedVehicle.price_per_hour || 0)}/HR`} />
              </div>

              {/* Logistics & Security */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                  <h4 className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-slate-400">Identity & Official RC</h4>
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedVehicle.registration_number}</p>
                      <a 
                        href={`http://localhost:5000${selectedVehicle.rc_book_url}`} 
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 mt-1 text-blue-600 text-[0.65rem] font-black uppercase tracking-widest hover:underline transition-all"
                      >
                        Secure Document Link <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6 text-right lg:text-left">
                  <h4 className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-slate-400">Verified Pickup Spot</h4>
                  <div className="flex flex-row-reverse lg:flex-row items-center gap-5">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 shrink-0">
                      <MapPin size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-snug italic">{selectedVehicle.pickup_location || "Coordinate Not Set"}</p>
                      <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mt-1">Landmark: {selectedVehicle.landmark || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics & Quotas */}
              <div className="space-y-6">
                <h4 className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Fleet Rules & Quotas</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="px-8 py-5 bg-slate-100 rounded-[2rem] text-sm font-black text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600"><Settings size={14} /></div>
                    Max {selectedVehicle.max_km_per_day} KM / day Allowance
                  </div>
                  <div className="px-8 py-5 bg-slate-100 rounded-[2rem] text-sm font-black text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600"><TrendingUp size={14} /></div>
                    ₹{Math.floor(selectedVehicle.price_per_km)}/KM Excess Surcharge
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                {selectedVehicle.status === "Rejected" && (
                  <button className="flex-[1.5] bg-red-600 text-white font-black uppercase tracking-[0.2em] py-6 rounded-[2rem] shadow-2xl hover:scale-[1.02] transition-all">Resolve & Resubmit</button>
                )}
                <button 
                  onClick={() => setSelectedVehicle(null)}
                  className="flex-1 bg-slate-900 text-white font-black uppercase tracking-[0.2em] py-6 rounded-[2rem] transition-all group overflow-hidden relative"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 group-hover:h-full transition-all duration-300 -z-10" />
                  Close Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-sm p-10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto mb-8 shadow-inner shadow-red-100">
              <LogOut size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-4">Leaving Already?</h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10">Confirm if you would like to end your current session.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[0.65rem] text-slate-400 hover:bg-slate-50 transition-all border border-slate-100"
              >
                No, Stay
              </button>
              <button 
                onClick={handleLogout}
                className="px-6 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[0.65rem] shadow-xl shadow-red-100 hover:bg-red-700 transition-all"
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

function DetailCard({ icon, label, value }) {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] group hover:border-blue-600 transition-all shadow-sm flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">{icon}</div>
      <div className="space-y-1">
        <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-lg font-black text-slate-900 italic tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    indigo: "from-indigo-600 to-indigo-800 text-indigo-600",
    amber: "from-amber-500 to-amber-600 text-amber-500",
    emerald: "from-emerald-600 to-emerald-700 text-emerald-600",
    blue: "from-blue-600 to-blue-800 text-blue-600"
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br transition-all duration-500 opacity-5 blur-2xl group-hover:opacity-20 ${colors[color].split(' ')[0]}`} />
      <div className="flex flex-col gap-6 relative z-10">
        <div className={`w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color].split(' ')[2]}`}>{icon}</div>
        <div className="space-y-1 text-center lg:text-left">
          <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{value}</p>
          <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.3em]">{title}</p>
        </div>
      </div>
    </div>
  );
}

function VehicleCard({ vehicle, onDetails }) {
  const statusColors = {
    "Approved": "bg-emerald-500 text-white",
    "Rejected": "bg-red-500 text-white",
    "Waiting for Approval": "bg-amber-500 text-white"
  };

  return (
    <div className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 relative flex flex-col h-[520px]">
      {/* Dynamic Image Wrapper */}
      <div className="relative h-2/3 overflow-hidden bg-slate-100">
        <div className="absolute top-6 left-6 z-20">
          <div className={`px-5 py-2 rounded-full text-[0.6rem] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md ${statusColors[vehicle.status] || "bg-white text-slate-900"}`}>
            {vehicle.status}
          </div>
        </div>
        
        {vehicle.vehicle_images?.length > 0 ? (
          <img 
            src={`http://localhost:5000${vehicle.vehicle_images[0].media_url}`} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            alt={vehicle.name} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200">
            <Car size={64} className="opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        
        <div className="absolute bottom-8 left-8">
           <p className="text-4xl font-black text-white italic tracking-tighter leading-none">₹{Math.floor(vehicle.price_per_day)}<span className="text-sm font-normal not-italic opacity-40 ml-1">/d</span></p>
        </div>
      </div>

      {/* Luxury Info Section */}
      <div className="p-8 flex flex-col gap-6 flex-1">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none italic">{vehicle.name}</h3>
            <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em] italic">{vehicle.type} • {vehicle.model_year}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
              <LayoutGrid size={14} />
            </div>
            <span className="text-[0.65rem] font-black text-slate-900 uppercase tracking-widest">{vehicle.registration_number}</span>
          </div>
          <button 
            onClick={onDetails} 
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[0.6rem] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg"
          >
            Insights
          </button>
        </div>
      </div>
    </div>
  );
}
