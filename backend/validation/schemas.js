const Joi = require("joi");

const objectId = Joi.string().trim().length(24).hex();

const adminLoginSchema = Joi.object({
  email: Joi.string().trim().required(),
  password: Joi.string().min(6).required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().required(),
  password: Joi.string().min(6).required(),
});

const studentRegisterSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  rollNum: Joi.number().integer().positive().required(),
  password: Joi.string().min(6).required(),
  sclassName: objectId.required(),
  adminID: objectId.optional(),
});

const createSubjectSchema = Joi.object({
  subjects: Joi.array()
    .items(
      Joi.object({
        subName: Joi.string().trim().required(),
        subCode: Joi.string().trim().required(),
        sessions: Joi.alternatives()
          .try(
            Joi.string().trim().required(),
            Joi.number().integer().positive(),
          )
          .required(),
      }),
    )
    .min(1)
    .required(),
  sclassName: objectId.required(),
  department: objectId.required(),
  semester: objectId.required(),
  adminID: objectId.optional(),
});

const submitAssignmentSchema = Joi.object({
  assignmentId: objectId,
  assignment: objectId,
  student: objectId.optional(),
  comment: Joi.string().allow("").max(1000).optional(),
  fileUrl: Joi.string().uri().optional(),
}).or("assignmentId", "assignment");

module.exports = {
  adminLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  studentRegisterSchema,
  createSubjectSchema,
  submitAssignmentSchema,
};
