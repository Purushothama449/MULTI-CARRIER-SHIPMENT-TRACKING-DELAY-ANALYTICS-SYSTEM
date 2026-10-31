export const CITY_COORDINATES: Record<string, [number, number]> = {
  'Delhi': [28.6139, 77.2090],
  'New Delhi': [28.6139, 77.2090],
  'Mumbai': [19.0760, 72.8777],
  'Bangalore': [12.9716, 77.5946],
  'Bengaluru': [12.9716, 77.5946],
  'Chennai': [13.0827, 80.2707],
  'Hyderabad': [17.3850, 78.4867],
  'Kolkata': [22.5726, 88.3639],
  'Ahmedabad': [23.0225, 72.5714],
  'Pune': [18.5204, 73.8567],
  'Kochi': [9.9312, 76.2673],
  'Cochin': [9.9312, 76.2673],
  'Chandigarh': [30.7333, 76.7794],
  'Jaipur': [26.9124, 75.7873],
  'Lucknow': [26.8467, 80.9462],
  'Surat': [21.1702, 72.8311],
  'Indore': [22.7196, 75.8577],
  'Bhopal': [23.2599, 77.4126],
  'Nagpur': [21.1458, 79.0882],
  'Visakhapatnam': [17.6868, 83.2185],
  'Coimbatore': [11.0168, 76.9558],
  'Bangalore Hub': [12.9716, 77.5946],
  'Chennai Hub': [13.0827, 80.2707],
  'Mumbai Hub': [19.0760, 72.8777],
  'Delhi Hub': [28.6139, 77.2090],
  'In Transit': [15.3173, 75.7139], // Karnataka transit mid-point
};

export function getCityCoords(cityName: string): [number, number] {
  if (!cityName) return [20.5937, 78.9629];
  const name = cityName.trim();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) {
      return coords;
    }
  }
  return [20.5937, 78.9629]; // Default India Center
}
