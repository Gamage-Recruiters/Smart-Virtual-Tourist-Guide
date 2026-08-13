import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <h1 className="mb-3 text-2xl font-bold text-gray-900">No admin page assigned</h1>
        <p className="mb-6 text-sm leading-6 text-gray-600">
          Your account is active, but your role does not currently have access to an Admin Control Panel page.
          Contact an Administrator if you believe your role should be changed.
        </p>
        <Link
          to="/login"
          onClick={() => localStorage.removeItem('adminToken')}
          className="inline-flex rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Sign out
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
