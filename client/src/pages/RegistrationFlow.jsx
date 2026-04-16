import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, ChevronRight, ChevronLeft, User, ShieldCheck, 
  Car, CreditCard, Star, LayoutGrid, Zap, Sparkles, Upload
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function RegistrationFlow() {
  const [step, setStep] = useState(2);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [vehicleId, setVehicleId] = useState(null);
  
  // States
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

    // Enforce selection limits
    photos = photos.slice(0, 4);
    if (vehicle.type === 'Car' || vehicle.type === 'Bike') {
      videos = []; // No videos for Cars or Bikes
    } else {
      videos = videos.slice(0, 1); // Max 1 video for others
    }

    setMedia([...photos, ...videos]);
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(vehicle).forEach(key => {
      if (key !== 'rc_book') formData.append(key, vehicle[key]);
    });
    if (vehicle.rc_book) formData.append('rc_book', vehicle.rc_book);
    Array.from(media).forEach(file => formData.append('media', file));
    if (vehicleId) formData.append('vehicle_id', vehicleId);

    try {
      const res = await axios.post(`${API_BASE}/vehicles/add`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setVehicleId(res.data.vehicleId);
      setStep(6);
    } catch (err) { alert('Error saving vehicle'); }
    finally { setLoading(false); }
  };

  const plans = [
    { duration: 1, price: 700, label: 'Starter', features: ['Basic Support', '1 Vehicle Listing', 'Standard Visibility'] },
    { duration: 3, price: 1200, label: 'Growth', features: ['Priority Support', 'Featured Listing', 'Extended Analytics'], popular: true },
    { duration: 6, price: 2000, label: 'Pro', features: ['Dedicated Manager', 'Top Search Result', 'Professional Photoshoot'] },
    { duration: 12, price: 3000, label: 'Empire', features: ['Global Reach', 'Premium Branding', 'Max Earnings'] }
  ];

  const handleSubscribe = async () => {
    if (!plan) return alert('Select a plan');
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/vehicles/${vehicleId}/subscribe`, { plan_duration: plan.duration, plan_price: plan.price }, { headers: { Authorization: `Bearer ${token}` } });
      setStep(7);
    } catch (err) { alert('Error processing subscription'); }
    finally { setLoading(false); }
  };

  const stepInfo = {
    2: { title: 'Profile Setup', subtitle: 'Tell us a bit about yourself', icon: <User className="w-6 h-6" /> },
    3: { title: 'Identity Verification', subtitle: 'Safety first, always', icon: <ShieldCheck className="w-6 h-6" /> },
    4: { title: 'Add Vehicle', subtitle: 'Lets list your first asset', icon: <Car className="w-6 h-6" /> },
    5: { title: 'Media Assets', subtitle: 'Visuals sell faster', icon: <Sparkles className="w-6 h-6" /> },
    6: { title: 'Subscription', subtitle: 'Choose your growth plan', icon: <Zap className="w-6 h-6" /> },
    7: { title: 'Review', subtitle: 'Awaiting the green light', icon: <CheckCircle className="w-6 h-6" /> },
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col lg:flex-row bg-[#f8fafc] rounded-[2.5rem] overflow-hidden luxe-shadow border border-white">
      
      {/* Sidebar - Progress & Content */}
      <div className="lg:w-[35%] bg-slate-900 p-8 lg:p-12 flex flex-col relative text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-12">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-2 block">Step {step} of 7</span>
            <h2 className="text-4xl font-black italic font-premium luxe-gradient-text !from-blue-100 !to-white leading-tight">
              {stepInfo[step]?.title || 'Welcome'}
            </h2>
            <p className="text-slate-400 mt-2 font-medium">{stepInfo[step]?.subtitle}</p>
          </div>

          <div className="space-y-8 flex-grow">
            {[2, 3, 4, 6, 7].map(s => (
              <div key={s} className="flex items-center gap-4 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  step === s ? 'bg-blue-600 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-110' :
                  step > s ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 text-slate-500'
                }`}>
                  {step > s ? <CheckCircle size={16} /> : <span className="text-xs font-bold">{s-1}</span>}
                </div>
                <span className={`text-sm font-bold tracking-tight transition-colors ${step === s ? 'text-white' : 'text-slate-500'}`}>
                  {stepInfo[s]?.title}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 animate-float lg:block hidden">
            <p className="text-slate-300 text-sm italic italic leading-relaxed">
              "My car went from sitting in the garage to generating ₹30,000 every month."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-slate-700" />
              <div>
                <p className="text-xs font-bold">Senthil Kumar</p>
                <p className="text-[10px] text-slate-500">Platinum Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center bg-white relative">
        <div className="max-w-xl mx-auto w-full">
          
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Personal Details</h3>
                <p className="text-slate-500 font-medium">Please provide your contact details for verification.</p>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <InputField label="Full name" placeholder="John Doe" value={profile.full_name} onChange={v => setProfile({...profile, full_name: v})} icon={<User size={18}/>} />
                <InputField label="Residential Address" placeholder="Street, Area, City" value={profile.address} onChange={v => setProfile({...profile, address: v})} icon={<LayoutGrid size={18}/>} />
                <div className="relative">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">City / Operations Hub</label>
                  <input value={profile.city} disabled className="w-full bg-slate-50 border-transparent rounded-2xl p-4 text-slate-400 font-bold outline-none cursor-not-allowed border border-slate-100" />
                  <span className="absolute right-4 top-10 text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Region</span>
                </div>
                <div className="pt-8">
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group">
                    {loading ? 'Saving...' : 'Secure & Continue'}
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Identity Documents</h3>
                <p className="text-slate-500 font-medium">Verify your identity to build trust with renters.</p>
              </div>
              {hasVerification && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold text-sm">
                  <CheckCircle size={20} /> Documents already uploaded
                </div>
              )}
              <form onSubmit={handleDocsSubmit} className="space-y-6">
                <FileUploadZone label="Aadhar Card (Front & Back)" onChange={f => setDocs({...docs, aadhar: f})} file={docs.aadhar} />
                <FileUploadZone label="Driving License" onChange={f => setDocs({...docs, license: f})} file={docs.license} />
                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={prevStep} className="flex-1 bg-slate-50 text-slate-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Back</button>
                  <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group">
                    {loading ? 'Uploading...' : 'Verify Now'}
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {(step === 4 || step === 5) && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 px-2 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Asset Registration</h3>
                <p className="text-slate-500 font-medium">Detailed specifications help you stand out.</p>
              </div>
              <form onSubmit={handleVehicleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Vehicle Type</label>
                     <select className="w-full bg-slate-50 border-slate-100 focus:border-blue-500 rounded-2xl p-4 text-slate-900 font-bold outline-none border transition-all" value={vehicle.type} onChange={e => setVehicle({...vehicle, type: e.target.value})}>
                      <option>Car</option><option>Bike</option><option>Bus</option><option>Van</option><option>Mini Van</option><option>Mini Bus</option><option>Tempo Traveller</option>
                    </select>
                  </div>
                  <InputField label="Brand & Model" placeholder="Swift VXI" value={vehicle.name} onChange={v => setVehicle({...vehicle, name: v})} />
                  <InputField label="Model Year" type="number" placeholder="2022" value={vehicle.model_year} onChange={v => setVehicle({...vehicle, model_year: v})} />
                  <InputField label="Registration No." placeholder="PY01AB1234" value={vehicle.registration_number} onChange={v => setVehicle({...vehicle, registration_number: v.toUpperCase()})} uppercase={true} />
                  <InputField label="Seat Capacity" type="number" placeholder="5" value={vehicle.seating_capacity} onChange={v => setVehicle({...vehicle, seating_capacity: v})} />
                  <SelectField 
                    label="Fuel Category" 
                    value={vehicle.fuel_type} 
                    onChange={v => setVehicle({...vehicle, fuel_type: v})}
                    options={['Petrol', 'Diesel', 'Gas', 'Electric']}
                  />
                  <InputField label="Mileage (KM/L)" type="number" placeholder="20" value={vehicle.mileage} onChange={v => setVehicle({...vehicle, mileage: v})} />
                  <InputField label="Daily Rate (₹)" type="number" placeholder="1500" value={vehicle.price_per_day} onChange={v => setVehicle({...vehicle, price_per_day: v})} />
                  <InputField label="Hourly Rate (₹)" type="number" placeholder="200" value={vehicle.price_per_hour} onChange={v => setVehicle({...vehicle, price_per_hour: v})} />
                  <InputField label="Price Per KM (₹)" type="number" placeholder="15" value={vehicle.price_per_km} onChange={v => setVehicle({...vehicle, price_per_km: v})} />
                  <InputField label="Max KM / Day" type="number" placeholder="250" value={vehicle.max_km_per_day} onChange={v => setVehicle({...vehicle, max_km_per_day: v})} />
                  <div className="col-span-2 grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <InputField label="Pickup Location" placeholder="Area / Sector" value={vehicle.pickup_location} onChange={v => setVehicle({...vehicle, pickup_location: v})} icon={<LayoutGrid size={18}/>} />
                    <InputField label="Nearby Landmark" placeholder="Near Railway Station" value={vehicle.landmark} onChange={v => setVehicle({...vehicle, landmark: v})} icon={<Sparkles size={18}/>} />
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Mandatory Documents</h4>
                  <FileUploadZone label="RC Book (Scanned / Photo)" onChange={f => setVehicle({...vehicle, rc_book: f})} file={vehicle.rc_book} />
                  <FileUploadZone 
                    label={`Vehicle Gallery (${vehicle.type === 'Car' || vehicle.type === 'Bike' ? 'Max 4 Photos' : 'Max 4 Photos + 1 Video'})`} 
                    multiple 
                    onChange={handleMediaChange} 
                    count={media.length} 
                    files={media} 
                    accept={vehicle.type === 'Car' || vehicle.type === 'Bike' ? 'image/*' : 'image/*,video/*'}
                  />
                </div>

                <div className="flex gap-4 pt-8 sticky bottom-0 bg-white pb-4">
                  <button type="button" onClick={prevStep} className="flex-1 bg-slate-50 text-slate-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Back</button>
                  <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all">
                    {loading ? 'Launching...' : 'Next Step'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight text-center">Select Your Plan</h3>
                <p className="text-slate-500 font-medium text-center">Unleash the full potential of your fleet.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((p, i) => (
                  <div 
                    key={i} 
                    onClick={() => setPlan(p)} 
                    className={`relative cursor-pointer p-6 rounded-[2rem] border-2 transition-all duration-300 group ${
                      plan?.duration === p.duration ? 'border-blue-600 bg-blue-50 shadow-2xl scale-[1.02]' : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest">Most Popular</span>}
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{p.label}</p>
                      <h4 className="text-3xl font-black text-slate-900 italic">{p.duration} {p.duration === 1 ? 'Month' : 'Months'}</h4>
                      <div className="my-4">
                         <span className="text-4xl font-black text-blue-600">₹{p.price}</span>
                         <span className="text-xs font-bold text-slate-400"> / total</span>
                      </div>
                      <div className="space-y-2 mt-6">
                        {p.features.map((f, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs font-bold text-slate-500 justify-center">
                            <CheckCircle size={14} className="text-blue-500" /> {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-8">
                <button type="button" onClick={prevStep} className="flex-1 bg-slate-50 text-slate-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Back</button>
                <button onClick={handleSubscribe} disabled={loading} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all">
                  {loading ? 'Processing...' : 'Complete Registration'}
                </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="text-center py-12 space-y-8 animate-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-100 relative">
                <CheckCircle size={56} />
                <div className="absolute inset-0 bg-emerald-400 blur-[30px] opacity-20 animate-pulse" />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-900 italic font-premium tracking-tighter">Success!</h2>
                <h3 className="text-xl font-bold text-slate-800">Your Fleet is Under Review</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                  Our professional auditors are reviewing your credentials. You'll be notified via SMS once your vehicles go live.
                </p>
              </div>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="px-12 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-slate-200 mt-8"
              >
                Go to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">{label}</label>
      <select 
        className="w-full bg-white border border-slate-100 focus:border-blue-500 rounded-2xl p-4 text-slate-900 font-bold outline-none transition-all shadow-sm hover:border-slate-200" 
        value={value} 
        onChange={e => onChange(e.target.value)}
      >
        <option value="" disabled>Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function InputField({ label, type = 'text', placeholder, value, onChange, icon, uppercase }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input 
          type={type} 
          required 
          placeholder={placeholder} 
          className={`w-full bg-white border border-slate-100 focus:border-blue-500 rounded-2xl p-4 pl-12 text-slate-900 font-bold outline-none transition-all shadow-sm hover:border-slate-200 ${uppercase ? 'uppercase tracking-widest' : ''}`} 
          value={value} 
          onChange={e => onChange(e.target.value)} 
        />
      </div>
    </div>
  );
}

function FileUploadZone({ label, onChange, multiple, count, file, files, accept }) {
  const [previews, setPreviews] = React.useState([]);

  React.useEffect(() => {
    const generatePreviews = (fileList) => {
      return Array.from(fileList).map(f => ({
        url: URL.createObjectURL(f),
        type: f.type.startsWith('video/') ? 'video' : 'image'
      }));
    };

    if (multiple && files && files.length > 0) {
      const items = generatePreviews(files);
      setPreviews(items);
      return () => items.forEach(item => URL.revokeObjectURL(item.url));
    } else if (!multiple && file) {
      const item = { url: URL.createObjectURL(file), type: file.type.startsWith('video/') ? 'video' : 'image' };
      setPreviews([item]);
      return () => URL.revokeObjectURL(item.url);
    } else {
      setPreviews([]);
    }
  }, [file, files, multiple]);

  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">{label}</label>
      <div className="relative group cursor-pointer">
        <input 
          type="file" 
          multiple={multiple} 
          accept={accept || "image/*,video/*"}
          onChange={e => multiple ? onChange(e.target.files) : onChange(e.target.files[0])} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        />
        <div className={`bg-slate-50 border-2 border-dashed border-slate-100 group-hover:border-blue-600 group-hover:bg-blue-50/50 rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center overflow-hidden min-h-[120px] ${previews.length > 0 ? 'p-2' : ''}`}>
          {previews.length > 0 ? (
            <div className={`grid gap-2 w-full h-full ${multiple ? 'grid-cols-4' : 'grid-cols-1'}`}>
              {previews.map((item, i) => (
                 <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-white shadow-sm flex items-center justify-center bg-black">
                   {item.type === 'video' ? (
                     <video src={item.url} className="w-full h-full object-cover" muted />
                   ) : (
                     <img src={item.url} className="w-full h-full object-cover" alt="Preview" />
                   )}
                   {item.type === 'video' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                       <Zap size={16} className="text-white fill-white" />
                     </div>
                   )}
                 </div>
              ))}
              {multiple && (
                <div className="flex flex-col items-center justify-center bg-white/50 backdrop-blur rounded-lg border border-dashed border-slate-200">
                  <Upload size={16} className="text-blue-500 mb-1" />
                  <span className="text-[8px] font-black uppercase">Add More</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm mb-2">
                <Upload size={20} />
              </div>
              <p className="text-xs font-black text-slate-600 uppercase tracking-widest italic">
                {count ? `${count} Files Selected` : 'Click to Upload'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
