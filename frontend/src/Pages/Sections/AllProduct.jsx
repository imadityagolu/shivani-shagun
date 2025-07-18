import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { Link } from 'react-router-dom';

function AllProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PRODUCTS_PER_PAGE = 32;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  let filtered = products.filter(p => {
    const matchesSearch =
      search === '' ||
      (p.product && p.product.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });
  filtered = filtered.sort((a, b) => (a._id > b._id ? -1 : 1));

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePage = (n) => setPage(n);

  useEffect(() => {
    // Reset to page 1 if search changes or products change
    setPage(1);
  }, [search, products]);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold text-rose-500 mb-6 text-center">All Products</h2>
        {/* Filters */}
        <div className="flex flex-row items-center mb-6 px-2 w-full">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search product..."
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full"
          />
        </div>
        {loading ? (
          <div className="text-center py-8 text-lg">Loading...</div>
        ) : paginated.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center text-3xl font-bold text-rose-500">
            No Product to Show.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {paginated.map((p) => (
                <Link to={`/sections/product/${p._id}`} key={p._id} className="bg-white rounded-xl shadow-lg flex flex-col items-center p-4 hover:shadow-2xl transition cursor-pointer">
                  {p.image && (
                    <img src={`${import.meta.env.VITE_BACKEND_URL}${p.image}`} alt={p.product} className="w-full h-64 object-contain rounded mb-3 bg-gray-50" />
                  )}
                  <h3 className="text-lg font-bold text-rose-500 mb-1 text-center w-full truncate">{p.product || 'No Name'}</h3>
                  <div className="text-gray-500 text-sm mb-2 text-center w-full truncate">{p.category || ''}</div>
                  <div className="text-gray-700 font-semibold mb-1">MRP: ₹{p.mrp || ''}</div>
                  <div className="text-gray-600 text-xs mb-2 text-center w-full truncate">{p.description || ''}</div>
                </Link>
              ))}
            </div>
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-0.5 mt-8" style={{marginTop: '2rem'}}>
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="px-1.5 py-0.5 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePage(i + 1)}
                    className={`px-1.5 py-0.5 text-xs rounded ${page === i + 1 ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="px-1.5 py-0.5 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AllProduct; 