import {useNavigate} from "react-router-dom";
import React from "react";

/**
 * ProductCard component
 * Displays a product summary card with image, name, category and price/exchange info.
 * Clicking the image navigates to the product detail page.
 */
const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    /**
     * Handle clicking on product image / card
     * Navigates to product detail page
     */
    const handleClick = () => {
        navigate(`/product/${product._id}`);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-4">
            {/* Product image */}
            <div
                onClick={handleClick}
                className="w-full h-48 overflow-hidden rounded-md border border-gray-100 mb-2 cursor-pointer"
            >
                <img
                    src={product.promotionalImage?.[0] || '/placeholder.png'}  // fallback image suggestion below
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product name */}
            <h2 className="font-semibold text-base text-gray-800">{product.name}</h2>

            {/* Product category */}
            <p className="text-sm text-gray-500">{product.category?.categoryName || 'Uncategorized'}</p>

            {/* Product price or exchange info */}
            <p className="text-theme-primary font-bold mt-1">
                {product.exchange ? `Exchange for: ${product.wantItem}` : `$${product.price}`}
            </p>
        </div>
    );
};

export default ProductCard;