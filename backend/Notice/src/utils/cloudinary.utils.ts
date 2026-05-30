import cloudinary from "../config/cloudinary.js";

export const uploadNoticeImage = async (
  fileBuffer: Buffer
): Promise<{ url: string; public_id: string }> => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(

      {
        folder: "notice-images",
      },

      (error, result) => {

        if (error || !result) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });

      }
    );

    stream.end(fileBuffer);

  });
};

// Delete Notice Image

export const deleteNoticeImage = async (
  publicId: string
): Promise<void> => {

  await cloudinary.uploader.destroy(publicId);

};