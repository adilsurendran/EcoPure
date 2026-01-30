import { useState } from "react";
import {
  sendOTP,
  verifyOTP,
  resetPassword,
} from "../api/forgotPassword.api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");

  const handleSendOTP = async () => {
    await sendOTP(email);
    setStep(2);
  };

  const handleVerifyOTP = async () => {
    const res = await verifyOTP({ email, otp });
    setResetToken(res.data.resetToken);
    setStep(3);
  };

  const handleReset = async () => {
    await resetPassword({ resetToken, newPassword: password });
    alert("Password reset successful");
  };

  return (
    <div>
      {step === 1 && (
        <>
          <h2>Forgot Password</h2>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOTP}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Enter OTP</h2>
          <input
            placeholder="OTP"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <h2>Reset Password</h2>
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleReset}>
            Update Password
          </button>
        </>
      )}
    </div>
  );
}
