const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
];

const csrfProtect = (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer;
  if (!origin || !ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
    return res.status(403).json({ success: false, message: 'Forbidden: invalid origin' });
  }
  next();
};

export default csrfProtect;
