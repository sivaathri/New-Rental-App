import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [verifications, setVerifications] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const API_BASE = 'http://localhost:5000/api/admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const verifRes = await axios.get(`${API_BASE}/verifications/pending`);
      setVerifications(verifRes.data.verifications);
      
      const vehicRes = await axios.get(`${API_BASE}/vehicles/pending`);
      setVehicles(vehicRes.data.vehicles);
    } catch(err) { console.error(err); }
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
    } catch(err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Admin Control Panel</h1>

      {/* Verifications section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Pending Identity Verifications</h2>
        {verifications.length === 0 ? <p className="text-gray-500">No pending verifications</p> : (
          <div className="space-y-4">
            {verifications.map(v => (
              <div key={v.id} className="flex items-center justify-between p-4 border rounded bg-gray-50">
                <div>
                  <div className="font-medium">User ID: {v.user_id}</div>
                  <div className="text-sm text-blue-600">
                    <a href={`http://localhost:5000${v.aadhar_card_url}`} target="_blank" rel="noreferrer" className="mr-4 hover:underline">View Aadhar</a>
                    <a href={`http://localhost:5000${v.driving_license_url}`} target="_blank" rel="noreferrer" className="hover:underline">View License</a>
                  </div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleAction('verifications', v.id, 'Verified')} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Approve</button>
                  <button onClick={() => handleAction('verifications', v.id, 'Rejected')} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Vehicles section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Pending Vehicles</h2>
        {vehicles.length === 0 ? <p className="text-gray-500">No pending vehicles</p> : (
          <div className="space-y-4">
            {vehicles.map(v => (
              <div key={v.id} className="flex items-center justify-between p-4 border rounded bg-gray-50">
                <div>
                  <div className="font-medium">{v.name} ({v.type} - {v.model_year})</div>
                  <div className="text-sm text-gray-600">Reg: {v.registration_number} | Owner ID: {v.user_id}</div>
                  <div className="text-sm text-blue-600 mt-1">
                    <a href={`http://localhost:5000${v.rc_book_url}`} target="_blank" rel="noreferrer" className="hover:underline">View RC Book</a>
                  </div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleAction('vehicles', v.id, 'Approved')} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Approve</button>
                  <button onClick={() => handleAction('vehicles', v.id, 'Rejected')} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
