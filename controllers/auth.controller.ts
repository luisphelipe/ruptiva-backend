import models from "../models";
import signup_validator from "./validators/signup.validator";

const User = models.User;

export const signup = async (req, res, next) => {
  const { value, error } = signup_validator.validate(req.body);
  if (error)
    return res.status(406).json({ message: "Failed validation", error });

  let user = await User.findOne({ where: { email: value.email } });
  if (user)
    return res.status(400).json({ message: "E-mail already registered." });

  user = await User.create(value);

  const token = await user.generateAuthToken();
  const { password, ...user_data } = user.get();

  return res.json({
    message: "User created successfully",
    user: user_data,
    token,
  });
};

export default { signup };
