import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DashboardOverview from './components/DashboardOverview';
import VehicleGrid from './components/VehicleGrid';
import ProcessSteps from './components/ProcessSteps';

function App() {
  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <main>
        <Hero />
        <DashboardOverview />
        <VehicleGrid />
      </main>
      <ProcessSteps />
    </div>
  );
}

export default App;
