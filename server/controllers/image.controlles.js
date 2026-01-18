const { default: axios } = require("axios");
const User = require("../models/user.models");
const FormData = require("form-data");

const generateImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prompt } = req.body;

    const user = await User.findById(userId);

    if (!user || !prompt) {
      return res
        .status(404)
        .json({ success: false, message: "Missing Details" });
    }

    if (user.creditBalance === 0 || user.creditBalance < 0) {
      return res.status(402).json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await User.findByIdAndUpdate(
      userId,
      { creditBalance: user.creditBalance - 1 },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Image Generated Successfully",
      image: resultImage,
      creditBalance: user.creditBalance - 1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = {
  generateImage,
};
