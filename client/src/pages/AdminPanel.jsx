import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart as BarChartIcon, Users, Car, CheckSquare, MessageSquare, 
  Star, Tag, Landmark, Settings, LogOut, LayoutDashboard, 
  Smartphone, Search, Bell, UserCheck, TrendingUp, Clock, 
  FileText, CreditCard, ChevronDown, MoreHorizontal, Check, X
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell 
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
    { name: 'Mon', value: 2500 },
    { name: 'Tue', value: 1800 },
    { name: 'Wed', value: 9500 },
    { name: 'Thu', value: 4200 },
    { name: 'Fri', value: 5000 },
    { name: 'Sat', value: 4000 },
    { name: 'Sun', value: 4800 },
  ];

  const volumeData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 200 },
    { name: 'Thu', value: 280 },
    { name: 'Fri', value: 190 },
    { name: 'Sat', value: 240 },
    { name: 'Sun', value: 350 },
  ];

  const SidebarItem = ({ icon, label, active, count }) => (
    <div className={`flex items-center justify-between px-6 py-3.5 cursor-pointer transition-all ${
      active ? 'bg-black text-white rounded-xl mx-4' : 'text-slate-500 hover:text-black'
    }`}>
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { size: 18 })}
        <span className="text-[0.85rem] font-bold tracking-tight">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-[0.65rem] font-black px-2 py-0.5 rounded-full ${
          active ? 'bg-red-500 text-white' : 'bg-red-100 text-red-500'
        }`}>{count}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-['Plus_Jakarta_Sans']">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col py-8 shrink-0">
        <div className="px-8 mb-10 flex items-center gap-2">
          <span className="text-2xl font-black italic tracking-tighter">Quick1</span>
          <span className="text-2xl font-black text-[#B0EB00] italic tracking-tighter uppercase">ADMIN</span>
        </div>

        <div className="space-y-1 overflow-y-auto hide-scrollbar flex-1 pb-10">
          <SidebarItem icon={<LayoutDashboard/>} label="Dashboard" active />
          <SidebarItem icon={<UserCheck/>} label="Owners" />
          <SidebarItem icon={<Smartphone/>} label="Asset Applications" count={0} />
          <SidebarItem icon={<TrendingUp/>} label="Ongoing Rentals" />
          <SidebarItem icon={<Tag/>} label="Asset Pricing" />
          <SidebarItem icon={<Users/>} label="Users" />
          <SidebarItem icon={<CheckSquare/>} label="Approvals" count={verifications.length + vehicles.length} />
          <SidebarItem icon={<MessageSquare/>} label="Messages" count={0} />
          <SidebarItem icon={<Star/>} label="Reviews" />
          <SidebarItem icon={<Car/>} label="Rental Bike" />
          <SidebarItem icon={<Landmark/>} label="Rental Brands" />
          <SidebarItem icon={<Settings/>} label="App Configuration" />
        </div>

        <div className="px-4 mt-auto">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-6 py-4 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="text-[0.85rem]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar p-10">
        {/* Top Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Welcome back, Admin <span className="text-xl">👋</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1 italic">Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-red-500 font-black text-sm uppercase tracking-widest hover:underline">Logout</button>
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xs border-4 border-white shadow-sm">A</div>
          </div>
        </header>

        {/* Dashboard Overview Section */}
        <div className="space-y-8">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Dashboard Overview</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard title="Total Users" value="1" icon={<Users/>} color="blue" growth="+12%" />
            <StatCard title="Total Owners" value="1" icon={<UserCheck/>} color="green" growth="+5%" />
            <StatCard title="Total Revenue" value="₹45.2L" icon={<CreditCard/>} color="purple" growth="+10%" />
            <StatCard title="Active Rides" value="0" icon={<TrendingUp/>} color="orange" growth="+0%" />
            <StatCard title="Cancelled Rides" value="0" icon={<X/>} color="red" growth="-2%" />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest italic">Revenue Analytics</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#B0EB00" 
                      strokeWidth={3} 
                      dot={{ fill: '#B0EB00', strokeWidth: 2, r: 6, stroke: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest italic">Ride Volume</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dx={-10} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                      {volumeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#1E293B" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pending Approvals Section */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest italic">Pending Driver Approvals</h3>
              <button className="text-[0.65rem] font-bold text-[#B0EB00] uppercase tracking-widest hover:underline transition-all">View All</button>
            </div>
            
            <div className="h-[1px] bg-slate-50 w-full" />

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FBFCFD]">
                    <th className="px-8 py-4 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest italic">Driver Name</th>
                    <th className="px-8 py-4 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest italic">Vehicle</th>
                    <th className="px-8 py-4 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest italic">Applied Date</th>
                    <th className="px-8 py-4 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                    <th className="px-8 py-4 text-[1px] text-transparent">Action</th>
                    <th className="px-8 py-4 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest italic text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {verifications.length === 0 && vehicles.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-bold italic uppercase text-xs">No pending requests found</td>
                    </tr>
                  ) : (
                    <>
                      {verifications.map(v => (
                        <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs uppercase italic tracking-tighter">ID</div>
                              <span className="text-sm font-black text-slate-900 italic tracking-tight uppercase">Owner #{v.user_id}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest text-[0.65rem]">Verification Docs</td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-500 italic tracking-tight uppercase">N/A</td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-amber-50 text-amber-500 rounded-full text-[0.6rem] font-black uppercase tracking-widest shadow-sm">Pending</span>
                          </td>
                          <td className="px-8 py-5" />
                          <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <button onClick={() => handleAction('verifications', v.id, 'Verified')} className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"><Check size={16}/></button>
                               <button onClick={() => handleAction('verifications', v.id, 'Rejected')} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><X size={16}/></button>
                               <button className="w-8 h-8 text-slate-300 hover:text-slate-600 transition-all"><MoreHorizontal size={18}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                      {vehicles.map(v => (
                        <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-xs uppercase italic tracking-tighter">VH</div>
                              <span className="text-sm font-black text-slate-900 italic tracking-tight uppercase">{v.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest text-[0.65rem]">{v.type} • {v.model_year}</td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-500 italic tracking-tight uppercase">{v.registration_number}</td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-amber-50 text-amber-500 rounded-full text-[0.6rem] font-black uppercase tracking-widest shadow-sm">Pending</span>
                          </td>
                          <td className="px-8 py-5" />
                          <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <button onClick={() => handleAction('vehicles', v.id, 'Approved')} className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"><Check size={16}/></button>
                               <button onClick={() => handleAction('vehicles', v.id, 'Rejected')} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><X size={16}/></button>
                               <button className="w-8 h-8 text-slate-300 hover:text-slate-600 transition-all"><MoreHorizontal size={18}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 bg-[#FBFCFD] flex justify-between items-center border-t border-slate-50">
               <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest italic">Showing 1-10 of 120 results</p>
               <div className="flex gap-2">
                  <button className="px-4 py-2 border border-slate-100 rounded-xl text-xs font-black text-slate-400 hover:bg-white transition-all">Prev</button>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black tracking-widest shadow-lg">Next</button>
               </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon, color, growth }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-emerald-50 text-emerald-500',
    purple: 'bg-purple-50 text-purple-500',
    orange: 'bg-orange-50 text-orange-500',
    red: 'bg-red-50 text-red-500'
  };

  const isPositive = growth.startsWith('+');

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:scale-[1.02] transition-all duration-500 h-full">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <p className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest">{title}</p>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${colors[color]}`}>{icon}</div>
        </div>
        <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{value}</p>
      </div>
      <p className={`text-[0.65rem] font-black mt-4 flex items-center gap-1.5 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {growth} <span className="text-slate-400 uppercase tracking-widest font-bold font-not-italic">vs last month</span>
      </p>
    </div>
  );
}
