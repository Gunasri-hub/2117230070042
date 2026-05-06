import api from "../api/axios";

import { getAuthToken } from "../api/authApi";

export const Log = async (
  stack,
  level,
  packageName,
  message
) => {
  try {
    const token = await getAuthToken();

    const response = await api.post(
      "/logs",
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("LOG CREATED:", response.data);
  } catch (error) {
    console.error("LOG FAILED:", error.response);
  }
};