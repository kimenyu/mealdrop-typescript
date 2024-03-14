import Joi, { Schema, ValidationResult } from 'joi';

/**
 * Validate the provided data against the provided Joi schema.
 * @param data - Data to validate.
 * @param schema - Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns Validated data.
 * @throws Error If validation fails.
 */
export const validateJoiSchema = <T>(data: T, schema: Schema, options: Joi.ValidationOptions = {}): T => {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        ...options
    }) as ValidationResult<T>;

    if (error) {
        throw new Error(error.details.map(detail => detail.message).join(', '));
    }

    return value;
};

