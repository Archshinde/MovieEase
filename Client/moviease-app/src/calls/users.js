import axios from "axios";
import Login from "../pages/Login";
import { axiosInstance } from "./axios";
import { API_URL } from "../App";

export const RegisterUser = async (userObj) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/register`, {
      name: userObj.name,
      email: userObj.email,
      password: userObj.password,
      userId: userObj.userName,
      userType: "CUSTOMER"
    })
      return response;
  } catch (err) {
      console.log(err);
        return err.response;
  }
}


export const LoginUser = async (userObj) => {

  try {    
    const response = await axiosInstance.post(`${API_URL}/login`, {
      email: userObj.email,
      password: userObj.password
    })
    return response.data;
  } catch (err) {
      console.log(err);
      return err.response
  }
}

export const sendOTP = async (email) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/forgetPassword`, {email: email})

    return response;
  } catch(err) {
      return err.response
  }
}

export const resetPassword = async (userObj) => {
  try {
      const response = await axiosInstance.patch(`${API_URL}/resetPassword`, {
        otp: userObj.otp,
        password: userObj.password
      })

      return response;
  } catch(err) {
      return err.response
  }
}

export const getUserDetails = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/user`);
      return response.data;
    } catch(err) {
      return err.response;
    }
}

export const emailVerification = async (userObj) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/verifyEmail`, {
            otp: Number(userObj.otp),
        })
        return response.data;
    } catch(err) {
        return err.response
    }
}

export const resendOtp = async (email) => {
  try {
    console.log(email);
    
    const response = await axios.post(`${API_URL}/resendOtp`, {
        email: email
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error" };
  }
};
