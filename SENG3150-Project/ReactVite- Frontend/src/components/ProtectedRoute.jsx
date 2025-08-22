import { Navigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if(isAuthenticated ){
        console.log("User is authenticated, rendering protected route.");
        return children

    }
    else {
        console.log("User is not authenticated, redirecting to login page.");
        return<Navigate to="/" />
    }
}
