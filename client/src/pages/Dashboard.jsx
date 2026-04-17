import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart as BarChartIcon, Users, Car, CheckSquare, MessageSquare, 
  Star, Tag, Landmark, Settings, LogOut, LayoutDashboard, 
  Smartphone, Search, Bell, UserCheck, TrendingUp, Clock, 
  FileText, CreditCard, ChevronDown, MoreHorizontal, Check, X, Zap, 
  ShieldCheck, ExternalLink, Fuel, Gauge, User, Plus
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#f8f9fa] flex font-['Inter', sans-serif]">
      {/* Sidebar - Matching Refined Admin Design */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col py-6 shrink-0 h-screen sticky top-0">
        <div className="px-8 mb-8 flex items-center">
          <span className="text-[22px] font-bold text-[#252f40]">Quick1</span>
          <span className="text-[22px] font-bold text-[#82d616] ml-0.5">OWNER</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-10">
          <SidebarNavItem icon={<LayoutDashboard/>} label="Dashboard" active />
          <SidebarNavItem icon={<Car/>} label="My Assets" />
          <SidebarNavItem icon={<TrendingUp/>} label="Earnings" />
          <SidebarNavItem icon={<FileText/>} label="Reports" />
          <SidebarNavItem icon={<Star/>} label="Reviews" />
          <SidebarNavItem icon={<Settings/>} label="Settings" />
        </nav>

        <div className="px-4 mt-auto pt-6 border-t border-gray-50">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-6 py-3 text-[#ea0606] font-bold hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="text-[13px] font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-8 pt-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[24px] font-bold text-[#252f40] leading-tight flex items-center gap-2">
              Welcome back, Owner 👋
            </h1>
            <p className="text-[#67748e] text-[14px] mt-0.5">Here's your fleet performance overview.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/register')} className="px-4 py-1.5 bg-black text-white text-[13px] font-bold rounded-lg hover:bg-[#1a1a1a] transition-all shadow-md">Add New Asset</button>
            <div className="w-10 h-10 bg-[#000] rounded-full flex items-center justify-center text-white font-bold text-sm">O</div>
          </div>
        </header>

        <div className="space-y-8">
          <h2 className="text-[18px] font-bold text-[#252f40]">Portfolio Performance</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Assets" value={stats.total} icon={<Car/>} color="#e6f0ff" iconColor="#2167f2" growth="+0%" />
            <StatCard title="Active Flux" value={stats.approved} icon={<Zap/>} color="#e6ffed" iconColor="#82d616" growth="+0%" />
            <StatCard title="Pending Audit" value={stats.pending} icon={<Clock/>} color="#fff5e6" iconColor="#fbcf33" growth="+0%" />
            <StatCard title="Yield Factor" value="124" icon={<TrendingUp/>} color="#f2e6ff" iconColor="#985eff" growth="+0%" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v) => (
              <VehicleCard 
                key={v.id} 
                vehicle={v} 
                onDetails={() => setSelectedVehicle(v)} 
              />
            ))}
          </div>
        </div>
      </main>

      {/* Detail Manager Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#000]/40 backdrop-blur-sm" onClick={() => setSelectedVehicle(null)} />
          <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="relative h-[300px] group bg-black">
              <button onClick={() => setSelectedVehicle(null)} className="absolute top-6 right-6 z-30 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-black hover:bg-gray-100 transition-all">
                <X size={20} />
              </button>
              {selectedVehicle.vehicle_images?.length > 0 ? (
                <img src={`http://localhost:5000${selectedVehicle.vehicle_images[0].media_url}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50"><Car size={64}/></div>
              )}
            </div>

            <div className="p-10 space-y-10 overflow-y-auto no-scrollbar">
               <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-[32px] font-bold text-[#252f40] leading-none mb-4">{selectedVehicle.name}</h2>
                    <div className="flex gap-2">
                      <span className="px-4 py-1.5 bg-[#f8f9fa] text-[#67748e] rounded-lg text-[12px] font-bold border border-gray-100">{selectedVehicle.type}</span>
                      <span className={`px-4 py-1.5 rounded-lg text-[12px] font-bold border ${selectedVehicle.status === 'Approved' ? 'bg-[#e6ffed] text-[#82d616] border-[#82d616]/20' : 'bg-[#fff5e6] text-[#fbcf33] border-[#fbcf33]/20'}`}>{selectedVehicle.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-medium text-[#67748e] mb-1">Daily Yield</p>
                    <p className="text-[32px] font-bold text-[#82d616] leading-none">₹{Math.floor(selectedVehicle.price_per_day)}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <SpecCard icon={<User/>} label="Capacity" value={selectedVehicle.seating_capacity} />
                  <SpecCard icon={<Fuel/>} label="Fuel" value={selectedVehicle.fuel_type} />
                  <SpecCard icon={<Gauge/>} label="Mileage" value={`${selectedVehicle.mileage}km`} />
                  <SpecCard icon={<ShieldCheck/>} label="Registration" value={selectedVehicle.registration_number} />
               </div>

               <button onClick={() => setSelectedVehicle(null)} className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-[#1a1a1a] transition-all">Close Asset Manager</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Manager */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 text-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ea0606] mx-auto mb-6">
              <LogOut size={32} />
            </div>
            <h2 className="text-[20px] font-bold text-[#252f40] mb-2">Sign Out?</h2>
            <p className="text-[#67748e] text-[14px] mb-8">Are you sure you want to end your session?</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="py-3 px-6 rounded-lg font-bold text-[13px] text-[#67748e] hover:bg-gray-50 transition-all border border-gray-100">Cancel</button>
              <button onClick={handleLogout} className="py-3 px-6 bg-[#ea0606] text-white rounded-lg font-bold text-[13px] shadow-sm hover:opacity-90 transition-all">Logout</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #f8f9fa; font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

