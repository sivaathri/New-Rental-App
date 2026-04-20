import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart as BarChartIcon, Users, Car, CheckSquare, MessageSquare, 
  Star, Tag, Landmark, Settings, LogOut, LayoutDashboard, 
  Smartphone, Search, Bell, UserCheck, TrendingUp, Clock, 
  FileText, CreditCard, ChevronDown, ChevronUp, MoreHorizontal, Check, X, ShieldCheck, Zap, Edit, Plus
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';

export default function AdminPanel() {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  const [verifications, setVerifications] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [rejectedVehicles, setRejectedVehicles] = useState([]);
  const [approvedVehicles, setApprovedVehicles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [masterVehicles, setMasterVehicles] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subSearchQuery, setSubSearchQuery] = useState('');
  const [subTimeFilter, setSubTimeFilter] = useState('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [masterFormData, setMasterFormData] = useState({ name: '', image: null });
  const [uploadingMaster, setUploadingMaster] = useState(false);
  const [editingMaster, setEditingMaster] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => { 
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'master') {
      navigate('/');
      return;
    }
    fetchData(); 
    fetchUsers(); 
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const verifRes = await adminAPI.getPendingVerifications();
      setVerifications(verifRes.data.verifications);
      const vehicRes = await adminAPI.getPendingVehicles();
      setVehicles(vehicRes.data.vehicles);
      const rejectedRes = await adminAPI.getRejectedVehicles();
      setRejectedVehicles(rejectedRes.data.vehicles);
      const approvedRes = await adminAPI.getApprovedVehicles();
      setApprovedVehicles(approvedRes.data.vehicles);
      const masterRes = await adminAPI.getMasterVehicles();
      setMasterVehicles(masterRes.data.vehicles);
      const subRes = await adminAPI.getSubscriptions();
      setSubscriptions(subRes.data.subscriptions);
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsersList(res.data.users);
    } catch(err) { console.error(err); }
  };

  const handleOrderChange = async (id, currentOrder, direction) => {
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    try {
      await adminAPI.updateMasterVehicleOrder(id, newOrder);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (type, id, status) => {
    let reason = '';
    if (status === 'Rejected') {
      reason = prompt('Enter rejection reason:');
      if (!reason) return;
    }
    try {
      if (type === 'vehicles') {
        await adminAPI.updateVehicleStatus(id, { status, reason });
      } else {
        await adminAPI.updateVerificationStatus(id, { status, reason });
      }
      fetchData();
    } catch(err) { alert('Error updating status'); }
  };

  const revenueData = [
    { name: 'Mon', value: 2500 }, { name: 'Tue', value: 1800 }, { name: 'Wed', value: 9500 },
    { name: 'Thu', value: 4200 }, { name: 'Fri', value: 5000 }, { name: 'Sat', value: 4000 }, { name: 'Sun', value: 4800 },
  ];

  const SidebarItem = ({ icon, label, active, count, onClick }) => (
    <div onClick={onClick} className={`flex items-center justify-between px-4 py-3 mx-4 cursor-pointer transition-all duration-200 ${
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
          <SidebarItem icon={<LayoutDashboard/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<CheckSquare/>} label="New Requests" count={vehicles.length} active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
          <SidebarItem icon={<CheckSquare/>} label="Approved" count={approvedVehicles.length} active={activeTab === 'approved'} onClick={() => setActiveTab('approved')} />
          <SidebarItem icon={<X/>} label="Rejected" count={rejectedVehicles.length} active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')} />
          <SidebarItem icon={<Car/>} label="List Vehicles" count={masterVehicles.length} active={activeTab === 'list-vehicles'} onClick={() => setActiveTab('list-vehicles')} />
          <SidebarItem icon={<Users/>} label="All Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarItem icon={<CreditCard/>} label="Subscriptions" count={subscriptions.length} active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} />
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
          {activeTab === 'dashboard' && (
            <>
              <h2 className="text-[18px] font-bold text-[#252f40]">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard title="Total Users" value={usersList.length} icon={<Users/>} color="#e6f0ff" iconColor="#2167f2" growth="+5%" />
                <StatCard title="Total Drivers" value="0" icon={<UserCheck/>} color="#e6ffed" iconColor="#17c1e8" growth="0%" />
                <StatCard 
                  title="Total Revenue" 
                  value={`₹${subscriptions.reduce((acc, curr) => acc + Number(curr.plan_price), 0).toLocaleString('en-IN')}`} 
                  icon={<CreditCard/>} color="#f2e6ff" iconColor="#985eff" growth="0%" 
                />
                <StatCard title="Active Rides" value="0" icon={<TrendingUp/>} color="#fff5e6" iconColor="#fbcf33" growth="0%" />
                <StatCard title="Pending Approvals" value={vehicles.length} icon={<Clock/>} color="#ffe6e6" iconColor="#ea0606" growth="0%" />
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
            </>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              <h2 className="text-[18px] font-bold text-[#252f40]">Pending Approvals</h2>

              {vehicles.map((v) => (
                <div key={v.id} className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-3">Vehicle Information</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div><span className="text-gray-500">Name:</span> <strong>{v.name}</strong></div>
                          <div><span className="text-gray-500">Brand:</span> <strong>{v.type}</strong></div>
                          <div><span className="text-gray-500">Model Year:</span> <strong>{v.model_year}</strong></div>
                          <div><span className="text-gray-500">Reg No:</span> <strong>{v.registration_number}</strong></div>
                          <div><span className="text-gray-500">Seating:</span> <strong>{v.seating_capacity}</strong></div>
                          <div><span className="text-gray-500">Fuel:</span> <strong>{v.fuel_type}</strong></div>
                          <div><span className="text-gray-500">Transmission:</span> <strong>{v.transmission_type || 'Manual'}</strong></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-3">Owner Details</h3>
                        <div className="grid grid-cols-1 gap-y-2 text-sm">
                          <div><span className="text-gray-500">Quick1 ID:</span> <strong className="text-[#82d616]">Q1-{v.owner_unique_id || 'N/A'}</strong></div>
                          <div><span className="text-gray-500">Owner Name:</span> <strong>{v.owner_name || 'N/A'}</strong></div>
                          <div><span className="text-gray-500">Mobile:</span> <strong>{v.owner_mobile}</strong></div>
                          <div><span className="text-gray-500">Email:</span> <strong>{v.owner_email || 'N/A'}</strong></div>
                          <div><span className="text-gray-500">City:</span> <strong>{v.owner_city || 'N/A'}</strong></div>
                          <div><span className="text-gray-500">Address:</span> <strong>{v.owner_address || 'N/A'}</strong></div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-64 flex flex-col justify-center items-center p-4 border-l border-gray-100 gap-3">
                      <button 
                        onClick={() => handleAction('vehicles', v.id, 'Approved')} 
                        className="w-full py-2.5 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
                      >
                        Accept Vehicle
                      </button>
                      <button 
                        onClick={() => handleAction('vehicles', v.id, 'Rejected')} 
                        className="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition"
                      >
                        Reject Vehicle
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Documents & Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Vehicle Media */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-tight">Vehicle Photos</p>
                        <div className="flex flex-wrap gap-3">
                          {v.media && v.media.map((img, idx) => (
                            <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                              <img 
                                src={`http://localhost:5000${img.media_url}`} 
                                alt="Vehicle" 
                                className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => setSelectedImg(`http://localhost:5000${img.media_url}`)}
                              />
                            </div>
                          ))}
                          {(!v.media || v.media.length === 0) && <p className="text-sm text-gray-400 italic">No photos uploaded</p>}
                        </div>
                      </div>

                      {/* Documents */}
                        <div className="flex flex-wrap gap-6">
                          <DocThumbnail 
                            label="RC Book" 
                            url={v.rc_book_url} 
                            icon={<FileText size={16}/>} 
                            onClick={() => setSelectedImg(`http://localhost:5000${v.rc_book_url}`)} 
                          />
                          <DocThumbnail 
                            label="Driving License" 
                            url={v.driving_license_url} 
                            icon={<ShieldCheck size={16}/>} 
                            onClick={() => setSelectedImg(`http://localhost:5000${v.driving_license_url}`)} 
                          />
                          <DocThumbnail 
                            label="Aadhar Card" 
                            url={v.aadhar_card_url} 
                            icon={<UserCheck size={16}/>} 
                            onClick={() => setSelectedImg(`http://localhost:5000${v.aadhar_card_url}`)} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {vehicles.length === 0 && (
                <div className="bg-white p-12 text-center rounded-[16px] border border-gray-100">
                  <p className="text-gray-500 font-medium">No pending requests at the moment.</p>
                </div>
              )}
            </div>
          )}
 
          {activeTab === 'approved' && (() => {
            const filteredApproved = approvedVehicles.filter(v => {
              const query = searchQuery.toLowerCase();
              return (
                v.name?.toLowerCase().includes(query) ||
                v.owner_name?.toLowerCase().includes(query) ||
                v.owner_email?.toLowerCase().includes(query) ||
                v.owner_address?.toLowerCase().includes(query) ||
                v.registration_number?.toLowerCase().includes(query) ||
                v.type?.toLowerCase().includes(query) ||
                v.owner_city?.toLowerCase().includes(query) ||
                v.owner_unique_id?.includes(query)
              );
            });

            return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
                    <div>
                      <h2 className="text-[24px] font-bold text-[#252f40]">Approved Assets Portfolio</h2>
                      <p className="text-[14px] text-[#67748e] mt-0.5">Comprehensive view of live fleet in the ecosystem.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#67748e] group-focus-within:text-[#82d616] transition-colors" size={18} />
                        <input 
                          type="text" 
                          placeholder="Search model, owner, email..." 
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#82d616]/10 focus:border-[#82d616] outline-none shadow-sm transition-all text-[13px] font-medium"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex -space-x-3">
                          {approvedVehicles.slice(0, 5).map((v, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                              <img src={v.media?.[0] ? `http://localhost:5000${v.media[0].media_url}` : `https://ui-avatars.com/api/?name=${v.name}&background=random`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                        <span className="text-[12px] font-bold text-[#252f40]">{approvedVehicles.length} LIVE</span>
                      </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredApproved.map((v) => (
                    <div key={v.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                        <div className="relative h-56 overflow-hidden">
                          <img 
                              src={v.media?.[0] ? `http://localhost:5000${v.media[0].media_url}` : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80'} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <div className="bg-white/90 backdrop-blur-md text-[#82d616] text-[10px] font-bold px-3 py-1.5 rounded-full border border-green-100 shadow-sm flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-[#82d616] rounded-full animate-pulse" /> LIVE
                            </div>
                            <div className="bg-black/80 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                                <Clock size={10} /> {formatDate(v.approved_at)}
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                              <button 
                                onClick={() => setSelectedVehicleForDetails(v)}
                                className="w-full py-3 bg-white text-black font-bold rounded-xl transition-all shadow-lg text-[13px] hover:bg-[#82d616] hover:text-white"
                              >
                                View Full Portfolio
                              </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-[18px] font-bold text-[#252f40] truncate pr-4">{v.name}</h4>
                            <span className="text-[13px] font-bold text-[#2167f2]">₹{Math.floor(v.price_per_day)}/day</span>
                          </div>
                          <p className="text-[12px] text-[#67748e] flex items-center gap-2 mb-6">
                              <Tag size={12} /> {v.type} • {v.registration_number}
                          </p>
                          
                          <div className="flex items-center justify-between border-t border-gray-50 pt-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-bold text-[#252f40] shadow-sm">
                                    {v.owner_name?.[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-[#252f40] leading-none mb-0.5">{v.owner_name}</p>
                                    <p className="text-[10px] text-[#67748e] font-medium uppercase tracking-wider">Property Owner</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setSelectedVehicleForDetails(v)}
                                className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#2167f2] hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                              >
                                <MoreHorizontal size={18} />
                              </button>
                          </div>
                        </div>
                    </div>
                  ))}
                </div>

                {filteredApproved.length === 0 && (
                  <div className="bg-white p-24 text-center rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                      <Search size={48} />
                    </div>
                    <h3 className="text-[22px] font-bold text-[#252f40]">No Matches Found</h3>
                    <p className="text-[#67748e] text-sm mt-2 max-w-sm mx-auto">We couldn't find any approved assets matching "{searchQuery}". Try a different term.</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-6 px-6 py-2 bg-black text-white text-[12px] font-bold rounded-xl hover:bg-gray-800 transition-all"
                    >
                      CLEAR SEARCH
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'rejected' && (
            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-[20px] font-bold text-[#252f40]">Rejected Vehicle Requests</h3>
                    <p className="text-[13px] text-[#67748e] mt-0.5">Manage assets that didn't meet the entry criteria.</p>
                  </div>
                  <span className="px-4 py-1.5 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg border border-red-100">{rejectedVehicles.length} ASSETS</span>
               </div>
 
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-gray-50/50">
                       <th className="p-4 text-[11px] font-bold text-[#67748e] uppercase tracking-wider border-b border-gray-100">Vehicle & Owner</th>
                       <th className="p-4 text-[11px] font-bold text-[#67748e] uppercase tracking-wider border-b border-gray-100">Contact Details</th>
                       <th className="p-4 text-[11px] font-bold text-[#67748e] uppercase tracking-wider border-b border-gray-100">Rejection Reason</th>
                       <th className="p-4 text-[11px] font-bold text-[#67748e] uppercase tracking-wider border-b border-gray-100">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {rejectedVehicles.map(v => (
                       <tr key={v.id} className="group hover:bg-gray-50/50 transition-all">
                         <td className="p-4">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 cursor-pointer" onClick={() => v.media?.[0] && setSelectedImg(v.media[0].media_url)}>
                                {v.media?.[0] ? <img src={`http://localhost:5000${v.media[0].media_url}`} className="w-full h-full object-cover" /> : <Car className="m-auto mt-3 text-gray-300"/>}
                             </div>
                             <div>
                               <p className="text-[14px] font-bold text-[#252f40]">{v.name}</p>
                               <p className="text-[12px] text-[#67748e]">{v.owner_name}</p>
                             </div>
                           </div>
                         </td>
                         <td className="p-4">
                           <div className="space-y-0.5">
                             <div className="flex items-center gap-2 text-[13px] text-[#252f40] font-medium">
                               <Smartphone size={12} className="text-[#67748e]" />
                               {v.owner_mobile}
                             </div>
                             <div className="flex items-center gap-2 text-[12px] text-[#67748e]">
                               <Star size={12} />
                               {v.type}
                             </div>
                           </div>
                         </td>
                         <td className="p-4">
                            <div className="max-w-[200px]">
                              <p className="text-[12px] text-red-600 font-medium italic">"{v.rejection_reason || 'No reason specified'}"</p>
                            </div>
                         </td>
                         <td className="p-4">
                           <div className="flex gap-2">
                             <button 
                               onClick={() => handleAction('vehicles', v.id, 'Approved')}
                               className="px-4 py-1.5 bg-[#82d616]/10 text-[#82d616] text-[11px] font-bold rounded-lg hover:bg-[#82d616] hover:text-white transition-all border border-[#82d616]/20"
                             >
                               RE-APPROVE
                             </button>
                             {v.rc_book_url && (
                                <button
                                  onClick={() => setSelectedImg(v.rc_book_url)}
                                  className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg hover:bg-black hover:text-white transition-all"
                                >
                                  <FileText size={14} />
                                </button>
                             )}
                           </div>
                         </td>
                       </tr>
                     ))}
                     {rejectedVehicles.length === 0 && (
                       <tr>
                         <td colSpan="4" className="p-12 text-center">
                            <div className="flex flex-col items-center gap-4">
                               <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                  <Check size={32} />
                               </div>
                               <div>
                                  <p className="text-[15px] font-bold text-[#252f40]">Clean Slate</p>
                                  <p className="text-[13px] text-[#67748e]">No rejected assets found in the system.</p>
                               </div>
                            </div>
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'list-vehicles' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-[24px] font-bold text-[#252f40]">Vehicle Master Management</h2>
                  <p className="text-[14px] text-[#67748e]">Establish and arrange the official ecosystem fleet for branding.</p>
                </div>
                {editingMaster && (
                   <button 
                    onClick={() => { setEditingMaster(null); setMasterFormData({ name: '', image: null }); }}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-black hover:text-white transition-all"
                   >
                     CANCEL EDITING
                   </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1">
                   <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm sticky top-10">
                      <h3 className="text-[18px] font-bold text-[#252f40] mb-6 flex items-center gap-2">
                        {editingMaster ? <Edit size={18} className="text-[#2167f2]" /> : <Plus size={18} className="text-[#fbcf33]" />}
                        {editingMaster ? 'Update Model' : 'Add New Model'}
                      </h3>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if(!masterFormData.name) return;
                        setUploadingMaster(true);
                        const fd = new FormData();
                        fd.append('name', masterFormData.name);
                        if(masterFormData.image) fd.append('image', masterFormData.image);
                        
                        try {
                          if (editingMaster) {
                            await adminAPI.updateMasterVehicle(editingMaster, fd);
                          } else {
                            await adminAPI.addMasterVehicle(fd);
                          }
                          setMasterFormData({ name: '', image: null });
                          setEditingMaster(null);
                          fetchData();
                        } catch(err) {
                           console.error(err);
                        } finally {
                          setUploadingMaster(false);
                        }
                      }} className="space-y-6">
                        <div>
                          <label className="text-[11px] font-bold text-[#67748e] uppercase mb-2 block">Vehicle Name</label>
                          <input 
                            type="text" 
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all text-sm" 
                            placeholder="e.g. Toyota Camry"
                            value={masterFormData.name}
                            onChange={e => setMasterFormData({...masterFormData, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#67748e] uppercase mb-2 block">
                            {editingMaster ? 'Update Graphic (Optional)' : 'Master Graphic'}
                          </label>
                          <div className="relative group">
                            <input 
                              key={masterFormData.image ? 'has-image' : 'no-image'}
                              type="file" 
                              id="master-graphic" 
                              className="hidden" 
                              onChange={e => setMasterFormData({...masterFormData, image: e.target.files[0]})} 
                            />
                            <label htmlFor="master-graphic" className="cursor-pointer block">
                               {masterFormData.image ? (
                                 <div className="h-40 w-full rounded-xl overflow-hidden border-2 border-black relative">
                                    <img src={URL.createObjectURL(masterFormData.image)} className="w-full h-full object-cover" />
                                 </div>
                               ) : editingMaster && masterVehicles.find(v => v.id === editingMaster)?.image_url ? (
                                 <div className="h-40 w-full rounded-xl overflow-hidden border border-gray-100 relative">
                                    <img src={`http://localhost:5000${masterVehicles.find(v => v.id === editingMaster).image_url}`} className="w-full h-full object-cover opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                       <span className="text-[10px] font-bold text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">CHANGE CURRENT GRAPHIC</span>
                                    </div>
                                 </div>
                               ) : (
                                 <div className="h-40 w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-black transition-all">
                                    <Car size={24} className="text-gray-300" />
                                    <p className="text-[11px] font-medium text-gray-400">Click to upload image</p>
                                 </div>
                               )}
                            </label>
                          </div>
                        </div>
                        <button disabled={uploadingMaster} className={`w-full py-4 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 ${editingMaster ? 'bg-[#2167f2]' : 'bg-black'}`}>
                          {uploadingMaster ? 'Processing...' : <>{editingMaster ? <Edit size={18} /> : <Check size={18} />} {editingMaster ? 'Save Changes' : 'Publish Model'}</>}
                        </button>
                      </form>
                   </div>
                </div>

                <div className="lg:col-span-2">
                   <div className="grid grid-cols-1 gap-4">
                      {masterVehicles.map((mv, index) => (
                        <div key={mv.id} className={`bg-white p-6 rounded-[24px] border shadow-sm flex items-center gap-6 transition-all ${editingMaster === mv.id ? 'border-[#2167f2] scale-[1.02] shadow-xl' : 'border-gray-100'}`}>
                           <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[14px] font-bold text-[#67748e] shrink-0 border border-gray-100">
                             #{index + 1}
                           </div>
                           <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                              <img src={`http://localhost:5000${mv.image_url}`} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-[18px] font-bold text-[#252f40]">{mv.name}</h4>
                              <p className="text-[11px] text-[#67748e]">Rank Influence: {mv.sort_order}</p>
                           </div>
                           <div className="flex gap-2">
                              <div className="flex flex-col gap-1">
                                 <button 
                                  onClick={() => handleOrderChange(mv.id, mv.sort_order, 'up')}
                                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-all"
                                 >
                                    <ChevronUp size={16} />
                                 </button>
                                 <button 
                                  onClick={() => handleOrderChange(mv.id, mv.sort_order, 'down')}
                                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-all"
                                 >
                                    <ChevronDown size={16} />
                                 </button>
                              </div>
                              <button 
                                onClick={() => {
                                  setEditingMaster(mv.id);
                                  setMasterFormData({ name: mv.name, image: null });
                                }}
                                className="p-3 bg-blue-50 text-[#2167f2] rounded-xl hover:bg-[#2167f2] hover:text-white transition-all"
                              >
                                <Edit size={18} />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'users' && (() => {
            const filteredUsers = usersList.filter(u => {
              const query = userSearchQuery.toLowerCase();
              return (
                u.full_name?.toLowerCase().includes(query) ||
                u.mobile_number?.includes(query) ||
                u.city?.toLowerCase().includes(query) ||
                u.unique_id?.includes(query)
              );
            });

            return (
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-50 mb-6">
                  <div>
                    <h3 className="text-[20px] font-bold text-[#252f40]">Registry of Users</h3>
                    <p className="text-[14px] text-[#67748e] mt-1">Manage and verify all registered fleet owners and drivers.</p>
                  </div>
                  <div className="relative group min-w-[320px] w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#67748e] group-focus-within:text-[#82d616] transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search name, ID, or mobile..." 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#82d616]/10 focus:border-[#82d616] outline-none transition-all text-sm font-medium"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto px-4">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Sys ID</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Quick1 ID</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Identity</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Compliance</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="group hover:bg-gray-50/50 transition-all rounded-xl shadow-sm">
                          <td className="px-6 py-4 bg-white border-y border-l border-gray-50 rounded-l-2xl group-hover:border-gray-100">
                             <span className="text-[14px] text-gray-400 font-medium">#{u.id}</span>
                          </td>
                          <td className="px-6 py-4 bg-white border-y border-gray-50 group-hover:border-gray-100">
                             <span className="text-[14px] font-bold text-[#82d616] bg-[#82d616]/10 px-3 py-1 rounded-lg">Q1-{u.unique_id || '----'}</span>
                          </td>
                          <td className="px-6 py-4 bg-white border-y border-gray-50 group-hover:border-gray-100">
                             <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-[#252f40]">{u.full_name || 'Anonymous User'}</span>
                                <span className="text-[12px] text-[#67748e]">{u.mobile_number} • {u.city}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 bg-white border-y border-gray-50 group-hover:border-gray-100">
                            <div className="flex gap-2">
                              {u.aadhar_card_url && (
                                <button 
                                  onClick={() => setSelectedImg(`http://localhost:5000${u.aadhar_card_url}`)}
                                  className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                  title="Aadhar Card"
                                >
                                  <UserCheck size={14}/>
                                </button>
                              )}
                              {u.driving_license_url && (
                                <button 
                                  onClick={() => setSelectedImg(`http://localhost:5000${u.driving_license_url}`)}
                                  className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                  title="Driving License"
                                >
                                  <ShieldCheck size={14}/>
                                </button>
                              )}
                              {!u.aadhar_card_url && !u.driving_license_url && <span className="text-[11px] font-bold text-gray-300 italic">No Uploads</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 bg-white border-y border-r border-gray-50 rounded-r-2xl group-hover:border-gray-100">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.is_verified ? 'bg-[#82d616]/10 text-[#82d616] border border-[#82d616]/20' : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}>
                              {u.is_verified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-20 text-center">
                             <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                                   <Users size={32} />
                                </div>
                                <p className="text-[14px] font-bold text-[#252f40]">No matching users found</p>
                             </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeTab === 'subscriptions' && (() => {
            const filteredSubs = subscriptions.filter(s => {
              const matchesSearch = 
                s.user_name?.toLowerCase().includes(subSearchQuery.toLowerCase()) ||
                s.mobile_number?.includes(subSearchQuery) ||
                s.plan_name?.toLowerCase().includes(subSearchQuery.toLowerCase()) ||
                String(s.user_unique_id)?.includes(subSearchQuery);
              
              if (!matchesSearch) return false;
              if (subTimeFilter === 'all') return true;

              const subDate = new Date(s.start_date);
              const now = new Date();
              const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              const startOfYear = new Date(now.getFullYear(), 0, 1);

              if (subTimeFilter === 'day') return subDate >= startOfDay;
              if (subTimeFilter === 'week') return subDate >= startOfWeek;
              if (subTimeFilter === 'month') return subDate >= startOfMonth;
              if (subTimeFilter === 'year') return subDate >= startOfYear;
              
              return true;
            });

            const totalAmount = filteredSubs.reduce((acc, curr) => acc + Number(curr.plan_price), 0);

            return (
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 border-b border-gray-50 mb-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <div>
                      <h3 className="text-[20px] font-bold text-[#252f40]">Membership Subscriptions</h3>
                      <p className="text-[14px] text-[#67748e] mt-1">Manage and monitor all active and historical plan purchases.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="bg-[#f2e6ff] px-6 py-3 rounded-2xl border border-purple-100">
                        <p className="text-[10px] font-bold text-[#985eff] uppercase tracking-wider mb-0.5">Filtered Total</p>
                        <p className="text-[18px] font-bold text-[#252f40]">₹{totalAmount.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-[#e6ffed] px-6 py-3 rounded-2xl border border-green-100">
                        <p className="text-[10px] font-bold text-[#82d616] uppercase tracking-wider mb-0.5">Active Plans</p>
                        <p className="text-[18px] font-bold text-[#252f40]">{filteredSubs.filter(s => s.status === 'Active').length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 group w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#67748e] group-focus-within:text-[#82d616] transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search user, mobile or plan..." 
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#82d616]/10 focus:border-[#82d616] outline-none transition-all text-sm font-medium"
                        value={subSearchQuery}
                        onChange={(e) => setSubSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100 w-full md:w-auto">
                      {[
                        { label: 'Today', value: 'day' },
                        { label: 'Week', value: 'week' },
                        { label: 'Month', value: 'month' },
                        { label: 'Year', value: 'year' },
                        { label: 'All', value: 'all' },
                      ].map((f) => (
                        <button
                          key={f.value}
                          onClick={() => setSubTimeFilter(f.value)}
                          className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-all ${
                            subTimeFilter === f.value 
                              ? 'bg-black text-white shadow-lg' 
                              : 'text-[#67748e] hover:bg-gray-100'
                          }`}
                        >
                          {f.label.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto px-4">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">User Details</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Plan Architecture</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Financials</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Validity Period</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#67748e] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubs.map((s) => (
                        <tr key={s.id} className="group hover:bg-gray-50/50 transition-all rounded-xl shadow-sm">
                          <td className="px-6 py-5 bg-white border-y border-l border-gray-50 rounded-l-2xl group-hover:border-gray-100">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-[#f2e6ff] flex items-center justify-center text-[#985eff] font-bold text-[14px]">
                                 {s.user_name?.[0] || 'U'}
                               </div>
                               <div>
                                 <p className="text-[14px] font-bold text-[#252f40] leading-none mb-1">{s.user_name || 'N/A'}</p>
                                 <p className="text-[12px] text-[#67748e]">{s.mobile_number}</p>
                               </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 bg-white border-y border-gray-50 group-hover:border-gray-100">
                             <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#82d616]" />
                                <span className="text-[14px] font-bold text-[#252f40]">{s.plan_name}</span>
                             </div>
                             <span className="text-[11px] text-[#67748e] mt-1 block uppercase font-medium">{s.duration_days} Days Access</span>
                          </td>
                          <td className="px-6 py-5 bg-white border-y border-gray-50 group-hover:border-gray-100">
                             <div className="text-[15px] font-bold text-[#252f40]">₹{s.plan_price}</div>
                             <span className="text-[11px] text-[#67748e] uppercase tracking-wider font-bold">Paid</span>
                          </td>
                          <td className="px-6 py-5 bg-white border-y border-gray-50 group-hover:border-gray-100">
                             <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[12px] text-[#252f40] font-medium">
                                   <Clock size={12} className="text-[#67748e]" />
                                   Ends: {new Date(s.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                                <div className="text-[10px] text-[#67748e] font-bold uppercase tracking-tighter">
                                   Started {new Date(s.start_date).toLocaleDateString()}
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-5 bg-white border-y border-r border-gray-50 rounded-r-2xl group-hover:border-gray-100">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                               s.status === 'Active' ? 'bg-[#82d616]/10 text-[#82d616] border border-[#82d616]/20' : 
                               s.status === 'Stacked' ? 'bg-[#2167f2]/10 text-[#2167f2] border border-[#2167f2]/20' : 
                               'bg-gray-100 text-gray-500 border border-gray-200'
                             }`}>
                               {s.status}
                             </span>
                          </td>
                        </tr>
                      ))}
                      {filteredSubs.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-20 text-center">
                             <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                                   <Search size={32} />
                                </div>
                                <div>
                                   <p className="text-[16px] font-bold text-[#252f40]">No Results Found</p>
                                   <p className="text-[13px] text-[#67748e]">Try adjusting your search or filters.</p>
                                </div>
                             </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      </main>

      {/* Full Details Modal for Approved Assets */}
      {selectedVehicleForDetails && (
        <div 
          className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedVehicleForDetails(null)}
        >
          <div 
            className="bg-white w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl relative my-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedVehicleForDetails(null)}
              className="absolute top-8 right-8 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all z-10 shadow-sm"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col h-[85vh]">
               {/* Hero Section in Modal */}
               <div className="relative h-72 shrink-0">
                  <img 
                    src={selectedVehicleForDetails.media?.[0] ? `http://localhost:5000${selectedVehicleForDetails.media[0].media_url}` : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80'} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-10 w-full">
                     <div className="flex justify-between items-end">
                        <div>
                           <div className="flex items-center gap-2 mb-2">
                             <span className="px-3 py-1 bg-[#82d616] text-white text-[10px] font-bold rounded-full">ACTIVE FLEET</span>
                             <span className="text-[13px] font-bold text-[#67748e]">{selectedVehicleForDetails.registration_number}</span>
                           </div>
                           <h2 className="text-[36px] font-extrabold text-[#252f40] leading-none mb-2">{selectedVehicleForDetails.name}</h2>
                           <p className="text-[16px] text-[#67748e] font-medium flex items-center gap-2">
                             <Tag size={16} className="text-[#2167f2]" /> {selectedVehicleForDetails.type} • Premium Tier Asset
                           </p>
                        </div>
                        <div className="flex gap-3">
                           <button 
                             onClick={() => {
                               if(window.confirm('Are you sure you want to revoke approval for this vehicle?')) {
                                 handleAction('vehicles', selectedVehicleForDetails.id, 'Rejected');
                                 setSelectedVehicleForDetails(null);
                               }
                             }}
                             className="px-8 py-4 bg-red-50 text-red-600 font-bold rounded-2xl text-[14px] hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
                           >
                             <ShieldCheck size={18} /> Revoke Permit
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-10 pt-4 space-y-12 no-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                     {/* Specifications */}
                     <div className="lg:col-span-2 space-y-10">
                        <section>
                           <h3 className="text-[18px] font-bold text-[#252f40] mb-6 flex items-center gap-3">
                             <div className="w-10 h-10 bg-[#82d616]/10 rounded-xl flex items-center justify-center">
                               <Car size={20} className="text-[#82d616]" />
                             </div>
                             Technical Specifications
                           </h3>
                           <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                              {[
                                { label: 'Year', value: selectedVehicleForDetails.model_year, icon: <Clock size={16}/> },
                                { label: 'Fuel', value: selectedVehicleForDetails.fuel_type, icon: <Zap size={16}/> },
                                { label: 'Transmission', value: selectedVehicleForDetails.transmission_type || 'Manual', icon: <Settings size={16}/> },
                                { label: 'Seating', value: `${selectedVehicleForDetails.seating_capacity} Seater`, icon: <Users size={16}/> },
                                { label: 'Mileage', value: `${selectedVehicleForDetails.mileage} km/l`, icon: <TrendingUp size={16}/> },
                                { label: 'Max KM/Day', value: `${selectedVehicleForDetails.max_km_per_day} km`, icon: <Search size={16}/> },
                              ].map((spec, i) => (
                                <div key={i} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                   <div className="text-[#67748e] mb-2">{spec.icon}</div>
                                   <p className="text-[10px] font-bold text-[#67748e] uppercase tracking-wider mb-1">{spec.label}</p>
                                   <p className="text-[15px] font-bold text-[#252f40]">{spec.value}</p>
                                </div>
                              ))}
                           </div>
                        </section>

                        <section>
                           <h3 className="text-[18px] font-bold text-[#252f40] mb-6 flex items-center gap-3">
                             <div className="w-10 h-10 bg-[#fbcf33]/10 rounded-xl flex items-center justify-center">
                               <Tag size={20} className="text-[#fbcf33]" />
                             </div>
                             Commercial Strategy
                           </h3>
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl text-white">
                                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Daily Rental</p>
                                 <h4 className="text-[28px] font-extrabold mb-1">₹{Math.floor(selectedVehicleForDetails.price_per_day)}</h4>
                                 <p className="text-[11px] text-gray-400">Net revenue per 24 hours</p>
                              </div>
                              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                 <p className="text-[11px] font-bold text-[#67748e] uppercase tracking-widest mb-3">Hourly Rate</p>
                                 <h4 className="text-[24px] font-bold text-[#252f40] mb-1">₹{Math.floor(selectedVehicleForDetails.price_per_hour)}</h4>
                                 <p className="text-[11px] text-[#67748e]">Flexible booking unit</p>
                              </div>
                              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                 <p className="text-[11px] font-bold text-[#67748e] uppercase tracking-widest mb-3">Excess KM</p>
                                 <h4 className="text-[24px] font-bold text-[#252f40] mb-1">₹{Math.floor(selectedVehicleForDetails.price_per_km)}</h4>
                                 <p className="text-[11px] text-[#67748e] font-medium">Add-on per kilometer</p>
                              </div>
                           </div>
                        </section>

                        <section>
                           <h3 className="text-[18px] font-bold text-[#252f40] mb-6">Visual Repository</h3>
                           <div className="grid grid-cols-4 gap-4">
                              {selectedVehicleForDetails.media?.map((img, idx) => (
                                <div 
                                  key={idx} 
                                  className="aspect-square rounded-2xl overflow-hidden border border-gray-100 cursor-pointer hover:border-[#82d616] transition-all group relative"
                                  onClick={() => setSelectedImg(`http://localhost:5000${img.media_url}`)}
                                >
                                  <img src={`http://localhost:5000${img.media_url}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <Search size={20} className="text-white" />
                                  </div>
                                </div>
                              ))}
                              {(!selectedVehicleForDetails.media || selectedVehicleForDetails.media.length === 0) && (
                                <div className="col-span-4 p-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                                   No high-resolution images available
                                </div>
                              )}
                           </div>
                        </section>
                     </div>

                     {/* Sidebar Info */}
                     <div className="space-y-10">
                        <div className="bg-gray-50/50 p-8 rounded-[24px] border border-gray-100 space-y-8">
                           <h3 className="text-[15px] font-bold text-[#252f40] uppercase tracking-wider flex items-center gap-2">
                              <Landmark size={16} className="text-[#ea0606]" /> Base Operations
                           </h3>
                             <div className="space-y-6">
                              <div>
                                 <p className="text-[11px] font-bold text-[#67748e] uppercase mb-1.5">Primary Pickup Point</p>
                                 <p className="text-[14px] font-semibold text-[#252f40] leading-relaxed">{selectedVehicleForDetails.pickup_location || 'Not Configured'}</p>
                              </div>
                              <div>
                                 <p className="text-[11px] font-bold text-[#67748e] uppercase mb-1.5">Strategic Landmark</p>
                                 <p className="text-[14px] font-semibold text-[#252f40]">{selectedVehicleForDetails.landmark || 'No specific identifier'}</p>
                              </div>
                              <div>
                                 <p className="text-[11px] font-bold text-[#67748e] uppercase mb-1.5">Registry Active Since</p>
                                 <p className="text-[14px] font-bold text-[#82d616]">{formatDate(selectedVehicleForDetails.approved_at)}</p>
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-8 rounded-[24px] border border-gray-100 space-y-8 shadow-sm">
                           <h3 className="text-[15px] font-bold text-[#252f40] uppercase tracking-wider flex items-center gap-2">
                              <Users size={16} className="text-[#2167f2]" /> Ownership Details
                           </h3>
                           <div className="space-y-5">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-blue-50 text-[#2167f2] rounded-full flex items-center justify-center font-bold text-lg border border-blue-100">
                                    {selectedVehicleForDetails.owner_name?.[0].toUpperCase()}
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-bold text-[#82d616] uppercase tracking-[2px] mb-1">Q1-{selectedVehicleForDetails.owner_unique_id || 'N/A'}</p>
                                    <p className="text-[16px] font-bold text-[#252f40] leading-none mb-1">{selectedVehicleForDetails.owner_name}</p>
                                    <p className="text-[11px] text-[#67748e] font-medium uppercase tracking-widest">{selectedVehicleForDetails.owner_city}</p>
                                 </div>
                              </div>
                              <div className="pt-4 space-y-4 border-t border-gray-50">
                                 <div className="flex items-center gap-3 text-[13px] text-[#252f40]">
                                    <Smartphone size={16} className="text-[#67748e]" /> <strong>{selectedVehicleForDetails.owner_mobile}</strong>
                                 </div>
                                 <div className="flex items-center gap-3 text-[13px] text-[#252f40]">
                                    <MessageSquare size={16} className="text-[#67748e]" /> <strong>{selectedVehicleForDetails.owner_email || 'No email provided'}</strong>
                                 </div>
                                 <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-[10px] font-bold text-[#67748e] uppercase mb-2">Registered Address</p>
                                    <p className="text-[13px] font-medium text-[#252f40] leading-relaxed">{selectedVehicleForDetails.owner_address || 'N/A'}</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <h3 className="text-[15px] font-bold text-[#252f40] uppercase tracking-wider">Compliance Documents</h3>
                           <div className="grid grid-cols-3 gap-3">
                              <DocThumbnail label="RC Book" url={selectedVehicleForDetails.rc_book_url} icon={<FileText size={16}/>} onClick={() => setSelectedImg(`http://localhost:5000${selectedVehicleForDetails.rc_book_url}`)} />
                              <DocThumbnail label="License" url={selectedVehicleForDetails.driving_license_url} icon={<ShieldCheck size={16}/>} onClick={() => setSelectedImg(`http://localhost:5000${selectedVehicleForDetails.driving_license_url}`)} />
                              <DocThumbnail label="Aadhar" url={selectedVehicleForDetails.aadhar_card_url} icon={<UserCheck size={16}/>} onClick={() => setSelectedImg(`http://localhost:5000${selectedVehicleForDetails.aadhar_card_url}`)} />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImg && (
        <div 
          className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
              onClick={() => setSelectedImg(null)}
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImg} 
              alt="Preview" 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 flex gap-4">
              <button 
                onClick={() => window.open(selectedImg, '_blank')}
                className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition shadow-lg flex items-center gap-2"
              >
                <FileText size={18}/> Open in New Tab
              </button>
            </div>
          </div>
        </div>
      )}


      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #f8f9fa; }
      `}</style>
    </div>
  );
}

function DocThumbnail({ label, url, icon, onClick }) {
  if (!url) return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <div className="w-20 h-24 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1">
        <X size={14} className="text-red-300"/>
        <span className="text-[9px] text-red-400 font-bold">MISSING</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
      <div 
        onClick={onClick}
        className="group relative w-20 h-24 rounded-lg overflow-hidden border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-all"
      >
        <img 
          src={`http://localhost:5000${url}`} 
          alt={label} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full border border-white/30 text-white">
            {icon}
          </div>
        </div>
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
