import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

function isValidNumber(number: string): string | Record<string, unknown> {
    if (!isValidPhoneNumber(number)) {
        throw new Error('Invalid phone number');
    } else {
        const phoneNumber = parsePhoneNumber(number);
        if (phoneNumber) {
            if (phoneNumber.country !== 'KE') {
                return 'Country is currently not supported';
            }
            return Object.keys(phoneNumber).filter(key => key !== 'metadata').reduce((acc: Record<string, unknown>, key: string) => {
                acc[key] = phoneNumber[key];
                return acc;
            }, {});
        }
    }
    throw new Error('Invalid phone number');
}

export default isValidNumber;