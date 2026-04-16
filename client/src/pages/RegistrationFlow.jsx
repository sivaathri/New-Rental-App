import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, ChevronRight, ChevronLeft, User, ShieldCheck, 
  Car, CreditCard, Star, LayoutGrid, Zap, Sparkles, Upload, MapPin, X, Film, Search, Globe
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
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-500 border border-white/20">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Pin Asset Location</h2>
            <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Select the primary pickup point for renters</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 transition-all">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 relative">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents />
          </MapContainer>
        </div>

        <div className="p-10 bg-white border-t border-slate-100 space-y-6">
          <div className="flex items-start gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0 border border-slate-100">
              <MapPin size={24} />
            </div>
            <p className="text-sm font-black text-slate-700 leading-relaxed italic">{address}</p>
          </div>
          <button 
            onClick={() => onSelect(address)}
            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all"
          >
            Authorize Location
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
  const [hasVerification, setHasVerification] = useState(false);
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
  const query = new URLSearchParams(window.location.search);
  const isAddMode = query.get('mode') === 'add';
  const urlVehicleId = query.get('vehicleId');

  useEffect(() => {
    if (!token) return navigate('/');
    
    let progressUrl = `${API_BASE}/profile/progress`;
    if (urlVehicleId) progressUrl += `?vehicleId=${urlVehicleId}`;

    axios.get(progressUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (isAddMode) {
          setStep(4);
          setVehicleId(null);
          const data = res.data.data;
          if (data.user?.full_name) {
            setProfile({ full_name: data.user.full_name, address: data.user.address || '', city: data.user.city || 'Pondicherry' });
          }
          if (data.verification) setHasVerification(true);
          return;
        }

        if (res.data.step === 7) return navigate('/dashboard');
        
        setStep(res.data.step);
        if (res.data.vehicleId) setVehicleId(res.data.vehicleId);

        const data = res.data.data;
        if (data.user?.full_name) {
          setProfile({ full_name: data.user.full_name, address: data.user.address || '', city: data.user.city || 'Pondicherry' });
        }
        if (data.verification) setHasVerification(true); 
        if (data.vehicle) setVehicle(v => ({ ...v, ...data.vehicle, rc_book: null })); 
      })
      .catch(err => console.error(err));
  }, [token, navigate, isAddMode, urlVehicleId]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(2, prev - 1));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/profile/setup`, profile, { headers: { Authorization: `Bearer ${token}` } });
      nextStep();
    } catch (err) { alert('Error updating profile'); }
    finally { setLoading(false); }
  };

  const handleDocsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (docs.aadhar) formData.append('aadhar', docs.aadhar);
    if (docs.license) formData.append('license', docs.license);
    try {
      await axios.post(`${API_BASE}/profile/verify`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setHasVerification(true);
      nextStep();
    } catch (err) { alert('Error uploading documents'); }
    finally { setLoading(false); }
  };

  const handleMediaChange = (newFiles) => {
    const filesArray = Array.from(newFiles);
    let photos = filesArray.filter(f => f.type.startsWith('image/'));
    let videos = filesArray.filter(f => f.type.startsWith('video/'));
    photos = photos.slice(0, 4);
    if (vehicle.type === 'Car' || vehicle.type === 'Bike') videos = [];
    else videos = videos.slice(0, 1);
    setMedia([...photos, ...videos]);
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

  const handleSubscribe = async () => {
    if (!plan) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/vehicles/${vehicleId}/subscribe`, { plan_duration: plan.duration, plan_price: plan.price }, { headers: { Authorization: `Bearer ${token}` } });
      setStep(7);
    } catch (err) { alert('Error processing subscription'); }
    finally { setLoading(false); }
  };

  const stepInfo = {
    2: { title: 'Profile Setup', subtitle: 'Authentication of owner credentials', desc: 'Secure your listing privilege by detailing your base operations.' },
    3: { title: 'Identity Verification', subtitle: 'Trust & Safety Assurance', desc: 'Official documentation ensures a secure marketplace for all participants.' },
    4: { title: 'Asset Details', subtitle: 'Fleet Specification Intake', desc: 'Provide precise technical and commercial data for your high-value asset.' },
    5: { title: 'Visual Media', subtitle: 'Asset Immersion', desc: 'High-resolution visuals significantly increase conversion rates.' },
    6: { title: 'Growth Membership', subtitle: 'Network Integration Plans', desc: 'Select a membership tier to maximize your asset yield.' },
    7: { title: 'Authorization', subtitle: 'Queue Verification', desc: 'Your asset is being reviewed by our professional network auditors.' }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Plus_Jakarta_Sans'] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-slate-900 -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
      
      <div className="w-full max-w-7xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[850px] border border-white/20 relative">
        
        {/* Step Progression Sidebar */}
        <aside className="lg:w-96 bg-slate-950 p-12 lg:p-16 flex flex-col relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full space-y-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-950 shadow-xl">
                <Globe size={20} />
              </div>
              <p className="text-xs font-black text-white uppercase tracking-[0.4em]">REGISTRY 2.0</p>
            </div>

            <div className="space-y-12 flex-1">
              {[2, 3, 4, 6].map(s => (
                <div key={s} className="flex items-start gap-6 group">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                    step === s ? 'bg-blue-600 border-blue-600 shadow-2xl scale-125' :
                    step > s ? 'bg-emerald-500 border-emerald-500 scale-100' : 'border-slate-800 text-slate-800'
                  }`}>
                    {step > s ? <CheckCircle size={14} className="text-white" /> : <div className={`w-1.5 h-1.5 rounded-full ${step === s ? 'bg-white' : 'bg-slate-800'}`} />}
                  </div>
                  <div className="space-y-1">
                    <p className={`text-[0.6rem] font-black uppercase tracking-widest transition-colors ${step >= s ? 'text-blue-500' : 'text-slate-700'}`}>PHASE 0{s-1}</p>
                    <h4 className={`text-sm font-black uppercase tracking-wider transition-colors ${step === s ? 'text-white' : 'text-slate-500'}`}>{stepInfo[s]?.title}</h4>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 space-y-6">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                "Listed my fleet and saw 300% ROI in the first quarter itself. The platform is truly state-of-the-art."
              </p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-6">
                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">SK</div>
                 <div>
                    <p className="text-[0.65rem] font-black text-white uppercase">Senthil Kumar</p>
                    <p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">Master fleet owner</p>
                 </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Multi-Step Form */}
        <section className="flex-1 p-8 lg:p-20 overflow-y-auto custom-scrollbar relative flex flex-col">
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
            
            <header className="mb-16 space-y-4 text-center lg:text-left">
               <div className="inline-block px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                  <p className="text-[0.65rem] font-black text-blue-600 uppercase tracking-widest">{stepInfo[step]?.subtitle}</p>
               </div>
               <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{stepInfo[step]?.title}</h2>
               <p className="text-slate-400 text-lg font-medium max-w-lg">{stepInfo[step]?.desc}</p>
            </header>

            {step === 2 && (
              <form onSubmit={handleProfileSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <LuxeInput label="Full Name" placeholder="Authentication Identity" value={profile.full_name} onChange={v => setProfile({...profile, full_name: v})} icon={<User size={20}/>} />
                  <LuxeInput label="Active City" value={profile.city} disabled icon={<Globe size={20}/>} tip="Assigned Hub" />
                  <div className="col-span-2">
                    <LuxeInput label="Corporate / Residential Address" placeholder="Full logistics address..." value={profile.address} onChange={v => setProfile({...profile, address: v})} icon={<MapPin size={20}/>} />
                  </div>
                </div>
                <LuxeButton text="Update & Progress" loading={loading} />
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleDocsSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <LuxeFile label="Primary Identity (Aadhar)" file={docs.aadhar} onChange={f => setDocs({...docs, aadhar: f})} icon={<ShieldCheck size={24}/>} />
                  <LuxeFile label="Operator License" file={docs.license} onChange={f => setDocs({...docs, license: f})} icon={<CreditCard size={24}/>} />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.65rem] text-slate-400 hover:bg-slate-50 transition-all border border-slate-100">Back</button>
                  <LuxeButton text="Initiate Verification" loading={loading} />
                </div>
              </form>
            )}

            {(step === 4 || step === 5) && (
              <form onSubmit={handleVehicleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-2">Vehicle Category</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-slate-900 font-black outline-none focus:border-blue-600 transition-all shadow-sm" value={vehicle.type} onChange={e => setVehicle({...vehicle, type: e.target.value})}>
                      {['Car', 'Bike', 'Bus', 'Van', 'Mini Van', 'Mini Bus', 'Tempo Traveller'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <LuxeInput label="Asset Model" placeholder="eg. Innova Crysta" value={vehicle.name} onChange={v => setVehicle({...vehicle, name: v})} />
                  <LuxeInput label="Model Vintage" type="number" placeholder="2024" value={vehicle.model_year} onChange={v => setVehicle({...vehicle, model_year: v})} />
                  <LuxeInput label="Registration Plate" placeholder="PY 01 XX 0000" value={vehicle.registration_number} onChange={v => setVehicle({...vehicle, registration_number: v.toUpperCase()})} uppercase />
                  <LuxeInput label="Asset Capacity" type="number" placeholder="7" value={vehicle.seating_capacity} onChange={v => setVehicle({...vehicle, seating_capacity: v})} />
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-2">Propulsion Type</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-slate-900 font-black outline-none focus:border-blue-600 transition-all shadow-sm" value={vehicle.fuel_type} onChange={e => setVehicle({...vehicle, fuel_type: e.target.value})}>
                      {['Petrol', 'Diesel', 'Gas', 'Electric'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <LuxeInput label="Commercial Rate / Day" type="number" placeholder="2500" value={vehicle.price_per_day} onChange={v => setVehicle({...vehicle, price_per_day: v})} icon={<Star size={18}/>} />
                  <LuxeInput label="Lease Rate / Hour" type="number" placeholder="300" value={vehicle.price_per_hour} onChange={v => setVehicle({...vehicle, price_per_hour: v})} />
                </div>

                <div className="space-y-8 pt-12 border-t border-slate-100">
                   <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Logistics & Media</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <LuxeInput label="Verified Pickup Spot" placeholder="Authorize via map..." value={vehicle.pickup_location} onChange={() => {}} onClick={() => setShowMap(true)} icon={<MapPin size={20}/>} />
                      <LuxeInput label="Specific Landmark" placeholder="Opposite to..." value={vehicle.landmark} onChange={v => setVehicle({...vehicle, landmark: v})} icon={<Sparkles size={18}/>} />
                   </div>
                   <div className="space-y-6">
                      <LuxeFile label="Official RC Document" file={vehicle.rc_book} onChange={f => setVehicle({...vehicle, rc_book: f})} icon={<LayoutGrid size={24}/>} />
                      <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/10 space-y-6">
                        <div className="flex items-center justify-between">
                           <p className="text-xs font-black text-white uppercase tracking-widest">Asset Gallery</p>
                           <span className="text-[0.6rem] font-bold text-blue-400 uppercase tracking-[0.2em] bg-blue-400/10 px-3 py-1 rounded-full">Pro Tip: Top view sells 2x faster</span>
                        </div>
                        <LuxeMultiMedia 
                          media={media} 
                          onChange={handleMediaChange} 
                          type={vehicle.type}
                        />
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 pt-12 sticky bottom-0 bg-white/80 backdrop-blur-xl pb-10">
                  <button type="button" onClick={prevStep} className="px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.65rem] text-slate-400 hover:bg-slate-50 transition-all border border-slate-100">Back</button>
                  <LuxeButton text="Register Asset" loading={loading} />
                </div>
              </form>
            )}

            {step === 6 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { duration: 1, price: 700, label: 'Starter Hub', desc: 'Basic listing visibility' },
                    { duration: 3, price: 1200, label: 'Growth Pass', desc: 'Priority in search results', popular: true },
                    { duration: 6, price: 2000, label: 'Elite Network', desc: 'Dedicated fleet manager' },
                    { duration: 12, price: 3000, label: 'Empire Tier', desc: 'Maximum earnings & reach' }
                  ].map((p, i) => (
                    <div 
                      key={i} 
                      onClick={() => setPlan(p)} 
                      className={`p-8 rounded-[2.5rem] border-[3px] transition-all cursor-pointer group relative overflow-hidden ${
                        plan?.duration === p.duration ? 'border-blue-600 bg-blue-50 shadow-2xl scale-[1.02]' : 'border-slate-50 hover:border-slate-200 bg-white'
                      }`}
                    >
                      {p.popular && <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-[2rem] text-[0.6rem] font-black uppercase tracking-widest">Global Pick</div>}
                      <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-2">{p.label}</p>
                      <h4 className="text-4xl font-black text-slate-900 italic tracking-tighter mb-4">{p.duration} <span className="text-lg font-normal not-italic text-slate-400">Mo.</span></h4>
                      <p className="text-4xl font-black text-blue-600 italic tracking-tighter">₹{p.price}</p>
                      <p className="text-xs font-bold text-slate-400 mt-4 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 pt-12">
                  <button type="button" onClick={prevStep} className="px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.65rem] text-slate-400 hover:bg-slate-50 transition-all border border-slate-100">Adjust Data</button>
                  <LuxeButton text="Complete Membership" loading={loading} onClick={handleSubscribe} />
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="text-center py-20 animate-in zoom-in-95 duration-1000">
                <div className="w-32 h-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-50 mb-12 relative overflow-hidden group">
                   <CheckCircle size={64} className="text-emerald-500 relative z-10 group-hover:scale-110 transition-transform" />
                   <div className="absolute inset-0 bg-emerald-400/20 blur-2xl animate-pulse" />
                </div>
                <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6">Pipeline Live</h2>
                <p className="text-slate-500 font-medium text-xl max-w-md mx-auto leading-relaxed italic mb-16">
                  Our professional network auditors are reviewing your credentials. Activation within 12 business hours.
                </p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-16 py-6 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4 mx-auto group"
                >
                  Enter Owner Hub
                  <Zap size={18} className="fill-blue-500 text-blue-500 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            )}

          </div>
        </section>
      </div>

      {showMap && <LocationPickerModal onClose={() => setShowMap(false)} onSelect={(v) => { setVehicle({...vehicle, pickup_location: v}); setShowMap(false); }} />}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function LuxeInput({ label, type = 'text', placeholder, value, onChange, icon, disabled, tip, uppercase, onClick }) {
  return (
    <div className="space-y-4" onClick={onClick}>
      <div className="flex justify-between items-center ml-2">
        <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</label>
        {tip && <span className="text-[0.6rem] font-black text-blue-500 uppercase tracking-widest leading-none italic">{tip}</span>}
      </div>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">{icon}</div>
        <input 
          type={type} 
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full bg-slate-50 border border-slate-100 group-focus-within:border-blue-600 group-focus-within:bg-white rounded-[1.5rem] px-6 py-5 ${icon ? 'pl-16' : ''} text-slate-900 font-black italic outline-none transition-all shadow-sm ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-text group-hover:border-slate-200'} ${uppercase ? 'uppercase tracking-widest' : ''}`} 
        />
      </div>
    </div>
  );
}

