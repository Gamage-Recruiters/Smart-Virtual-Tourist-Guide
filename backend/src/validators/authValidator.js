const validateEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

const validateRegistration = (req, res, next, role) => {
  const { fullName, email, password } = req.body;

  if (role !== 'government_user') {
    if (!fullName || fullName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }
  } else {
    const { firstName, lastName } = req.body;
    if (!firstName || firstName.trim() === '') {
      return res.status(400).json({ success: false, message: 'First name is required' });
    }
    if (!lastName || lastName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Last name is required' });
    }
  }

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
  }

  if (role === 'tourist_user') {
    const { country, travelType, gender } = req.body;
    if (!gender || (gender !== 'Male' && gender !== 'Female')) {
      return res.status(400).json({ success: false, message: 'Gender is required and must be Male or Female' });
    }
    if (!country || country.trim() === '') {
      return res.status(400).json({ success: false, message: 'Country is required' });
    }
    if (!travelType || travelType.trim() === '') {
      return res.status(400).json({ success: false, message: 'Travel type is required' });
    }
  }

  if (role === 'hotelowner_user') {
    const { contactNumber } = req.body;
    if (!contactNumber || contactNumber.trim() === '') {
      return res.status(400).json({ success: false, message: 'Contact number is required' });
    }
  }

  if (role === 'guide_user') {
    const { contactNumber, guideId, dob, gender } = req.body;
    if (!contactNumber || contactNumber.trim() === '') {
      return res.status(400).json({ success: false, message: 'Contact number is required' });
    }
    if (!guideId || guideId.trim() === '') {
      return res.status(400).json({ success: false, message: 'Guide ID is required' });
    }
    if (!dob || dob.trim() === '') {
      return res.status(400).json({ success: false, message: 'Date of birth is required' });
    }
    if (!gender || gender.trim() === '') {
      return res.status(400).json({ success: false, message: 'Gender is required' });
    }
  }

  if (role === 'restaurant_user') {
    const { contactNumber } = req.body;
    if (!contactNumber || contactNumber.trim() === '') {
      return res.status(400).json({ success: false, message: 'Contact number is required' });
    }
  }

  if (role === 'renter_user') {
    const { contactNumber } = req.body;
    if (!contactNumber || contactNumber.trim() === '') {
      return res.status(400).json({ success: false, message: 'Contact number is required' });
    }
  }

  if (role === 'driver_user') {
    const { vehicleType, vehicleNumber, licenseNumber, contactNumber } = req.body;
    if (!vehicleType || vehicleType.trim() === '') {
      return res.status(400).json({ success: false, message: 'Vehicle type is required' });
    }
    if (!vehicleNumber || vehicleNumber.trim() === '') {
      return res.status(400).json({ success: false, message: 'Vehicle number is required' });
    }
    if (!licenseNumber || licenseNumber.trim() === '') {
      return res.status(400).json({ success: false, message: 'License number is required' });
    }
    if (!contactNumber || contactNumber.trim() === '') {
      return res.status(400).json({ success: false, message: 'Contact number is required' });
    }
  }

  next();
};

const validateTouristRegister = (req, res, next) => {
  validateRegistration(req, res, next, 'tourist_user');
};

const validateHotelOwnerRegister = (req, res, next) => {
  validateRegistration(req, res, next, 'hotelowner_user');
};

const validateGuideRegister = (req, res, next) => {
  validateRegistration(req, res, next, 'guide_user');
};

const validateRestaurantRegister = (req, res, next) => {
  validateRegistration(req, res, next, 'restaurant_user');
};

const validateRenterRegister = (req, res, next) => {
  validateRegistration(req, res, next, 'renter_user');
};

const validateGovernmentRegister = (req, res, next) => {
  validateRegistration(req, res, next, 'government_user');
};

const validateHotelInfo = (req, res, next) => {
  const { hotelName, hotelRegistrationNo, hotelEmail, hotelRegisteredYear, hotelContactNumber } = req.body;
  if (!hotelName || hotelName.trim() === '') {
    return res.status(400).json({ success: false, message: 'Hotel name is required' });
  }
  if (!hotelRegistrationNo || hotelRegistrationNo.trim() === '') {
    return res.status(400).json({ success: false, message: 'Hotel registration number is required' });
  }
  if (!hotelEmail || hotelEmail.trim() === '') {
    return res.status(400).json({ success: false, message: 'Hotel email is required' });
  }
  if (!hotelContactNumber || hotelContactNumber.trim() === '') {
    return res.status(400).json({ success: false, message: 'Hotel contact number is required' });
  }
  next();
};

const validateDriverRegister = (req, res, next) => {
  validateRegistration(req, res, next, 'driver_user');
};

const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || identifier.trim() === '') {
    return res.status(400).json({ success: false, message: 'Please provide email or username' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ success: false, message: 'Please provide password' });
  }

  next();
};

module.exports = {
  validateTouristRegister,
  validateHotelOwnerRegister,
  validateGuideRegister,
  validateRestaurantRegister,
  validateRenterRegister,
  validateGovernmentRegister,
  validateDriverRegister,
  validateLogin,
  validateHotelInfo,
};
