import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function RegistrationFlow() {
  const [step, setStep] = useState(2);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [vehicleId, setVehicleId] = useState(null);
  
  // States holding prepopulated data
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
        // If in 'Add Mode', we force Step 4 and don't prepopulate vehicle details
        if (isAddMode) {
          setStep(4);
          setVehicleId(null);
          // Prepopulate user/docs only
          const data = res.data.data;
          if (data.user && data.user.full_name) {
            setProfile({
              full_name: data.user.full_name,
              address: data.user.address || '',
              city: data.user.city || 'Pondicherry'
            });
          }
          if (data.verification) setHasVerification(true);
          return;
        }

        if (res.data.step === 7) return navigate('/dashboard');
        
        setStep(res.data.step);
        if (res.data.vehicleId) setVehicleId(res.data.vehicleId);

        // Prepopulate exact fetched data directly into state hooks
        const data = res.data.data;
        if (data.user && data.user.full_name) {
          setProfile({
            full_name: data.user.full_name,
            address: data.user.address || '',
            city: data.user.city || 'Pondicherry'
          });
        }
        if (data.verification) {
          setHasVerification(true); 
        }
        if (data.vehicle) {
          setVehicle(v => ({ ...v, ...data.vehicle, rc_book: null })); 
        }
      })
      .catch(err => console.error(err));
  }, [token, navigate, isAddMode]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(2, prev - 1));

  // Step 2: Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_BASE}/profile/setup`, profile, { headers: { Authorization: `Bearer ${token}` } });
    nextStep();
  };

  // Step 3: Verification
  const handleDocsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (docs.aadhar) formData.append('aadhar', docs.aadhar);
    if (docs.license) formData.append('license', docs.license);
    await axios.post(`${API_BASE}/profile/verify`, formData, { headers: { Authorization: `Bearer ${token}` } });
    setHasVerification(true);
    nextStep();
  };

  // Step 4 & 5: Add Vehicle & Media
  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(vehicle).forEach(key => {
      if (key !== 'rc_book') formData.append(key, vehicle[key]);
    });
    if (vehicle.rc_book) formData.append('rc_book', vehicle.rc_book);
    Array.from(media).forEach(file => formData.append('media', file));

    if (vehicleId) formData.append('vehicle_id', vehicleId);

    const res = await axios.post(`${API_BASE}/vehicles/add`, formData, { headers: { Authorization: `Bearer ${token}` } });
    setVehicleId(res.data.vehicleId);
    setStep(6);
  };

  // Step 6: Subscription
  const plans = [
    { duration: 1, price: 700 }, { duration: 3, price: 1200 },
    { duration: 6, price: 2000 }, { duration: 12, price: 3000 }
  ];
  const handleSubscribe = async () => {
    if (!plan) return alert('Select plan');
    await axios.post(`${API_BASE}/vehicles/${vehicleId}/subscribe`, { plan_duration: plan.duration, plan_price: plan.price }, { headers: { Authorization: `Bearer ${token}` } });
    setStep(7);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Owner Registration Flow - Step {step} of 7</h2>
      </div>
      
      <div className="h-2 w-full bg-gray-200 rounded-full mb-8">
        <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${(step/7)*100}%` }}></div>
      </div>

      {step === 2 && (
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <h3 className="text-xl font-medium">Profile Setup</h3>
          <input required placeholder="Full Name" className="w-full p-3 border rounded" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} />
          <input required placeholder="Address" className="w-full p-3 border rounded" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
          <input placeholder="City" className="w-full p-3 border rounded" value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})} disabled />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-medium mt-4">Save & Continue</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleDocsSubmit} className="space-y-4">
          <h3 className="text-xl font-medium">Identity Verification</h3>
          {hasVerification && <p className="text-sm text-green-600 font-medium bg-green-50 p-2 border border-green-200 rounded">You have already uploaded these documents. You can upload new files below to replace them, or just click Continue.</p>}
          
          <div>
            <label className="block mb-2 text-gray-700">Aadhar Card</label>
            <input type="file" required={!hasVerification} onChange={e => setDocs({...docs, aadhar: e.target.files[0]})} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Driving License</label>
            <input type="file" required={!hasVerification} onChange={e => setDocs({...docs, license: e.target.files[0]})} className="w-full p-2 border rounded" />
          </div>
          <div className="flex gap-4 mt-6">
            <button type="button" onClick={prevStep} className="w-1/3 bg-gray-200 text-gray-800 p-3 rounded font-medium hover:bg-gray-300">Back</button>
            <button type="submit" className="w-2/3 bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700">Upload & Continue</button>
          </div>
        </form>
      )}

      {(step === 4 || step === 5) && (
        <form onSubmit={handleVehicleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-xl font-medium">Add Vehicle & Media</h3>
            {vehicle.name && <p className="text-sm text-green-600 font-medium bg-green-50 p-2 border border-green-200 rounded mb-2">Vehicle data restored! Make any edits below.</p>}
          </div>
          
          <select className="p-3 border rounded" value={vehicle.type} onChange={e => setVehicle({...vehicle, type: e.target.value})}>
            <option>Car</option><option>Bike</option><option>Bus</option><option>Van</option><option>Mini Van</option><option>Mini Bus</option><option>Tempo Traveller</option>
          </select>
          <input required placeholder="Vehicle Name (e.g. Swift)" className="p-3 border rounded" value={vehicle.name} onChange={e => setVehicle({...vehicle, name: e.target.value})} />
          <input required type="number" placeholder="Model Year (e.g. 2022)" className="p-3 border rounded" value={vehicle.model_year} onChange={e => setVehicle({...vehicle, model_year: e.target.value})} />
          <input required placeholder="Registration Number" className="p-3 border rounded" value={vehicle.registration_number} onChange={e => setVehicle({...vehicle, registration_number: e.target.value})} />
          <input required type="number" placeholder="Seating Capacity" className="p-3 border rounded" value={vehicle.seating_capacity} onChange={e => setVehicle({...vehicle, seating_capacity: e.target.value})} />
          <input required placeholder="Fuel Type" className="p-3 border rounded" value={vehicle.fuel_type} onChange={e => setVehicle({...vehicle, fuel_type: e.target.value})} />
          <input required type="number" placeholder="Price Per Day" className="p-3 border rounded" value={vehicle.price_per_day} onChange={e => setVehicle({...vehicle, price_per_day: e.target.value})} />
          <input required type="number" placeholder="Price Per Hour" className="p-3 border rounded" value={vehicle.price_per_hour} onChange={e => setVehicle({...vehicle, price_per_hour: e.target.value})} />
          
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">RC Book Upload</label>
            <input type="file" required={!vehicle.id} onChange={e => setVehicle({...vehicle, rc_book: e.target.files[0]})} className="w-full p-2 border rounded bg-gray-50" />
          </div>

          <div className="md:col-span-2 mt-4">
            <label className="block mb-2 font-medium">Media Upload (Images & Videos)</label>
            <input type="file" multiple accept="image/*,video/*" required={!vehicle.id} onChange={e => setMedia(e.target.files)} className="w-full p-2 border rounded bg-gray-50" />
          </div>

          <div className="md:col-span-2 flex gap-4 mt-6">
            <button type="button" onClick={prevStep} className="w-1/3 bg-gray-200 text-gray-800 p-3 rounded font-medium hover:bg-gray-300">Back</button>
            <button type="submit" className="w-2/3 bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700">Save Vehicle & Media</button>
          </div>
        </form>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Choose Subscription Plan</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {plans.map((p, i) => (
              <div key={i} onClick={() => setPlan(p)} className={`cursor-pointer p-4 border rounded-lg text-center shadow-sm hover:shadow-md transition-all ${plan?.duration === p.duration ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-200'}`}>
                <div className="text-2xl font-bold text-gray-800">{p.duration} {p.duration === 1 ? 'Month' : 'Months'}</div>
                <div className="text-xl mt-2 text-blue-600 font-semibold">₹{p.price}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <button type="button" onClick={prevStep} className="w-1/3 bg-gray-200 text-gray-800 p-3 rounded font-medium hover:bg-gray-300">Back</button>
            <button onClick={handleSubscribe} className="w-2/3 bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700">Subscribe & Finish</button>
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Submitted for Approval!</h2>
          <p className="text-gray-600 mt-2 mb-8">Your registration and vehicle are in 'Waiting for Approval' state.</p>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">Go to Dashboard</button>
        </div>
      )}

    </div>
  );
}
