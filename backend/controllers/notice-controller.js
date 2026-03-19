const Notice = require("../models/noticeSchema.js");
const { pickAllowedFields } = require("../utils/pickAllowedFields.js");
const { getIO } = require("../socket.js");

const noticeCreate = async (req, res, next) => {
  try {
    const allowedFields = pickAllowedFields(req.body, [
      "title",
      "details",
      "date",
      "adminID",
    ]);
    const notice = new Notice({
      title: allowedFields.title,
      details: allowedFields.details,
      date: allowedFields.date,
      school: allowedFields.adminID,
    });
    const result = await notice.save();
    getIO().emit("new_notice", {
      _id: result._id,
      title: result.title,
      details: result.details,
      date: result.date,
      school: result.school,
    });
    res.send(result);
  } catch (err) {
    next(err);
  }
};

const noticeList = async (req, res, next) => {
  try {
    let notices = await Notice.find({ school: req.params.id });
    if (notices.length > 0) {
      res.send(notices);
    } else {
      res.send({ message: "No notices found" });
    }
  } catch (err) {
    next(err);
  }
};

const updateNotice = async (req, res, next) => {
  try {
    const updates = pickAllowedFields(req.body, ["title", "details", "date"]);
    const result = await Notice.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true },
    );
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const deleteNotice = async (req, res, next) => {
  try {
    const result = await Notice.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const deleteNotices = async (req, res, next) => {
  try {
    const result = await Notice.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No notices found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  noticeCreate,
  noticeList,
  updateNotice,
  deleteNotice,
  deleteNotices,
};
