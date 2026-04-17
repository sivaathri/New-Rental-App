import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart as BarChartIcon,
  Users,
  Car,
  CheckSquare,
  MessageSquare,
  Star,
  Tag,
  Landmark,
  Settings,
  LogOut,
  LayoutDashboard,
  Smartphone,
  Search,
  Bell,
  UserCheck,
  TrendingUp,
  Clock,
  FileText,
  CreditCard,
  ChevronDown,
  MoreHorizontal,
  Check,
  X,
  Zap,
  ShieldCheck,
  ExternalLink,
  Fuel,
  Gauge,
  User,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Navigation,
  Mail,
  MapPin,
  Globe,
  AlertCircle,
  CheckCircle,
  Hash,
  Flag,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationPickerModal({ onSelect, onClose }) {
  const [position, setPosition] = useState([11.9416, 79.8083]); 
  const [address, setAddress] = useState('Fetching location...');

  function MapEvents() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setAddress('Resolving address...');
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          setAddress(data.display_name);
        } catch (err) { setAddress('Unknown location'); }
      },
    });
    return position ? <Marker position={position} /> : null;
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#252f40]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#252f40]">Pin Pickup Location</h2>
            <p className="text-[13px] font-medium text-gray-400 mt-1">Pin the location on map and click select</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="flex-1 relative bg-gray-50">
          <MapContainer center={[11.9416, 79.8083]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents />
          </MapContainer>
        </div>
        <div className="p-8 bg-white border-t border-gray-100 flex items-center justify-between gap-8">
           <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Primary Address</p>
              <p className="text-sm font-bold text-[#252f40] leading-tight">{address}</p>
           </div>
           <button 
              onClick={() => onSelect(address)}
              className="px-12 py-4 bg-[#82d616] text-white rounded-2xl font-bold text-[14px] shadow-lg shadow-[#82d616]/20 transition-all hover:scale-105"
           >
              Select Point
           </button>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange, disabled, type = 'text', icon: Icon, required }) {
  return (
    <div className="space-y-2 w-full">
       <label className="text-[13px] font-bold text-[#252f40] flex items-center">
         {label}
         {required && <span className="text-red-500 ml-1">*</span>}
       </label>
       <div className="relative group">
         {Icon && (
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#82d616] transition-colors">
             <Icon size={18} />
           </div>
         )}
         <input 
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className={`w-full bg-white border border-gray-100 h-[50px] rounded-xl font-medium text-[#252f40] outline-none transition-all ${Icon ? 'pl-11' : 'px-5'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-[#82d616] focus:ring-4 focus:ring-[#82d616]/5'}`}
         />
       </div>
    </div>
  );
}

