export default function generateVerificationCode(): number {
    return Math.floor(10000 + Math.random() * 90000);
}