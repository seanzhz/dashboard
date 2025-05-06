import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {getSingleProduct, messageClear, updateProduct} from '../../store/Reducers/productReducer';
import {getCategory} from "../../store/Reducers/categoryReducer";
import toast from "react-hot-toast";
import {PropagateLoader} from "react-spinners";

function EditProduct() {
    const {productId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {singleProduct, successMessage, errorMessage, loader} = useSelector(state => state.product);
    const {categories} = useSelector(state => state.category);
    const [productImages, setProductImages] = useState([]);

    const [product, setProduct] = useState({
        id: "",
        name: "",
        description: "",
        brand: "",
        stock: "",
        category: "",
        price: "",
        exchange: false,
        wantItem: "",
        isSecret: false,
        promotionalImage: [],
    });

    useEffect(() => {
        dispatch(getSingleProduct(productId));
        dispatch(getCategory());
    }, [dispatch, productId]);

    useEffect(() => {
        if (singleProduct) {
            setProduct({
                id: singleProduct._id || '',
                name: singleProduct.name || '',
                description: singleProduct.description || '',
                brand: singleProduct.brand || '',
                stock: singleProduct.stock ?? '',
                category: singleProduct.category?._id || '',
                price: singleProduct.price ?? '',
                exchange: singleProduct.exchange ?? false,
                wantItem: singleProduct.wantItem || '',
                isSecret: singleProduct.isSecret ?? false,
                promotionalImage: singleProduct.promotionalImage || [],
            });

            setProductImages(
                Array.isArray(singleProduct.promotionalImage)
                    ? singleProduct.promotionalImage.map(url => ({preview: url}))
                    : []
            );
        }
    }, [singleProduct]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate(`/seller/dashboard/products/${productId}`);
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch, navigate]);

    const priceCheck = (e) => {
        if (!/[0-9.]/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        if (e.key === '.' && e.target.value.includes('.')) e.preventDefault();
        if (e.target.value.includes('.') && e.target.value.split('.')[1].length >= 2 && e.key !== 'Backspace') e.preventDefault();
    };

    const inputChangeHandler = (e) => {
        const {name, value, type, checked} = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            if (key !== 'promotionalImage') {
                formData.append(key, value);
            }
        });

        productImages.forEach(img => {
            if (img.file) {
                formData.append('images', img.file);
            } else {
                formData.append('existingImages', img.preview);
            }
        });

        dispatch(updateProduct({id: product.id, formData}));
    };

    return (
        <div className='px-2 lg:px-7 pt-2 text-theme-text'>
            <h1 className="text-2xl font-bold mb-3">Edit Product</h1>

            <div className="w-full p-4 bg-theme-card border border-theme-border rounded-md shadow-sm">
                <form className="space-y-6" onSubmit={handleUpload}>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Product ID</label>
                        <input
                            type="text"
                            name="id"
                            value={product.id}
                            readOnly
                            className="w-full p-3 border border-theme-border bg-gray-200 text-theme-text rounded-lg focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Product Name</label>
                        <input type="text" name="name" value={product.name} onChange={inputChangeHandler}
                               className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border"/>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Product Description</label>
                        <textarea name="description" value={product.description} onChange={inputChangeHandler}
                                  className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border"
                                  rows="4"/>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Brand</label>
                        <input type="text" name="brand" value={product.brand} onChange={inputChangeHandler}
                               className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border"/>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Stock</label>
                        <input type="number" name="stock" value={product.stock} onKeyDown={priceCheck}
                               onChange={inputChangeHandler}
                               className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border"/>
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
                            <input type="checkbox" name="isSecret" checked={product.isSecret}
                                   onChange={inputChangeHandler} className="form-checkbox h-5 w-5 text-theme-primary"/>
                            <span className="text-sm font-semibold">Private Product (isSecret)</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">The way you want to process your
                            item</label>
                        <div className="flex items-center space-x-4">
                            <button type="button" onClick={() => setProduct(prev => ({...prev, exchange: false}))}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${!product.exchange ? 'bg-theme-primary text-white border-theme-primary' : 'bg-white text-gray-700 border-theme-border hover:bg-gray-100'}`}>
                                Sell
                            </button>
                            <button type="button" onClick={() => setProduct(prev => ({...prev, exchange: true}))}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${product.exchange ? 'bg-theme-primary text-white border-theme-primary' : 'bg-white text-gray-700 border-theme-border hover:bg-gray-100'}`}>
                                Exchange
                            </button>
                        </div>
                    </div>

                    {!product.exchange ? (
                        <div>
                            <label className="block text-sm font-semibold mb-2">Price</label>
                            <input type="number" name="price" value={product.price} onChange={inputChangeHandler}
                                   onKeyDown={priceCheck}
                                   className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border"
                                   placeholder="Enter price"/>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-semibold mb-2">What do you want in exchange?</label>
                            <input type="text" name="wantItem" value={product.wantItem} onChange={inputChangeHandler}
                                   className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border"
                                   placeholder="Enter desired item"/>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-2">Promotional Images</label>
                        <input type="file" name="promotionalImages" multiple accept="image/*" onChange={(e) => {
                            const files = Array.from(e.target.files);
                            const previews = files.map(file => ({file, preview: URL.createObjectURL(file)}));
                            setProductImages(prev => [...prev, ...previews]);
                        }}
                               className="w-full p-3 border rounded-lg bg-theme-bgSecondary text-theme-text border-theme-border"/>
                        {productImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {productImages.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img src={img.preview} alt={`preview-${index}`}
                                             className="w-full h-32 object-cover rounded border"/>
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

                    <div className="pt-6 flex justify-between items-center gap-4">
                        <button type="button" onClick={() => navigate('/seller/dashboard/products')}
                                className="w-1/2 py-3 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition">
                            ← Back to Products
                        </button>

                        <button type="submit"
                                className="w-1/2 py-3 bg-theme-primary text-white text-sm font-semibold rounded-lg hover:bg-theme-hover transition">
                            Save Changes
                        </button>

                        {loader && (
                            <div className='flex justify-center items-center pt-2'>
                                <PropagateLoader color="#4f93ce"/>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProduct;
