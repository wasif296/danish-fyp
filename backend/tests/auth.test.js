const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Admin = require("../models/adminSchema");

describe("Admin auth flow", () => {
  it("registers an admin and allows login with the same credentials", async () => {
    const registrationPayload = {
      name: "Test Admin",
      email: "admin@test.com",
      password: "strongpass123",
      schoolName: "Test School",
    };

    const registerResponse = await request(app)
      .post("/AdminReg")
      .send(registrationPayload)
      .expect(200);

    expect(registerResponse.body).toMatchObject({
      name: registrationPayload.name,
      email: registrationPayload.email.toLowerCase(),
      schoolName: registrationPayload.schoolName,
      role: "Admin",
    });
    expect(registerResponse.body.token).toEqual(expect.any(String));
    expect(registerResponse.body.password).toBeUndefined();

    const savedAdmin = await Admin.findOne({
      email: registrationPayload.email.toLowerCase(),
    }).select("+password");

    expect(savedAdmin).not.toBeNull();
    expect(savedAdmin.password).not.toBe(registrationPayload.password);

    const loginResponse = await request(app)
      .post("/AdminLogin")
      .send({
        email: registrationPayload.email,
        password: registrationPayload.password,
      })
      .expect(200);

    expect(loginResponse.body).toMatchObject({
      _id: savedAdmin._id.toString(),
      email: registrationPayload.email.toLowerCase(),
      schoolName: registrationPayload.schoolName,
      role: "Admin",
    });
    expect(loginResponse.body.token).toEqual(expect.any(String));
    expect(loginResponse.body.password).toBeUndefined();
  });
});
