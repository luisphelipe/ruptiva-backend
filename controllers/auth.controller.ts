import models from "../models";
import auth_validator from "./validators/auth.validator";

const User = models.User;

export const signup = async (req, res, next) => {
  const { value, error } = auth_validator.validate(req.body);
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

export const login = async (req, res, next) => {
  const { value, error } = auth_validator.validate(req.body);
  if (error)
    return res.status(406).json({ message: "Invalid credentials.", error });

  let user = await User.findOne({
    where: { email: value.email },
    attributes: { include: ["password"] },
  });
  if (!user) return res.status(400).json({ message: "Incorrect credentials." });

  let password_verification = await user.verifyPassword(value.password);
  if (!password_verification)
    return res.status(400).json({ message: "Incorrect credentials." });

  const token = await user.generateAuthToken();
  const { password, ...user_data } = user.get();

  return res.json({
    message: "Logged-in successfully",
    user: user_data,
    token,
  });
};

export default { signup, login };
