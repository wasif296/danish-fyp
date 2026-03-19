const FeeVoucher = require("../models/feeVoucherSchema");

// Create Fee Voucher
exports.createFeeVoucher = async (req, res, next) => {
  try {
    const {
      student,
      department,
      semester,
      tuitionFee,
      examFee,
      labFee,
      otherCharges,
      dueDate,
      voucherId,
      school,
    } = req.body;
    const total = tuitionFee + examFee + (labFee || 0) + (otherCharges || 0);
    const existing = await FeeVoucher.findOne({ voucherId });
    if (existing)
      return res.status(400).json({ message: "Voucher ID already exists" });
    const voucher = new FeeVoucher({
      student,
      department,
      semester,
      tuitionFee,
      examFee,
      labFee,
      otherCharges,
      total,
      dueDate,
      voucherId,
      school,
    });
    await voucher.save();
    res.status(201).json(voucher);
  } catch (err) {
    next(err);
  }
};

// Get Fee Vouchers for a Student
exports.getStudentVouchers = async (req, res, next) => {
  try {
    const { student } = req.params;
    const vouchers = await FeeVoucher.find({ student });
    res.json(vouchers);
  } catch (err) {
    next(err);
  }
};

// Get Fee Vouchers for a Department/Semester
exports.getVouchersByDeptSem = async (req, res, next) => {
  try {
    const { department, semester } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    const vouchers = await FeeVoucher.find(filter);
    res.json(vouchers);
  } catch (err) {
    next(err);
  }
};

// Update Fee Voucher Status
exports.updateVoucherStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const voucher = await FeeVoucher.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!voucher) return res.status(404).json({ message: "Voucher not found" });
    res.json(voucher);
  } catch (err) {
    next(err);
  }
};

// Delete Fee Voucher
exports.deleteFeeVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const voucher = await FeeVoucher.findByIdAndDelete(id);
    if (!voucher) return res.status(404).json({ message: "Voucher not found" });
    res.json({ message: "Voucher deleted" });
  } catch (err) {
    next(err);
  }
};
