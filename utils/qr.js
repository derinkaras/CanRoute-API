import QRCode from "qrcode";

// ✅ For storing as value to embed in a QR (short URL)
export const generateCanQrUrl = (canId) => {
    return `https://localhost:5173/maintenance-form/${canId}`;
};

// ✅ For generating base64 for printing (if needed)
export const generateCanQrImage = async (canId) => {
    const url = generateCanQrUrl(canId);
    return await QRCode.toDataURL(url); // base64 string for image
};
