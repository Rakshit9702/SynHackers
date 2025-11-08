const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { 
  getBookings, 
  getRooms, 
  saveRooms, 
  getUsers, 
  getPayments,
  saveBookings
} = require('../utils/storage');

const router = express.Router();

// Get all bookings
router.get('/bookings', authenticate, authorize('admin'), (req, res) => {
  try {
    const bookings = getBookings();
    const users = getUsers();
    const payments = getPayments();

    const bookingsWithDetails = bookings.map(booking => {
      const student = users.find(u => u.id === booking.studentId);
      const faculty = booking.facultyAdvisorId 
        ? users.find(u => u.id === booking.facultyAdvisorId)
        : null;
      const payment = payments.find(p => p.bookingId === booking.id);

      return {
        ...booking,
        studentEmail: student?.email,
        studentName: student?.name,
        facultyEmail: faculty?.email,
        facultyName: faculty?.name,
        payment
      };
    });

    res.json(bookingsWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all rooms
router.get('/rooms', authenticate, authorize('admin'), (req, res) => {
  try {
    const rooms = getRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new room
router.post('/rooms', authenticate, authorize('admin'), (req, res) => {
  try {
    const { guestHouse, roomNumber, capacity, price, amenities } = req.body;

    if (!guestHouse || !roomNumber || !capacity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const rooms = getRooms();
    
    // Check if room already exists
    if (rooms.find(r => r.guestHouse === guestHouse && r.roomNumber === roomNumber)) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const newRoom = {
      id: `${guestHouse.toLowerCase().replace(/\s+/g, '-')}-${roomNumber}`,
      guestHouse,
      roomNumber,
      capacity: parseInt(capacity),
      price: parseFloat(price),
      amenities: amenities || [],
      available: true
    };

    rooms.push(newRoom);
    saveRooms(rooms);

    res.status(201).json({ message: 'Room added successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update room
router.put('/rooms/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const { available, price, amenities } = req.body;
    const rooms = getRooms();
    const room = rooms.find(r => r.id === req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (available !== undefined) room.available = available;
    if (price !== undefined) room.price = parseFloat(price);
    if (amenities !== undefined) room.amenities = amenities;

    saveRooms(rooms);

    res.json({ message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete room
router.delete('/rooms/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const rooms = getRooms();
    const filteredRooms = rooms.filter(r => r.id !== req.params.id);

    if (rooms.length === filteredRooms.length) {
      return res.status(404).json({ message: 'Room not found' });
    }

    saveRooms(filteredRooms);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Analytics
router.get('/analytics', authenticate, authorize('admin'), (req, res) => {
  try {
    const bookings = getBookings();
    const rooms = getRooms();
    const payments = getPayments();

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const approvedBookings = bookings.filter(b => b.status === 'approved').length;
    const paidBookings = bookings.filter(b => b.status === 'paid').length;
    const rejectedBookings = bookings.filter(b => b.status === 'rejected').length;

    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const bookingsByGuestHouse = bookings.reduce((acc, booking) => {
      booking.rooms.forEach(room => {
        acc[room.guestHouse] = (acc[room.guestHouse] || 0) + 1;
      });
      return acc;
    }, {});

    const availableRooms = rooms.filter(r => r.available).length;
    const totalRooms = rooms.length;

    res.json({
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        approved: approvedBookings,
        paid: paidBookings,
        rejected: rejectedBookings
      },
      revenue: {
        total: totalRevenue
      },
      rooms: {
        total: totalRooms,
        available: availableRooms,
        occupied: totalRooms - availableRooms
      },
      bookingsByGuestHouse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status (admin override)
router.put('/bookings/:id/status', authenticate, authorize('admin'), (req, res) => {
  try {
    const { status, remarks } = req.body;
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    if (remarks) booking.remarks = remarks;
    booking.updatedAt = new Date().toISOString();

    saveBookings(bookings);

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

