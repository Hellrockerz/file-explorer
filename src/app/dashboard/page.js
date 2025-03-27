'use client';

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import request from '@/app/api/axiosInstanceFIle';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    totalFolder: 0,
    totalFiles: 0,
    totalFavourite: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Unauthorized: Please login again');
          router.push('/');
          return;
        }
        const response = await request.get('/file/dashboard');
        setDashboardData(response.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex">
      <ToastContainer />
      <div className="p-4 w-full">
        <h2 className="text-2xl font-bold">Dashboard</h2><br />
        Total Files and Folders: {dashboardData.totalFiles + dashboardData.totalFolder} <br />
        Total Folders: {dashboardData.totalFolder} <br />
        Total Files: {dashboardData.totalFiles} <br />
        Total Favorite: {dashboardData.totalFavourite} <br />
      </div>
    </div>
  );
}
