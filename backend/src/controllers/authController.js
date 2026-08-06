import { createUser, loginUser } from "../services/touristStore.js";

async function register(req, res) {
  try {
    const { fullName, email, password } = req.body;
    const result = await createUser({ fullName, email, password });

    return res.status(201).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Failed to register user.",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Login failed.",
    });
  }
}

export {
  register,
  login,
};