function SelectGroup({ label, options, value, onChange, icon: Icon, required }) {
  return (
    <div className="space-y-2 w-full">
       <label className="text-[13px] font-bold text-[#252f40] flex items-center">
         {label}
         {required && <span className="text-red-500 ml-1">*</span>}
       </label>
       <div className="relative group">
         {Icon && (
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#82d616] transition-colors">
             <Icon size={18} />
           </div>
         )}
         <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white border border-gray-100 h-[50px] rounded-xl font-medium text-[#252f40] outline-none transition-all appearance-none ${Icon ? 'pl-11' : 'px-5'} focus:border-[#82d616] focus:ring-4 focus:ring-[#82d616]/5`}
         >
           {options.map(o => <option key={o} value={o}>{o}</option>)}
         </select>
         <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={18} />
         </div>
       </div>
    </div>
  );
}

const PLAN_LIMITS = {
  "1 Month": { "Bike": Infinity, "Car": 2, "Van": 1, "Bus": 1, "Mini-Van": 1, "Mini-Bus": 1, "Tempo_traveller": 1, "traveller": 1 },
  "3 Month": { "Bike": Infinity, "Car": 3, "Van": 2, "Bus": 2, "Mini-Van": 2, "Mini-Bus": 2, "Tempo_traveller": 2, "traveller": 2 },
  "6 Month": { "Bike": Infinity, "Car": 5, "Van": 3, "Bus": 3, "Mini-Van": 3, "Mini-Bus": 3, "Tempo_traveller": 3, "traveller": 3 },
  "12 Month": { "Bike": Infinity, "Car": Infinity, "Van": Infinity, "Bus": Infinity, "Mini-Van": Infinity, "Mini-Bus": Infinity, "Tempo_traveller": Infinity, "traveller": Infinity }
};

function AddVehicleModal({ onClose, onVehicleAdded, vehicles, subscriptions }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState({
    type: 'Car', name: '', model_year: '', registration_number: '', rc_book: null,
    seating_capacity: '', fuel_type: 'Petrol', mileage: '', 
    price_per_day: '', price_per_hour: '', price_per_km: '', max_km_per_day: '', 
    pickup_location: '', landmark: ''
  });
  const [media, setMedia] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const activePlan = subscriptions.find(s => s.status === 'Active');
  const currentCount = vehicles.filter(v => v.type === vehicle.type && v.status !== 'Rejected').length;
  const limit = activePlan ? (PLAN_LIMITS[activePlan.plan_name]?.[vehicle.type] || 0) : 0;
  const isOverLimit = activePlan ? currentCount >= limit : true;

  const API_BASE = "http://localhost:5000/api";
  const vehicleTypes = ["Car", "Bike", "Bus", "Van", "Mini-Van", "Mini-Bus", "Tempo_traveller", "traveller"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (media.length < 4) return alert("Minimum 4 images required");
    
    setLoading(true);
    const formData = new FormData();
    Object.keys(vehicle).forEach(k => {
      if (k !== 'rc_book') formData.append(k, vehicle[k]);
    });
    if (vehicle.rc_book) formData.append('rc_book', vehicle.rc_book);
    media.forEach(file => formData.append('media', file));

    try {
      await axios.post(`${API_BASE}/vehicles/add`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Asset synchronized into ecosystem. Awaiting validation.");
      onVehicleAdded();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding vehicle. Check limits.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#252f40]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[90vh] animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg">
               <Car size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#252f40]">Add New Asset</h2>
              <p className="text-[13px] font-medium text-gray-400 mt-0.5">Step {step} of 3 • {step === 1 ? 'Technical Config' : step === 2 ? 'Deployment Point' : 'Media Gallery'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10">
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
               {isOverLimit && (
                 <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center justify-between text-red-600">
                    <div className="flex items-center gap-4">
                       <AlertCircle size={24}/>
                       <div>
                          <p className="font-bold">Slot Limit Reached</p>
                          <p className="text-[12px] opacity-80">Your current {activePlan?.plan_name || 'Free'} plan allows {limit === Infinity ? 'Unlimited' : limit} {vehicle.type === 'Tempo_traveller' ? 'Tempo Traveller' : vehicle.type}s. Upgrade to add more.</p>
                       </div>
                    </div>
                    <button onClick={() => { onClose(); setActiveTab('Subscription'); }} className="px-5 py-2 bg-red-600 text-white rounded-xl text-[11px] font-bold">UPGRADE</button>
                 </div>
               )}
               <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <SelectGroup label="Vehicle Type" options={vehicleTypes} value={vehicle.type} onChange={(v) => setVehicle({...vehicle, type: v})} icon={Car} />
                     <InputGroup label="Vehicle Name" placeholder="Example: Swift, Innova" value={vehicle.name} onChange={(v) => setVehicle({...vehicle, name: v.toUpperCase()})} icon={Tag} required />
                     <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Model Year" placeholder="2022" type="number" value={vehicle.model_year} onChange={(v) => setVehicle({...vehicle, model_year: v})} icon={Clock} required />
                        <InputGroup label="Reg. Number" placeholder="PY01XX1234" value={vehicle.registration_number} onChange={(v) => setVehicle({...vehicle, registration_number: v.toUpperCase()})} icon={Hash} required />
                     </div>
                  </div>
                  <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center gap-4">
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md overflow-hidden text-[#82d616]">
                         {vehicle.rc_book ? <img src={URL.createObjectURL(vehicle.rc_book)} className="w-full h-full object-cover" /> : <FileText size={32} />}
                      </div>
                      <p className="font-bold text-[#252f40]">RC Book Copy</p>
                      <label className="bg-black text-white px-6 py-3 rounded-xl font-bold text-[12px] cursor-pointer hover:bg-[#1a1a1a] transition-all shadow-md">
                         {vehicle.rc_book ? "Change RC" : "Upload RC Image"}
                         <input type="file" accept="image/*" className="hidden" onChange={(e) => setVehicle({...vehicle, rc_book: e.target.files[0]})} />
                      </label>
                  </div>
               </section>

               <section className="pt-8 border-t border-gray-50">
                  <h3 className="text-lg font-bold text-[#252f40] mb-6 flex items-center gap-2"><Zap size={18} className="text-[#82d616]"/> Technical & Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <InputGroup label="Seating" type="number" value={vehicle.seating_capacity} onChange={(v) => setVehicle({...vehicle, seating_capacity: v})} icon={Users} />
                     <SelectGroup label="Fuel Type" options={["Petrol", "Diesel", "Electric", "CNG"]} value={vehicle.fuel_type} onChange={(v) => setVehicle({...vehicle, fuel_type: v})} icon={Zap} />
                     <InputGroup label="Mileage" type="number" value={vehicle.mileage} onChange={(v) => setVehicle({...vehicle, mileage: v})} icon={Sparkles} />
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                     <InputGroup label="Per Day" type="number" value={vehicle.price_per_day} onChange={(v) => setVehicle({...vehicle, price_per_day: v})} icon={IndianRupee} />
                     <InputGroup label="Per Hour" type="number" value={vehicle.price_per_hour} onChange={(v) => setVehicle({...vehicle, price_per_hour: v})} icon={Clock} />
                     <InputGroup label="Per KM" type="number" value={vehicle.price_per_km} onChange={(v) => setVehicle({...vehicle, price_per_km: v})} icon={Navigation} />
                     <InputGroup label="KM Limit" type="number" value={vehicle.max_km_per_day} onChange={(v) => setVehicle({...vehicle, max_km_per_day: v})} icon={LayoutDashboard} />
                  </div>
               </section>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center gap-10">
                   <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-[#82d616] shadow-xl shrink-0"><MapPin size={40}/></div>
                   <div className="flex-1 text-center md:text-left">
                      <h4 className="text-xl font-bold text-[#252f40] mb-2">Set Pickup Location</h4>
                      <p className="text-[#67748e] font-medium mb-6">{vehicle.pickup_location || "Renter will see this on the map for collection."}</p>
                      <button onClick={() => setShowMap(true)} className="px-8 py-3 bg-black text-white rounded-xl font-bold text-[13px] hover:bg-[#1a1a1a] transition-all shadow-md">Pick Location on Map</button>
                   </div>
                </div>
                <InputGroup label="Nearby Landmark" placeholder="Example: Near MG Road Post Office" value={vehicle.landmark} onChange={(v) => setVehicle({...vehicle, landmark: v})} icon={Flag} required />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {[...Array(5)].map((_, i) => {
                    const file = media[i];
                    return (
                      <div key={i} className="aspect-square bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
                        {file ? (
                          <>
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                            <button onClick={() => setMedia(media.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><X size={24} className="text-white"/></button>
                            {i === 0 && <span className="absolute top-3 left-3 bg-[#82d616] text-black px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">Primary</span>}
                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                              <Plus size={24} className="text-gray-300" />
                              <p className="text-[9px] font-black text-gray-400 mt-2 uppercase">Slot {i+1}</p>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                if (e.target.files[0]) setMedia([...media, e.target.files[0]]);
                              }} />
                          </label>
                        )}
                      </div>
                    )
                  })}
               </div>
               <p className={`text-sm font-bold ${media.length >= 4 ? 'text-[#82d616]' : 'text-red-500'}`}>
                  {media.length} / 4 minimum images required to launch
               </p>
            </div>
          )}
        </div>

        <div className="p-8 bg-white border-t border-gray-50 flex gap-4">
           {step > 1 && <button onClick={() => setStep(step - 1)} className="w-[100px] bg-gray-50 text-[#252f40] rounded-2xl font-bold flex items-center justify-center hover:bg-gray-100 transition-all"><ChevronLeft size={24}/></button>}
           {step < 3 ? (
             <button 
              onClick={() => {
                if (isOverLimit) return alert(`Limit Reached: Your current plan only allows ${limit} ${vehicle.type}s. Please upgrade.`);
                if(step === 1 && (!vehicle.name || !vehicle.registration_number || !vehicle.rc_book)) return alert("Complete basic configuration first");
                if(step === 2 && !vehicle.pickup_location) return alert("Select deployment point on map");
                setStep(step + 1);
              }} 
              className="flex-1 bg-black text-white h-[60px] rounded-2xl font-bold hover:bg-[#1a1a1a] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
             >
               Next Phase <ChevronRight size={20} />
             </button>
           ) : (
             <button onClick={handleSubmit} disabled={loading || media.length < 4 || isOverLimit} className="flex-1 bg-[#82d616] text-white h-[60px] rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-[#82d616]/20 flex items-center justify-center">
                {loading ? "Synchronizing Asset..." : "Complete Registration"}
             </button>
           )}
        </div>
      </div>
      {showMap && <LocationPickerModal onSelect={(a) => { setVehicle({...vehicle, pickup_location: a}); setShowMap(false); }} onClose={() => setShowMap(false)} />}
    </div>
  );
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showMap, setShowMap] = useState(false);
  const [updatingVehicle, setUpdatingVehicle] = useState(null);
  const [editingLandmark, setEditingLandmark] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    callbackClicks: 0,
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [editPricing, setEditPricing] = useState({});
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [isEmailUpdating, setIsEmailUpdating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedSubscriptionVehicle, setSelectedSubscriptionVehicle] = useState(null);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedVehicle) return;
    setIsSubscribing(true);
    try {
      await axios.post(`${API_BASE}/vehicles/${selectedVehicle.id}/subscribe`, { 
        plan_duration: selectedPlan.duration, 
        plan_price: selectedPlan.price 
      }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      
      setSelectedVehicle({ ...selectedVehicle, has_active_subscription: true });
      fetchDashboard();
      alert("Subscription activated! Your vehicle is now live.");
    } catch (err) {
      alert("Error activating subscription");
    } finally {
      setIsSubscribing(false);
    }
  };
  const handleSavePricing = async () => {
    try {
      await axios.post(
        `${API_BASE}/vehicles/${selectedVehicle.id}/update-pricing`,
        editPricing,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setSelectedVehicle({ ...selectedVehicle, ...editPricing });
      setIsEditingPricing(false);
      fetchDashboard();
    } catch (err) {
      alert("Error updating pricing");
    }
  };

  const handleRequestEmailChange = async () => {
    if (!newEmail) return alert("Enter a valid email");
    setIsEmailUpdating(true);
    try {
      await axios.post(`${API_BASE}/profile/request-email-change`, { newEmail }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setShowEmailOtpInput(true);
    } catch (err) {
      alert(err.response?.data?.error || "Error requesting email change");
    } finally {
      setIsEmailUpdating(false);
    }
  };

  const handleVerifyEmailChange = async () => {
    if (!emailOtp) return alert("Enter OTP");
    setIsEmailUpdating(true);
    try {
      await axios.post(`${API_BASE}/profile/verify-email-change`, { newEmail, otp: emailOtp }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setIsEditingEmail(false);
      setShowEmailOtpInput(false);
      setEmailOtp("");
      fetchDashboard();
      alert("Email updated successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Invalid OTP");
    } finally {
      setIsEmailUpdating(false);
    }
  };

  const handleUpdateLocation = async (vId, address) => {
    try {
      const vehicle = vehicles.find(v => v.id === vId);
      await axios.post(`${API_BASE}/vehicles/${vId}/update-pricing`, {
        ...vehicle,
        pickup_location: address
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchDashboard();
      setShowMap(false);
      alert("Location updated!");
    } catch (err) {
      alert("Error updating location");
    }
  };

  const handleUpdateLandmark = async (vId, landmark) => {
    try {
      const vehicle = vehicles.find(v => v.id === vId);
      await axios.post(`${API_BASE}/vehicles/${vId}/update-pricing`, {
        ...vehicle,
        landmark
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchDashboard();
      alert("Landmark updated!");
    } catch (err) {
      alert("Error updating landmark");
    }
  };

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

      const profileRes = await axios.get(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(profileRes.data);

      const counts = { pending: 0, approved: 0 };
      res.data.vehicles.forEach((v) => {
        if (v.status === "Waiting for Approval") counts.pending++;
        if (v.status === "Approved") counts.approved++;
      });
      const unpaidApproved = res.data.vehicles.filter(v => v.status === "Approved" && !v.has_active_subscription);
      setNotifications(unpaidApproved);

      const subRes = await axios.get(`${API_BASE}/subscriptions/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserSubscriptions(subRes.data.subscriptions);

      setStats({
        total: res.data.vehicles.length,
        ...counts,
        callbackClicks: 124,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

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
          <span className="text-[22px] font-bold text-[#82d616] ml-0.5">
            OWNER
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-10">
          <SidebarNavItem
            icon={<LayoutDashboard />}
            label="Dashboard"
            active={activeTab === "Dashboard"}
            onClick={() => setActiveTab("Dashboard")}
          />
          <SidebarNavItem
            icon={<IndianRupee />}
            label="Pricing Strategy"
            active={activeTab === "Pricing Strategy"}
            onClick={() => setActiveTab("Pricing Strategy")}
          />
          <SidebarNavItem
            icon={<Car />}
            label="Reviews"
            active={activeTab === "Reviews"}
            onClick={() => setActiveTab("Reviews")}
          />
          <SidebarNavItem
            icon={<TrendingUp />}
            label="Subscription"
            active={activeTab === "Subscription"}
            onClick={() => setActiveTab("Subscription")}
          />
          <SidebarNavItem
            icon={<FileText />}
            label="Reports"
            active={activeTab === "Reports"}
            onClick={() => setActiveTab("Reports")}
          />
          <SidebarNavItem
            icon={<Settings />}
            label="Settings"
            active={activeTab === "Settings"}
            onClick={() => setActiveTab("Settings")}
          />
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
              Welcome back, {userProfile?.user?.full_name ? userProfile.user.full_name.split(' ')[0] : "Owner"} 👋
            </h1>
            <p className="text-[#67748e] text-[14px] mt-0.5">
              Here's your fleet performance overview.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-4 py-1.5 bg-black text-white text-[13px] font-bold rounded-lg hover:bg-[#1a1a1a] transition-all shadow-md"
            >
              Add New Vehicle
            </button>
            <div className="w-10 h-10 bg-[#000] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {userProfile?.user?.full_name ? userProfile.user.full_name.charAt(0).toUpperCase() : "O"}
            </div>
          </div>
        </header>

        {activeTab === "Dashboard" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {notifications.length > 0 && (
              <div className="space-y-4 mb-10">
                {notifications.map(n => (
                  <div key={n.id} className="bg-white p-6 rounded-[28px] border border-[#82d616]/20 shadow-xl shadow-[#82d616]/5 flex items-center justify-between group animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100">
                          {n.vehicle_images?.[0] ? (
                            <img src={`http://localhost:5000${n.vehicle_images[0].media_url}`} className="w-full h-full object-cover" alt="" />
                          ) : <Car size={24} className="text-gray-300 m-auto mt-4"/>}
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#82d616] rounded-full flex items-center justify-center text-white border-4 border-white">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[17px] font-bold text-[#252f40]">Your {n.name} is approved! 🚀</h4>
                        <p className="text-[13px] text-[#67748e]">Complete the listing by choosing a subscription plan.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedSubscriptionVehicle(n);
                        setActiveTab("Subscription");
                      }}
                      className="px-8 py-3 bg-[#82d616] text-white rounded-xl font-bold text-[13px] hover:scale-105 transition-all shadow-lg shadow-[#82d616]/20"
                    >
                      Pay & List Vehicle
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-[18px] font-bold text-[#252f40]">
              Portfolio Performance
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Vehicles"
                value={stats.total}
                icon={<Car />}
                color="#e6f0ff"
                iconColor="#2167f2"
                growth="+0%"
              />
              <StatCard
                title="Active Vehicles"
                value={stats.approved}
                icon={<Zap />}
                color="#e6ffed"
                iconColor="#82d616"
                growth="+0%"
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                icon={<Clock />}
                color="#fff5e6"
                iconColor="#fbcf33"
                growth="+0%"
              />
              <StatCard
                title="Yield Factor"
                value="124"
                icon={<TrendingUp />}
                color="#f2e6ff"
                iconColor="#985eff"
                growth="+0%"
              />
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
        )}

        {activeTab === "Pricing Strategy" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm mb-10">
              <div>
                <h2 className="text-[20px] font-bold text-[#252f40]">
                  Fleet Pricing Strategy
                </h2>
                <p className="text-[#67748e] text-[14px] mt-1">
                  Manage rental rates and distance limits across your entire
                  fleet.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#e6ffed] px-4 py-2 rounded-xl text-[#82d616] font-bold text-sm">
                <Tag size={16} />
                Optimal Pricing Active
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {vehicles.length > 0 ? (
                vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100">
                        {v.vehicle_images?.[0] ? (
                          <img
                            src={`http://localhost:5000${v.vehicle_images[0].media_url}`}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Car size={32} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-[18px] font-bold text-[#252f40]">
                          {v.name}
                        </h4>
                        <p className="text-[13px] text-[#67748e] font-medium">
                          {v.type} • {v.registration_number}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 max-w-2xl px-8 border-l border-r border-gray-50">
                      <PricingSmallCard
                        label="Per Day"
                        value={Math.floor(v.price_per_day)}
                        icon={<IndianRupee size={14} />}
                      />
                      <PricingSmallCard
                        label="Per Hour"
                        value={Math.floor(v.price_per_hour)}
                        icon={<Clock size={14} />}
                      />
                      <PricingSmallCard
                        label="Per KM"
                        value={Math.floor(v.price_per_km)}
                        icon={<Navigation size={14} />}
                      />
                      <PricingSmallCard
                        label="Limit"
                        value={v.max_km_per_day}
                        suffix="KM"
                        icon={<TrendingUp size={14} />}
                      />
                    </div>

                    <button
                      onClick={() => setSelectedVehicle(v)}
                      className="px-8 py-3 bg-black text-white rounded-xl font-bold text-[13px] hover:bg-[#1a1a1a] transition-all whitespace-nowrap shadow-sm"
                    >
                      Adjust Strategy
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
                  <Tag size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">
                    No assets found to manage pricing.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6 mb-10">
                   <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                      {userProfile?.user?.full_name?.charAt(0) || 'O'}
                   </div>
                   <div>
                      <h2 className="text-[28px] font-bold text-[#252f40] flex items-center gap-3">
                         {userProfile?.user?.full_name}
                         {userProfile?.verification?.status === 'Verified' && <ShieldCheck size={24} className="text-[#82d616]" />}
                      </h2>
                      <p className="text-[#67748e] font-medium">Owner Account Verified • Member since {new Date(userProfile?.user?.created_at || Date.now()).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                   <div className="bg-[#f8f9fa] p-6 rounded-[24px] border border-gray-50 flex flex-col justify-between">
                      <div>
                         <p className="text-[11px] font-bold text-[#67748e] uppercase tracking-widest mb-4">Personal Email</p>
                         {!isEditingEmail ? (
                            <div className="flex items-center justify-between gap-3">
                               <div className="flex items-center gap-3">
                                  <Mail size={18} className="text-black" />
                                  <span className="font-bold text-[#252f40] truncate max-w-[120px]">{userProfile?.user?.email || 'Not Provided'}</span>
                               </div>
                               <button onClick={() => { setIsEditingEmail(true); setNewEmail(userProfile?.user?.email || ""); }} className="text-[10px] font-bold text-[#82d616] hover:underline">EDIT</button>
                            </div>
                         ) : (
                            <div className="space-y-3">
                               {!showEmailOtpInput ? (
                                  <>
                                     <input 
                                        type="email" 
                                        value={newEmail} 
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="New Email"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] font-bold outline-none focus:border-[#82d616]"
                                     />
                                     <div className="flex gap-2">
                                        <button 
                                           disabled={isEmailUpdating}
                                           onClick={handleRequestEmailChange}
                                           className="flex-1 bg-black text-white text-[10px] font-bold py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                                        >
                                           {isEmailUpdating ? "SENDING..." : "GET OTP"}
                                        </button>
                                        <button onClick={() => setIsEditingEmail(false)} className="px-3 py-2 text-[10px] font-bold text-gray-400 hover:text-black">CANCEL</button>
                                     </div>
                                  </>
                               ) : (
                                  <>
                                     <p className="text-[10px] text-[#67748e]">OTP sent to <b>{newEmail}</b></p>
                                     <input 
                                        type="text" 
                                        value={emailOtp} 
                                        onChange={(e) => setEmailOtp(e.target.value)}
                                        placeholder="6-digit OTP"
                                        maxLength={6}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] font-bold outline-none focus:border-[#82d616] tracking-widest"
                                     />
                                     <div className="flex gap-2">
                                        <button 
                                           disabled={isEmailUpdating}
                                           onClick={handleVerifyEmailChange}
                                           className="flex-1 bg-[#82d616] text-white text-[10px] font-bold py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                                        >
                                           {isEmailUpdating ? "VERIFYING..." : "VERIFY & SAVE"}
                                        </button>
                                        <button onClick={() => setShowEmailOtpInput(false)} className="px-3 py-2 text-[10px] font-bold text-gray-400 hover:text-black">BACK</button>
                                     </div>
                                  </>
                                )}
                            </div>
                         )}
                      </div>
                   </div>
                   <div className="bg-[#f8f9fa] p-6 rounded-[24px] border border-gray-50">
                      <p className="text-[11px] font-bold text-[#67748e] uppercase tracking-widest mb-4">Mobile Number</p>
                      <div className="flex items-center gap-3">
                         <Smartphone size={18} className="text-black" />
                         <span className="font-bold text-[#252f40]">{userProfile?.user?.mobile_number}</span>
                      </div>
                   </div>
                   <div className="bg-[#f8f9fa] p-6 rounded-[24px] border border-gray-50">
                      <p className="text-[11px] font-bold text-[#67748e] uppercase tracking-widest mb-4">Verification Status</p>
                      <div className="flex items-center gap-3">
                         <span className={`px-4 py-1.5 rounded-xl text-[12px] font-bold border ${userProfile?.verification?.status === 'Verified' ? 'bg-[#e6ffed] text-[#82d616] border-[#82d616]/20' : 'bg-[#fff5e6] text-[#fbcf33] border-[#fbcf33]/20'}`}>
                            {userProfile?.verification?.status?.toUpperCase() || 'PENDING'}
                         </span>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xl font-bold text-[#252f40]">Verification Documents</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-[24px] border border-gray-100 flex items-center justify-between group hover:border-[#82d616]/30 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#e6ffed] group-hover:text-[#82d616] transition-all">
                               <FileText size={24} />
                            </div>
                            <div>
                               <p className="font-bold text-[#252f40]">Aadhar Card</p>
                               <p className="text-[12px] text-[#67748e]">National Identity Document</p>
                            </div>
                         </div>
                         {userProfile?.verification?.aadhar_card_url ? (
                            <a href={`http://localhost:5000${userProfile.verification.aadhar_card_url}`} target="_blank" rel="noreferrer" className="px-5 py-2 bg-black text-white rounded-xl text-[12px] font-bold shadow-md hover:scale-105 transition-all">View Copy</a>
                         ) : <span className="text-[12px] font-bold text-red-500">Missing</span>}
                      </div>

                      <div className="p-6 rounded-[24px] border border-gray-100 flex items-center justify-between group hover:border-[#82d616]/30 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#e6ffed] group-hover:text-[#82d616] transition-all">
                               <FileText size={24} />
                            </div>
                            <div>
                               <p className="font-bold text-[#252f40]">Driving License</p>
                               <p className="text-[12px] text-[#67748e]">Authorised Vehicle Operation Doc</p>
                            </div>
                         </div>
                         {userProfile?.verification?.driving_license_url ? (
                            <a href={`http://localhost:5000${userProfile.verification.driving_license_url}`} target="_blank" rel="noreferrer" className="px-5 py-2 bg-black text-white rounded-xl text-[12px] font-bold shadow-md hover:scale-105 transition-all">View Copy</a>
                         ) : <span className="text-[12px] font-bold text-red-500">Missing</span>}
                      </div>
                   </div>
                </div>

                <div className="space-y-6 mt-10 pt-10 border-t border-gray-50">
                   <h3 className="text-xl font-bold text-[#252f40]">Vehicle RC Books</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {vehicles.map(v => (
                         <div key={v.id} className="p-6 rounded-[24px] border border-gray-100 flex items-center justify-between group hover:border-[#82d616]/30 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#e6ffed] group-hover:text-[#82d616] transition-all">
                                  <Car size={24} />
                               </div>
                               <div>
                                  <p className="font-bold text-[#252f40]">{v.name} RC</p>
                                  <p className="text-[12px] text-[#67748e]">{v.registration_number}</p>
                               </div>
                            </div>
                            {v.rc_book_url ? (
                               <a href={`http://localhost:5000${v.rc_book_url}`} target="_blank" rel="noreferrer" className="px-5 py-2 bg-black text-white rounded-xl text-[12px] font-bold shadow-md hover:scale-105 transition-all">View RC</a>
                            ) : <span className="text-[12px] font-bold text-red-500">Missing</span>}
                         </div>
                      ))}
                      {vehicles.length === 0 && (
                         <div className="col-span-full py-10 text-center bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
                            <p className="text-gray-400 text-sm font-medium">No vehicles registered yet.</p>
                         </div>
                      )}
                   </div>
                </div>

                <div className="space-y-6 mt-10 pt-10 border-t border-gray-50">
                   <h3 className="text-xl font-bold text-[#252f40]">Vehicle Locations</h3>
                   <div className="grid grid-cols-1 gap-6">
                      {vehicles.map(v => (
                         <div key={v.id} className="bg-[#f8f9fa] p-8 rounded-[32px] border border-gray-50 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#82d616] shadow-sm">
                                  <MapPin size={24} />
                               </div>
                               <div>
                                  <h4 className="font-bold text-[#252f40] text-lg">{v.name} Deployment</h4>
                                  <p className="text-sm font-medium text-[#67748e]">{v.registration_number}</p>
                               </div>
                            </div>
                            
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                               <div className="space-y-2">
                                  <label className="text-[11px] font-bold text-[#67748e] uppercase tracking-widest">Pickup Address</label>
                                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 min-h-[56px]">
                                     <span className="text-[13px] font-bold text-[#252f40] truncate max-w-[200px]">{v.pickup_location || 'No location set'}</span>
                                     <button onClick={() => { setUpdatingVehicle(v.id); setShowMap(true); }} className="text-[10px] font-bold text-[#82d616] hover:underline whitespace-nowrap">CHANGE ON MAP</button>
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[11px] font-bold text-[#67748e] uppercase tracking-widest">Nearby Landmark</label>
                                  <div className="flex items-center gap-2">
                                     <input 
                                        type="text" 
                                        defaultValue={v.landmark}
                                        onBlur={(e) => handleUpdateLandmark(v.id, e.target.value)}
                                        placeholder="Major landmark nearby"
                                        className="flex-1 bg-white border border-gray-100 rounded-2xl px-4 py-3 text-[13px] font-bold outline-none focus:border-[#82d616] shadow-sm"
                                     />
                                  </div>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {(activeTab === "My Vehicles" || activeTab === "Earnings" || activeTab === "Reports" || activeTab === "Reviews") && (
          <div className="py-40 text-center bg-white rounded-[32px] border border-gray-50 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-gray-50 rounded-[24px] flex items-center justify-center text-gray-300 mb-6">
              <Settings
                size={40}
                className="animate-spin duration-[10s] linear infinite"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#252f40] mb-2">
              {activeTab} Section
            </h2>
            <p className="text-[#67748e] max-w-sm">
              This module is currently being optimized for high-performance
              vehicle management. Stay tuned for real-time updates.
            </p>
            <button
              onClick={() => setActiveTab("Dashboard")}
              className="mt-8 px-8 py-3 bg-black text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#1a1a1a] transition-all"
            >
              Back to Overview
            </button>
          </div>
        )}

        {activeTab === "Subscription" && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <header>
              <h2 className="text-[32px] font-bold text-[#252f40]">Membership Plans</h2>
              <p className="text-[#67748e] text-[15px] mt-1">Upgrade your fleet capacity and network reach.</p>
            </header>

            {/* Current Active Plan Alert */}
            {userSubscriptions.find(s => s.status === "Active") && (
              <div className="bg-black text-white p-8 rounded-[32px] flex items-center justify-between shadow-2xl shadow-black/20">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#82d616]/20 rounded-2xl flex items-center justify-center text-[#82d616]">
                    <Zap size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Active {userSubscriptions.find(s => s.status === "Active").plan_name} Plan</h4>
                    <p className="text-gray-400 text-sm">Valid until {new Date(userSubscriptions.find(s => s.status === "Active").end_date).toLocaleDateString()} • Your fleet is synchronized.</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Status</p>
                   <span className="px-4 py-1.5 bg-[#82d616] text-black text-[12px] font-bold rounded-lg uppercase tracking-tight">Active Node</span>
                </div>
              </div>
            )}

            {/* Plan Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { 
                   name: "Starter Node", 
                   id: "1 Month",
                   desc: "Perfect for single vehicle owners",
                   price: 600, 
                   oldPrice: 3999,
                   off: "85%",
                   duration: "30 days", 
                   popular: false,
                   features: ["Unlimited Bike Slots", "2 Car Limit", "1 Other (Bus/Van) Slot", "Basic Node Verification"],
                   benefits: ["HQ Priority Support", "Standard Listing Status", "Basic Fleet Analytics"]
                 },
                 { 
                   name: "Growth Node", 
                   id: "3 Month",
                   desc: "Power & efficiency for small fleets",
                   price: 1200, 
                   oldPrice: 5999,
                   off: "80%",
                   duration: "90 days", 
                   popular: false,
                   features: ["Unlimited Bike Slots", "3 Car Limit", "2 Other Slots", "Priority Node Verification"],
                   benefits: ["Accelerated HQ Support", "Enhanced Listing Status", "Advanced Fleet Analytics"]
                 },
                 { 
                   name: "Platinum Node", 
                   id: "6 Month",
                   desc: "Total control for professional fleets",
                   price: 2000, 
                   oldPrice: 9999,
                   off: "80%",
                   duration: "180 days", 
                   popular: true,
                   features: ["Unlimited Bike Slots", "5 Car Limit", "3 Other Slots", "Express Node Verification"],
                   benefits: ["24/7 Direct HQ Access", "VIP Listing Priority", "Real-time Profit Analytics", "Multi-Region Visibility"]
                 },
                 { 
                   name: "Cloud Fleet", 
                   id: "12 Month",
                   desc: "Unlimited power for global operations",
                   price: 3000, 
                   oldPrice: 14999,
                   off: "80%",
                   duration: "365 days", 
                   popular: false,
                   features: ["Unlimited Bike Slots", "Unlimited Car Limit", "Unlimited Other Slots", "Instant Node Activation"],
                   benefits: ["Dedicated Account General", "Global Network Dominance", "AI-Powered Fleet Scaling", "Beta Access to New Tech"]
                 },
               ].map(p => (
                 <div key={p.name} className={`relative bg-white rounded-[32px] p-10 flex flex-col border-[2px] transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${p.popular ? 'border-[#6366f1] shadow-2xl shadow-[#6366f1]/10' : 'border-gray-50'}`}>
                    {p.popular && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#6366f1] text-white text-[11px] font-black uppercase tracking-[2px] py-2 px-6 rounded-full shadow-lg">
                        Most Popular
                      </div>
                    )}
                    <div className="absolute top-6 right-6 bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-red-100">
                      {p.off} OFF
                    </div>

                    <div className="mb-8">
                       <h3 className="text-2xl font-bold text-[#252f40] mb-2">{p.name}</h3>
                       <p className="text-[#67748e] text-[13px] leading-relaxed">{p.desc}</p>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#67748e] text-lg line-through opacity-50 font-medium">₹{p.oldPrice}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-[#252f40]">₹{p.price}</span>
                         
                        </div>
                        <p className="text-[#6366f1] text-[11px] font-bold mt-2 uppercase tracking-wide">Valid for {p.duration}</p>
                    </div>

                    <button 
                      onClick={async () => {
                        if (!window.confirm(`Initiate ${p.name} Transmission for ₹${p.price}?`)) return;
                        setIsSubscribing(true);
                        try {
                          await axios.post(`${API_BASE}/subscriptions/purchase`, { planName: p.id }, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                          });
                          alert("Membership Link Established! Node Updated.");
                          fetchDashboard();
                        } catch(e) { alert("Transmission Interrupted: Purchase Failed"); } finally { setIsSubscribing(false); }
                      }}
                      className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all mb-10 ${p.popular ? 'bg-[#6366f1] text-white shadow-xl shadow-[#6366f1]/30 hover:bg-[#4f46e5]' : 'bg-white text-[#6366f1] border-2 border-[#6366f1] hover:bg-[#6366f1]/5'}`}
                    >
                      Choose Plan
                    </button>

                    <div className="space-y-5 mt-auto border-t border-gray-50 pt-8">
                       <div className="space-y-4">
                          {p.features.map(f => (
                            <div key={f} className="flex items-center gap-3 group/item">
                               <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center text-[#6366f1]">
                                 <Globe size={12} strokeWidth={3} />
                               </div>
                               <span className="text-[13px] text-[#252f40] font-semibold border-b border-dotted border-gray-200 flex-1 py-1 group-hover/item:border-gray-400 transition-colors">{f}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Tracking Table */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#252f40]">Plan Tracking</h3>
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-gray-50/30">
                       <th className="p-6 text-[11px] font-bold text-[#67748e] uppercase border-b border-gray-50">Membership</th>
                       <th className="p-6 text-[11px] font-bold text-[#67748e] uppercase border-b border-gray-50">Purchase Date</th>
                       <th className="p-6 text-[11px] font-bold text-[#67748e] uppercase border-b border-gray-50">Activation Window</th>
                       <th className="p-6 text-[11px] font-bold text-[#67748e] uppercase border-b border-gray-50">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {userSubscriptions.map(s => (
                       <tr key={s.id} className="text-[14px]">
                         <td className="p-6 font-bold text-[#252f40]">{s.plan_name}</td>
                         <td className="p-6 text-[#67748e] font-medium">{new Date(s.start_date).toLocaleDateString()}</td>
                         <td className="p-6 text-[#67748e] font-bold">
                           {new Date(s.start_date).toLocaleDateString()} - {new Date(s.end_date).toLocaleDateString()}
                         </td>
                         <td className="p-6">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                             s.status === 'Active' ? 'bg-[#e6ffed] text-[#82d616]' : 
                             s.status === 'Stacked' ? 'bg-[#fff5e6] text-[#fbcf33]' : 
                             'bg-red-50 text-red-500'
                           }`}>
                             {s.status}
                           </span>
                         </td>
                       </tr>
                     ))}
                     {userSubscriptions.length === 0 && (
                       <tr>
                         <td colSpan="4" className="p-10 text-center text-[#67748e] font-medium italic">No subscription history found.</td>
                       </tr>
                     )}
                   </tbody>
                </table>
              </div>
            </div>

            {/* Reminder logic alert (optional Notification) */}
            {userSubscriptions.find(s => s.status === 'Active' && (new Date(s.end_date) - new Date()) < (2 * 24 * 60 * 60 * 1000)) && (
               <div className="bg-red-50 border border-red-100 p-6 rounded-[24px] flex items-center gap-4 text-red-600 animate-pulse">
                 <AlertCircle size={24} />
                 <div>
                   <p className="font-bold">⚠️ Membership Expiring Soon!</p>
                   <p className="text-sm opacity-80">Your plan expires in less than 2 days. Stack a new plan to avoid disruption.</p>
                 </div>
               </div>
            )}
          </div>
        )}
      </main>

      {/* Detail Manager Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-[#000]/40 backdrop-blur-sm"
            onClick={() => setSelectedVehicle(null)}
          />
          <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="relative h-[300px] group bg-black">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-6 right-6 z-30 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-black hover:bg-gray-100 transition-all"
              >
                <X size={20} />
              </button>
              {selectedVehicle.vehicle_images?.length > 0 ? (
                <img
                  src={`http://localhost:5000${selectedVehicle.vehicle_images[0].media_url}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt=""
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                  <Car size={64} />
                </div>
              )}
            </div>

            <div className="p-10 space-y-10 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-[32px] font-bold text-[#252f40] leading-none mb-4">
                    {selectedVehicle.name}
                  </h2>
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-[#f8f9fa] text-[#67748e] rounded-lg text-[12px] font-bold border border-gray-100">
                      {selectedVehicle.type}
                    </span>
                    <span
                      className={`px-4 py-1.5 rounded-lg text-[12px] font-bold border ${selectedVehicle.status === "Approved" ? "bg-[#e6ffed] text-[#82d616] border-[#82d616]/20" : "bg-[#fff5e6] text-[#fbcf33] border-[#fbcf33]/20"}`}
                    >
                      {selectedVehicle.status}
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div>
                    <p className="text-[12px] font-medium text-[#67748e] mb-1">
                      Daily Yield
                    </p>
                    <div
                      className="flex items-center gap-2 group cursor-pointer"
                      onClick={() => {
                        if (!isEditingPricing) {
                          setEditPricing({
                            price_per_day: selectedVehicle.price_per_day,
                            price_per_hour: selectedVehicle.price_per_hour,
                            price_per_km: selectedVehicle.price_per_km,
                            max_km_per_day: selectedVehicle.max_km_per_day,
                          });
                          setIsEditingPricing(true);
                        }
                      }}
                    >
                      <p className="text-[32px] font-bold text-[#82d616] leading-none">
                        ₹{Math.floor(selectedVehicle.price_per_day)}
                      </p>
                      <Settings
                        size={16}
                        className="text-gray-300 group-hover:text-[#82d616] transition-colors"
                      />
                    </div>
                  </div>
                  {selectedVehicle.rc_book_url && (
                    <a
                      href={`http://localhost:5000${selectedVehicle.rc_book_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold border border-blue-100 hover:bg-blue-100 transition-all"
                    >
                      <FileText size={14} />
                      View RC Book
                    </a>
                  )}
                </div>
              </div>

              {/* Media Manager Section */}
              {/* Media Manager Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#252f40] flex items-center gap-2">
                    <Sparkles size={18} className="text-[#82d616]" />
                    Media Gallery
                  </h3>
                  <p className="text-[12px] text-gray-400 font-medium">
                    Reorder to set primary thumbnail
                  </p>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {selectedVehicle.vehicle_images?.length > 0 ? (
                    selectedVehicle.vehicle_images.map((img, i) => (
                      <div
                        key={img.id}
                        className="w-[180px] h-[120px] rounded-2xl border border-gray-100 relative overflow-hidden shrink-0 group"
                      >
                        <img
                          src={`http://localhost:5000${img.media_url}`}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
                          {i > 0 && (
                            <button
                              onClick={async () => {
                                const newMedia = [
                                  ...selectedVehicle.vehicle_images,
                                ];
                                [newMedia[i - 1], newMedia[i]] = [
                                  newMedia[i],
                                  newMedia[i - 1],
                                ];
                                const mediaIds = newMedia.map((m) => m.id);
                                try {
                                  await axios.post(
                                    `${API_BASE}/vehicles/${selectedVehicle.id}/media/reorder`,
                                    { mediaIds },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                      },
                                    },
                                  );
                                  setSelectedVehicle({
                                    ...selectedVehicle,
                                    vehicle_images: newMedia,
                                  });
                                  fetchDashboard();
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                              className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white"
                            >
                              <ChevronLeft size={14} />
                            </button>
                          )}
                          {i < selectedVehicle.vehicle_images.length - 1 && (
                            <button
                              onClick={async () => {
                                const newMedia = [
                                  ...selectedVehicle.vehicle_images,
                                ];
                                [newMedia[i], newMedia[i + 1]] = [
                                  newMedia[i + 1],
                                  newMedia[i],
                                ];
                                const mediaIds = newMedia.map((m) => m.id);
                                try {
                                  await axios.post(
                                    `${API_BASE}/vehicles/${selectedVehicle.id}/media/reorder`,
                                    { mediaIds },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                      },
                                    },
                                  );
                                  setSelectedVehicle({
                                    ...selectedVehicle,
                                    vehicle_images: newMedia,
                                  });
                                  fetchDashboard();
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                              className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white"
                            >
                              <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                        {i === 0 && (
                          <div className="absolute top-2 left-2 bg-[#82d616] text-[#252f40] px-2 py-0.5 rounded-md text-[8px] font-bold uppercase">
                            Main
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="w-full py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                      <Plus size={32} />
                      <p className="text-[12px] font-bold mt-2">
                        No Media Uploaded
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedVehicle.status === "Approved" && !selectedVehicle.has_active_subscription && (
                <div className="pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="flex flex-col gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-[#252f40] flex items-center gap-2">
                        <Zap size={24} className="text-[#fbcf33]" />
                        Subscription Activation Required
                      </h3>
                      <p className="text-[14px] text-[#67748e] mt-1">Your vehicle is approved! Select a plan to start receiving bookings.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <YieldCard 
                         active={selectedPlan?.duration === 1} 
                         onSelect={() => setSelectedPlan({duration: 1, price: 700})} 
                         title="Starter" 
                         price="₹700" 
                         sub="1 Month Listing" 
                       />
                       <YieldCard 
                         active={selectedPlan?.duration === 3} 
                         onSelect={() => setSelectedPlan({duration: 3, price: 1200})} 
                         title="Growth" 
                         price="₹1200" 
                         sub="3 Months Priority" 
                         popular 
                       />
                    </div>

                    <button 
                      onClick={handleSubscribe}
                      disabled={!selectedPlan || isSubscribing}
                      className="w-full py-6 bg-[#82d616] text-white rounded-[2rem] font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-[#82d616]/20 disabled:grayscale disabled:opacity-50"
                    >
                      {isSubscribing ? "Activating Node..." : "Pay & Sync Listing"}
                    </button>
                  </div>
                </div>
              )}

              {/* Pricing Strategy Section */}
              <div className="pt-10 border-t border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-[#252f40]">
                    Pricing Strategy
                  </h3>
                  <button
                    onClick={() => {
                      if (isEditingPricing) handleSavePricing();
                      else {
                        setEditPricing({
                          price_per_day: selectedVehicle.price_per_day,
                          price_per_hour: selectedVehicle.price_per_hour,
                          price_per_km: selectedVehicle.price_per_km,
                          max_km_per_day: selectedVehicle.max_km_per_day,
                        });
                        setIsEditingPricing(true);
                      }
                    }}
                    className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${isEditingPricing ? "bg-[#82d616] text-white shadow-lg" : "bg-gray-100 text-[#67748e] hover:bg-gray-200"}`}
                  >
                    {isEditingPricing ? "Save Strategy" : "Edit Strategy"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <PriceInput
                    label="Per Day"
                    value={isEditingPricing ? editPricing.price_per_day : Math.floor(selectedVehicle.price_per_day)}
                    onChange={(v) => setEditPricing({ ...editPricing, price_per_day: v })}
                    icon={<IndianRupee size={16} />}
                    editing={isEditingPricing}
                  />
                  <PriceInput
                    label="Per Hour"
                    value={isEditingPricing ? editPricing.price_per_hour : Math.floor(selectedVehicle.price_per_hour)}
                    onChange={(v) => setEditPricing({ ...editPricing, price_per_hour: v })}
                    icon={<Clock size={16} />}
                    editing={isEditingPricing}
                  />
                  <PriceInput
                    label="Per KM"
                    value={isEditingPricing ? editPricing.price_per_km : Math.floor(selectedVehicle.price_per_km)}
                    onChange={(v) => setEditPricing({ ...editPricing, price_per_km: v })}
                    icon={<Navigation size={16} />}
                    editing={isEditingPricing}
                  />
                  <PriceInput
                    label="Limit (KM/Day)"
                    value={isEditingPricing ? editPricing.max_km_per_day : selectedVehicle.max_km_per_day}
                    onChange={(v) => setEditPricing({ ...editPricing, max_km_per_day: v })}
                    icon={<TrendingUp size={16} />}
                    editing={isEditingPricing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-gray-100">
                <SpecCard
                  icon={<User />}
                  label="Capacity"
                  value={selectedVehicle.seating_capacity}
                />
                <SpecCard
                  icon={<Fuel />}
                  label="Fuel"
                  value={selectedVehicle.fuel_type}
                />
                <SpecCard
                  icon={<Gauge />}
                  label="Mileage"
                  value={`${selectedVehicle.mileage}km`}
                />
                <SpecCard
                  icon={<ShieldCheck />}
                  label="Registration"
                  value={selectedVehicle.registration_number}
                />
              </div>

              <button
                onClick={() => setSelectedVehicle(null)}
                className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-[#1a1a1a] transition-all"
              >
                Close Vehicle Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Manager */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 text-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ea0606] mx-auto mb-6">
              <LogOut size={32} />
            </div>
            <h2 className="text-[20px] font-bold text-[#252f40] mb-2">
              Sign Out?
            </h2>
            <p className="text-[#67748e] text-[14px] mb-8">
              Are you sure you want to end your session?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="py-3 px-6 rounded-lg font-bold text-[13px] text-[#67748e] hover:bg-gray-50 transition-all border border-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="py-3 px-6 bg-[#ea0606] text-white rounded-lg font-bold text-[13px] shadow-sm hover:opacity-90 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddVehicleModal && <AddVehicleModal onClose={() => setShowAddVehicleModal(false)} onVehicleAdded={fetchDashboard} vehicles={vehicles} subscriptions={userSubscriptions} setActiveTab={setActiveTab} />}

      {showMap && <LocationPickerModal onSelect={(a) => handleUpdateLocation(updatingVehicle, a)} onClose={() => setShowMap(false)} />}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #f8f9fa; font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

function YieldCard({ active, onSelect, title, price, sub, popular }) {
  return (
    <div onClick={onSelect} className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all relative overflow-hidden ${
      active ? 'bg-[#252f40] border-[#82d616] text-white shadow-2xl scale-[1.02]' : 'bg-white border-gray-100 text-[#252f40] hover:border-gray-200'
    }`}>
       {popular && <div className="absolute top-0 right-0 bg-[#82d616] text-[#252f40] px-6 py-2 rounded-bl-3xl text-[10px] font-bold uppercase tracking-widest">Network Peak</div>}
       <p className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-60 mb-4">{title}</p>
       <p className="text-4xl font-bold leading-none mb-4">{price}</p>
       <p className={`text-xs font-medium ${active ? 'text-gray-400' : 'text-gray-500'}`}>{sub}</p>
    </div>
  );
}

function SidebarNavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 mx-4 cursor-pointer transition-all duration-200 ${
        active
          ? "bg-black text-white rounded-[10px]"
          : "text-[#67748e] hover:text-black"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-lg ${active ? "bg-[#1a1a1a]" : "bg-white shadow-sm border border-gray-100"}`}
        >
          {React.cloneElement(icon, {
            size: 16,
            className: active ? "text-white" : "text-[#67748e]",
          })}
        </div>
        <span
          className={`text-[13px] font-medium leading-none ${active ? "font-semibold" : ""}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, iconColor, growth }) {
  return (
    <div className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
      <div className="space-y-1">
        <p className="text-[12px] font-medium text-[#67748e]">{title}</p>
        <p className="text-[20px] font-bold text-[#252f40] leading-none">
          {value}
        </p>
        <p className="text-[12px] font-bold text-[#82d616] mt-2">
          {growth}{" "}
          <span className="text-[#67748e] font-normal ml-0.5">
            vs last month
          </span>
        </p>
      </div>
      <div
        className="w-[48px] h-[48px] rounded-[10px] flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
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
          <span
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all shadow-md border ${
              vehicle.status === "Approved"
                ? "bg-[#e6ffed] text-[#82d616] border-[#82d616]/20"
                : "bg-[#fff5e6] text-[#fbcf33] border-[#fbcf33]/20"
            }`}
          >
            {vehicle.status === "Approved" ? "ACTIVE" : "PENDING"}
          </span>
        </div>
        {vehicle.vehicle_images?.[0] ? (
          <img
            src={`http://localhost:5000${vehicle.vehicle_images[0].media_url}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            alt=""
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
            <Car size={48} />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div className="space-y-1">
          <h4 className="text-[18px] font-bold text-[#252f40] leading-tight">
            {vehicle.name}
          </h4>
          <p className="text-[12px] text-[#67748e] font-medium">
            {vehicle.type} • {vehicle.model_year}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#67748e] uppercase tracking-wider">
              Daily Rate
            </p>
            <p className="text-[18px] font-bold text-[#82d616]">
              ₹{Math.floor(vehicle.price_per_day)}
            </p>
          </div>
          <button
            onClick={onDetails}
            className="px-5 py-2 bg-black text-white rounded-lg text-[12px] font-bold hover:bg-[#1a1a1a] transition-all"
          >
            Manage
          </button>
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
        <p className="text-[11px] font-medium text-[#67748e] leading-none mb-1">
          {label}
        </p>
        <p className="text-[13px] font-bold text-[#252f40] leading-none">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

function PriceInput({ label, value, onChange, icon, editing }) {
  return (
    <div className="bg-[#f8f9fa] p-4 rounded-xl border border-gray-100 flex items-center gap-3">
      <div className="text-[#82d616] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-medium text-[#67748e] leading-none mb-1">
          {label}
        </p>
        {editing ? (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full bg-white border border-gray-200 rounded-md px-2 py-1 text-[13px] font-bold text-[#252f40] focus:border-[#82d616] outline-none shadow-sm transition-all"
          />
        ) : (
          <p className="text-[13px] font-bold text-[#252f40] leading-none">
            {label.includes("KM") ? Math.floor(value) : `₹${Math.floor(value)}`}
          </p>
        )}
      </div>
    </div>
  );
}

function PricingSmallCard({ label, value, icon, suffix = "" }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-[#67748e] uppercase tracking-wider flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-[16px] font-bold text-[#252f40]">
        {label === "Limit" ? value : `₹${value}`}
        {suffix && (
          <span className="text-[10px] ml-0.5 text-gray-400">{suffix}</span>
        )}
      </p>
    </div>
  );
}
