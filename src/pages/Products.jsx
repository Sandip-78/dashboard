import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const productData = {
        name,
        price: Number(price),
        stock: Number(stock),
        image: image || ''
      };

      if (editingId) {
        // Update existing product
        await updateDoc(doc(db, 'products', editingId), productData);
      } else {
        // Create new product
        await addDoc(collection(db, 'products'), productData);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name || '');
    setPrice(product.price || '');
    setStock(product.stock || '');
    setImage(product.image || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setPrice('');
    setStock('');
    setImage('');
    setFormError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium mb-4 text-[#111827]">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="text-[#DC2626] bg-red-50 p-2 rounded text-sm">{formError}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB]"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB]"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB]"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t mt-4 border-gray-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-4 py-2 bg-[#2563EB] text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {formLoading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">No products found. Click "Add Product" to create one.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-3">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <span>{product.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-[#DC2626]'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(product)} className="text-[#2563EB] hover:text-blue-900 mr-4 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="text-[#DC2626] hover:text-red-900 transition-colors">Delete</button>
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
