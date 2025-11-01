import { Outlet } from "react-router-dom";

export default function Lancamentos() {
  return (
    <>
      <div className="flex-auto flex flex-col overflow-y-auto overflow-x-hidden px-4 py-3">
        <Outlet />
      </div>
    </>
  );
}
