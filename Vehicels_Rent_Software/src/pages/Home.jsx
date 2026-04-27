import React, { useState } from 'react';
import Hero from '../components/Hero';
import InfoStrip from '../components/InfoStrip';
import Allvehicles from '../components/Allvehicles';
import FilterDrawer from '../components/FilterDrawer';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
      type: 'All',
      location: '',
      minPrice: 250,
      maxPrice: 5000,
      fuelType: 'All',
      transmission: 'All',
      seats: 'All',
      sortBy: 'Recommended'
    });

    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Hero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                setIsFilterOpen={setIsFilterOpen}
                isFilterOpen={isFilterOpen}
                filters={filters}
                setFilters={setFilters}
            />
            <InfoStrip activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <Allvehicles 
                searchQuery={searchQuery} 
                activeCategory={activeCategory} 
                filters={filters} 
            />
            
            <FilterDrawer 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)} 
                filters={filters}
                setFilters={setFilters}
            />
        </div>
    );
};

export default Home;
