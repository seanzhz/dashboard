import React, { useEffect } from 'react';

function SellerDetails(props) {
    const [status, setStatus] = React.useState('active');
    const [selectedStatus, setSelectedStatus] = React.useState('');

    const handleUpdate = () => {
        setStatus(selectedStatus);
    };

    return (
        <div className='px-2 lg:px-7 pt-5 text-theme-text'>
            <h1 className="text-2xl font-bold mb-3">Seller Detail</h1>
            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border">
                <div className="mb-4">
                    <p className="text-sm text-theme-primary italic">
                        Tip: Use the dropdown menu below to change the seller's status.
                    </p>
                </div>

                <div className="flex items-start space-x-6 mb-4">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-theme-border overflow-hidden">
                        <img
                            src="http://localhost:3000/img/admin.png"
                            alt="Seller Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                        <h2 className="text-lg font-bold">John Doe</h2>
                        <p className="text-sm text-theme-subtle"><span className="font-bold">Email:</span> johndoe@example.com</p>
                        <p className="text-sm text-theme-subtle"><span className="font-bold">Role:</span> Seller</p>
                        <p className="text-sm text-theme-subtle">
                            <span className="font-bold">Status: </span>
                            <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        </p>
                        <p className="text-sm text-theme-subtle"><span className="font-bold">Payment Status:</span> Paid</p>
                    </div>

                    {/* Address */}
                    <div className="text-right">
                        <h3 className="font-medium">Address</h3>
                        <p className="text-sm text-theme-subtle"><span className="font-bold">Street:</span> 123 Main Street</p>
                        <p className="text-sm text-theme-subtle"><span className="font-bold">City:</span> Springfield, IL 62701</p>
                        <p className="text-sm text-theme-subtle"><span className="font-bold">Country:</span> United States</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-theme-border my-6"></div>

                {/* Dropdown for Settings */}
                <div className="mt-4">
                    <label htmlFor="statusDropdown" className="block mb-2 text-lg font-medium text-theme-text w-full">
                        Change Status
                    </label>
                    <div className="mt-4 flex justify-start items-center space-x-4 w-full">
                        <select
                            id="statusDropdown"
                            className="block w-full p-2 bg-white border border-theme-border rounded-md text-theme-text"
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            className="bg-theme-primary text-white py-2 px-4 rounded-md hover:bg-theme-primaryHover transition duration-200"
                            onClick={handleUpdate}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerDetails;