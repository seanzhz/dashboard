import React, { useState } from 'react';

function OrderDetail() {
    const [status, setStatus] = useState('Processing');
    const [selectedStatus, setSelectedStatus] = useState('Processing');

    const handleUpdate = () => {
        if (selectedStatus && selectedStatus !== status) {
            setStatus(selectedStatus);
            alert(`Status updated to: ${selectedStatus}`);
        }
    };

    return (
        <div className='px-2 lg:px-7 pt-5 text-theme-text'>
            <h1 className="text-2xl font-bold mb-3">Order Detail</h1>
            <div className="w-full p-4 bg-theme-bgSecondary border border-theme-border rounded-md">
                {/* 提示 */}
                <p className="text-sm text-theme-primary italic mb-4">
                    Tip: Use the dropdown menu below to update order status.
                </p>

                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    {/* Orders Information */}
                    <div className="w-full p-4 bg-white border border-theme-border rounded-md">
                        <h2 className="text-lg font-bold mb-3">Order Information</h2>
                        <ul className="text-sm space-y-1">
                            <li><strong>Order ID:</strong> #123456</li>
                            <li><strong>Date:</strong> 2023-10-15</li>
                            <li><strong>Buyer Name:</strong> John Doe</li>
                            <li><strong>Address:</strong> 123 Main Street, Suite 400, New York, NY</li>
                            <li><strong>Payment Status:</strong> Paid</li>
                            <li><strong>Total Amount:</strong> $129.99</li>
                            <li>
                                <strong>Order Status:</strong>{' '}
                                <span className="text-theme-primary">{status}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Product Information */}
                    <div className="w-full p-4 bg-white border border-theme-border rounded-md">
                        <h2 className="text-lg font-bold mb-3">Product Information</h2>
                        <table className="w-full text-sm text-left border">
                            <thead className="bg-theme-bgSecondary text-theme-text font-semibold">
                            <tr>
                                <th className="p-2 border">Product Name</th>
                                <th className="p-2 border">Product ID</th>
                                <th className="p-2 border">Price</th>
                                <th className="p-2 border">Quantity</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="p-2 border">Product A</td>
                                <td className="p-2 border">#A123</td>
                                <td className="p-2 border">$49.99</td>
                                <td className="p-2 border">2</td>
                            </tr>
                            <tr>
                                <td className="p-2 border">Product B</td>
                                <td className="p-2 border">#B456</td>
                                <td className="p-2 border">$29.99</td>
                                <td className="p-2 border">1</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Seller Information */}
                    <div className="w-full p-4 bg-white border border-theme-border rounded-md">
                        <h2 className="text-lg font-bold mb-3">Seller Information</h2>
                        <ul className="text-sm space-y-1">
                            <li><strong>Seller Name:</strong> ABC Electronics</li>
                            <li><strong>Items Provided:</strong> Product A, Product B</li>
                            <li><strong>Contact:</strong> support@abcelectronics.com</li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-theme-border my-6"></div>

                {/* Status Selector */}
                <div className="mt-4">
                    <label htmlFor="statusDropdown" className="block mb-2 text-lg font-medium text-gray-700">
                        Change Status
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <select
                            id="statusDropdown"
                            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="Processing">Processing</option>
                            <option value="Dispatching">Dispatching</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <button
                            className="bg-theme-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                            onClick={handleUpdate}
                            disabled={!selectedStatus || selectedStatus === status}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;