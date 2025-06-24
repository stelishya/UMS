import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, redirectTo = '/login' }) {
  const { accessToken } = useSelector((state) => state.auth);
  console.log("accesstoken,children : ",accessToken,children)
  return accessToken ? children : <Navigate to={redirectTo} />;  
}
// const { token } = useAuth();
// return token ? children : <Navigate to={redirectTo} />;

// export default function PrivateRoute({ children }) {
//   const token = useSelector(state => state.auth.token);
//   return token ? children : <Navigate to="/login" />;
// }
