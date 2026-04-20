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
  const [verifications, setVerifications] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [rejectedVehicles, setRejectedVehicles] = useState([]);
  const [approvedVehicles, setApprovedVehicles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [masterVehicles, setMasterVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [masterFormData, setMasterFormData] = useState({ name: '', image: null });
  const [uploadingMaster, setUploadingMaster] = useState(false);
  const [editingMaster, setEditingMaster] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); fetchUsers(); }, []);

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
                <StatCard title="Total Revenue" value="₹0" icon={<CreditCard/>} color="#f2e6ff" iconColor="#985eff" growth="0%" />
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
 
          {activeTab === 'approved' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#252f40]">Approved Assets</h2>
                    <p className="text-[13px] text-[#67748e] mt-0.5">Comprehensive view of live fleet in the ecosystem.</p>
                  </div>
                  <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[11px] font-bold rounded-lg border border-green-100">{approvedVehicles.length} LIVE</span>
               </div>

               {approvedVehicles.map((v) => (
                 <div key={v.id} className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm flex flex-col gap-8 group">
                   <div className="flex flex-col lg:flex-row gap-8">
                     {/* Left Column: Vehicle & Owner Info */}
                     <div className="flex-1 space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Vehicle Specs */}
                         <div>
                           <h3 className="text-[15px] font-bold text-[#252f40] border-b border-gray-50 pb-2 mb-4 flex items-center gap-2">
                             <Car size={16} className="text-[#82d616]" /> Vehicle Information
                           </h3>
                           <div className="grid grid-cols-2 gap-y-3 text-[13px]">
                             <div><span className="text-[#67748e]">Name:</span> <strong className="text-[#252f40] ml-1">{v.name}</strong></div>
                             <div><span className="text-[#67748e]">Brand:</span> <strong className="text-[#252f40] ml-1">{v.type}</strong></div>
                             <div><span className="text-[#67748e]">Year:</span> <strong className="text-[#252f40] ml-1">{v.model_year}</strong></div>
                             <div><span className="text-[#67748e]">Reg No:</span> <strong className="text-[#252f40] ml-1">{v.registration_number}</strong></div>
                             <div><span className="text-[#67748e]">Fuel:</span> <strong className="text-[#252f40] ml-1">{v.fuel_type}</strong></div>
                             <div><span className="text-[#67748e]">Trans:</span> <strong className="text-[#252f40] ml-1">{v.transmission_type || 'Manual'}</strong></div>
                             <div><span className="text-[#67748e]">Seating:</span> <strong className="text-[#252f40] ml-1">{v.seating_capacity}</strong></div>
                             <div><span className="text-[#67748e]">Mileage:</span> <strong className="text-[#252f40] ml-1">{v.mileage} km/l</strong></div>
                           </div>
                         </div>
                         
                         {/* Owner Info */}
                         <div>
                           <h3 className="text-[15px] font-bold text-[#252f40] border-b border-gray-50 pb-2 mb-4 flex items-center gap-2">
                             <Users size={16} className="text-[#2167f2]" /> Owner Details
                           </h3>
                           <div className="space-y-3 text-[13px]">
                             <div className="flex justify-between"><span className="text-[#67748e]">Full Name:</span> <strong className="text-[#252f40]">{v.owner_name || 'N/A'}</strong></div>
                             <div className="flex justify-between"><span className="text-[#67748e]">Mobile:</span> <strong className="text-[#252f40]">{v.owner_mobile}</strong></div>
                             <div className="flex justify-between"><span className="text-[#67748e]">Email:</span> <strong className="text-[#252f40]">{v.owner_email || 'N/A'}</strong></div>
                             <div className="flex justify-between"><span className="text-[#67748e]">City:</span> <strong className="text-[#252f40]">{v.owner_city || 'N/A'}</strong></div>
                             <div><span className="text-[#67748e]">Address:</span> <p className="mt-1 font-medium text-[#252f40] leading-relaxed">{v.owner_address || 'N/A'}</p></div>
                           </div>
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Pricing & Performance */}
                          <div>
                            <h3 className="text-[15px] font-bold text-[#252f40] border-b border-gray-50 pb-2 mb-4 flex items-center gap-2">
                              <Tag size={16} className="text-[#fbcf33]" /> Pricing & Strategy
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-[10px] font-bold text-[#67748e] uppercase">Per Day</p>
                                <p className="text-[16px] font-bold text-[#252f40]">₹{Math.floor(v.price_per_day)}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-[10px] font-bold text-[#67748e] uppercase">Per Hour</p>
                                <p className="text-[16px] font-bold text-[#252f40]">₹{Math.floor(v.price_per_hour)}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-[10px] font-bold text-[#67748e] uppercase">Per KM</p>
                                <p className="text-[16px] font-bold text-[#252f40]">₹{Math.floor(v.price_per_km)}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-[10px] font-bold text-[#67748e] uppercase">KM Limit</p>
                                <p className="text-[16px] font-bold text-[#252f40]">{v.max_km_per_day} km</p>
                              </div>
                            </div>
                          </div>

                          {/* Deployment & Location */}
                          <div>
                            <h3 className="text-[15px] font-bold text-[#252f40] border-b border-gray-50 pb-2 mb-4 flex items-center gap-2">
                              <Landmark size={16} className="text-[#ea0606]" /> Deployment Point
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] font-bold text-[#67748e] uppercase">Primary Location</p>
                                <p className="text-[13px] font-medium text-[#252f40] mt-1 leading-relaxed">{v.pickup_location || 'Not set'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-[#67748e] uppercase">Landmark</p>
                                <p className="text-[13px] font-medium text-[#252f40] mt-1 leading-relaxed">{v.landmark || 'None specified'}</p>
                              </div>
                            </div>
                          </div>
                       </div>
                     </div>

                     {/* Right Column: Visuals & Actions */}
                     <div className="w-full lg:w-[320px] space-y-6">
                        <div className="bg-gray-50 rounded-[20px] p-6 space-y-4 border border-gray-100 flex flex-col items-center">
                           <div className="flex items-center gap-2 text-[11px] font-bold text-[#82d616] bg-white border border-[#82d616]/20 px-4 py-2 rounded-full shadow-sm">
                              <Clock size={12} />
                              APPROVED ON {v.approved_at ? new Date(v.approved_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                           </div>
                           
                           <div className="flex flex-wrap justify-center gap-3 w-full">
                              <button 
                                onClick={() => handleAction('vehicles', v.id, 'Rejected')}
                                className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl text-[12px] hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                              >
                                <X size={14} /> Revoke Approval
                              </button>
                           </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-[#67748e] uppercase tracking-wider mb-3">Vehicle Gallery</p>
                          <div className="flex flex-wrap gap-2">
                            {v.media && v.media.slice(0, 4).map((img, idx) => (
                              <div key={idx} className="w-[70px] h-[70px] rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:border-[#82d616] transition-all shadow-sm" onClick={() => setSelectedImg(`http://localhost:5000${img.media_url}`)}>
                                <img src={`http://localhost:5000${img.media_url}`} className="w-full h-full object-cover" alt="Media" />
                              </div>
                            ))}
                            {(!v.media || v.media.length === 0) && <p className="text-[11px] text-gray-400 italic">No media uploaded</p>}
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-[#67748e] uppercase tracking-wider mb-3">Owner Verification Docs</p>
                          <div className="flex gap-4">
                            <DocThumbnail label="RC Book" url={v.rc_book_url} icon={<FileText size={14}/>} onClick={() => setSelectedImg(`http://localhost:5000${v.rc_book_url}`)} />
                            <DocThumbnail label="Driving License" url={v.driving_license_url} icon={<ShieldCheck size={14}/>} onClick={() => setSelectedImg(`http://localhost:5000${v.driving_license_url}`)} />
                            <DocThumbnail label="Aadhar Card" url={v.aadhar_card_url} icon={<UserCheck size={14}/>} onClick={() => setSelectedImg(`http://localhost:5000${v.aadhar_card_url}`)} />
                          </div>
                        </div>
                     </div>
                   </div>
                 </div>
               ))}

               {approvedVehicles.length === 0 && (
                 <div className="bg-white p-20 text-center rounded-[32px] border border-gray-100 shadow-sm">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                     <Car size={40} />
                   </div>
                   <h3 className="text-xl font-bold text-[#252f40]">No Approved Assets</h3>
                   <p className="text-[#67748e] text-sm mt-1">When vehicles are validated, they will appear here.</p>
                 </div>
               )}
            </div>
          )}

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


          {activeTab === 'users' && (
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden pb-6">
              <div className="p-6 flex justify-between items-center border-b border-gray-50 mb-4">
                <h3 className="text-[18px] font-bold text-[#252f40]">All Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50/50">
                      <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">City</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">KYC Documents</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/20 transition-colors">
                        <td className="px-6 py-4 text-[14px] text-gray-900">#{u.id}</td>
                        <td className="px-6 py-4 text-[14px] font-medium text-gray-900">{u.full_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-[14px] text-gray-600">{u.mobile_number}</td>
                        <td className="px-6 py-4 text-[14px] text-gray-600">{u.city}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {u.aadhar_card_url && (
                              <button 
                                onClick={() => setSelectedImg(`http://localhost:5000${u.aadhar_card_url}`)}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                                title="Aadhar Card"
                              >
                                <UserCheck size={14}/>
                              </button>
                            )}
                            {u.driving_license_url && (
                              <button 
                                onClick={() => setSelectedImg(`http://localhost:5000${u.driving_license_url}`)}
                                className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                                title="Driving License"
                              >
                                <ShieldCheck size={14}/>
                              </button>
                            )}
                            {!u.aadhar_card_url && !u.driving_license_url && <span className="text-xs text-gray-400">No Docs</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.is_verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {u.is_verified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-[#67748e] text-[14px]">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {selectedImg && (
        <div 
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
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
