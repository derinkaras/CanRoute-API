import QRCode from "qrcode";

export const generateCanQrCode = async (canId) => {
    const url = `https://localhost:5173/maintenance-form/${canId}`;
    return await QRCode.toDataURL(url); // returns a base64 image string
};
