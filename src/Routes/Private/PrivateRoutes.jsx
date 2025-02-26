import { useContext } from "react";
import { AuthContext } from "../Components/AuthProvider/AuthProvider";
import { Navigate } from "react-router-dom";


const PrivateRoutes = ({ children }) => {
    const { user } = useContext(AuthContext)
    // const navigate = useNavigate()

    if (user && user?.email) {
        return children
    }

    return <Navigate to={"/signin"}></Navigate>
};

export default PrivateRoutes;