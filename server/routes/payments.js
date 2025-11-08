const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getBookings, saveBookings, getPayments, savePayments, getRooms, saveRooms } = require('../utils/storage');

const router = express.Router();

// Initiate payment (for approved bookings)
router.post('/initiate', authenticate, authorize('student'), (req, res) => {
  try {
    const { bookingId } = req.body;

    const bookings = getBookings();
    const booking = bookings.find(b => b.id === bookingId && b.studentId === req.user.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'approved') {
      return res.status(400).json({ 
        message: `Payment can only be initiated for approved bookings. Current status: ${booking.status}` 
      });
    }

    const payments = getPayments();
    const existingPayment = payments.find(p => p.bookingId === bookingId);

    if (existingPayment && existingPayment.status === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Create or update payment record
    let payment;
    if (existingPayment) {
      payment = existingPayment;
    } else {
      payment = {
        id: `pay_${Date.now()}`,
        bookingId: booking.id,
        studentId: booking.studentId,
        amount: booking.totalAmount,
        status: 'pending', // pending, completed, failed
        paymentMethod: 'online',
        transactionId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      payments.push(payment);
      savePayments(payments);
    }

    // Return payment details (in real scenario, this would integrate with payment gateway)
    res.json({
      message: 'Payment initiated',
      paymentId: payment.id,
      amount: payment.amount,
      bookingId: booking.id,
      // In production, this would return payment gateway URL/credentials
      paymentUrl: `/payment/process/${payment.id}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process payment (mock payment gateway)
router.post('/process/:paymentId', authenticate, authorize('student'), (req, res) => {
  try {
    const { paymentId } = req.params;
    const { transactionId } = req.body; // Mock transaction ID

    const payments = getPayments();
    const payment = payments.find(p => p.id === paymentId && p.studentId === req.user.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Simulate payment processing
    payment.status = 'completed';
    payment.transactionId = transactionId || `TXN_${Date.now()}`;
    payment.completedAt = new Date().toISOString();
    payment.updatedAt = new Date().toISOString();

    savePayments(payments);

    // Update booking status
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === payment.bookingId);
    if (booking) {
      booking.status = 'paid';
      booking.paidAt = new Date().toISOString();
      booking.updatedAt = new Date().toISOString();

      // Mark rooms as unavailable
      const rooms = getRooms();
      payment.bookingId && booking.roomIds.forEach(roomId => {
        const room = rooms.find(r => r.id === roomId);
        if (room) {
          room.available = false;
        }
      });
      saveRooms(rooms);
      saveBookings(bookings);
    }

    res.json({
      message: 'Payment completed successfully',
      payment,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payment details
router.get('/:paymentId', authenticate, (req, res) => {
  try {
    const { paymentId } = req.params;
    const payments = getPayments();
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check authorization
    if (req.user.role === 'student' && payment.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const bookings = getBookings();
    const booking = bookings.find(b => b.id === payment.bookingId);

    res.json({
      ...payment,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payment receipt
router.get('/:paymentId/receipt', authenticate, (req, res) => {
  try {
    const { paymentId } = req.params;
    const payments = getPayments();
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (req.user.role === 'student' && payment.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const bookings = getBookings();
    const booking = bookings.find(b => b.id === payment.bookingId);

    const receipt = {
      receiptNumber: `VNIT-GH-${payment.id}`,
      date: payment.completedAt,
      studentName: booking?.studentName,
      bookingId: booking?.id,
      rooms: booking?.rooms || [],
      checkInDate: booking?.checkInDate,
      checkOutDate: booking?.checkOutDate,
      amount: payment.amount,
      transactionId: payment.transactionId,
      paymentMethod: payment.paymentMethod
    };

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

