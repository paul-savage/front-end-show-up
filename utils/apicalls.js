import axios from "axios";

/////////////////////////////////////////////////////
const TESTING = false;
/////////////////////////////////////////////////////

const showUp = axios.create({
  //baseURL: "http://localhost:9090/api"
  baseURL: "https://back-end-show-up.onrender.com/api",
});

// USER AUTHENTICATION
// expects:
// username - string
// password - string
// returns:
// success: { token: "JWT token string..."}
// failure: { message: "Invalid username or password"}

export const authenticateUser = (username, password) => {
  if (TESTING) {
    return Promise.resolve({ token: "JWT token" });
  }
  const body = { username, password };
  return showUp.post("/auth", body).then((response) => {
    return response.data;
  });
};

// REGISTRATION OF CLIENT, OR ENTERTAINER
// expects (for a Client):
// {
//   username: "JohnDoe",
//   password: "password",
//   first_name: "John",
//   last_name: "Doe",
//   email: "client@example.com",
//   user_type: "Client"
// }
// expects (for an Entertainer):
// {
//   username: "JohnDoe",
//   password: "password",
//   first_name: "John",
//   last_name: "Doe",
//   email: "entertainer@example.com",
//   user_type: "Entertainer"
//   category: "Juggler",
//   location: "London",
//   entertainer_name: "Juggling Joe",
//   description: "An amazing juggler",
//   price: 50
// }
// returns:
// success: returns user object created { username: "JohnDoe",... }
// failure: returns { error: "error message"}

export const registerUser = (data) => {
  if (TESTING) {
    return Promise.resolve(data);
  }
  return showUp.post("/register", data).then((response) => {
    return response.data;
  });
};

export const me = (token) => {
  const headers = { headers: { Authorization: `${token}` } };
  return showUp.get("/me", headers).then((response) => {
    return response.data;
  });
};

