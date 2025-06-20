import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, redirectTo = '/login' }) {
  const { token } = useAuth();
  return token ? children : <Navigate to={redirectTo} />;
}


// export default function PrivateRoute({ children }) {
//   const token = useSelector(state => state.auth.token);
//   return token ? children : <Navigate to="/login" />;
// }
