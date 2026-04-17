import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, ChevronRight, ChevronLeft, User, ShieldCheck, 
  Car, CreditCard, Star, LayoutGrid, Zap, Sparkles, Upload, MapPin, X, Film, Search, Globe, Plus, FileText, Clock,
  Home, Tag, Hash, IndianRupee
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const API_BASE = 'http://localhost:5000/api';

function LocationPickerModal({ onSelect, onClose }) {
  const [position, setPosition] = useState([11.9416, 79.8083]); // Default Pondy
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#252f40]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#252f40]">Pin Asset Location</h2>
            <p className="text-[13px] font-medium text-gray-400 mt-1">Select the primary pickup point for renters</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 relative">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents />
          </MapContainer>
        </div>

        <div className="p-8 bg-white border-t border-gray-100 space-y-6">
          <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0 border border-gray-100">
              <MapPin size={20} />
            </div>
            <p className="text-sm font-semibold text-[#252f40] leading-relaxed pt-2">{address}</p>
          </div>
          <button 
            onClick={() => onSelect(address)}
            className="w-full bg-[#252f40] text-white py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationFlow() {
  const [step, setStep] = useState(2);
  const [token] = useState(localStorage.getItem('token') || '');
  const [vehicleId, setVehicleId] = useState(null);
  
  const [profile, setProfile] = useState({ full_name: '', address: '', city: 'Pondicherry' });
  const [docs, setDocs] = useState({ aadhar: null, license: null });
  const [vehicle, setVehicle] = useState({
    type: 'Car', name: '', model_year: '', registration_number: '', rc_book: null,
    seating_capacity: '', fuel_type: '', mileage: '', price_per_day: '', price_per_hour: '',
    price_per_km: '', max_km_per_day: '', pickup_location: '', landmark: ''
  });
  const [media, setMedia] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate('/');
    axios.get(`${API_BASE}/profile/progress`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.step === 7) return navigate('/dashboard');
        setStep(res.data.step);
        if (res.data.vehicleId) setVehicleId(res.data.vehicleId);
        const data = res.data.data;
        if (data.user?.full_name) setProfile({ full_name: data.user.full_name, address: data.user.address || '', city: data.user.city || 'Pondicherry' });
      })
      .catch(err => console.error(err));
  }, [token, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile.full_name || !profile.address) return alert('Please fill in all details');
    if (!docs.aadhar || !docs.license) return alert('Please upload both Aadhar and Driving License');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('full_name', profile.full_name);
    formData.append('address', profile.address);
    formData.append('city', profile.city);
    formData.append('aadhar', docs.aadhar);
    formData.append('license', docs.license);

    try {
      await axios.post(`${API_BASE}/profile/setup`, formData, { 
        headers: { 
          Authorization: `Bearer ${token}`
        } 
      });
      setStep(4);
    } catch (err) { alert('Error updating profile and documents'); }
    finally { setLoading(false); }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(vehicle).forEach(key => { if (key !== 'rc_book') formData.append(key, vehicle[key]); });
    if (vehicle.rc_book) formData.append('rc_book', vehicle.rc_book);
    media.forEach(file => formData.append('media', file));
    if (vehicleId) formData.append('vehicle_id', vehicleId);

    try {
      const res = await axios.post(`${API_BASE}/vehicles/add`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setVehicleId(res.data.vehicleId);
      setStep(6);
    } catch (err) { alert('Error saving vehicle'); }
    finally { setLoading(false); }
  };

  const handlePlanSubmit = async () => {
    if (!plan) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/vehicles/${vehicleId}/subscribe`, { plan_duration: plan.duration, plan_price: plan.price }, { headers: { Authorization: `Bearer ${token}` } });
      setStep(7);
    } catch (err) { alert('Error processing subscription'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 lg:p-12 font-['Inter', sans-serif]">
      {/* Dynamic Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-50/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-green-50/40 blur-[120px] rounded-full" />
      </div>

      <div className="w-full min-h-screen  relative z-10 flex flex-col">
        
        {/* Registration Logic - True Full Width */}
        <div className="flex-1 bg-white pt-10 pb-20 px-8 lg:px-20 flex flex-col relative w-full">
          
          {/* Horizontal Stepper matching the UI Design image */}
          <div className="mb-8 px-4 w-full">
             <div className="flex items-center justify-between relative w-full">
                <HorizontalStep num={1} label="Registry" active={step >= 2} current={step === 2} completed={step > 2} />
                <StepLine active={step > 2} />
                <HorizontalStep num={2} label="Asset" active={step >= 4} current={step === 4} completed={step > 4} />
                <StepLine active={step > 4} />
                <HorizontalStep num={3} label="Yield" active={step >= 6} current={step === 6} completed={step > 6} />
                <StepLine active={step > 6} />
                <HorizontalStep num={4} label="Confirm" active={step >= 7} current={step === 7} completed={step >= 7} />
             </div>
          </div>

          <div className="flex-1 w-full flex flex-col">
            
            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
                <header className="space-y-4">
                  <h2 className="text-[48px] font-bold text-[#252f40] leading-none">Owner Registry</h2>
                  <p className="text-gray-500 font-medium text-xl">Verify your legal stature within the ecosystem.</p>
                </header>

                <div className="space-y-8">
                   <InputGroup label="Full Name" placeholder="Example: Rahul Sharma" value={profile.full_name} onChange={(v) => setProfile({...profile, full_name: v})} icon={User} required />
                   <div className="grid grid-cols-2 gap-8">
                      <InputGroup label="City" value="Pondicherry" disabled icon={MapPin} required />
                      <InputGroup label="Address" placeholder="Example: 123 Street Name" value={profile.address} onChange={(v) => setProfile({...profile, address: v})} icon={Home} required />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex flex-col gap-4">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#82d616]"><FileText size={20}/></div>
                            <div>
                               <p className="font-bold text-[#252f40] text-sm">Aadhar Card</p>
                               <p className="text-gray-500 text-[11px]">{docs.aadhar ? docs.aadhar.name : 'Government ID'}</p>
                            </div>
                         </div>
                         <label className="w-full bg-white border border-blue-100 text-[#252f40] py-3 rounded-xl font-bold text-[11px] cursor-pointer hover:bg-blue-50 transition-all text-center">
                            Select Aadhar
                            <input type="file" className="hidden" onChange={(e) => setDocs({...docs, aadhar: e.target.files[0]})} />
                         </label>
                      </div>

                      <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex flex-col gap-4">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#82d616]"><CreditCard size={20}/></div>
                            <div>
                               <p className="font-bold text-[#252f40] text-sm">Driving License</p>
                               <p className="text-gray-500 text-[11px]">{docs.license ? docs.license.name : 'Operator Permit'}</p>
                            </div>
                         </div>
                         <label className="w-full bg-white border border-blue-100 text-[#252f40] py-3 rounded-xl font-bold text-[11px] cursor-pointer hover:bg-blue-50 transition-all text-center">
                            Select License
                            <input type="file" className="hidden" onChange={(e) => setDocs({...docs, license: e.target.files[0]})} />
                         </label>
                      </div>
                   </div>
                </div>

                <button onClick={handleProfileSubmit} disabled={loading} className="w-full bg-[#252f40] text-white py-5 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl">
                  {loading ? 'Processing...' : 'Proceed to Asset Config'}
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
                <header className="space-y-4">
                  <h2 className="text-[48px] font-bold text-[#252f40] leading-none">Asset Configuration</h2>
                  <p className="text-gray-500 font-medium text-xl">Define the core telemetry for your rental asset.</p>
                </header>

                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-8">
                     <InputGroup label="Asset Name" placeholder="Example: Audi A6" value={vehicle.name} onChange={(v) => setVehicle({...vehicle, name: v})} icon={Car} required />
                     <InputGroup label="Type" value={vehicle.type} disabled icon={Tag} required />
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                     <InputGroup label="Reg Number" placeholder="Example: PY 01 XX 1234" value={vehicle.registration_number} onChange={(v) => setVehicle({...vehicle, registration_number: v.toUpperCase()})} icon={Hash} required />
                     <InputGroup label="Daily Yield" placeholder="Example: 5000" type="number" value={vehicle.price_per_day} onChange={(v) => setVehicle({...vehicle, price_per_day: v})} icon={IndianRupee} required />
                   </div>
                   
                   <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm"><MapPin size={24}/></div>
                         <div className="max-w-[200px]">
                            <p className="font-bold text-[#252f40] text-sm">Deployment Point</p>
                            <p className="text-gray-400 text-xs font-medium truncate">{vehicle.pickup_location || "Renter pickup point"}</p>
                         </div>
                      </div>
                      <button onClick={() => setShowMap(true)} className="bg-white border border-gray-200 px-6 py-2 rounded-xl text-[11px] font-bold text-[#252f40] hover:border-blue-300 transition-all">Set Point</button>
                   </div>

                   <div className="p-8 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mx-auto"><Plus size={32}/></div>
                      <div>
                        <p className="font-bold text-[#252f40]">Inject Asset Media</p>
                        <p className="text-gray-400 text-xs">High-res photos increase yield by 40%</p>
                      </div>
                      <input type="file" multiple className="hidden" id="asset-media" onChange={(e) => setMedia([...media, ...Array.from(e.target.files)])} />
                      <label htmlFor="asset-media" className="inline-block bg-[#252f40] text-white px-8 py-3 rounded-xl font-bold text-[12px] cursor-pointer">Select Files</label>
                      {media.length > 0 && <p className="text-[11px] font-bold text-[#82d616]">{media.length} files attached</p>}
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(2)} className="w-[80px] h-[64px] rounded-2xl border border-gray-100 flex items-center justify-center text-[#252f40] hover:bg-gray-50 transition-all"><ChevronLeft size={24}/></button>
                  <button onClick={handleVehicleSubmit} disabled={loading} className="flex-1 bg-[#252f40] text-white py-5 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl">Complete Configuration</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
                 <header className="space-y-4">
                    <h2 className="text-[48px] font-bold text-[#252f40] leading-none">Pricing Strategy</h2>
                    <p className="text-gray-500 font-medium text-xl">Select a membership tier to launch your asset node.</p>
                 </header>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    <YieldCard active={plan?.duration === 1} onSelect={() => setPlan({duration: 1, price: 700})} title="Starter" price="₹700" sub="1 Month Listing" />
                    <YieldCard active={plan?.duration === 3} onSelect={() => setPlan({duration: 3, price: 1200})} title="Growth" price="₹1200" sub="3 Months Priority" popular />
                 </div>

                 <button onClick={handlePlanSubmit} disabled={loading || !plan} className="w-full bg-[#82d616] text-white py-6 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-[#82d616]/20">Synchronize & Launch Node</button>
              </div>
            )}

            {step === 7 && (
              <div className="py-20 animate-in zoom-in-95 duration-700">
                <div className="w-32 h-32 bg-[#e6ffed] rounded-[3rem] flex items-center justify-center text-[#82d616] mb-12 shadow-xl shadow-[#82d616]/10">
                   <Clock size={64} />
                </div>
                <h2 className="text-[56px] font-bold text-[#252f40] leading-[1.1] mb-6">Security Audit In Progress</h2>
                <p className="text-gray-500 text-xl font-medium leading-relaxed mb-16">
                  Your asset node is being validated by our professional network auditors. Cycle completes in <span className="text-[#252f40] font-bold underline">12 hours</span>.
                </p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-20 py-6 bg-[#252f40] text-white rounded-[2rem] font-bold text-[18px] transition-all hover:bg-black shadow-2xl"
                >
                  Enter Command Center
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMap && <LocationPickerModal onSelect={(a) => { setVehicle({...vehicle, pickup_location: a}); setShowMap(false); }} onClose={() => setShowMap(false)} />}
      
      <style>{`
        body { background-color: #f8f9fa; font-family: 'Inter', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function HorizontalStep({ num, label, active, current, completed }) {
  return (
    <div className="flex flex-col items-center relative z-10">
      {/* Current pointer chevron */}
      <div className={`transition-opacity duration-300 ${current ? 'opacity-100' : 'opacity-0'}`}>
        <ChevronRight className="rotate-90 text-gray-400 mb-1" size={14} />
      </div>
      
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-500 border-2 ${
        completed ? 'bg-[#82d616] border-[#82d616] text-white' : 
        active ? 'bg-[#82d616] border-[#82d616] text-white' : 
        'bg-white border-gray-200 text-gray-300'
      }`}>
        {completed ? <CheckCircle size={16} strokeWidth={3} /> : num}
      </div>
      
      <p className={`text-[12px] font-bold mt-2 transition-colors ${active ? 'text-[#252f40]' : 'text-gray-300'}`}>
        {label}
      </p>
    </div>
  );
}

function StepLine({ active }) {
  return (
    <div className="flex-1 h-[2px] bg-gray-100 mx-2 -mt-[26px] relative overflow-hidden">
       <div className={`absolute inset-0 bg-[#82d616] transition-transform duration-700 ease-in-out origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange, disabled, type = 'text', icon: Icon, required }) {
  return (
    <div className="space-y-4 w-full">
       <label className="text-[14px] font-bold text-[#252f40] flex items-center">
         {label}
         {required && <span className="text-red-500 ml-1">*</span>}
       </label>
       <div className="relative group">
         {Icon && (
           <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
             <Icon size={20} />
           </div>
         )}
         <input 
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className={`w-full bg-white border border-gray-200 h-[56px] rounded-xl font-medium text-[#252f40] outline-none transition-all ${Icon ? 'pl-14' : 'px-6'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-blue-400 focus:ring-4 focus:ring-blue-50'}`}
         />
       </div>
    </div>
  );
}

function SelectGroup({ label, options, value, onChange, icon: Icon, required }) {
  return (
    <div className="space-y-4 w-full">
       <label className="text-[14px] font-bold text-[#252f40] flex items-center">
         {label}
         {required && <span className="text-red-500 ml-1">*</span>}
       </label>
       <div className="relative group">
         {Icon && (
           <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
             <Icon size={20} />
           </div>
         )}
         <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white border border-gray-200 h-[56px] rounded-xl font-medium text-[#252f40] outline-none transition-all appearance-none ${Icon ? 'pl-14' : 'px-6'} focus:border-blue-400 focus:ring-4 focus:ring-blue-50`}
         >
           {options.map(o => <option key={o} value={o}>{o}</option>)}
         </select>
         <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronRight className="rotate-90" size={18} />
         </div>
       </div>
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
