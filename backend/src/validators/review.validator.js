import Joi from 'joi';
import { PROVIDER_TYPES } from '../constants/review.constants.js';

export const validateReview = (req, res, next) => {
    const schema = Joi.object({
        // touristId IS REMOVED HERE because it comes securely from req.user, not req.body!
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
        title: Joi.string().min(2).max(100).optional().allow(null, '').messages({
            'string.min': 'Review title must be at least 2 characters long.',
            'string.max': 'Review title cannot exceed 100 characters.'
        }),
        reviewText: Joi.string().min(5).max(1000).required().messages({
            'string.min': 'Review text is too short. It must be at least 5 characters long.',
            'string.max': 'Review text is too long. It cannot exceed 1000 characters.',
            'any.required': 'Review text is required.'
        }),
        images: Joi.array().items(Joi.string().uri()).optional().default([]).messages({
            'string.uri': 'Image must be a valid URL.',
            'array.base': 'Images must be an array of URLs.'
        })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation Failed',
            error: error.details[0].message
        });
    }
    next(); 
};