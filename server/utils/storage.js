const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize JSON files if they don't exist
const initFile = (filename, defaultData = []) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

// Initialize all data files
initFile('users.json', []);
initFile('bookings.json', []);
initFile('rooms.json', [
  {
    id: 'boys-gh-101',
    guestHouse: 'Boys Guest House',
    roomNumber: '101',
    capacity: 2,
    price: 500,
    amenities: ['AC', 'WiFi', 'Attached Bathroom'],
    available: true
  },
  {
    id: 'boys-gh-102',
    guestHouse: 'Boys Guest House',
    roomNumber: '102',
    capacity: 2,
    price: 500,
    amenities: ['AC', 'WiFi', 'Attached Bathroom'],
    available: true
  },
  {
    id: 'girls-gh-201',
    guestHouse: 'Girls Guest House',
    roomNumber: '201',
    capacity: 2,
    price: 500,
    amenities: ['AC', 'WiFi', 'Attached Bathroom'],
    available: true
  },
  {
    id: 'girls-gh-202',
    guestHouse: 'Girls Guest House',
    roomNumber: '202',
    capacity: 2,
    price: 500,
    amenities: ['AC', 'WiFi', 'Attached Bathroom'],
    available: true
  },
  {
    id: 'institute-gh-301',
    guestHouse: 'Institute Guest House',
    roomNumber: '301',
    capacity: 3,
    price: 800,
    amenities: ['AC', 'WiFi', 'Attached Bathroom', 'TV'],
    available: true
  },
  {
    id: 'institute-gh-302',
    guestHouse: 'Institute Guest House',
    roomNumber: '302',
    capacity: 3,
    price: 800,
    amenities: ['AC', 'WiFi', 'Attached Bathroom', 'TV'],
    available: true
  }
]);
initFile('payments.json', []);

// Read from JSON file
const readFile = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

// Write to JSON file
const writeFile = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Helper functions for specific data types
const getUsers = () => readFile('users.json');
const saveUsers = (users) => writeFile('users.json', users);

const getBookings = () => readFile('bookings.json');
const saveBookings = (bookings) => writeFile('bookings.json', bookings);

const getRooms = () => readFile('rooms.json');
const saveRooms = (rooms) => writeFile('rooms.json', rooms);

const getPayments = () => readFile('payments.json');
const savePayments = (payments) => writeFile('payments.json', payments);

module.exports = {
  getUsers,
  saveUsers,
  getBookings,
  saveBookings,
  getRooms,
  saveRooms,
  getPayments,
  savePayments
};

