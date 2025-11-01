// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/contexts/authContext";

export default function PrivateRoute({ to }: any) {
  // const { session } = useAuth();

  // let location = useLocation();
  // if (!session?.user) {
  //   return <Navigate to={"/"} state={{ from: location }} replace />;
  // }

  return to;
}
