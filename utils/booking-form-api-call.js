import axios from "axios";


const testing = true


const showUp = axios.create({
    baseURL: "https://back-end-show-up.onrender.com/api",
  });


export const getAvailability = (user_id) => {
    return showUp.get(`/availability/${user_id}`)
    .then((response) => {
        return response
    })
}

export const postBooking = (token, body) => {
    console.log(body)
    const headers = { headers: { Authorization: `${token}` } };
    return showUp.post("/bookings", body, headers).then((response) => {
        return response.data
    })
}