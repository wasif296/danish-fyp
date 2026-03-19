const path = require("path");
const cloudinary = require("../config/cloudinary");

const getCloudinaryUploadData = (file) => {
  if (!file) {
    return {
      fileUrl: undefined,
      filePublicId: undefined,
      fileResourceType: undefined,
    };
  }

  return {
    fileUrl: file.path || file.secure_url,
    filePublicId: file.filename || file.public_id,
    fileResourceType: file.resource_type,
  };
};

const extractPublicIdFromUrl = (fileUrl) => {
  if (!fileUrl || !fileUrl.includes("/upload/")) {
    return null;
  }

  const uploadIndex = fileUrl.indexOf("/upload/");
  let publicIdPath = fileUrl.slice(uploadIndex + "/upload/".length);

  publicIdPath = publicIdPath.replace(/^.*?\/v\d+\//, "");
  publicIdPath = publicIdPath.replace(/^v\d+\//, "");

  const parsed = path.posix.parse(publicIdPath.split("?")[0]);
  return parsed.dir ? `${parsed.dir}/${parsed.name}` : parsed.name;
};

const tryDestroy = async (publicId, resourceType) => {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });

  return result;
};

const deleteCloudinaryFile = async ({
  filePublicId,
  fileUrl,
  fileResourceType,
}) => {
  const publicId = filePublicId || extractPublicIdFromUrl(fileUrl);

  if (!publicId) {
    return null;
  }

  const resourceTypes = fileResourceType
    ? [fileResourceType]
    : ["raw", "image", "video"];

  for (const resourceType of resourceTypes) {
    try {
      const result = await tryDestroy(publicId, resourceType);
      if (["ok", "not found"].includes(result?.result)) {
        return result;
      }
    } catch (error) {
      if (resourceType === resourceTypes[resourceTypes.length - 1]) {
        throw error;
      }
    }
  }

  return null;
};

module.exports = {
  getCloudinaryUploadData,
  deleteCloudinaryFile,
  extractPublicIdFromUrl,
};
