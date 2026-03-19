const mongoose = require("mongoose");

const feeVoucherSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "semester",
    required: true,
  },
  tuitionFee: { type: Number, required: true },
  examFee: { type: Number, required: true },
  labFee: { type: Number, default: 0 },
  otherCharges: { type: Number, default: 0 },
  total: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  voucherId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("feevoucher", feeVoucherSchema);
