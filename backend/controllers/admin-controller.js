const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Admin = require("../models/adminSchema.js");
const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const Notice = require("../models/noticeSchema.js");
const Complain = require("../models/complainSchema.js");
const { createAuthResponse } = require("../utils/auth.js");
const { pickAllowedFields } = require("../utils/pickAllowedFields.js");

const getResetTokenSecret = () => {
  if (process.env.RESET_PASSWORD_SECRET) {
    return process.env.RESET_PASSWORD_SECRET;
  }

  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  throw new Error("RESET_PASSWORD_SECRET or JWT_SECRET must be configured");
};

const createResetTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

const buildResetLink = (token) => {
  const baseUrl =
    process.env.PASSWORD_RESET_URL ||
    `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password`;

  const separator = baseUrl.includes("?") ? "&" : "?";

  return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
};

const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email?.toLowerCase()?.trim();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email });

    if (admin) {
      const token = jwt.sign(
        {
          id: admin._id.toString(),
          email: admin.email,
          purpose: "password-reset",
        },
        getResetTokenSecret(),
        {
          expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN || "15m",
        },
      );

      const resetLink = buildResetLink(token);
      const transporter = createResetTransporter();
      const mailFrom =
        process.env.MAIL_FROM ||
        process.env.SMTP_USER ||
        "no-reply@example.com";

      const info = await transporter.sendMail({
        from: mailFrom,
        to: admin.email,
        subject: "Password Reset Request",
        text: `Reset your password using this link: ${resetLink}`,
        html: `
          <p>Hello ${admin.name},</p>
          <p>We received a request to reset your password.</p>
          <p><a href="${resetLink}">Click here to reset your password</a></p>
          <p>If you did not request this, you can safely ignore this email.</p>
        `,
      });

      if (process.env.NODE_ENV !== "production" && info.message) {
        console.log("Password reset email preview:", info.message.toString());
      }
    }

    return res.json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    const decoded = jwt.verify(token, getResetTokenSecret());

    if (decoded.purpose !== "password-reset") {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const admin = await Admin.findById(decoded.id).select("+password");

    if (!admin || admin.email !== decoded.email) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);
    await admin.save();

    return res.json({ message: "Password reset successful. Please log in." });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Reset token is invalid or expired" });
    }

    next(err);
  }
};

// const adminRegister = async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(req.body.password, salt);

//         const admin = new Admin({
//             ...req.body,
//             password: hashedPass
//         });

//         const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
//         const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

//         if (existingAdminByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingSchool) {
//             res.send({ message: 'School name already exists' });
//         }
//         else {
//             let result = await admin.save();
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

// const adminLogIn = async (req, res) => {
//     if (req.body.email && req.body.password) {
//         let admin = await Admin.findOne({ email: req.body.email });
//         if (admin) {
//             const validated = await bcrypt.compare(req.body.password, admin.password);
//             if (validated) {
//                 admin.password = undefined;
//                 res.send(admin);
//             } else {
//                 res.send({ message: "Invalid password" });
//             }
//         } else {
//             res.send({ message: "User not found" });
//         }
//     } else {
//         res.send({ message: "Email and password are required" });
//     }
// };

const adminRegister = async (req, res, next) => {
  try {
    const allowedFields = pickAllowedFields(req.body, [
      "name",
      "email",
      "password",
      "schoolName",
    ]);

    if (!allowedFields.password || !allowedFields.email) {
      return res.send({ message: "Email and password are required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(allowedFields.password, salt);

    const admin = new Admin({
      ...allowedFields,
      email: allowedFields.email?.toLowerCase(),
      password: hashedPass,
    });

    const existingAdminByEmail = await Admin.findOne({
      email: allowedFields.email?.toLowerCase(),
    });
    const existingSchool = await Admin.findOne({
      schoolName: allowedFields.schoolName,
    });

    if (existingAdminByEmail) {
      res.send({ message: "Email already exists" });
    } else if (existingSchool) {
      res.send({ message: "School name already exists" });
    } else {
      let result = await admin.save();
      res.send(createAuthResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

const adminLogIn = async (req, res, next) => {
  try {
    if (req.body.email && req.body.password) {
      let admin = await Admin.findOne({
        email: req.body.email.toLowerCase(),
      }).select("+password");
      if (admin) {
        const validated = await bcrypt.compare(
          req.body.password,
          admin.password,
        );
        if (validated) {
          res.send(createAuthResponse(admin));
        } else {
          res.send({ message: "Invalid password" });
        }
      } else {
        res.send({ message: "User not found" });
      }
    } else {
      res.send({ message: "Email and password are required" });
    }
  } catch (err) {
    next(err);
  }
};

const getAdminDetail = async (req, res, next) => {
  try {
    let admin = await Admin.findById(req.params.id);
    if (admin) {
      res.send(admin);
    } else {
      res.send({ message: "No admin found" });
    }
  } catch (err) {
    next(err);
  }
};

// const deleteAdmin = async (req, res) => {
//     try {
//         const result = await Admin.findByIdAndDelete(req.params.id)

//         await Sclass.deleteMany({ school: req.params.id });
//         await Student.deleteMany({ school: req.params.id });
//         await Teacher.deleteMany({ school: req.params.id });
//         await Subject.deleteMany({ school: req.params.id });
//         await Notice.deleteMany({ school: req.params.id });
//         await Complain.deleteMany({ school: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = {
  adminRegister,
  adminLogIn,
  getAdminDetail,
  forgotPassword,
  resetPassword,
};
