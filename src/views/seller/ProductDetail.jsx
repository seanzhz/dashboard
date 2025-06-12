import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getSingleProduct} from "../../store/Reducers/productReducer";
import {PropagateLoader} from "react-spinners";

/**
 * ProductDetail component
 * Displays detailed information about a product and its seller, with option to chat with seller.
 */
function ProductDetail() {
    // Extract product ID from URL params
    const {id} = useParams();

    // Get current logged-in user info
    const {userInfo} = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get single product state from Redux store
    const {singleProduct, loader} = useSelector(state => state.product);

    // Fetch single product when component mounts or ID changes
    useEffect(() => {
        dispatch(getSingleProduct(id));
    }, [dispatch, id]);

    /**
     * Handle chat button click
     * - Prevent user from chatting with themselves
     * - Navigate to chat page if valid
     */
    const handleChat = () => {
        if (singleProduct.userId && userInfo._id) {
            if (singleProduct.userId._id === userInfo._id) {
                alert('You cannot chat with yourself.');
            } else {
                navigate(`/contact-customer/${singleProduct.userId._id}`);
            }
        }
    };

    // Show loader if loading or no product yet
    if (loader || !singleProduct) {
        return (
            <div className="flex justify-center items-center py-10">
                <PropagateLoader color="#4f93ce"/>
            </div>
        );
    }

    return (
        <div className="p-6 text-theme-text">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Product Detail</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/market')}
                        className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded-md"
                    >
                        Back to Market
                    </button>
                </div>
            </div>

            {/* Product details card */}
            <div className="w-full p-4 bg-theme-card border border-theme-border rounded-md shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Info */}
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

            {/* Seller info */}
            {singleProduct.userId && (
                <div className="mt-4">
                    <h2 className="text-2xl font-bold mb-3">Related Seller</h2>
                    <div className="w-full p-4 bg-theme-card border border-theme-border rounded-md shadow-sm">
                        <div className="flex justify-between items-start">
                            {/* Seller Info */}
                            <div>
                                <p><span className="font-semibold">Name:</span> {singleProduct.userId.username}</p>
                                <p><span className="font-semibold">Email:</span> {singleProduct.userId.email}</p>
                                <p>
                                    <span className="font-semibold">Contact:</span>{" "}
                                    {singleProduct.userId.contact ? singleProduct.userId.contact : 'N/A'}
                                </p>
                            </div>

                            {/* Chat Button */}
                            <div>
                                <button
                                    className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-theme-hover transition"
                                    onClick={handleChat}
                                >
                                    Start to Chat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetail;