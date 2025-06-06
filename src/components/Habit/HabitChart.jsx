import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HabitChart = ({ streakData = [] }) => {
  if (!streakData.length) return <p>No streak data available 📉</p>;

  const data = {
    labels: streakData.map((d) => d.date),
    datasets: [
      {
        label: "Streak",
        data: streakData.map((d) => d.streakCount),
        fill: false,
        borderColor: "green",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Habit Streak Over Time" },
    },
  };

  return <Line data={data} options={options} />;
};

export default HabitChart;
