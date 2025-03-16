
import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from "../context/user";
import Loading from "../pages/Loading.jsx"

const UnprotectedRoutes = () => {
    const { userLoading, user } = useUser();
    if(userLoading)
    {
        return <Loading />;
    }
    return !user ? <Outlet /> : <Navigate to="/"/>
}
export default UnprotectedRoutes;