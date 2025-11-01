import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./index.css";

import {
  Chart as ChartJS,
  BarController,
  DoughnutController,
  LinearScale,
  ArcElement,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Colors,
} from "chart.js";

ChartJS.register(
  Colors,
  BarController,
  DoughnutController,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  Tooltip
);

// theme
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
// core
import "primereact/resources/primereact.min.css";
// icons
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
