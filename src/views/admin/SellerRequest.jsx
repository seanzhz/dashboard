import React, {useCallback, useRef, useState} from 'react';
import {AgGridReact} from "ag-grid-react";
import {Link} from "react-router-dom";
import {BiDetail} from "react-icons/bi";

function SellerRequest(props) {
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
                <Link>
                    <div className="text-theme-primary hover:text-theme-hover flex items-center">
                        <BiDetail />
                        <span className="ml-2">Confirm</span>
                    </div>
                </Link>
            </button>
        );
    };

    const CustomStatus = (props) => {
        if (props.value === 'Paid') {
            return (
                <span className="px-2 py-1 text-white bg-theme-success rounded-md">
                    {props.value}
                </span>
            );
        } else if (props.value === 'Pending') {
            return (
                <span className="px-2 py-1 text-white bg-theme-warning rounded-md">
                    {props.value}
                </span>
            );
        }
    };

    const rowData = Array.from({length: 50}, (_, index) => ({
        id: `PAY-${index + 1}`,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        status: index % 2 === 0 ? 'Active' : 'Inactive',
        payment: index % 3 === 0 ? 'Paid' : 'Pending',
    }));

    const [colDefs, setColDefs] = useState([
        { field: "id", headerName: "Payment ID", flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
        { field: "payment", headerName: "Payment Status", cellRenderer: CustomStatus, flex: 1 },
        { field: "button", headerName: "Action", cellRenderer: CustomButtonComponent, flex: 1 },
    ]);

    return (
        <div className="container mx-auto p-4 px-2 lg:px-7 pt-5 text-theme-text">
            <h1 className="text-2xl font-bold mb-3">Payment</h1>
            <div className="w-full p-4 bg-theme-card rounded-md border border-theme-border shadow-sm">
                <input
                    type="text"
                    id="filter-text-box"
                    placeholder="Filter..."
                    onInput={onFilterTextBoxChanged}
                    className="px-3 py-2 mb-4 w-full rounded-md outline-none border bg-theme-bgSecondary
                        border-theme-border text-theme-text placeholder-theme-subtext
                        focus:border-theme-primary focus:bg-white"
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

export default SellerRequest;