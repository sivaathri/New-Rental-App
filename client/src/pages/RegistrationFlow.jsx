import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, ChevronRight, ChevronLeft, User, ShieldCheck, 
  Car, CreditCard, Star, LayoutGrid, Zap, Sparkles, Upload, MapPin, X, Film, Search, Globe, Plus, FileText, Clock,
  Home, Tag, Hash, IndianRupee, Flag, Users, Navigation, Mail
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
  
  const [profile, setProfile] = useState({ full_name: '', email: '', address: '', city: 'Pondicherry' });
  const [docs, setDocs] = useState({ aadhar: null, license: null });
  const [vehicle, setVehicle] = useState({
    type: 'Car', name: '', model_year: '', registration_number: '', rc_book: null,
    seating_capacity: '', fuel_type: '', mileage: '', 
    price_per_day: '', price_per_hour: '', price_per_km: '', max_km_per_day: '', 
    pickup_location: '', landmark: ''
  });
  const [media, setMedia] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const navigate = useNavigate();

  const vehicleTypes = ["Car", "Bike", "Bus", "Van", "Mini-Van", "Mini-Bus", "Tempo_traveller", "traveller"];

  useEffect(() => {
    if (!token) return navigate('/');
    axios.get(`${API_BASE}/profile/progress`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.step === 8) return navigate('/dashboard');
        setStep(res.data.step);
        if (res.data.vehicleId) setVehicleId(res.data.vehicleId);
        const data = res.data.data;
        if (data.user?.full_name) setProfile({ full_name: data.user.full_name, address: data.user.address || '', city: data.user.city || 'Pondicherry' });
      })
      .catch(err => console.error(err));
  }, [token, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile.full_name || !profile.email || !profile.address) return alert('Please fill in all details');
    if (!docs.aadhar || !docs.license) return alert('Please upload both Aadhar and Driving License');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('full_name', profile.full_name);
    formData.append('email', profile.email);
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
    
    // Append vehicle meta-data skipping the file object
    Object.keys(vehicle).forEach(k => {
      if (k !== 'rc_book') formData.append(k, vehicle[k]);
    });
    
    // Append files
    if (vehicle.rc_book) formData.append('rc_book', vehicle.rc_book);
    media.forEach(file => formData.append('media', file));
    
    if (vehicleId) formData.append('vehicle_id', vehicleId);

    try {
      const res = await axios.post(`${API_BASE}/vehicles/add`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setVehicleId(res.data.vehicleId);
      setStep(8);
    } catch (err) { 
      alert(err.response?.data?.error || 'Error saving vehicle'); 
    }
    finally { setLoading(false); }
  };

  const handlePlanSubmit = async () => {
    if (!plan) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/vehicles/${vehicleId}/subscribe`, { plan_duration: plan.duration, plan_price: plan.price }, { headers: { Authorization: `Bearer ${token}` } });
      setStep(8);
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
          
          <div className="mb-8 px-4 w-full">
             <div className="flex items-center justify-between relative w-full">
                <HorizontalStep num={1} label="Registry" active={step >= 2} current={step === 2} completed={step > 2} />
                <StepLine active={step > 2} />
                <HorizontalStep num={2} label="Asset" active={step >= 4} current={step === 4 || step === 5} completed={step > 5} />
                <StepLine active={step > 5} />
                <HorizontalStep num={3} label="Media" active={step >= 6} current={step === 6} completed={step > 6} />
                <StepLine active={step > 6} />
                <HorizontalStep num={4} label="Confirm" active={step >= 8} current={step === 8} completed={step >= 8} />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <InputGroup label="Full Name" placeholder="Example: Rahul Sharma" value={profile.full_name} onChange={(v) => setProfile({...profile, full_name: v})} icon={User} required />
                       <InputGroup label="Email Address" placeholder="Example: rahul@example.com" value={profile.email} onChange={(v) => setProfile({...profile, email: v})} icon={Mail} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <InputGroup label="City" value="Pondicherry" disabled icon={MapPin} required />
                       <InputGroup label="Address" placeholder="Example: 123 Street Name" value={profile.address} onChange={(v) => setProfile({...profile, address: v})} icon={Home} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-blue-50/30 rounded-[2rem] border border-blue-100 flex flex-col gap-6">
                         <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm overflow-hidden text-[#82d616]">
                               {docs.aadhar ? (
                                 <img src={URL.createObjectURL(docs.aadhar)} className="w-full h-full object-cover" alt="Aadhar" />
                               ) : (
                                 <FileText size={28}/>
                               )}
                            </div>
                            <div>
                               <p className="font-bold text-[#252f40] text-lg">Aadhar Card</p>
                               <p className="text-gray-400 text-sm">{docs.aadhar ? "Captured" : 'Front Image'}</p>
                            </div>
                         </div>
                         <label className="w-full bg-white border border-blue-100 text-[#252f40] py-4 rounded-xl font-bold text-[13px] cursor-pointer hover:bg-blue-50 transition-all text-center">
                            {docs.aadhar ? "Change File" : "Upload Aadhar"}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setDocs({...docs, aadhar: e.target.files[0]})} />
                         </label>
                      </div>

                      <div className="p-8 bg-blue-50/30 rounded-[2rem] border border-blue-100 flex flex-col gap-6">
                         <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm overflow-hidden text-[#82d616]">
                               {docs.license ? (
                                 <img src={URL.createObjectURL(docs.license)} className="w-full h-full object-cover" alt="License" />
                               ) : (
                                 <CreditCard size={28}/>
                               )}
                            </div>
                            <div>
                               <p className="font-bold text-[#252f40] text-lg">Driving License</p>
                               <p className="text-gray-400 text-sm">{docs.license ? "Captured" : 'Operator Permit'}</p>
                            </div>
                         </div>
                         <label className="w-full bg-white border border-blue-100 text-[#252f40] py-4 rounded-xl font-bold text-[13px] cursor-pointer hover:bg-blue-50 transition-all text-center">
                            {docs.license ? "Change File" : "Upload License"}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setDocs({...docs, license: e.target.files[0]})} />
                         </label>
                      </div>
                   </div>
                </div>

                <button onClick={handleProfileSubmit} disabled={loading} className="w-full bg-[#252f40] text-white py-5 rounded-2xl font-bold text-[18px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl">
                  {loading ? 'Processing...' : 'Proceed to Asset Config'}
                  <ChevronRight size={24} />
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
                <header className="space-y-4">
                  <h2 className="text-[48px] font-bold text-[#252f40] leading-none">Basic Info</h2>
                  <p className="text-gray-500 font-medium text-xl">Define the core specifications of your asset.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-8">
                     <SelectGroup label="Vehicle Type" options={vehicleTypes} value={vehicle.type} onChange={(v) => setVehicle({...vehicle, type: v})} icon={Car} required />
                     <InputGroup label="Vehicle Name" placeholder="Example: Swift, Innova" value={vehicle.name} onChange={(v) => setVehicle({...vehicle, name: v.toUpperCase()})} icon={Tag} required />
                     <InputGroup label="Model Year" placeholder="Example: 2022" type="number" value={vehicle.model_year} onChange={(v) => setVehicle({...vehicle, model_year: v})} icon={Clock} required />
                     <InputGroup label="Registration Number" placeholder="Example: PY 01 XX 1234" value={vehicle.registration_number} onChange={(v) => setVehicle({...vehicle, registration_number: v.toUpperCase()})} icon={Hash} required />
                   </div>
                   
                   <div className="p-8 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center gap-6">
                      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg overflow-hidden border border-gray-100 text-blue-500 shrink-0">
                         {vehicle.rc_book ? (
                           <img src={URL.createObjectURL(vehicle.rc_book)} className="w-full h-full object-cover" alt="RC Preview" />
                         ) : (
                           <FileText size={40} />
                         )}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-[#252f40]">RC Book Copy</p>
                        <p className="text-gray-500 text-sm mt-1">Upload front side clear image</p>
                      </div>
                      <label className="bg-[#252f40] text-white px-10 py-4 rounded-2xl font-bold text-sm cursor-pointer hover:bg-black transition-all">
                         {vehicle.rc_book ? "Change RC Book" : "Select RC Image"}
                         <input type="file" accept="image/*" className="hidden" onChange={(e) => setVehicle({...vehicle, rc_book: e.target.files[0]})} />
                      </label>
                   </div>
                </div>

                <div className="pt-10 border-t border-gray-100">
                  <h3 className="text-3xl font-bold text-[#252f40] mb-8">Technical Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <InputGroup label="Seating" placeholder="Example: 5" type="number" value={vehicle.seating_capacity} onChange={(v) => setVehicle({...vehicle, seating_capacity: v})} icon={Users} required />
                     <SelectGroup label="Fuel Type" options={["Petrol", "Diesel", "Electric", "CNG"]} value={vehicle.fuel_type} onChange={(v) => setVehicle({...vehicle, fuel_type: v})} icon={Zap} required />
                     <InputGroup label="Mileage" placeholder="Example: 18" type="number" value={vehicle.mileage} onChange={(v) => setVehicle({...vehicle, mileage: v})} icon={Sparkles} required />
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-100">
                  <h3 className="text-3xl font-bold text-[#252f40] mb-8">Pricing Strategy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <InputGroup label="Per Day" placeholder="₹1500" type="number" value={vehicle.price_per_day} onChange={(v) => setVehicle({...vehicle, price_per_day: v})} icon={IndianRupee} required />
                     <InputGroup label="Per Hour" placeholder="₹200" type="number" value={vehicle.price_per_hour} onChange={(v) => setVehicle({...vehicle, price_per_hour: v})} icon={Clock} required />
                     <InputGroup label="Per KM" placeholder="₹15" type="number" value={vehicle.price_per_km} onChange={(v) => setVehicle({...vehicle, price_per_km: v})} icon={Navigation} required />
                     <InputGroup label="Limit (KM/Day)" placeholder="200" type="number" value={vehicle.max_km_per_day} onChange={(v) => setVehicle({...vehicle, max_km_per_day: v})} icon={LayoutGrid} required />
                  </div>
                </div>

                <div className="flex gap-4 pt-10">
                  <button onClick={() => setStep(2)} className="w-[100px] h-[72px] rounded-[2rem] border border-gray-200 flex items-center justify-center text-[#252f40] hover:bg-gray-50 transition-all"><ChevronLeft size={32}/></button>
                  <button onClick={() => setStep(5)} className="flex-1 bg-[#252f40] text-white py-6 rounded-[2rem] font-bold text-[18px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl">Set Deployment Location</button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
                <header className="space-y-4">
                  <h2 className="text-[48px] font-bold text-[#252f40] leading-none">Deployment Point</h2>
                  <p className="text-gray-500 font-medium text-xl">Define where renters will collect the asset.</p>
                </header>

                <div className="space-y-8">
                   <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-blue-500 shadow-md"><MapPin size={32}/></div>
                         <div>
                            <p className="font-bold text-[#252f40] text-xl">Pickup Location</p>
                            <p className="text-gray-400 text-sm font-medium mt-1">{vehicle.pickup_location || "Select location on map"}</p>
                         </div>
                      </div>
                      <button onClick={() => setShowMap(true)} className="bg-white border border-gray-200 px-8 py-4 rounded-2xl font-bold text-sm text-[#252f40] hover:border-blue-400 transition-all shadow-sm">Set Location</button>
                   </div>
                   <InputGroup label="Landmark" placeholder="Example: Near Gym, Opposite Bakery" value={vehicle.landmark} onChange={(v) => setVehicle({...vehicle, landmark: v})} icon={Flag} required />
                </div>

                <div className="flex gap-4 pt-10">
                  <button onClick={() => setStep(4)} className="w-[100px] h-[72px] rounded-[2rem] border border-gray-200 flex items-center justify-center text-[#252f40] hover:bg-gray-50 transition-all"><ChevronLeft size={32}/></button>
                  <button onClick={() => setStep(6)} className="flex-1 bg-[#252f40] text-white py-6 rounded-[2rem] font-bold text-[18px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl">Proceed to Media Upload</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
                <header className="space-y-4">
                  <h2 className="text-[48px] font-bold text-[#252f40] leading-none">Upload Media</h2>
                  <div className="flex items-center gap-3 text-[#82d616] font-bold">
                    <Sparkles size={20} />
                    <span>Good photos = more bookings</span>
                  </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                   {/* Image Slots */}
                   {[...Array(5)].map((_, i) => {
                     const file = media.filter(m => m.type?.includes('image'))[i];
                     const realIndex = media.indexOf(file);
                     
                     return (
                       <div key={i} className="aspect-square bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
                          {file ? (
                            <>
                              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt={`preview ${i}`} />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                 {i > 0 && (
                                   <button onClick={() => {
                                      const images = media.filter(m => m.type?.includes('image'));
                                      const otherMedia = media.filter(m => !m.type?.includes('image'));
                                      const newImages = [...images];
                                      [newImages[i-1], newImages[i]] = [newImages[i], newImages[i-1]];
                                      setMedia([...newImages, ...otherMedia]);
                                   }} className="w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"><ChevronLeft size={16}/></button>
                                 )}
                                 <button onClick={() => setMedia(media.filter(m => m !== file))} className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"><X size={20}/></button>
                                 {i < media.filter(m => m.type?.includes('image')).length - 1 && (
                                   <button onClick={() => {
                                      const images = media.filter(m => m.type?.includes('image'));
                                      const otherMedia = media.filter(m => !m.type?.includes('image'));
                                      const newImages = [...images];
                                      [newImages[i], newImages[i+1]] = [newImages[i+1], newImages[i]];
                                      setMedia([...newImages, ...otherMedia]);
                                   }} className="w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"><ChevronRight size={16}/></button>
                                 )}
                              </div>
                              {i === 0 && <div className="absolute top-4 left-4 bg-[#82d616] text-[#252f40] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg">1st (Main)</div>}
                              {i > 0 && <div className="absolute top-4 left-4 bg-white/90 text-[#252f40] px-3 py-1 rounded-lg text-[10px] font-bold shadow-lg">{i + 1}st</div>}
                            </>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                              <Plus size={32} className="text-gray-300" />
                              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Image {i+1}</p>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const newFile = e.target.files[0];
                                if (newFile) setMedia([...media, newFile]);
                              }} />
                            </label>
                          )}
                       </div>
                     );
                   })}
                </div>

                {(!['Car', 'Bike'].includes(vehicle.type)) && (
                   <div className="p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-100 flex items-center justify-between mt-10">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-blue-500 shadow-sm"><Film size={32}/></div>
                        <div>
                           <p className="font-bold text-[#252f40] text-xl">Video Showcase</p>
                           <p className="text-gray-400 text-sm font-medium">Capture a full walk-around of your {vehicle.type}</p>
                        </div>
                      </div>
                      <label className="bg-[#252f40] text-white px-8 py-4 rounded-xl font-bold text-sm cursor-pointer">
                         Upload Video
                         <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                            const newMedia = [...media.filter(m => !m.type.includes('video'))];
                            newMedia.push(e.target.files[0]);
                            setMedia(newMedia);
                         }} />
                      </label>
                   </div>
                )}

                <p className={`text-sm font-bold ${media.filter(m => m.type?.includes('image')).length >= 4 ? 'text-[#82d616]' : 'text-red-500'}`}>
                  {media.filter(m => m.type?.includes('image')).length} / 4 minimum images uploaded
                </p>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(5)} className="w-[100px] h-[72px] rounded-[2rem] border border-gray-200 flex items-center justify-center text-[#252f40] hover:bg-gray-50 transition-all"><ChevronLeft size={32}/></button>
                  <button onClick={handleVehicleSubmit} disabled={loading || media.filter(m => m.type?.includes('image')).length < 4} className="flex-1 bg-[#252f40] text-white py-6 rounded-[2rem] font-bold text-[18px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl">Complete & Finalize Asset</button>
                </div>
              </div>
            )}


            {step === 8 && (
              <div className="py-20 animate-in zoom-in-95 duration-700">
                <div className="w-32 h-32 bg-[#e6ffed] rounded-[3rem] flex items-center justify-center text-[#82d616] mb-12 shadow-xl shadow-[#82d616]/10">
                   <CheckCircle size={64} />
                </div>
                <h2 className="text-[56px] font-bold text-[#252f40] leading-[1.1] mb-6">Verification Pending</h2>
                <p className="text-gray-500 text-xl font-medium leading-relaxed mb-16">
                  Your vehicle listing is being validated by our professional verification team. Cycle completes in <span className="text-[#252f40] font-bold underline">12 hours</span>.
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
