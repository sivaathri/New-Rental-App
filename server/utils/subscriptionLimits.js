const PLAN_LIMITS = {
    "1 Month": { "Bike": Infinity, "Car": 2, "Van": 1, "Bus": 1, "Mini Bus": 1, "Mini Van": 1, "Tempo Traveller": 1 },
    "3 Month": { "Bike": Infinity, "Car": 3, "Van": 2, "Bus": 2, "Mini Bus": 2, "Mini Van": 2, "Tempo Traveller": 2 },
    "6 Month": { "Bike": Infinity, "Car": 5, "Van": 3, "Bus": 3, "Mini Bus": 3, "Mini Van": 3, "Tempo Traveller": 3 },
    "12 Month": { "Bike": Infinity, "Car": Infinity, "Van": Infinity, "Bus": Infinity, "Mini Bus": Infinity, "Mini Van": Infinity, "Tempo Traveller": Infinity }
};

const checkVehicleLimit = (planName, vehicleType, currentCount) => {
    if (!planName) return false;
    const limits = PLAN_LIMITS[planName];
    if (!limits) return false;
    
    const limit = limits[vehicleType] || 0;
    return currentCount < limit;
};

module.exports = { PLAN_LIMITS, checkVehicleLimit };
