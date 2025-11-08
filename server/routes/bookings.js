const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getBookings } = require('../utils/storage');

const router = express.Router();

// Public endpoint to get booking status (for checking without auth)
router.get('/:id/status', (req, res) => {
  try {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      id: booking.id,
      status: booking.status,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

