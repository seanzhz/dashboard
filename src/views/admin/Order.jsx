import React, {useCallback, useRef, useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Link } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

function Orders(props) {
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
        return (
            <Link to={`/admin/dashboard/order/detail/${props.data.id}`} className="text-theme-primary hover:underline">
                View
            </Link>
        );
    };

    const [rowData, setRowData] = useState(() =>
        Array.from({ length: 50 }, (_, index) => ({
            id: `00${index + 1}`,
            PaymentStatus: index % 2 === 0 ? "Pending" : "Received",
            OrderStatus: index % 3 === 0 ? "Completed" : "Pending",
            Amount: '$' + Math.floor(Math.random() * 1000 + 100),
        }))
    );

    const [colDefs, setColDefs] = useState([
        { field: "id", flex: 1 },
        { field: "PaymentStatus", flex: 1 },
        { field: "OrderStatus", flex: 1 },
        { field: "Amount", flex: 1 },
        { field: "button", headerName: "Action", cellRenderer: CustomButtonComponent, flex: 1 },
    ]);

    return (
        <div className="container mx-auto p-4 px-2 lg:px-7 pt-5 text-theme-text">
            <h1 className="text-2xl font-bold mb-3">Orders</h1>
            <div className="w-full p-4 bg-white rounded-md border border-theme-border shadow-sm">
                <input
                    type="text"
                    id="filter-text-box"
                    placeholder="Search orders..."
                    onInput={onFilterTextBoxChanged}
                    className='px-3 py-2 mb-4 w-full rounded-md outline-none border bg-theme-bgSecondary
                        border-theme-border text-theme-text placeholder-gray-500
                        focus:border-theme-primary focus:bg-white'
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
