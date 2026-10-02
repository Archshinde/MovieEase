import axios from "axios";
import { API_URL } from "../App";
import { axiosInstance } from "./axios"


export const getAllTheatesByMovie = async (movieId, date)=>{
    try{
        const response = await axiosInstance
        .get(`${API_URL}/shows?movieId=${movieId}&date=${date}`);
        return response.data;
    }catch(err){
        return err.response;
    }
}
export const getShowViaId = async (showId)=>{
    try{
        const response = await axiosInstance
        .get(`${API_URL}/shows/${showId}`);
        return response.data;
    }catch(err){
        return err.response;
    }
}

export const getAllBookedShows = async ({ userDetails }) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/bookings`, {
      ...userDetails
    })
    return response.data;
  } catch(err) {
    return err.response;
  }
}
