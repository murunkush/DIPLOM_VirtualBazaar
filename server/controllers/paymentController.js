// paymentController.js
const Payment = require('../models/Payment'); // payment модель хамааруулж байна

// Төлбөр үүсгэх
exports.createPayment = async (req, res) => {
  try {
    const newPayment = new Payment({
      order_id: req.body.order_id,
      amount: req.body.amount,
      status: 'pending',
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(500).json({ message: 'Алдаа гарлаа', error: err });
  }
};

// Төлбөрийн мэдээлэл харах
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id); // Төлбөрийн ID-р хайж байна
    if (!payment) {
      return res.status(404).json({ message: 'Төлбөр олдсонгүй' });
    }
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Алдаа гарлаа', error: err });
  }
};
