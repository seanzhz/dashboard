import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleProduct, deleteProduct } from "../../store/Reducers/productReducer";
import { PropagateLoader } from "react-spinners";

/**
 * ViewProduct component
 * Displays the details of a single product and allows editing or deleting it.
 */
function ViewProduct() {
    // Extract product ID from route params
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get product state from Redux store
    const { singleProduct, loader } = useSelector(state => state.product);

    // Fetch product details on component mount or when ID changes
    useEffect(() => {
        dispatch(getSingleProduct(id));
    }, [dispatch, id]);

    // Handle delete product action
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id)).then(() => {
                // After successful deletion, navigate back to product list
                navigate('/products');
            });
        }
    };

    // Show loader while fetching product details
    if (loader || !singleProduct) {
        return (
            <div className="flex justify-center items-center py-10">
                <PropagateLoader color="#4f93ce" />
            </div>
        );
    }

    return (
        <div className="p-6 text-theme-text">
            {/* Header with navigation buttons */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Product Detail</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/products')}
                        className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded-md"
                    >
                        Back to List
                    </button>
                    <button
                        onClick={() => navigate(`/edit-product/${id}`)}
                        className="px-4 py-2 text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Product details card */}
            <div className="w-full p-4 bg-theme-card border border-theme-border rounded-md shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product info */}
                    <div className="space-y-4 text-sm lg:text-base">
                        <p><span className="font-semibold">Product Name:</span> {singleProduct.name}</p>
                        <p><span className="font-semibold">Description:</span> {singleProduct.description}</p>
                        <p><span className="font-semibold">Brand:</span> {singleProduct.brand}</p>
                        <p><span className="font-semibold">Stock:</span> {singleProduct.stock}</p>
                        <p>
                            <span className="font-semibold">Category:</span>{" "}
                            {singleProduct.category?.categoryName || 'Unknown'}
                        </p>
                        <p>
                            <span className="font-semibold">Processing Type:</span>{" "}
                            {singleProduct.exchange ? "Exchange" : "Sell"}
                        </p>
                        {/* Conditional display for exchange/sell */}
                        {!singleProduct.exchange ? (
                            <p>
                                <span className="font-semibold">Price:</span> ${singleProduct.price}
                            </p>
                        ) : (
                            <p>
                                <span className="font-semibold">Want Item:</span> {singleProduct.wantItem}
                            </p>
                        )}
                        <p>
                            <span className="font-semibold">Private (isSecret):</span>{" "}
                            {singleProduct.isSecret ? "Yes" : "No"}
                        </p>
                    </div>

                    {/* Product images */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {singleProduct.promotionalImage?.length > 0 ? (
                            singleProduct.promotionalImage.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="relative overflow-hidden rounded-lg border border-theme-border bg-white shadow-sm hover:shadow-md transition-all duration-300 aspect-square"
                                >
                                    <img
                                        src={img}
                                        alt={`Product-${idx}`}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No promotional images available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;