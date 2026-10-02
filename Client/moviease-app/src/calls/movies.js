import { API_URL } from "../App";
import { axiosInstance } from "./axios"

export const getAllMovies = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/movies`);
        return response.data;
    } catch(err) {
        // console.log(err);
        return err.response.message
    }
}

export const getMovie = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/movie/${id}`);
        return response.data;
    } catch(err) {
        return err.response.message
    }
}