"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libphonenumber_js_1 = require("libphonenumber-js");
function isValidNumber(number) {
    if (!(0, libphonenumber_js_1.isValidPhoneNumber)(number)) {
        throw new Error('Invalid phone number');
    }
    else {
        const phoneNumber = (0, libphonenumber_js_1.parsePhoneNumber)(number);
        if (phoneNumber) {
            if (phoneNumber.country !== 'KE') {
                return 'Country is currently not supported';
            }
            return Object.keys(phoneNumber).filter(key => key !== 'metadata').reduce((acc, key) => {
                acc[key] = phoneNumber[key];
                return acc;
            }, {});
        }
    }
    throw new Error('Invalid phone number');
}
exports.default = isValidNumber;
//# sourceMappingURL=numParser.js.map