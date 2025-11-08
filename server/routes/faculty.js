const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getBookings, saveBookings, getUsers, getPayments } = require('../utils/storage');

const router = express.Router();

// Get all pending bookings (for faculty to review)
router.get('/bookings/pending', authenticate, authorize('faculty'), (req, res) => {
  try {
    const bookings = getBookings();
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    
    // Get student details
    const users = getUsers();
    const bookingsWithStudentInfo = pendingBookings.map(booking => {
      const student = users.find(u => u.id === booking.studentId);
      return {
        ...booking,
        studentEmail: student?.email,
        studentName: student?.name
      };
    });

    res.json(bookingsWithStudentInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings (approved, rejected, etc.)
router.get('/bookings', authenticate, authorize('faculty'), (req, res) => {
  try {
    const bookings = getBookings();
    const users = getUsers();
    
    const bookingsWithStudentInfo = bookings.map(booking => {
      const student = users.find(u => u.id === booking.studentId);
      return {
        ...booking,
        studentEmail: student?.email,
        studentName: student?.name
      };
    });

    res.json(bookingsWithStudentInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve booking
router.post('/bookings/:id/approve', authenticate, authorize('faculty'), (req, res) => {
  try {
    const { remarks } = req.body;
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is not in pending status' });
    }

    booking.status = 'approved';
    booking.facultyAdvisorId = req.user.id;
    booking.facultyAdvisorName = req.user.name || req.user.email;
    booking.remarks = remarks || 'Booking approved';
    booking.approvedAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    saveBookings(bookings);

    res.json({ message: 'Booking approved successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject booking
router.post('/bookings/:id/reject', authenticate, authorize('faculty'), (req, res) => {
  try {
    const { remarks } = req.body;
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is not in pending status' });
    }

    booking.status = 'rejected';
    booking.facultyAdvisorId = req.user.id;
    booking.facultyAdvisorName = req.user.name || req.user.email;
    booking.remarks = remarks || 'Booking rejected';
    booking.rejectedAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    saveBookings(bookings);

    res.json({ message: 'Booking rejected', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get booking by ID
router.get('/bookings/:id', authenticate, authorize('faculty'), (req, res) => {
  try {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const users = getUsers();
    const student = users.find(u => u.id === booking.studentId);
    const payments = getPayments();
    const payment = payments.find(p => p.bookingId === booking.id);

    res.json({
      ...booking,
      studentEmail: student?.email,
      studentName: student?.name,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

