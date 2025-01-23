
import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from "../context/user";
import Loading from "../pages/Loading.jsx"

const ProtectedRoutes = () => {
    const { userLoading, user } = useUser();
    if(userLoading)
    {
        return <Loading />;
    }
    return user ? <Outlet /> : <Navigate to="/login"/>
}
export default ProtectedRoutes;