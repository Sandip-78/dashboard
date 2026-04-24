import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getCountFromServer } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { userRole } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    admins: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsSnapshot, ordersSnapshot] = await Promise.all([
          getCountFromServer(collection(db, 'products')),
          getCountFromServer(collection(db, 'orders'))
        ]);

        let adminsCount = 0;
        if (userRole === 'super_admin') {
          const adminsSnapshot = await getCountFromServer(collection(db, 'users'));
          adminsCount = adminsSnapshot.data().count;
        }

        setStats({
          products: productsSnapshot.data().count,
          orders: ordersSnapshot.data().count,
          admins: adminsCount
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchStats();
    }
  }, [userRole]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Products Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4 transition-shadow hover:shadow-md">
          <div className="p-3 bg-blue-50 text-[#2563EB] rounded-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.products}</p>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4 transition-shadow hover:shadow-md">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.orders}</p>
          </div>
        </div>

        {/* Total Admins Card (Super Admin Only) */}
        {userRole === 'super_admin' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4 transition-shadow hover:shadow-md">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.admins}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
