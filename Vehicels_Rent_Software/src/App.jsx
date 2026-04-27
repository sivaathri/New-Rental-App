import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import InfoStrip from './components/InfoStrip';
import Allvehicles from './components/Allvehicles';
import FilterDrawer from './components/FilterDrawer';
import './index.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', overflowX: 'hidden' }}>
      <Header />
      <Hero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        setIsFilterOpen={setIsFilterOpen}
        isFilterOpen={isFilterOpen}
      />
      <InfoStrip activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <Allvehicles searchQuery={searchQuery} activeCategory={activeCategory} />

      <FilterDrawer 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />

      {/* Added content section to make the page scrollable */}
      {/* <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px', color: '#333' }}>Why Choose AutoVoyage?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
          {[
            { title: 'Wide Selection', desc: 'From bikes to minibuses, we have whatever your journey needs.' },
            { title: 'Affordable Rates', desc: 'Get the best deal for short term and long term rentals.' },
            { title: 'Best Support', desc: 'We are here for you 24/7 on the road.' }
          ].map((item, index) => (
            <div key={index} style={{ padding: '30px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '50px', height: '50px', background: '#7ED321', borderRadius: '50%', marginBottom: '20px', opacity: '0.8' }}></div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#1a1a1a' }}>{item.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
}

export default App;
