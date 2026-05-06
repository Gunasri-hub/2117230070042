import api from "./axios";
import { getAuthToken } from "./authApi";
import { Log } from "../middleware/logger";

// PAGINATED ALL NOTIFICATIONS
export const fetchNotifications = async (
  page = 1,
  limit = 10,
  type = ""
) => {
  try {
    const token =
      await getAuthToken();

    let url =
      `/notifications?page=${page}&limit=${limit}`;

    if (type) {
      url +=
        `&notification_type=${type}`;
    }

    const response =
      await api.get(url, {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      });

    console.log(
      "ALL RESPONSE:",
      response.data
    );

    return (
      response.data
        ?.notifications ||
      response.data?.data ||
      response.data ||
      []
    );
  } catch (error) {
    console.log(
      "ALL ERROR:",
      error.response
    );

    await Log(
      "frontend",
      "error",
      "api",
      error.message
    );

    throw error;
  }
};

// PRIORITY NOTIFICATIONS
export const fetchPriorityNotifications =
  async (type = "") => {
    try {
      const token =
        await getAuthToken();

      // GET MORE DATA FOR SORTING
      let allNotifications =
        [];

      // FETCH MULTIPLE PAGES
      for (
        let page = 1;
        page <= 5;
        page++
      ) {
        let url =
          `/notifications?page=${page}&limit=20`;

        if (type) {
          url +=
            `&notification_type=${type}`;
        }

        const response =
          await api.get(url, {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          });

        console.log(
          `PRIORITY PAGE ${page}:`,
          response.data
        );

        const pageData =
          response.data
            ?.notifications ||
          response.data
            ?.data ||
          response.data ||
          [];

        if (
          Array.isArray(
            pageData
          )
        ) {
          allNotifications =
            [
              ...allNotifications,
              ...pageData,
            ];
        }
      }

      console.log(
        "FINAL PRIORITY SOURCE:",
        allNotifications
      );

      return allNotifications;
    } catch (error) {
      console.log(
        "PRIORITY ERROR:",
        error.response
      );

      throw error;
    }
  };