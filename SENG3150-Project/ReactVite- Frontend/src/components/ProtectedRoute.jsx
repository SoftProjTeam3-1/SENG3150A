import { href, Navigate } from "react-router-dom";


export default function ProtectedRoute(isAuthenticated) {
    console.log("ProtectedRoute", isAuthenticated);

  return isAuthenticated ? href : <Navigate to="/" />;

}
