const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Admin = require("../models/adminSchema");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;
const name = process.env.SUPER_ADMIN_NAME || "Super Admin";
const email = process.env.SUPER_ADMIN_EMAIL;
const password = process.env.SUPER_ADMIN_PASSWORD;
const schoolName = process.env.SUPER_ADMIN_SCHOOL_NAME || "Main Campus";

const exitWithError = (message) => {
  console.error(message);
  process.exit(1);
};

const seedSuperAdmin = async () => {
  if (!mongoUrl) {
    exitWithError("Missing MONGO_URL. Set it in backend/.env before seeding.");
  }

  if (!email || !password) {
    exitWithError(
      "Missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD. Add both to backend/.env before running the seed.",
    );
  }

  await mongoose.connect(mongoUrl);

  try {
    const normalizedEmail = email.toLowerCase();
    const existingAdmin = await Admin.findOne({
      $or: [{ email: normalizedEmail }, { schoolName }],
    });

    if (existingAdmin) {
      console.log(
        `Super Admin already exists for ${existingAdmin.email} / ${existingAdmin.schoolName}.`,
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      schoolName,
      role: "Admin",
    });

    console.log(
      `Super Admin created successfully: ${admin.email} (${admin.schoolName})`,
    );
  } finally {
    await mongoose.disconnect();
  }
};

seedSuperAdmin().catch((error) => {
  console.error("Failed to seed Super Admin:", error);
  process.exit(1);
});
