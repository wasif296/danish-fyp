const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Student IDOR protection", () => {
  it("prevents one student from accessing another student's record", async () => {
    const adminPayload = {
      name: "Access Admin",
      email: "access-admin@test.com",
      password: "strongpass123",
      schoolName: "Secure School",
    };

    const adminResponse = await request(app)
      .post("/AdminReg")
      .send(adminPayload)
      .expect(200);

    const adminToken = adminResponse.body.token;
    const sclassName = new mongoose.Types.ObjectId().toString();

    const firstStudentPayload = {
      name: "Student One",
      rollNum: 1,
      password: "studentpass123",
      sclassName,
    };

    const secondStudentPayload = {
      name: "Student Two",
      rollNum: 2,
      password: "studentpass123",
      sclassName,
    };

    const firstStudentResponse = await request(app)
      .post("/StudentReg")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(firstStudentPayload)
      .expect(200);

    const secondStudentResponse = await request(app)
      .post("/StudentReg")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(secondStudentPayload)
      .expect(200);

    const firstStudentLogin = await request(app)
      .post("/StudentLogin")
      .send({
        rollNum: firstStudentPayload.rollNum,
        studentName: firstStudentPayload.name,
        password: firstStudentPayload.password,
      })
      .expect(200);

    const firstStudentToken = firstStudentLogin.body.token;

    const forbiddenResponse = await request(app)
      .get(`/Student/${secondStudentResponse.body._id}`)
      .set("Authorization", `Bearer ${firstStudentToken}`)
      .expect(403);

    expect(forbiddenResponse.body.message).toBe("Access denied");

    const ownRecordResponse = await request(app)
      .get(`/Student/${firstStudentResponse.body._id}`)
      .set("Authorization", `Bearer ${firstStudentToken}`)
      .expect(200);

    expect(ownRecordResponse.body._id).toBe(firstStudentResponse.body._id);
    expect(ownRecordResponse.body.name).toBe(firstStudentPayload.name);
  });
});
