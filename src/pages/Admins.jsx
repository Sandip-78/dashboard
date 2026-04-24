import { useState, useEffect } from 'react';
import { db, secondaryAuth } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const adminData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdmins(adminData);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (editingId) {
        // Update existing admin
        await updateDoc(doc(db, 'users', editingId), {
          name,
          role
        });
      } else {
        // Create new admin
        if (!password) {
          setFormError('Password is required for new users');
          setFormLoading(false);
          return;
        }
        
        // Use secondary auth to create user without logging out the current admin
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const newUser = userCredential.user;
        
        // Add to Firestore
        await setDoc(doc(db, 'users', newUser.uid), {
          name,
          email,
          role,
          created_at: serverTimestamp()
        });
        
        // Sign out from secondary auth
        await signOut(secondaryAuth);
      }

      // Reset form and refresh list
      resetForm();
      fetchAdmins();
    } catch (error) {
      console.error("Error saving admin:", error);
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingId(admin.id);
    setName(admin.name || '');
    setEmail(admin.email);
    setRole(admin.role);
    setPassword(''); // Password cannot be edited here for security
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to disable this admin? Their access will be revoked.")) {
      try {
        await deleteDoc(doc(db, 'users', id));
        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert("Failed to delete admin.");
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('admin');
    setFormError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Add New Admin
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium mb-4">{editingId ? 'Edit Admin' : 'Add New Admin'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  disabled={!!editingId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400"
              >
                {formLoading ? 'Saving...' : 'Save Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No admins found</td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(admin)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:text-red-900">Disable</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
