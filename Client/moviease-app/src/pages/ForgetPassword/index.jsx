import React from 'react'
import { Button, Form, Input, message } from 'antd'
import {Link, useNavigate} from 'react-router-dom'
import { sendOTP } from '../../calls/users';

function ForgetPassword() {
  const navigate = useNavigate();
  
    async function onFinish(value) {
        console.log(value);

        const response = await sendOTP(value.email);

        console.log(response);
        if(response.status == 200) {
            message.success("OTP sent successfully to your email")
            navigate("/reset");
        } else {
            message.error(response.data.message)
        }
        
    }

  return (
    <>
            <header className="App-header">
                <main className="main-area mw-500 text-center px-3">
                    <section className="left-section text-2xl font-bold mb-6">
                        <h1>Forget Password</h1>
                    </section>
                    <section className="right-section">
                        <Form layout="vertical" onFinish={onFinish}>

                            <Form.Item
                                label="Email"
                                htmlFor="email"
                                name="email"
                                className="d-block"
                                rules={[{ required: true, message: "Email is required" }]}
                            >
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="Enter your Email"
                                ></Input>
                            </Form.Item>


                            <Form.Item className="d-block">
                                <Button
                                    type="primary"
                                    block
                                    htmlType="submit"
                                    style={{ fontSize: "1rem", fontWeight: "600" }}
                                >
                                    SEND OTP
                                </Button>
                            </Form.Item>
                        </Form>
                        <div>
                            <p>
                                Existing User? <Link className='text-blue-600' to="/">Login Here</Link>
                            </p>
                        </div>
                    </section>
                </main>
            </header>
        </>
  )
}

export default ForgetPassword