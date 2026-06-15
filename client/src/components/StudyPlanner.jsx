function StudyPlanner({
  plan,
}) {
  return (
    <div className="card">
      <h2>
        AI Study Plan
      </h2>

      <pre
        style={{
          whiteSpace:
            "pre-wrap",
        }}
      >
        {plan}
      </pre>
    </div>
  );
}

export default StudyPlanner;