function LuxeFile({ label, file, onChange, icon }) {
  return (
    <div className="space-y-4">
      <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-2 leading-none">{label}</label>
      <div className="relative group">
        <input type="file" onChange={e => onChange(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
        <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-4 ${file ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50 group-hover:border-blue-200 group-hover:bg-blue-50/10'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all ${file ? 'bg-emerald-500 text-white rotate-6' : 'bg-white text-slate-300 group-hover:text-blue-600'}`}>{icon}</div>
          <p className={`text-xs font-black uppercase tracking-widest italic ${file ? 'text-emerald-700' : 'text-slate-400'}`}>{file ? 'Document Anchored' : 'Select Scan'}</p>
        </div>
      </div>
    </div>
  );
}

function LuxeMultiMedia({ media, onChange, type }) {
  const isVideoAllowed = !(type === 'Car' || type === 'Bike');
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {media.map((file, i) => (
        <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/5 overflow-hidden shadow-2xl group/m relative">
           {file.type.startsWith('video/') ? (
             <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" autoPlay muted loop />
           ) : (
             <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
           )}
           <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/m:opacity-100 transition-opacity">
              <span className="text-[0.6rem] font-black text-white uppercase tracking-widest">{file.type.split('/')[1]}</span>
           </div>
        </div>
      ))}
      <div className="relative group/add aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-white/10 transition-all cursor-pointer">
         <input type="file" multiple onChange={e => onChange(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
         <PlusCircle size={24} className="text-white/20 group-hover/add:text-blue-500 transition-colors" />
         <span className="text-[0.6rem] font-black text-white/20 uppercase tracking-widest group-hover/add:text-blue-500">Inject Assets</span>
      </div>
    </div>
  );
}

function PlusCircle({ size, className }) {
   return <Plus size={size} className={className} />
}

function LuxeButton({ text, loading, onClick }) {
  return (
    <button 
      type={onClick ? "button" : "submit"} 
      disabled={loading}
      onClick={onClick}
      className="flex-1 bg-slate-950 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[0.7rem] hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-3 group overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 opacity-5" />
      <span className="relative z-10">{loading ? 'Processing...' : text}</span>
      <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
