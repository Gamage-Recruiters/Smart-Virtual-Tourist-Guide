const Joi = require('joi');
const { PROVIDER_TYPES } = require('../constants/review.constants');

/**
 * @desc    Middleware to validate incoming review data before processing
 * @param   {Object} req - Express request object containing the payload in req.body
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @returns {Object} JSON response with 400 status if validation fails, otherwise calls next()
 */
const validateReview = (req, res, next) => {
    // 1. Define the validation schema rules using Joi
    const schema = Joi.object({
        touristId: Joi.string().required().messages({
            'any.required': 'Tourist ID is required.'
        }),
        targetProviderId: Joi.string().required().messages({
            'any.required': 'Target Provider ID is required.'
        }),
        targetType: Joi.string().valid(...PROVIDER_TYPES).required().messages({
            'any.only': `Invalid provider type. Allowed types are: ${PROVIDER_TYPES.join(', ')}.`
        }),
        rating: Joi.number().min(1).max(5).required().messages({
            'number.min': 'Rating must be at least 1 star.',
            'number.max': 'Rating cannot exceed 5 stars.',
            'any.required': 'Rating is required.'
        }),
        
        // --- NEW: Validate Title ---
        title: Joi.string().min(2).max(100).optional().allow(null, '').messages({
            'string.min': 'Review title must be at least 2 characters long.',
            'string.max': 'Review title cannot exceed 100 characters.'
        }),
        
        reviewText: Joi.string().min(5).max(1000).required().messages({
            'string.min': 'Review text is too short. It must be at least 5 characters long.',
            'string.max': 'Review text is too long. It cannot exceed 1000 characters.',
            'any.required': 'Review text is required.'
        }),

        // --- NEW: Validate Images Array (Checks if they are valid URLs) ---
        images: Joi.array().items(Joi.string().uri()).optional().default([]).messages({
            'string.uri': 'Image must be a valid URL.',
            'array.base': 'Images must be an array of URLs.'
        })
    });

    // 2. Validate the request body against the defined schema
    const { error } = schema.validate(req.body);

    // 3. If validation fails, intercept the request and return a 400 Bad Request error
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation Failed',
            error: error.details[0].message
        });
    }

    // 4. If validation is successful, proceed to the next middleware or controller
    next(); 
};

module.exports = {
    validateReview
};