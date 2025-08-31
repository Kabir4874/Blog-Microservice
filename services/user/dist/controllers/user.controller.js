import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import TryCatch from "../utils/TryCatch.js";
export const loginUser = TryCatch(async (req, res) => {
    const { email, name, image } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name,
            email,
            image,
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d",
    });
    res.status(200).json({
        message: "Login success",
        token,
        user,
    });
});
export const myProfile = TryCatch(async (req, res) => { });
//# sourceMappingURL=user.controller.js.map