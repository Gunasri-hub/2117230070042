export const getTopPriorityNotifications = (
  notifications,
  topN = 10
) => {
  if (
    !Array.isArray(
      notifications
    ) ||
    notifications.length === 0
  ) {
    return [];
  }

  const priorityWeight = {
    placement: 3,
    result: 2,
    event: 1,
  };

  return [...notifications]
    .filter((item) => {
      const type =
        (
          item.Type ||
          item.type ||
          ""
        ).toLowerCase();

      return (
        type ===
          "placement" ||
        type ===
          "result" ||
        type ===
          "event"
      );
    })
    .sort((a, b) => {
      const typeA =
        (
          a.Type ||
          a.type ||
          ""
        ).toLowerCase();

      const typeB =
        (
          b.Type ||
          b.type ||
          ""
        ).toLowerCase();

      const weightA =
        priorityWeight[
          typeA
        ] || 0;

      const weightB =
        priorityWeight[
          typeB
        ] || 0;

      // Higher type priority first
      if (
        weightB !==
        weightA
      ) {
        return (
          weightB -
          weightA
        );
      }

      // Latest timestamp first
      return (
        new Date(
          b.Timestamp ||
            b.timestamp
        ) -
        new Date(
          a.Timestamp ||
            a.timestamp
        )
      );
    })
    .slice(0, topN);
};