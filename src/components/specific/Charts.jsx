import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  purple,
  purpleLight,
  orange,
  orangeLight,
} from "../../constants/color";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js"; // to use charts these all elements need to be included ,and registered to avoid error
import { getLast7days } from "../../lib/features";
ChartJS.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

const labels = getLast7days();
const lineChartOptions = {
  //to remove default  title and label above line graph
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  //this property remove default line from chart
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({ value = [] }) => {
  const data = {
    labels, //it is defined above x-axis of line chart
    //to specify data and background color of line chart
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: true,
        backgroundColor: purpleLight,
        borderColor: purple,
      },
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
};
const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 120,
};

//plot the chart on basis of labels and value
const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: [purpleLight, orangeLight],
        hoverBackgroundColor: [purple, orange],
        borderColor: [purple, orange],
        offset: 40,
      },
    ],
  };

  return (
    <Doughnut
      style={{ zIndex: 10 }}
      data={data}
      options={doughnutChartOptions}
    />
  );
};

export { LineChart, DoughnutChart };
//const LineChart = () => {
//   const data = {
//     labels: ["january", "February", "March", "April", "May", "June"],
//     datasets: [1, 2, 34],
//   };
//   return <Line data={data} />;
// };
//creates a line chart ,with (labels)months on x axis,