export const uploadFile = (file, token) => {
  if (TESTING) {
    return Promise.resolve({ message: "File upload simulation" });
  }
  const form = new FormData();
  form.append("file", file);

  const headers = {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  return showUp.post("/upload", form, headers).then((response) => {
    return response.data;
  });
};

export const conversations = (token) => {
  const headers = { headers: { Authorization: `${token}` } };
  return showUp.get("/conversations", headers).then((response) => {
    return response.data;
  });
};

export const getConversation = (token, username) => {
  const headers = { headers: { Authorization: `${token}` } };
  return showUp.get(`/conversations/${username}`, headers).then((response) => {
    return response.data;
  });
};

export const sendMessage = (token, recipientId, message) => {
  const headers = { headers: { Authorization: `${token}` } };
  const body = { recipientId, message };
  console.log(body);
  return showUp.post("/conversations", body, headers).then((response) => {
    return response.data;
  });
};

// CHECK IF USER-NAME AVAILABLE
// expects:
// username - string to be checked for availability
// returns:
// if username has NOT been taken: { usernameTaken: false }
// if username has been taken:     { usernameTaken: true }

export const checkUsername = (username) => {
  if (TESTING) {
    return Promise.resolve({ usernameTaken: false });
  }
  return showUp.get("/check-username/${username}").then((response) => {
    return response;
  });
};

// GET LIST OF ENTERTAINERS
// expects:
// optional object holding query parameters:
// {
//   location: "London",
//   category: "Juggler",
//   date: "2024-07-01"
// }
// returns:
// an array of objects with the following structure
// {
//   username: "JohnDoe",
//   password: "password",
//   first_name: "John",
//   last_name: "Doe",
//   email: "entertainer@example.com",
//   profile_img_url: "image.jpg@example.com",
//   user_type: "Entertainer",
//   category: "Juggler",
//   location: "London",
//   entertainer_name: "Juggling Joe",
//   description: "An amazing juggler",
//   price: 50,
//   media_id: 42,
//   urls: ["image1.jpg@example.com", "image2.jpg@example.com"]
// }

// export const getEntertainers = (queries = {}) => {
//   const headers = { headers: { Authorization: `Bearer ${token}` } };
//   return showUp.get("/entertainers", headers).then((response) => {
//     return response;
//   });
// };

export const getEntertainers = (queries = {}) => {
  if (TESTING) {
    return Promise.resolve([
      {
        user_id: 1,
        username: "j_depp",
        first_name: "Johnny",
        last_name: "Depp",
        email: "j.depp@gmail.com",
        profile_img_url:
          "https://cdn.britannica.com/89/152989-050-DDF277EA/Johnny-Depp-2011.jpg",
        user_type: "Entertainer",
        category: "Juggler",
        location: "London",
        entertainer_name: "Johnny the Juggler",
        description:
          "A master of balance and coordination, this juggler dazzles audiences with a variety of props including balls, clubs, and rings. Known for their high-energy performances and humorous interactions, they bring a playful and captivating experience to any event",
        price: 20,
      },
      {
        user_id: 2,
        username: "e_watson",
        first_name: "Emma",
        last_name: "Watson",
        email: "e.watson@gmail.com",
        profile_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/7/7f/Emma_Watson_2013.jpg",
        user_type: "Entertainer",
        category: "Violinist",
        location: "Oxford",
        entertainer_name: "Emma the Violin Virtuoso",
        description:
          "A highly skilled violinist with years of experience, Emma delivers soulful and captivating performances. Perfect for weddings, events, and private concerts.",
        price: 30,
      },
      {
        user_id: 3,
        username: "d_radcliffe",
        first_name: "Daniel",
        last_name: "Radcliffe",
        email: "d.radcliffe@gmail.com",
        profile_img_url:
          "https://img.huffingtonpost.com/asset/661e23ea2200008623fc6d32.jpeg?cache=Avj37YZQ0T&ops=crop_528_121_1719_1077%2Cscalefit_500_noupscale",
        user_type: "Entertainer",
        category: "Juggler",
        location: "London",
        entertainer_name: "Dan the Dynamic Juggler",
        description:
          "Known for his exceptional juggling skills, Dan brings excitement and fun to every performance. Specializes in juggling a variety of objects with incredible precision.",
        price: 25,
      },
      {
        user_id: 6,
        username: "m_smith",
        first_name: "Maggie",
        last_name: "Smith",
        email: "m.smith@gmail.com",
        profile_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Dame_Maggie_Smith_1973_%28fro[…]-Dame_Maggie_Smith_1973_%28front_side%29_%28cropped%29.jpg",
        user_type: "Entertainer",
        category: "Violinist",
        location: "London",
        entertainer_name: "Maggie the Maestro",
        description:
          "An acclaimed violinist known for her stunning performances and mastery of classical music. Ideal for concerts, special events, and private recitals.",
        price: 35,
      },
    ]);
  }
  return showUp.get("/entertainers", { params: queries }).then((response) => {
    return response.data.entertainers;
  });
};

export const getLocations = () => {
  return showUp.get("/locations").then((response) => {
    return response.data;
  });
};

export const getCategories = () => {
  return showUp.get("/categories").then((response) => {
    return response.data;
  });
};

// export const getBookings = (token) => {
//   const headers = { headers: { Authorization: `${token}` } };
//   return showUp.get("/bookings", headers).then((response) => {
//     console.log(response);
//     return response.data;
//   });
// };

export const getBookings = () => {
  return Promise.resolve([
    {
      booking_id: 1,
      user_id: 9,
      entertainer_id: 1,
      booking_date: "2024-06-30T23:00:00.000Z",
      event_details: "Birthday",
      address: "123 Main St, London",
    },
    {
      booking_id: 2,
      user_id: 9,
      entertainer_id: 2,
      booking_date: "2024-07-04T23:00:00.000Z",
      event_details: "Anniversary",
      address: "321 Maple St, Manchester",
    },
    {
      booking_id: 3,
      user_id: 9,
      entertainer_id: 10,
      booking_date: "2024-07-04T23:00:00.000Z",
      event_details: "Boxing Match",
      address: "The Arena, Biff St, Oxford",
    },
  ]);

  return showUp.get("/bookings").then((response) => {
    console.log(response.data);
    return response.data.bookings;
  });
};

export const getCustomerBookings = (token, id) => {
  const headers = { headers: { Authorization: `${token}` } };
  return showUp.get(`/customer-bookings/${id}`, headers).then((response) => {
    return response.data.bookings;
  });
};

export const getEntertainerBookings = (token, id) => {
  const headers = { headers: { Authorization: `${token}` } };
  return showUp.get(`/entertainer-bookings/${id}`, headers).then((response) => {
    return response.data.bookings;
  });
};

export const deleteBooking = (id) => {
  return showUp.delete(`/bookings/${id}`);
};

export const confirmBooking = (id) => {
  return showUp
    .patch(`/bookings/${id}`, { status: "confirmed" })
    .then((response) => {
      console.log(response.data);
      return response.data.booking;
    });
};

export const deleteEntertainer = (id) => {
  return showUp.delete(`/entertainers/${id}`);
};