function SidebarNavItem({ icon, label, active }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 mx-4 cursor-pointer transition-all duration-200 ${
      active ? 'bg-black text-white rounded-[10px]' : 'text-[#67748e] hover:text-black'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${active ? 'bg-[#1a1a1a]' : 'bg-white shadow-sm border border-gray-100'}`}>
          {React.cloneElement(icon, { size: 16, className: active ? 'text-white' : 'text-[#67748e]' })}
        </div>
        <span className={`text-[13px] font-medium leading-none ${active ? 'font-semibold' : ''}`}>{label}</span>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, iconColor, growth }) {
  return (
    <div className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
      <div className="space-y-1">
        <p className="text-[12px] font-medium text-[#67748e]">{title}</p>
        <p className="text-[20px] font-bold text-[#252f40] leading-none">{value}</p>
        <p className="text-[12px] font-bold text-[#82d616] mt-2">
          {growth} <span className="text-[#67748e] font-normal ml-0.5">vs last month</span>
        </p>
      </div>
      <div className="w-[48px] h-[48px] rounded-[10px] flex items-center justify-center" style={{ backgroundColor: color }}>
        {React.cloneElement(icon, { size: 20, style: { color: iconColor } })}
      </div>
    </div>
  );
}

function VehicleCard({ vehicle, onDetails }) {
  return (
    <div className="bg-white rounded-[16px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-[400px]">
      <div className="relative h-[200px] overflow-hidden">
        <div className="absolute top-4 left-4 z-20">
           <span className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all shadow-md border ${
              vehicle.status === 'Approved' ? 'bg-[#e6ffed] text-[#82d616] border-[#82d616]/20' : 'bg-[#fff5e6] text-[#fbcf33] border-[#fbcf33]/20'
           }`}>
              {vehicle.status === 'Approved' ? 'ACTIVE' : 'AUDIT'}
           </span>
        </div>
        {vehicle.vehicle_images?.[0] ? (
          <img src={`http://localhost:5000${vehicle.vehicle_images[0].media_url}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50"><Car size={48}/></div>
        )}
      </div>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div className="space-y-1">
          <h4 className="text-[18px] font-bold text-[#252f40] leading-tight">{vehicle.name}</h4>
          <p className="text-[12px] text-[#67748e] font-medium">{vehicle.type} • {vehicle.model_year}</p>
        </div>
        
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-bold text-[#67748e] uppercase tracking-wider">Daily Rate</p>
              <p className="text-[18px] font-bold text-[#82d616]">₹{Math.floor(vehicle.price_per_day)}</p>
           </div>
           <button onClick={onDetails} className="px-5 py-2 bg-black text-white rounded-lg text-[12px] font-bold hover:bg-[#1a1a1a] transition-all">Manage</button>
        </div>
      </div>
    </div>
  );
}

function SpecCard({ icon, label, value }) {
  return (
    <div className="bg-[#f8f9fa] p-4 rounded-xl border border-gray-100 flex items-center gap-3">
       <div className="text-[#82d616]">{icon}</div>
       <div>
          <p className="text-[11px] font-medium text-[#67748e] leading-none mb-1">{label}</p>
          <p className="text-[13px] font-bold text-[#252f40] leading-none">{value || 'N/A'}</p>
       </div>
    </div>
  );
}
