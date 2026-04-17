import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart as BarChartIcon, Users, Car, CheckSquare, MessageSquare, 
  Star, Tag, Landmark, Settings, LogOut, LayoutDashboard, 
  Smartphone, Search, Bell, UserCheck, TrendingUp, Clock, 
  FileText, CreditCard, ChevronDown, MoreHorizontal, Check, X, ShieldCheck, Zap
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';

export default function AdminPanel() {
  const [verifications, setVerifications] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE = 'http://localhost:5000/api/admin';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const verifRes = await axios.get(`${API_BASE}/verifications/pending`);
      setVerifications(verifRes.data.verifications);
      const vehicRes = await axios.get(`${API_BASE}/vehicles/pending`);
      setVehicles(vehicRes.data.vehicles);
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (type, id, status) => {
    let reason = '';
    if (status === 'Rejected') {
      reason = prompt('Enter rejection reason:');
      if (!reason) return;
    }
    try {
      await axios.post(`${API_BASE}/${type}/${id}/status`, { status, reason });
      fetchData();
    } catch(err) { alert('Error updating status'); }
  };

  const revenueData = [
    { name: 'Mon', value: 2500 }, { name: 'Tue', value: 1800 }, { name: 'Wed', value: 9500 },
    { name: 'Thu', value: 4200 }, { name: 'Fri', value: 5000 }, { name: 'Sat', value: 4000 }, { name: 'Sun', value: 4800 },
  ];

  const SidebarItem = ({ icon, label, active, count }) => (
    <div className={`flex items-center justify-between px-4 py-3 mx-4 cursor-pointer transition-all duration-200 ${
      active ? 'bg-black text-white rounded-[10px]' : 'text-[#67748e] hover:text-black'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${active ? 'bg-[#1a1a1a]' : 'bg-white shadow-sm border border-gray-100'}`}>
          {React.cloneElement(icon, { size: 16, className: active ? 'text-white' : 'text-[#67748e]' })}
        </div>
        <span className={`text-[13px] font-medium leading-none ${active ? 'font-semibold' : ''}`}>{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className="bg-[#ea0606] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{count}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-['Inter', sans-serif]">
      {/* Sidebar - Same as UI Design */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col py-6 shrink-0 h-screen sticky top-0">
        <div className="px-8 mb-8 flex items-center">
          <span className="text-[22px] font-bold tracking-tight text-[#252f40]">Quick1</span>
          <span className="text-[22px] font-bold text-[#82d616] tracking-tight ml-0.5">ADMIN</span>
        </div>

        <div className="space-y-1 overflow-y-auto no-scrollbar flex-1 pb-10">
          <SidebarItem icon={<LayoutDashboard/>} label="Dashboard" active />
          <SidebarItem icon={<UserCheck/>} label="Cab Drivers" />
          <SidebarItem icon={<Smartphone/>} label="Cab Applications" count={0} />
          <SidebarItem icon={<TrendingUp/>} label="Ongoing Rides" />
          <SidebarItem icon={<Tag/>} label="Vehicle Pricing" />
          <SidebarItem icon={<Users/>} label="Users" />
          <SidebarItem icon={<CheckSquare/>} label="Approvals" count={3} />
          <SidebarItem icon={<MessageSquare/>} label="Messages" count={0} />
          <SidebarItem icon={<Star/>} label="Reviews" />
          <SidebarItem icon={<Car/>} label="Rental Bike" />
          <SidebarItem icon={<Landmark/>} label="Rental Brands" />
          <SidebarItem icon={<FileText/>} label="Rental Models" />
          <SidebarItem icon={<CreditCard/>} label="Rental Bookings" />
          <SidebarItem icon={<Tag/>} label="Rental Coupons" />
        </div>

        <div className="px-4 mt-auto pt-6 border-t border-gray-50">
          <button 
            onClick={() => navigate('/')}
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
              Welcome back, Admin 👋
            </h1>
            <p className="text-[#67748e] text-[14px] mt-0.5">Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-1.5 border border-[#ea0606] text-[#ea0606] font-semibold text-[13px] rounded-lg hover:bg-red-50 transition-all">Logout</button>
            <div className="w-10 h-10 bg-[#000] rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
          </div>
        </header>

        <div className="space-y-8">
          <h2 className="text-[18px] font-bold text-[#252f40]">Dashboard Overview</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard title="Total Users" value="0" icon={<Users/>} color="#e6f0ff" iconColor="#2167f2" growth="0%" />
            <StatCard title="Total Drivers" value="0" icon={<UserCheck/>} color="#e6ffed" iconColor="#17c1e8" growth="0%" />
            <StatCard title="Total Revenue" value="₹0" icon={<CreditCard/>} color="#f2e6ff" iconColor="#985eff" growth="0%" />
            <StatCard title="Active Rides" value="0" icon={<TrendingUp/>} color="#fff5e6" iconColor="#fbcf33" growth="0%" />
            <StatCard title="Cancelled Rides" value="0" icon={<X/>} color="#ffe6e6" iconColor="#ea0606" growth="0%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
               <h3 className="text-[16px] font-bold text-[#252f40] mb-6">Revenue Analytics</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#67748e', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#67748e', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="value" stroke="#82d616" strokeWidth={3} dot={{ r: 4, fill: '#82d616', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
               <h3 className="text-[16px] font-bold text-[#252f40] mb-6">Ride Volume</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#67748e', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#67748e', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{ borderRadius: '10px', border: 'none' }} />
                    <Bar dataKey="value" fill="#252f40" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden pb-6">
            <div className="p-6 flex justify-between items-center">
              <h3 className="text-[16px] font-bold text-[#252f40]">Pending Driver Approvals</h3>
              <button className="text-[13px] font-bold text-[#82d616] hover:underline">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-4 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Driver Name</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#67748e] uppercase tracking-wider text-center">Applied Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#67748e] uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#67748e] uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-[#67748e] text-[14px]">
                        No pending approvals found
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #f8f9fa; }
      `}</style>
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
