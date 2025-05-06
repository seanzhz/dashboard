import {useNavigate} from "react-router-dom";
import React from "react";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/seller/product/${product._id}`);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-4">
            <div
                onClick={handleClick}
                className="w-full h-48 overflow-hidden rounded-md border border-gray-100 mb-2 cursor-pointer"
            >
                <img
                    src={product.promotionalImage?.[0] || null}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <h2 className="font-semibold text-base text-gray-800">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.category?.categoryName || 'Uncategorized'}</p>
            <p className="text-theme-primary font-bold mt-1">
                {product.exchange ? `Exchange for: ${product.wantItem}` : `$${product.price}`}
            </p>
        </div>
    );
};

export default ProductCard