const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  items: [
    {
      productId: String,
      name: String,
      qty: Number,
      price: Number
    }
  ],
  totalItems: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  customer: { type: String, default: 'N/A' },
  paymentStatus: { type: String, enum: ['Paid','Pending','Canceled'], default: 'Paid' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
