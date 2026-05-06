const FilterBar = ({ setType }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      <button onClick={() => setType("")}>
        All
      </button>

      <button onClick={() => setType("Event")}>
        Event
      </button>

      <button onClick={() => setType("Result")}>
        Result
      </button>

      <button onClick={() => setType("Placement")}>
        Placement
      </button>
    </div>
  );
};

export default FilterBar;