const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getBookings, saveBookings, getRooms, getPayments } = require('../utils/storage');

const router = express.Router();

// Get available rooms
router.get('/rooms', authenticate, authorize('student'), (req, res) => {
  try {
    const rooms = getRooms();
    const availableRooms = rooms.filter(room => room.available);
    res.json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student's bookings
router.get('/bookings', authenticate, authorize('student'), (req, res) => {
  try {
    const bookings = getBookings();
    const studentBookings = bookings.filter(b => b.studentId === req.user.id);
    res.json(studentBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create booking request
router.post('/bookings', authenticate, authorize('student'), (req, res) => {
  try {
    const { roomIds, checkInDate, checkOutDate, purpose, numberOfGuests } = req.body;

    if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0) {
      return res.status(400).json({ message: 'Please select at least one room' });
    }

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }

    const rooms = getRooms();
    const selectedRooms = rooms.filter(r => roomIds.includes(r.id));

    if (selectedRooms.length !== roomIds.length) {
      return res.status(400).json({ message: 'Some selected rooms are invalid' });
    }

    // Check if rooms are available
    const unavailableRooms = selectedRooms.filter(r => !r.available);
    if (unavailableRooms.length > 0) {
      return res.status(400).json({ 
        message: `Room(s) ${unavailableRooms.map(r => r.roomNumber).join(', ')} are not available` 
      });
    }

    const bookings = getBookings();
    const totalAmount = selectedRooms.reduce((sum, room) => {
      const days = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
      return sum + (room.price * days);
    }, 0);

    const newBooking = {
      id: Date.now().toString(),
      studentId: req.user.id,
      studentName: req.user.name || req.user.email,
      roomIds,
      rooms: selectedRooms.map(r => ({
        id: r.id,
        guestHouse: r.guestHouse,
        roomNumber: r.roomNumber,
        price: r.price
      })),
      checkInDate,
      checkOutDate,
      purpose: purpose || 'Personal visit',
      numberOfGuests: numberOfGuests || 1,
      totalAmount,
      status: 'pending', // pending, approved, rejected, paid, cancelled
      facultyAdvisorId: null, // Will be assigned by admin or system
      remarks: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    saveBookings(bookings);

    res.status(201).json({ message: 'Booking request submitted successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get booking by ID
router.get('/bookings/:id', authenticate, authorize('student'), (req, res) => {
  try {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === req.params.id && b.studentId === req.user.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const payments = getPayments();
    const payment = payments.find(p => p.bookingId === booking.id);

    res.json({ ...booking, payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

