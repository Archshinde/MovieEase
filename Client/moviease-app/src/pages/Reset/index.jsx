import React from 'react'
import { Button, Form, Input, message } from 'antd'
import { resetPassword } from '../../calls/users'
import { useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
  const navigate = useNavigate();

    const onFinish = async (values) => {
        const response = await resetPassword(values);
        if(response.status == 200) {
            message.success("Password Reset Successfully. Please login!")
            navigate("/");
        } else {
            message.error(response.data.message)
        }
    }

  return (
    <>
            <header className="App-header">
                <main className="main-area mw-500 text-center px-3">
                    <section className="left-section text-2xl font-bold mb-6">
                        <h1>Reset Password</h1>
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
                                    type="number"
                                    placeholder="Enter your OTP"
                                ></Input>
                            </Form.Item>

                            <Form.Item
                                label="New Password"
                                htmlFor="password"
                                name="password"
                                className="d-block"
                                rules={[{ required: true, message: "Password is required" }]}
                            >
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter new password"

                                ></Input>
                            </Form.Item>

                            <Form.Item className="d-block">
                                <Button
                                    type="primary"
                                    block
                                    htmlType="submit"
                                    style={{ fontSize: "1rem", fontWeight: "600" }}
                                >
                                    RESET PASSWORD
                                </Button>
                            </Form.Item>
                        </Form>

                    </section>
                </main>
            </header>
        </>
  )
}

export default ResetPasswordPage