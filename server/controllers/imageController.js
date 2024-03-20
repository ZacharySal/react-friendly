import { getFileStream } from "../s3.js";

export const getImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (id != "null") {
      const readStream = await getFileStream(id);
      readStream.pipe(res);
    } else {
      throw new Error("No key provided");
    }
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};
