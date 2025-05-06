import React, { useCallback, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Link } from "react-router-dom";
import { BiDetail } from "react-icons/bi";
import { FaEdit, FaTrash } from "react-icons/fa";

ModuleRegistry.registerModules([AllCommunityModule]);

function Orders() {
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [5, 10, 20, 50, 100];
    const gridRef = useRef(null);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setGridOption(
            "quickFilterText",
            document.getElementById("filter-text-box").value,
        );
    }, []);

    const ActionButtons = (props) => {
        const id = props.data.id;
        return (
            <div className="flex gap-4 items-center h-full">
                <Link to={`/seller/dashboard/orders/${id}`}  title="View">
                    <BiDetail className="text-theme-primary hover:text-theme-primaryHover cursor-pointer" />
                </Link>
                <Link to={`/seller/dashboard/orders/${id}`} title="Modify">
                    <FaEdit className="text-yellow-500 hover:text-yellow-600 cursor-pointer" />
                </Link>
                <Link to={`/seller/dashboard/orders/${id}`} title="Delete">
                    <FaTrash className="text-red-500 hover:text-red-600 cursor-pointer" />
                </Link>
            </div>
        );
    };


    const [rowData] = useState(() =>
        Array.from({ length: 50 }, (_, index) => ({
            id: `${1000 + index}`,
            price: `$${(Math.random() * 1000).toFixed(2)}`,
            payment: Math.random() > 0.5 ? 'Paid' : 'Pending',
            status: Math.random() > 0.5 ? 'Paid' : 'Pending'
        }))
    );

    const CustomStatus = (props) => {
        const baseClass = "px-2 py-1 text-white text-xs rounded-md";
        if (props.value === 'Paid') {
            return <span className={`${baseClass} bg-green-600`}>{props.value}</span>;
        } else if (props.value === 'Pending') {
            return <span className={`${baseClass} bg-yellow-400`}>{props.value}</span>;
        }
    };

    const [colDefs] = useState([
        { field: "id", headerName: "Order ID", flex: 1 },
        { field: "price", headerName: "Price", flex: 1 },
        { field: "payment", headerName: "Payment Status", cellRenderer: CustomStatus, flex: 1 },
        { field: "status", headerName: "Order Status", cellRenderer: CustomStatus,flex: 1 },
        { field: "actions", headerName: "Action", cellRenderer: ActionButtons, flex: 1.5 },
    ]);

    return (
        <div className="container mx-auto p-4 px-2 lg:px-7 pt-5 text-theme-text">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold">Discount Products</h1>
                <Link to='/seller/dashboard/products'
                      to="/seller/dashboard/add-product"
                      className="px-4 py-2 text-sm font-medium bg-theme-primary text-white rounded-md hover:bg-theme-hover transition"
                >
                    Add Product
                </Link>
            </div>

            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border">
                <input
                    type="text"
                    id="filter-text-box"
                    placeholder="Search products..."
                    onInput={onFilterTextBoxChanged}
                    className='px-3 py-2 mb-4 w-full rounded-md outline-none border bg-white
                        border-theme-border text-theme-text placeholder-gray-500
                        focus:border-theme-primary focus:ring-1 focus:ring-theme-primary'
                />
                <div style={{ height: 500 }}>
                    <AgGridReact
                        ref={gridRef}
                        pagination={pagination}
                        paginationPageSize={paginationPageSize}
                        paginationPageSizeSelector={paginationPageSizeSelector}
                        rowData={rowData}
                        columnDefs={colDefs}
                    />
                </div>
            </div>
        </div>
    );
}

export default Orders;