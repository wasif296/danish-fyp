const Department = require("../models/departmentSchema");

// Create Department
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, description, school } = req.body;
    const existing = await Department.findOne({ name, school });
    if (existing)
      return res.status(400).json({ message: "Department already exists" });
    const department = new Department({ name, description, school });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    next(err);
  }
};

// Get All Departments for a School
exports.getDepartments = async (req, res, next) => {
  try {
    const { school } = req.params;
    const departments = await Department.find({ school });
    res.json(departments);
  } catch (err) {
    next(err);
  }
};

// Update Department
exports.updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const department = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true },
    );
    if (!department)
      return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (err) {
    next(err);
  }
};

// Delete Department
exports.deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    if (!department)
      return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department deleted" });
  } catch (err) {
    next(err);
  }
};
