function SummaryCard({
  summary,
}) {
  return (
    <div className="card">
      <h2>
        AI Summary
      </h2>
      <pre
        style={{
          whiteSpace:
            "pre-wrap",
        }}
      >
        {summary}
      </pre>
    </div>
  );
}

export default SummaryCard;
