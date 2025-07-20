import { useState, useEffect } from 'react';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useGetUserRole = () => {
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  const {user} = useAuth();
  const email=user?.email;

  useEffect(() => {
    if (!email) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);
    setError(null);

    axiosSecure.get(`users?email=${encodeURIComponent(email)}`)
      .then(res => {
        if (res.data && res.data.role) {
          setRole(res.data.role);
        } else {
          setRole(null);
        }
      })
      .catch(err => {
        setError(err);
        setRole(null);
      })
      .finally(() => setRoleLoading(false));
  }, [email, axiosSecure]);

  return { role, roleLoading, error };
};

export default useGetUserRole;
