import { useState } from "react";

export default function QRCodePage() {
  const [qrImage, setQrImage] = useState("");
  const [code, setCode] = useState("");

  const generateQR = async () => {
    const res = await fetch("/api/transactions/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 50, value: 350 })
    });
    const data = await res.json();
    setQrImage(data.qrCodeImage);
    setCode(data.redemptionCode);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Generate QR Code</h2>
      <button onClick={generateQR}>Generate</button>
      {qrImage && (
        <>
          <p><strong>Code:</strong> {code}</p>
          <img src={qrImage} alt="QR Code" width="200" height="200" />
        </>
      )}
    </div>
  );
}