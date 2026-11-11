import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isPlainObject = (val) =>
  typeof val === 'object' && val !== null && !Array.isArray(val);

const formatLabel = (path, rule) => rule?.label || path;

const validateRule = (value, rule, path, errors) => {
  const label = formatLabel(path, rule);
  const isMissing = value === undefined || value === null;
  const isBlankString = typeof value === 'string' && value.trim() === '';

  if (isMissing) {
    if (rule.required) {
      errors.push(`${label} is required`);
    }
    return;
  }

  if (rule.allowEmpty && value === '') {
    return;
  }

  if (isBlankString && rule.required) {
    errors.push(`${label} is required`);
    return;
  }

  switch (rule.type) {
    case 'string': {
      if (typeof value !== 'string') {
        errors.push(`${label} must be a string`);
        return;
      }
      const trimmed = value.trim();
      if (rule.minLength !== undefined && trimmed.length < rule.minLength) {
        errors.push(`${label} must be at least ${rule.minLength} characters`);
        return;
      }
      if (rule.maxLength !== undefined && trimmed.length > rule.maxLength) {
        errors.push(`${label} must not exceed ${rule.maxLength} characters`);
        return;
      }
      if (rule.enum && !rule.enum.includes(trimmed)) {
        errors.push(`${label} must be one of: ${rule.enum.join(', ')}`);
        return;
      }
      if (rule.pattern && !rule.pattern.test(trimmed)) {
        errors.push(rule.patternMessage || `${label} format is invalid`);
        return;
      }
      break;
    }

    case 'rawString': {
      if (typeof value !== 'string') {
        errors.push(`${label} must be a string`);
        return;
      }
      if (rule.required && value.length === 0) {
        errors.push(`${label} is required`);
        return;
      }
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push(`${label} must be at least ${rule.minLength} characters`);
        return;
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push(`${label} must not exceed ${rule.maxLength} characters`);
        return;
      }
      break;
    }

    case 'email': {
      if (typeof value !== 'string') {
        errors.push(`${label} must be a valid email address`);
        return;
      }
      const normalized = value.trim().toLowerCase();
      if (!normalized) {
        errors.push(`${label} is required`);
        return;
      }
      if (!EMAIL_REGEX.test(normalized) || normalized.length > 254) {
        errors.push(`Please enter a valid ${label.toLowerCase()}`);
        return;
      }
      break;
    }

    case 'number': {
      if (typeof value === 'boolean' || typeof value === 'object' || value === '') {
        errors.push(`${label} must be a valid number`);
        return;
      }
      const num = Number(value);
      if (!Number.isFinite(num)) {
        errors.push(`${label} must be a valid number`);
        return;
      }
      if (rule.integer && !Number.isInteger(num)) {
        errors.push(`${label} must be a whole number`);
        return;
      }
      if (rule.min !== undefined && num < rule.min) {
        errors.push(`${label} must be at least ${rule.min}`);
        return;
      }
      if (rule.max !== undefined && num > rule.max) {
        errors.push(`${label} must not exceed ${rule.max}`);
        return;
      }
      break;
    }

    case 'boolean': {
      const isBool =
        typeof value === 'boolean' ||
        (rule.coerceBoolean && (value === 'true' || value === 'false'));
      if (!isBool) {
        errors.push(`${label} must be a boolean`);
        return;
      }
      break;
    }

    case 'objectId': {
      if (typeof value !== 'string' || !mongoose.isValidObjectId(value.trim())) {
        errors.push(`Invalid ${label.toLowerCase()}`);
        return;
      }
      break;
    }

    case 'object': {
      if (!isPlainObject(value)) {
        errors.push(`${label} must be an object`);
        return;
      }
      if (rule.fields) {
        for (const [childKey, childRule] of Object.entries(rule.fields)) {
          validateRule(value[childKey], childRule, `${path}.${childKey}`, errors);
        }
      }
      break;
    }

    case 'array': {
      if (!Array.isArray(value)) {
        errors.push(`${label} must be a list`);
        return;
      }
      if (rule.minItems !== undefined && value.length < rule.minItems) {
        errors.push(`${label} must contain at least ${rule.minItems} item(s)`);
        return;
      }
      if (rule.maxItems !== undefined && value.length > rule.maxItems) {
        errors.push(`${label} must not exceed ${rule.maxItems} items`);
        return;
      }
      if (rule.of) {
        value.forEach((item, index) => {
          validateRule(item, rule.of, `${path}[${index}]`, errors);
        });
      }
      break;
    }

    default:
      break;
  }

  if (typeof rule.custom === 'function') {
    const customError = rule.custom(value, label);
    if (customError) {
      errors.push(customError);
    }
  }
};

export const validateBody = (schema) => (req, res, next) => {
  let payload = req.body;
  if (payload === undefined && schema.allowEmptyBody) {
    payload = {};
  }

  if (!isPlainObject(payload)) {
    return next(new ApiError(400, 'Request body must be a valid JSON object'));
  }

  const errors = [];
  for (const [field, rule] of Object.entries(schema.fields || {})) {
    validateRule(payload[field], rule, field, errors);
  }

  if (typeof schema.custom === 'function') {
    const schemaError = schema.custom(payload);
    if (schemaError) {
      errors.push(schemaError);
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors[0]));
  }

  return next();
};

export const validateObjectIdParam = (paramName = 'id') => (req, res, next) => {
  const value = req.params?.[paramName];
  if (!value || !mongoose.isValidObjectId(value)) {
    return next(new ApiError(400, `Invalid ${paramName} parameter`));
  }
  return next();
};

