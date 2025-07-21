import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosSecure from '../../../../hoooks/useAxiosSecure';

const ManageRoleRequests = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all role requests
  const {
    data: requests = [],
    refetch,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['charityRoleRequests'],
    queryFn: async () => {
      const res = await axiosSecure.get('allRoleRequests');
      return res.data;
    },
  });

  // Handle approve/reject actions
  const handleAction = async (id, action) => {
    try {
      const res = await axiosSecure.patch(`roleRequests/${id}`, {
        status: action,
      });

      // Use backend message if available, else fallback message
      const message =
        res.data?.message || `Request ${action} successfully`;

      toast.success(message);

      // Refresh list after update
      refetch();
    } catch (err) {
      toast.error('Something went wrong.');
      console.error(err);
    }
  };

  if (isLoading) return <p className="text-center text-3xl">Loading requests...</p>;
  if (isError)
    return (
      <p className="text-center text-red-600">
        Error loading requests: {error.message}
      </p>
    );

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Manage Charity Role Requests
      </h2>

      <table className="table w-full border rounded-lg">
        <thead className="bg-blue-100">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Mission</th>
            <th>Transaction ID</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => {
            const isPending = request.charity_role_status === 'pending';
            return (
              <tr key={request._id} className="hover:bg-blue-50">
                <td>{index + 1}</td>
                <td>{request.name}</td>
                <td>{request.email}</td>
                <td>{request.organization}</td>
                <td>{request.mission}</td>
                <td className="text-sm">{request.transactionId}</td>
                <td className="capitalize font-medium">
                  {request.charity_role_status}
                </td>
                <td className="space-x-2 text-center">
                  {isPending ? (
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleAction(request._id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleAction(request._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 italic">No Actions</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Toast container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default ManageRoleRequests;
