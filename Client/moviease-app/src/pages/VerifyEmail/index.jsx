import React, { useEffect, useState, useRef } from "react";
import { emailVerification, resendOtp } from "../../calls/users"; // import resendOtp
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

function VerifyEmail() {
  const [resendTimer, setResendTimer] = useState(20);
  const navigate = useNavigate();
  const timerId = useRef(null);

  // Retrieve the email from localStorage
  const email = localStorage.getItem("emailForOtp");

  useEffect(() => {
    if (resendTimer > 0) {
      timerId.current = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timerId.current);
    };
  }, [resendTimer]);

  const onFinish = async (values) => {
    const response = await emailVerification(values); 

    if (response.success) {
      message.success("Email verification successful. Login to continue", 3);
      localStorage.removeItem("emailForOtp");
      navigate("/");
    } else {
      message.error(response.message);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await resendOtp(email);
      if (response.success) {
        message.success("OTP resent successfully");
        setResendTimer(20); // Reset the timer to 20 seconds
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Error resending OTP. Please try again.");
    }
  };

  return (
    <>
      <header className="App-header">
        <main className="main-area mw-500 text-center px-3">
          <section className="left-section text-2xl font-bold mb-6">
            <h1>Email Verification</h1>
          </section>
          <section className="right-section">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="OTP"
                htmlFor="otp"
                name="otp"
                className="d-block"
                rules={[{ required: true, message: "OTP is required" }]}
              >
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter your OTP"
                  className="m-0"
                />
              </Form.Item>
              {resendTimer === 0 ? (
                <p
                  className="text-blue-600 mb-4 cursor-pointer font-medium"
                  onClick={handleResendOTP}
                >
                  Resend OTP
                </p>
              ) : (
                <p className="mb-4 font-medium text-blue-400">
                  Resend OTP: <span>{resendTimer}s</span>
                </p>
              )}
              <Form.Item className="d-block">
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                >
                  Verify
                </Button>
              </Form.Item>
            </Form>
            <div className="mt-2">
              <p>
                Already verified?{" "}
                <Link className="text-blue-600" to="/">
                  Login Here
                </Link>
              </p>
              <p>
                New User ?{" "}
                <Link className="text-blue-600" to="/">
                  Register Here
                </Link>
              </p>
            </div>
          </section>
        </main>
      </header>
    </>
  );
}

export default VerifyEmail;
