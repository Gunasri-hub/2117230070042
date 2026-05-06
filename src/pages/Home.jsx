// COMPLETE WORKING Home.jsx
// REPLACE YOUR ENTIRE Home.jsx WITH THIS

import { useEffect, useState } from "react";

import { fetchNotifications } from "../api/notificationApi";

import FilterBar from "../components/FilterBar";

import { Log } from "../middleware/logger";

const Home = () => {
  const [allNotifications, setAllNotifications] =
    useState([]);

  const [priorityNotifications, setPriorityNotifications] =
    useState([]);

  const [page, setPage] = useState(1);

  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      await Log(
        "frontend",
        "debug",
        "page",
        "Loading notifications"
      );

      // ALL NOTIFICATIONS FOR CURRENT PAGE
      const pageData =
        await fetchNotifications(
          page,
          10,
          type
        );

      setAllNotifications(
        Array.isArray(pageData)
          ? pageData
          : []
      );

      // FETCH MORE DATA FOR PRIORITY
      let combinedData = [];

      for (
        let currentPage = 1;
        currentPage <= 5;
        currentPage++
      ) {
        const data =
          await fetchNotifications(
            currentPage,
            10,
            type
          );

        if (
          Array.isArray(data)
        ) {
          combinedData = [
            ...combinedData,
            ...data,
          ];
        }
      }

      const priorityWeight = {
        Placement: 3,
        Result: 2,
        Event: 1,
      };

      const sortedPriority =
        combinedData
          .filter(
            (item) =>
              item?.Type ===
                "Placement" ||
              item?.Type ===
                "Result" ||
              item?.Type ===
                "Event"
          )
          .sort((a, b) => {
            const weightA =
              priorityWeight[
                a.Type
              ] || 0;

            const weightB =
              priorityWeight[
                b.Type
              ] || 0;

            if (
              weightB !==
              weightA
            ) {
              return (
                weightB -
                weightA
              );
            }

            return (
              new Date(
                b.Timestamp
              ) -
              new Date(
                a.Timestamp
              )
            );
          })
          .slice(0, 10);

      setPriorityNotifications(
        sortedPriority
      );

      await Log(
        "frontend",
        "info",
        "page",
        "Notifications loaded successfully"
      );
    } catch (error) {
      console.error(error);

      await Log(
        "frontend",
        "error",
        "page",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ONLY CHANGE THIS useEffect IN Home.jsx
// REMOVE old useEffect([page, type])
// ADD THESE TWO useEffects EXACTLY

// 1. LOAD CONSTANT TOP 10 PRIORITY ONLY WHEN TYPE CHANGES
useEffect(() => {
  const loadPriorityNotifications = async () => {
    try {
      const combinedData = [];

      // Fetch large fixed dataset once
      for (
        let currentPage = 1;
        currentPage <= 5;
        currentPage++
      ) {
        const data =
          await fetchNotifications(
            currentPage,
            10,
            type
          );

        if (
          Array.isArray(data)
        ) {
          combinedData.push(
            ...data
          );
        }
      }

      const priorityWeight = {
        Placement: 3,
        Result: 2,
        Event: 1,
      };

      const sortedPriority =
        combinedData
          .filter(
            (item) =>
              priorityWeight[
                item.Type
              ] > 0
          )
          .sort((a, b) => {
            const weightA =
              priorityWeight[
                a.Type
              ] || 0;

            const weightB =
              priorityWeight[
                b.Type
              ] || 0;

            if (
              weightB !==
              weightA
            ) {
              return (
                weightB -
                weightA
              );
            }

            return (
              new Date(
                b.Timestamp
              ) -
              new Date(
                a.Timestamp
              )
            );
          })
          .slice(0, 10);

      setPriorityNotifications(
        sortedPriority
      );
    } catch (error) {
      console.error(
        "Priority Error:",
        error
      );
    }
  };

  loadPriorityNotifications();
}, [type]);

// 2. LOAD PAGE-WISE ALL NOTIFICATIONS
useEffect(() => {
  const loadAllNotifications = async () => {
    try {
      setLoading(true);

      const pageData =
        await fetchNotifications(
          page,
          10,
          type
        );

      setAllNotifications(
        Array.isArray(
          pageData
        )
          ? pageData
          : []
      );
    } catch (error) {
      console.error(
        "All Notifications Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadAllNotifications();
}, [page, type]);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
      }}
    >
      <h1>
        AffordMed Notifications
      </h1>

      <FilterBar
        setType={setType}
      />

      {loading ? (
        <h2>
          Loading...
        </h2>
      ) : (
        <>
          <h2>
            Priority Notifications
          </h2>

          {priorityNotifications.length ===
          0 ? (
            <p>
              No priority
              notifications
              available
            </p>
          ) : (
            priorityNotifications.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item.ID
                  }
                  style={{
                    border:
                      "2px solid green",
                    borderRadius:
                      "10px",
                    padding:
                      "20px",
                    marginBottom:
                      "15px",
                    backgroundColor:
                      "#f0fff0",
                  }}
                >
                  <h3>
                    {
                      item.Type
                    }
                  </h3>

                  <p>
                    <strong>
                      Priority
                      Rank:
                      #
                      {index +
                        1}
                    </strong>
                  </p>

                  <p>
                    {
                      item.Message
                    }
                  </p>

                  <p>
                    {
                      item.Timestamp
                    }
                  </p>
                </div>
              )
            )
          )}

          <h2
            style={{
              marginTop:
                "40px",
            }}
          >
            All Notifications
          </h2>

          {allNotifications.map(
            (item) => (
              <div
                key={
                  item.ID
                }
                style={{
                  border:
                    "1px solid #ccc",
                  borderRadius:
                    "10px",
                  padding:
                    "20px",
                  marginBottom:
                    "15px",
                }}
              >
                <h3>
                  {
                    item.Type
                  }
                </h3>

                <p>
                  {
                    item.Message
                  }
                </p>

                <p>
                  {
                    item.Timestamp
                  }
                </p>
              </div>
            )
          )}
        </>
      )}

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() =>
            setPage(
              (
                prev
              ) =>
                prev > 1
                  ? prev -
                    1
                  : 1
            )
          }
        >
          Previous
        </button>

        <span>
          Page {page}
        </span>

        <button
          onClick={() =>
            setPage(
              (
                prev
              ) =>
                prev +
                1
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;