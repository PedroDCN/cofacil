import { Outlet } from "react-router-dom";
import NavMenu from "./NavMenu";
import TopBar from "./TopBar/TopBar";
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

export default function AppLayout() {
  return (
    <>
      <div className='h-screen flex relative lg:static surface-ground'>
        <NavMenu />
        <div className='min-h-screen flex flex-column relative flex-auto'>
          <TopBar />
          <Outlet />
        </div>
      </div>
    </>
  );
}
