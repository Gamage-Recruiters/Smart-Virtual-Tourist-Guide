const { createUser } = require("../services/touristStore");

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

module.exports = {
  register,
};
