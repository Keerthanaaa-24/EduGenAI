import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
function AnalyticsChart({
  analytics,
}) {
  const data = [
    {
      name:
        "Documents",
      value:
        analytics.documentsUploaded,
    },

    {
      name:
        "Quizzes",
      value:
        analytics.quizzesTaken,
    },

    {
      name:
        "Plans",
      value:
        analytics.studyPlansCreated,
    },

    {
      name:
        "Score",
      value:
        analytics.averageScore,
    },
  ];

  return (
    <div className="chart-container">
      <ResponsiveContainer
        width="100%"
        height={400}
      >
        <BarChart
          data={data}
        >
          <XAxis
            dataKey="name"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsChart;
