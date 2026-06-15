function QuizCard({
  question,
  options,
  selected,
  onSelect,
}) {
  return (
    <div className="card">
      <h3>{question}</h3>

      {options.map(
        (
          option,
          index
        ) => (
          <div
            key={index}
          >
            <input
              type="radio"
              checked={
                selected ===
                option
              }
              onChange={() =>
                onSelect(
                  option
                )
              }
            />

            <label>
              {option}
            </label>
          </div>
        )
      )}
    </div>
  );
}

export default QuizCard;