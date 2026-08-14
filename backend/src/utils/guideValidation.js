import mongoose from 'mongoose';
import AppError from './AppError.js';

const parseObjectId = (value, label = 'ID') => {
  if (!mongoose.isObjectIdOrHexString(value)) {
    throw new AppError(`Invalid ${label} format.`, 400, 'INVALID_ID');
  }
  return value;
};

const parsePagination = (query, defaultLimit = 10) => {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? defaultLimit : Number(query.limit);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new AppError('Page must be at least 1 and limit must be between 1 and 50.', 400, 'INVALID_PAGINATION');
  }
  return { page, limit, skip: (page - 1) * limit };
};

const cleanString = (value, maxLength, label, { required = false } = {}) => {
  if (value === undefined || value === null) {
    if (required) throw new AppError(`${label} is required.`, 400, 'VALIDATION_ERROR');
    return undefined;
  }
  if (typeof value !== 'string') throw new AppError(`${label} must be text.`, 400, 'VALIDATION_ERROR');
  const result = value.trim();
  if (required && !result) throw new AppError(`${label} is required.`, 400, 'VALIDATION_ERROR');
  if (result.length > maxLength) throw new AppError(`${label} must be ${maxLength} characters or fewer.`, 400, 'VALIDATION_ERROR');
  return result;
};

const cleanStringArray = (value, label, { maxItems = 20, maxLength = 100 } = {}) => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > maxItems) {
    throw new AppError(`${label} must be an array with at most ${maxItems} items.`, 400, 'VALIDATION_ERROR');
  }
  return [...new Set(value.map((item) => cleanString(item, maxLength, label, { required: true })))];
};

const parseOptionalNumber = (value, label, { min, max, integer = false } = {}) => {
  if (value === undefined || value === null || value === '') return undefined;
  const result = Number(value);
  if (!Number.isFinite(result) || (integer && !Number.isInteger(result)) || (min !== undefined && result < min) || (max !== undefined && result > max)) {
    const range = min !== undefined && max !== undefined ? ` between ${min} and ${max}` : min !== undefined ? ` at least ${min}` : '';
    throw new AppError(`${label} must be a valid number${range}.`, 400, 'VALIDATION_ERROR');
  }
  return result;
};

const parseBoolean = (value, label) => {
  if (value === undefined) return undefined;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  throw new AppError(`${label} must be true or false.`, 400, 'VALIDATION_ERROR');
};

const parseDate = (value, label, { required = false } = {}) => {
  if (!value) {
    if (required) throw new AppError(`${label} is required.`, 400, 'VALIDATION_ERROR');
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new AppError(`${label} must be a valid date.`, 400, 'VALIDATION_ERROR');
  return date;
};

const paginationMeta = ({ page, limit, totalItems }) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.ceil(totalItems / limit),
  hasNextPage: page * limit < totalItems,
  hasPreviousPage: page > 1,
});

export {
  parseObjectId,
  parsePagination,
  cleanString,
  cleanStringArray,
  parseOptionalNumber,
  parseBoolean,
  parseDate,
  paginationMeta,
};
