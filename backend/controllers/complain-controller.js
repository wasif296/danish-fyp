const Complain = require("../models/complainSchema.js");
const { pickAllowedFields } = require("../utils/pickAllowedFields.js");

const complainCreate = async (req, res, next) => {
  try {
    const allowedFields = pickAllowedFields(req.body, [
      "user",
      "date",
      "complaint",
      "school",
    ]);
    const complain = new Complain(allowedFields);
    const result = await complain.save();
    res.send(result);
  } catch (err) {
    next(err);
  }
};

const complainList = async (req, res, next) => {
  try {
    let complains = await Complain.find({ school: req.params.id }).populate(
      "user",
      "name",
    );
    if (complains.length > 0) {
      res.send(complains);
    } else {
      res.send({ message: "No complains found" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { complainCreate, complainList };
