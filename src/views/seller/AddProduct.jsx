import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory, messageClear } from '../../store/Reducers/categoryReducer';
import { addProduct } from '../../store/Reducers/productReducer';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {PropagateLoader} from "react-spinners";

function AddProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { categories } = useSelector(state => state.category);
    const { loader, successMessage, errorMessage } = useSelector(state => state.product);
    const [submitted, setSubmitted] = useState(false);

    const [productImages, setProductImages] = useState([]);
    const [product, setProduct] = useState({
        name: "",
        description: "",
        category: "",
        brand: "",
        stock: "",
        price: "",
        exchange: false,
        wantItem: "",
        isSecret: false,
    });

    useEffect(() => {
        dispatch(getCategory());
        dispatch(messageClear());
    }, [dispatch]);

    useEffect(() => {
        if (!submitted) return;

        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
            setSubmitted(false);
        }

        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setSubmitted(false);
            //navigate("/seller/dashboard/products");
        }
    }, [successMessage, errorMessage, dispatch, navigate, submitted]);

    const priceCheck = (e) => {
        if (!/[0-9.]/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        if (e.key === '.' && e.target.value.includes('.')) e.preventDefault();
        if (e.target.value.includes('.') &&
            e.target.value.split('.')[1].length >= 2 &&
            e.key !== 'Backspace') e.preventDefault();
    };

    const inputChangeHandler = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setProductImages(prev => [...prev, ...previews]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value);
        });
        productImages.forEach(img => {
            formData.append('images', img.file);
        });
        dispatch(addProduct(formData));
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }
        setSubmitted(true);
    };

    return (
        <div className='px-2 lg:px-7 pt-2 text-theme-text'>
            <h1 className="text-2xl font-bold mb-3">Add Product</h1>
            <div className="w-full p-4 bg-theme-card border border-theme-border rounded-md shadow-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Product Name</label>
                        <input type="text" name="name" value={product.name} onChange={inputChangeHandler}
                               className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Product Description</label>
                        <textarea name="description" value={product.description} onChange={inputChangeHandler}
                                  className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border"
                                  rows="4" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Brand Name</label>
                        <input type="text" name="brand" value={product.brand || ""} onChange={inputChangeHandler}
                               className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Stock</label>
                        <input type="number" name="stock" value={product.stock || ""} onChange={inputChangeHandler}
                               onKeyDown={priceCheck}
                               className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Category</label>
                        <select name="category" value={product.category} onChange={inputChangeHandler}
                                className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border">
                            <option value="">Select category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                name="isSecret"
                                checked={product.isSecret}
                                onChange={inputChangeHandler}
                                className="form-checkbox h-5 w-5 text-theme-primary"
                            />
                            <span className="text-sm font-semibold">Private Product (isSecret)</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">The way your want to process your item</label>
                        <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setProduct(prev => ({ ...prev, exchange: false }))}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition
                                        ${!product.exchange
                                            ? 'bg-theme-primary text-white border-theme-primary'
                                            : 'bg-white text-gray-700 border-theme-border hover:bg-gray-100'}`}
                                    >
                                        Sell
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProduct(prev => ({ ...prev, exchange: true }))}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition
                                        ${product.exchange
                                            ? 'bg-theme-primary text-white border-theme-primary'
                                            : 'bg-white text-gray-700 border-theme-border hover:bg-gray-100'}`}
                                    >
                                        Exchange
                                    </button>
                                </div>
                        </div>
                    </div>

                    {!product.exchange ? (
                        <div>
                            <label className="block text-sm font-semibold mb-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={inputChangeHandler}
                                onKeyDown={priceCheck}
                                className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border"
                                placeholder="Enter price"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-semibold mb-2">What do you want in exchange?</label>
                            <input
                                type="text"
                                name="wantItem"
                                value={product.wantItem}
                                onChange={inputChangeHandler}
                                className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border"
                                placeholder="Enter desired item"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-2">Promotional Images</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange}
                               className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border" />
                        {productImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {productImages.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img src={img.preview} alt={`preview-${index}`}
                                             className="w-full h-32 object-cover rounded border" />
                                        <button type="button"
                                                onClick={() => setProductImages(prev => prev.filter((_, i) => i !== index))}
                                                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-6">
                        <button type="submit"
                                className="w-full py-3 bg-theme-primary text-white text-sm font-semibold rounded-lg hover:bg-theme-hover focus:outline-none">
                            Submit
                        </button>

                        {loader && (
                            <div className='flex justify-center items-center pt-2'>
                                <PropagateLoader color="#4f93ce" />
                            </div>
                        )}

                        <br/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;