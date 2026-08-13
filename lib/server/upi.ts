import QRCode from "qrcode";

const UPI_VPA = "8770609976@kotak";
const PAYEE_NAME = "DigitalAIIndia";
const CERT_AMOUNT_INR = 49;

export function buildUpiLink(note: string) {
  const params = new URLSearchParams({
    pa: UPI_VPA,
    pn: PAYEE_NAME,
    am: String(CERT_AMOUNT_INR),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

export async function buildUpiQrDataUrl(note: string) {
  return QRCode.toDataURL(buildUpiLink(note), {
    margin: 1,
    width: 320,
    color: { dark: "#17140F", light: "#FFFFFF" },
  });
}

export { UPI_VPA, PAYEE_NAME, CERT_AMOUNT_INR };
