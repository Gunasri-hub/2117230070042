import axios from "axios";

export const getAuthToken = async () => {
  try {
    const response = await axios.post(
      "http://20.207.122.201/evaluation-service/auth",
      {
            "email": "gunasri.m.2023.aids@ritchennai.edu.in",
    "name": "gunasri m",
    "rollNo": "2117230070042",
    "accessCode": "BTCDqT",
    "clientID": "2da3c95f-3ffe-4fef-8b8f-e450f3513d45",
    "clientSecret": "zpgrAdZWPGyRHtKR"
      }
    );

    console.log("TOKEN RESPONSE:", response.data);

    return response.data.access_token;
  } catch (error) {
    console.log(error.response);

    throw error;
  }
};