import { Link } from 'react-router-dom';

export const AppNavbar = () => {
  return (
    <nav className="w-full bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-white-900">Invoice Data Mapper</h1>
      <div className="space-x-6">
        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <Link to="/upload" className="hover:text-gray-300">File Upload</Link>
      </div>
    </nav>
  );
};
