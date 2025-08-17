import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Fetch all users
    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('users');
            return res.data.users;
        },
    });

    // Mutation for updating user role
    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, newRole }) => {
            const res = await axiosSecure.patch(`users/${userId}/role`, { role: newRole });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            Swal.fire({
                icon: 'success',
                title: 'Role Updated',
                text: 'User role has been updated successfully!',
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.message,
            });
        },
    });

    // Mutation for deleting user
    const deleteUserMutation = useMutation({
        mutationFn: async (userId) => {
            const res = await axiosSecure.delete(`users/${userId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            Swal.fire({
                icon: 'success',
                title: 'User Deleted',
                text: 'User has been deleted successfully!',
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: error.message,
            });
        },
    });

    // Handlers for button actions

    const confirmRoleChange = (userId, newRole) => {
        Swal.fire({
            title: `Are you sure you want to make this user a ${newRole}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, make ${newRole}`,
        }).then((result) => {
            if (result.isConfirmed) {
                updateRoleMutation.mutate({ userId, newRole });
            }
        });
    };

    const handleMakeAdmin = (userId) => {
        confirmRoleChange(userId, 'admin');
    };

    const handleMakeRestaurant = (userId) => {
        confirmRoleChange(userId, 'restaurant');
    };

    const handleMakeCharity = (userId) => {
        confirmRoleChange(userId, 'charity');
    };




    const handleDeleteUser = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUserMutation.mutate(userId);
            }
        });
    };

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    if (error) {
        return <div className="text-center text-red-500 text-xl">Error: {error.message}</div>;
    }

    return (
        <div className="p-6 md:p-12 min-w-sm mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-6 text-center">Manage Users</h1>
            {users.length === 0 ? (
                <p className="text-gray-600 text-center">No users found.</p>
            ) : (
                <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md">
  <table className="table table-zebra table-compact min-w-sm w-full border-collapse border border-gray-300">
    {/* Table Head */}
    <thead className="bg-primary text-white">
      <tr>
        <th className="border border-gray-300">#</th>
        <th className="border border-gray-300">User Name</th>
        <th className="border border-gray-300">User Email</th>
        <th className="border border-gray-300">Role</th>
        <th className="border border-gray-300">Actions</th>
      </tr>
    </thead>
    {/* Table Body */}
    <tbody>
      {users.map((user, index) => (
        <tr
          key={user._id}
          className="hover:bg-base-200 border border-gray-300"
        >
          <th className="border border-gray-300">{index + 1}</th>
          <td className="border border-gray-300">{user.name}</td>
          <td className="border border-gray-300">{user.email}</td>
          <td className="border border-gray-300 font-semibold text-center capitalize"><span className='rounded p-1 text-sky-600'>{user.role}</span></td>
          <td className="border border-gray-300">
            <div className="flex flex-wrap gap-2">
              <button
                className="btn btn-sm btn-primary btn-outline"
                onClick={() => handleMakeAdmin(user._id)}
                disabled={user.role === 'admin'}
              >
                Make Admin
              </button>
              <button
                className="btn btn-sm btn-secondary bg-primary/70 hover:bg-primary/50 text-black btn-outline"
                onClick={() => handleMakeRestaurant(user._id)}
                disabled={user.role === 'restaurant'}
              >
                Make Restaurant
              </button>
              <button
                className="btn btn-sm  btn-outline"
                onClick={() => handleMakeCharity(user._id)}
                disabled={user.role === 'charity'}
              >
                Make Charity
              </button>
              <button
                className="btn btn-sm btn-error btn-outline"
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


            )}
        </div>
    );
};

export default ManageUsers;