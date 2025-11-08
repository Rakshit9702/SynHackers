const { getUsers, saveUsers } = require('../utils/storage');
const bcrypt = require('bcryptjs');

// Initialize default users for testing
async function initUsers() {
  const users = getUsers();
  
  // Check if users already exist
  if (users.length > 0) {
    console.log('Users already initialized');
    return;
  }

  const defaultUsers = [
    {
      id: '1',
      email: 'student@vnit.ac.in',
      password: await bcrypt.hash('student123', 10),
      name: 'John Student',
      role: 'student',
      studentId: 'VNIT2024001',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'faculty@vnit.ac.in',
      password: await bcrypt.hash('faculty123', 10),
      name: 'Dr. Jane Faculty',
      role: 'faculty',
      facultyId: 'FAC001',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      email: 'admin@vnit.ac.in',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ];

  saveUsers(defaultUsers);
  console.log('Default users initialized:');
  console.log('Student: student@vnit.ac.in / student123');
  console.log('Faculty: faculty@vnit.ac.in / faculty123');
  console.log('Admin: admin@vnit.ac.in / admin123');
}

if (require.main === module) {
  initUsers().then(() => {
    console.log('Initialization complete');
    process.exit(0);
  }).catch(err => {
    console.error('Error initializing users:', err);
    process.exit(1);
  });
}

module.exports = { initUsers };

