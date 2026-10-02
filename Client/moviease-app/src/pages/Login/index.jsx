import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../calls/users";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    const response = await LoginUser(values);
    try {
      if (response.success) {
        if (response.verificationRequired) {
          message.warning("Please verify your email to continue")
          localStorage.setItem("emailForOtp", values.email);
          navigate("/verifyEmail");
        } else {
          // Save token and redirect to home
          localStorage.setItem("token", response.token);
          navigate("/home");
        }
      } else {
        console.log(response);
        message.error(response.data.message);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("Login error:", error);
      message.error("An unexpected error occurred");
    }
  };

  return (
    <div>
      <header className="App-header">
        <main className="main-area max-w-md mx-auto text-center p-4">
          <section>
            <h3 className="text-2xl font-bold mb-6">Login to MoviEase</h3>
          </section>

          <section className="right-section w-[400px]">
            <Form layout="vertical" onFinish={onFinish} className="space-y-6">
              <Form.Item
                label="Email"
                name="email"
                className="text-left"
                rules={[{ required: true, message: "Email Id is required" }]}
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your Email Id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                className="text-left"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </Form.Item>

              <Form.Item className="text-left">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </Button>
              </Form.Item>
            </Form>

            <div className="mt-4">
              <p className="text-sm">
                New User?{" "}
                <Link to="/register" className="text-blue-600">
                  Register Here
                </Link>
              </p>
              <p className="text-sm mt-1">
                {" "}
                Forget Password?{" "}
                <Link to="/forget" className="text-blue-600">
                  Click here
                </Link>
              </p>
            </div>
          </section>
        </main>
      </header>
    </div>
  );
}

export default Login;
