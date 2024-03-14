"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJoiSchema = void 0;
/**
 * Validate the provided data against the provided Joi schema.
 * @param data - Data to validate.
 * @param schema - Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns Validated data.
 * @throws Error If validation fails.
 */
const validateJoiSchema = (data, schema, options = {}) => {
    const { error, value } = schema.validate(data, Object.assign({ abortEarly: false }, options));
    if (error) {
        throw new Error(error.details.map(detail => detail.message).join(', '));
    }
    return value;
};
exports.validateJoiSchema = validateJoiSchema;
//# sourceMappingURL=validateJoiSche.js.map