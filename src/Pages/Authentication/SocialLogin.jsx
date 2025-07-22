import React from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router';
import useAuth from '../../hoooks/useAuth';
import useAxios from '../../hoooks/useAxios';

const SocialLogin = () => {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosInstance = useAxios();

  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignin = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;
      const name = user.displayName;
      const email = user.email;
      const photo = user.photoURL;
      const firebaseUid = user.uid;
      const created_at = new Date(user.metadata.creationTime).toISOString();
      const last_login_at = new Date(user.metadata.lastSignInTime).toISOString();

      const savedUser = {
        name,
        email,
        photo,
        role: 'user',
        firebaseUid,
        created_at,
        last_login_at,
      };

      let isNewUser = false;
      let userRole = 'user';

      try {
        const res = await axiosInstance.get(`users/email/?email=${email}`);
        userRole = res.data.role;

        await axiosInstance.patch(`users?email=${email}`, {
          last_login_at,
          role: userRole,
        });
      } catch (err) {
        if (err.response?.status === 404) {
          isNewUser = true;
        } else {
          throw err;
        }
      }

      if (isNewUser) {
        await axiosInstance.post('users', savedUser);
      }

      Swal.fire({
        title: 'Login Successful!',
        text: 'You have been logged in with Google.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Continue',
      });

      navigate(from, { replace: true });

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Login Failed!',
        text: 'Google login failed. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    }
  };



  return (
    <div>
      <div className="divider">or</div>
      <button
        onClick={handleGoogleSignin}
        className="btn btn-lg bg-white w-full text-black"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
