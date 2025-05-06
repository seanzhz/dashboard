import React, { useCallback, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Link } from "react-router-dom";
import { BiDetail } from "react-icons/bi";
import {IoIosSend} from "react-icons/io";
import {IoEyeSharp} from "react-icons/io5";

ModuleRegistry.registerModules([AllCommunityModule]);

function Payments() {
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

    const CustomButtonComponent = (props) => {
        const handleClick = () => {
            const id = props.data.id;
            window.alert(`当前行的 ID 是：${id}`);
        };
        return (
            <button onClick={handleClick}>
                <Link to={`/seller/dashboard/payments/${props.data.id}`}>
                    <div className="text-theme-primary hover:text-theme-primaryHover flex items-center">
                        <IoIosSend />
                        <span className="ml-2">Send</span>
                    </div>
                </Link>
            </button>
        );
    };

    const CustomButtonComponent1 = (props) => {
        const handleClick = () => {
            const id = props.data.id;
            window.alert(`当前行的 ID 是：${id}`);
        };
        return (
            <button onClick={handleClick}>
                <Link to={`/seller/dashboard/payments/${props.data.id}/view`}>
                    <div className="text-theme-primary hover:text-theme-primaryHover flex items-center">
                        <IoEyeSharp />
                        <span className="ml-2">View</span>
                    </div>
                </Link>
            </button>
        );
    };

    const CustomStatus = (props) => {
        const baseClass = "px-2 py-1 text-white text-xs rounded-md";
        if (props.value === 'Paid') {
            return <span className={`${baseClass} bg-green-600`}>{props.value}</span>;
        } else if (props.value === 'Pending') {
            return <span className={`${baseClass} bg-yellow-400`}>{props.value}</span>;
        }
    };

    const [rowData] = useState(() =>
        Array.from({ length: 120 }, (_, index) => ({
            id: `#00${index + 1}`,
            amount: '$' + (Math.random() * 1000).toFixed(2),
            date: new Date(Date.now() - Math.random() * 1e10).toISOString().replace('T', ' ').split('.')[0],
            status: 'Pending',
            button: null,
        }))
    );

    const [colDefs] = useState([
        { field: "id", headerName: "Payment ID", flex: 1 },
        { field: "amount", headerName: "Amount", flex: 1 },
        { field: "date", headerName: "Date and Time", flex: 1 },
        { field: "status", headerName: "Status", cellRenderer: CustomStatus, flex: 1 },
        { field: "button", headerName: "Action", cellRenderer: CustomButtonComponent, flex: 1 },
    ]);

    const [rowData1] = useState(() =>
        Array.from({ length: 120 }, (_, index) => ({
            id: `#00${index + 1}`,
            amount: '$' + (Math.random() * 1000).toFixed(2),
            date: new Date(Date.now() - Math.random() * 1e10).toISOString().replace('T', ' ').split('.')[0],
            status: 'Paid',
            button: null,
        }))
    );

    const [colDefs1] = useState([
        { field: "id", headerName: "Payment ID", flex: 1 },
        { field: "amount", headerName: "Amount", flex: 1 },
        { field: "date", headerName: "Date and Time", flex: 1 },
        { field: "status", headerName: "Status", cellRenderer: CustomStatus, flex: 1 },
        { field: "button", headerName: "Action", cellRenderer: CustomButtonComponent1, flex: 1 },
    ]);

    return (
        <div className="container mx-auto p-4 px-2 lg:px-7 pt-5 text-theme-text">
            <h1 className="text-2xl font-bold mb-3">Pending Payment</h1>
            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border">
                <input
                    type="text"
                    id="filter-text-box"
                    placeholder="Search payments..."
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

            <h1 className="mt-5 text-2xl font-bold mb-3">Completed Payment</h1>
            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border">
                <input
                    type="text"
                    id="filter-text-box"
                    placeholder="Search payments..."
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
                        rowData={rowData1}
                        columnDefs={colDefs1}
                    />
                </div>
            </div>
        </div>
    );
}

export default Payments;