export const validateGuideProfile = (req, res, next) => {
  const errors = [];
  const { fullName, email, gender, yearsOfExperience, languagesSpoken, areasOfExpertise } = req.body;

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full Name is required' });
  } else if (fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Full Name must be at least 2 characters long' });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push({ field: 'email', message: 'Email Address is required' });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push({ field: 'email', message: 'Must be a valid email address' });
    }
  }

  if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
    errors.push({ field: 'gender', message: 'Invalid gender value' });
  }

  if (yearsOfExperience !== undefined && yearsOfExperience !== null && yearsOfExperience !== '') {
    const num = Number(yearsOfExperience);
    if (isNaN(num) || num < 0) {
      errors.push({ field: 'yearsOfExperience', message: 'Years of experience must be a non-negative number' });
    }
  }

  if (languagesSpoken !== undefined && !Array.isArray(languagesSpoken)) {
    errors.push({ field: 'languagesSpoken', message: 'Languages spoken must be an array' });
  }

  if (areasOfExpertise !== undefined && !Array.isArray(areasOfExpertise)) {
    errors.push({ field: 'areasOfExpertise', message: 'Areas of expertise must be an array' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};
