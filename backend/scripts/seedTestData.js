const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Admin = require("../models/adminSchema");
const Department = require("../models/departmentSchema");
const Semester = require("../models/semesterSchema");
const Sclass = require("../models/sclassSchema");
const Subject = require("../models/subjectSchema");
const Student = require("../models/studentSchema");
const Teacher = require("../models/teacherSchema");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "superadmin@example.com";

const exitWithError = (message) => {
  console.error(message);
  process.exit(1);
};

const seedTestStudent = async () => {
  if (!mongoUrl) {
    exitWithError("Missing MONGO_URL. Set it in backend/.env before seeding.");
  }

  await mongoose.connect(mongoUrl);

  try {
    // 1. Find the super admin
    const admin = await Admin.findOne({ email: superAdminEmail.toLowerCase() });
    if (!admin) {
      exitWithError(`Super Admin not found with email: ${superAdminEmail}. 
Please run 'npm run seed:admin' first.`);
    }

    console.log(`Found Super Admin: ${admin.email} (${admin.schoolName})`);

    // 2. Create or find test department
    let department = await Department.findOne({
      name: "Computer Science",
      school: admin._id,
    });

    if (!department) {
      department = await Department.create({
        name: "Computer Science",
        description: "Department of Computer Science and Technology",
        school: admin._id,
      });
      console.log(`Created department: ${department.name}`);
    } else {
      console.log(`Found existing department: ${department.name}`);
    }

    // 3. Create or find test semester
    let semester = await Semester.findOne({
      name: "Fall 2024",
      department: department._id,
      school: admin._id,
    });

    if (!semester) {
      semester = await Semester.create({
        name: "Fall 2024",
        department: department._id,
        school: admin._id,
      });
      console.log(`Created semester: ${semester.name}`);
    } else {
      console.log(`Found existing semester: ${semester.name}`);
    }

    // 4. Create or find test class
    let testClass = await Sclass.findOne({
      sclassName: "CS-101",
      department: department._id,
      semester: semester._id,
      school: admin._id,
    });

    if (!testClass) {
      testClass = await Sclass.create({
        sclassName: "CS-101",
        department: department._id,
        semester: semester._id,
        school: admin._id,
      });
      console.log(`Created class: ${testClass.sclassName}`);
    } else {
      console.log(`Found existing class: ${testClass.sclassName}`);
    }

    // 5. Create test subjects
    const testSubjects = [
      {
        subName: "Programming Fundamentals",
        subCode: "CS101",
        sessions: "32",
      },
      {
        subName: "Data Structures",
        subCode: "CS102",
        sessions: "28",
      },
      {
        subName: "Database Systems",
        subCode: "CS103",
        sessions: "30",
      },
    ];

    const createdSubjects = [];
    for (const subjectData of testSubjects) {
      const existingSubject = await Subject.findOne({
        subCode: subjectData.subCode,
        sclassName: testClass._id,
        department: department._id,
        semester: semester._id,
        school: admin._id,
      });

      if (!existingSubject) {
        const subject = await Subject.create({
          subName: subjectData.subName,
          subCode: subjectData.subCode,
          sessions: subjectData.sessions,
          sclassName: testClass._id,
          department: department._id,
          semester: semester._id,
          school: admin._id,
        });
        createdSubjects.push(subject);
        console.log(`Created subject: ${subject.subName} (${subject.subCode})`);
      } else {
        createdSubjects.push(existingSubject);
        console.log(
          `Found existing subject: ${existingSubject.subName} (${existingSubject.subCode})`,
        );
      }
    }

    // 6. Create test teachers
    const testTeachers = [
      {
        name: "Dr. Sarah Wilson",
        email: "sarah.wilson@school.com",
        password: "teacher123",
        subjectIndex: 0, // Programming Fundamentals
      },
      {
        name: "Prof. Michael Chen",
        email: "michael.chen@school.com",
        password: "teacher123",
        subjectIndex: 1, // Data Structures
      },
      {
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@school.com",
        password: "teacher123",
        subjectIndex: 2, // Database Systems
      },
    ];

    const createdTeachers = [];
    for (const teacherData of testTeachers) {
      const existingTeacher = await Teacher.findOne({
        email: teacherData.email,
        school: admin._id,
      });

      if (!existingTeacher) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(teacherData.password, salt);

        const teacher = await Teacher.create({
          name: teacherData.name,
          email: teacherData.email,
          password: hashedPassword,
          role: "Teacher",
          school: admin._id,
          teachSubject: createdSubjects[teacherData.subjectIndex]._id,
          teachSclass: testClass._id,
        });

        // Update the subject to reference this teacher
        await Subject.findByIdAndUpdate(
          createdSubjects[teacherData.subjectIndex]._id,
          { teacher: teacher._id },
        );

        createdTeachers.push(teacher);
        console.log(
          `Created teacher: ${teacher.name} (${teacher.email}) - Teaching: ${createdSubjects[teacherData.subjectIndex].subName}`,
        );
      } else {
        createdTeachers.push(existingTeacher);
        console.log(
          `Teacher already exists: ${existingTeacher.name} (${existingTeacher.email})`,
        );
      }
    }

    // 7. Create test students
    const testStudents = [
      {
        name: "John Doe",
        rollNum: 1001,
        password: "student123",
      },
      {
        name: "Jane Smith",
        rollNum: 1002,
        password: "student123",
      },
      {
        name: "Mike Johnson",
        rollNum: 1003,
        password: "student123",
      },
    ];

    for (const studentData of testStudents) {
      const existingStudent = await Student.findOne({
        rollNum: studentData.rollNum,
        school: admin._id,
        sclassName: testClass._id,
      });

      if (!existingStudent) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(studentData.password, salt);

        const student = await Student.create({
          name: studentData.name,
          rollNum: studentData.rollNum,
          password: hashedPassword,
          sclassName: testClass._id,
          school: admin._id,
        });

        console.log(
          `Created student: ${student.name} (Roll: ${student.rollNum})`,
        );
      } else {
        console.log(
          `Student already exists: ${existingStudent.name} (Roll: ${existingStudent.rollNum})`,
        );
      }
    }

    console.log("\n=== Test Login Credentials ===");
    console.log("\nAdmin Login:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.SUPER_ADMIN_PASSWORD || 'change-this-password'}`);
    console.log(`School: ${admin.schoolName}`);
    
    console.log("\nTeacher Logins:");
    testTeachers.forEach((teacher, index) => {
      console.log(`\nTeacher ${index + 1}:`);
      console.log(`Name: ${teacher.name}`);
      console.log(`Email: ${teacher.email}`);
      console.log(`Password: ${teacher.password}`);
      console.log(`Subject: ${createdSubjects[teacher.subjectIndex].subName}`);
      console.log(`Class: CS-101`);
    });
    
    console.log("\nStudent Logins:");
    testStudents.forEach((student, index) => {
      console.log(`\nStudent ${index + 1}:`);
      console.log(`Name: ${student.name}`);
      console.log(`Roll Number: ${student.rollNum}`);
      console.log(`Password: ${student.password}`);
      console.log(`Class: CS-101`);
    });

    console.log("\n=== School Structure Created ===");
    console.log(`Department: ${department.name}`);
    console.log(`Semester: ${semester.name}`);
    console.log(`Class: ${testClass.sclassName}`);
    console.log(`Subjects: ${createdSubjects.length} subjects created`);
    console.log(`Teachers: ${testTeachers.length} test teachers created`);
    console.log(`Students: ${testStudents.length} test students created`);

  } catch (error) {
    console.error("Error seeding test student:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedTestStudent().catch((error) => {
  console.error("Failed to seed test student:", error);
  process.exit(1);
});