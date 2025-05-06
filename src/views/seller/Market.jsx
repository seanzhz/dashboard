import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ReactPaginate from 'react-paginate';
import {getAllProducts} from '../../store/Reducers/productReducer';
import {getCategory} from "../../store/Reducers/categoryReducer";
import ProductCard from "./ProductCard";


const Market = () => {
    const dispatch = useDispatch();
    const {products, pagination, loader} = useSelector(state => state.product);
    const {categories} = useSelector(state => state.category);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSell, setSelectedSell] = useState(true);
    const [selectedExchange, setSelectedExchange] = useState(true);
    const limit = 8;
    let content = null;

    if (loader) {
        content = <p className="text-gray-600">Loading...</p>;
    } else if (products.length === 0) {
        content = <p className="text-gray-600">No products found.</p>;
    } else {
        content = products.map(product => (
            <ProductCard key={product._id} product={product}/>
        ));
    }

    useEffect(() => {
        dispatch(getCategory())
        dispatch(getAllProducts({
            page: currentPage + 1,
            limit,
            search: searchQuery,
            category: selectedCategory === 'all' ? '' : selectedCategory,
            sell: selectedSell,
            exchange: selectedExchange
        }));
    }, [dispatch, currentPage, selectedCategory, searchQuery, selectedExchange,selectedSell]);


    return (
        <div className="p-4 max-w-6xl mx-auto">
            {/* Header + Filter */}
            <div className="mb-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold">Marketplace</h1>

                <div className="flex gap-2 w-full md:w-auto">
                  <div className="flex items-center space-x-1">
                            <span className="text-sm font-semibold">Sell</span>
                      <input
                          type="checkbox"
                          name="sell"
                          checked={selectedSell}
                          onChange={() => setSelectedSell(prev => !prev)}
                          className="form-checkbox h-5 w-5 text-theme-primary"
                      />
                  </div>

                    <div className="flex items-center space-x-1 ml-3">
                        <span className="text-sm font-semibold">Exchange</span>
                        <input
                            type="checkbox"
                            name="exchange"
                            checked={selectedExchange}
                            onChange={() => setSelectedExchange(prev => !prev)}
                            className="form-checkbox h-5 w-5 text-theme-primary"
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="border p-2 rounded text-sm"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(0);
                        }}
                        placeholder="Search products..."
                        className="border p-2 rounded text-sm"
                    />
                </div>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {content}
            </div>

            {/* Pagination */}
            {pagination.total > limit && (
                <div className="mt-6 flex justify-center">
                    <ReactPaginate
                        previousLabel={
                            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                                {"<"}
                            </button>
                        }
                        nextLabel={
                            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                                >
                            </button>
                        }
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        onPageChange={({selected}) => setCurrentPage(selected)}
                        pageCount={Math.ceil(pagination.total / pagination.limit)}
                        forcePage={currentPage}
                        containerClassName="flex items-center space-x-2"
                        activeClassName="font-bold text-theme-primary underline"
                        pageClassName="px-3 py-1 rounded hover:bg-gray-100"
                        breakLabel="..."
                    />
                </div>
            )}
        </div>
    );
};

export default Market;