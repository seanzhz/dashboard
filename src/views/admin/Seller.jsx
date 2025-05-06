import React, { useCallback, useRef, useState } from 'react';
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import { BiDetail } from "react-icons/bi";

function Seller() {
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
            <Link to={`/admin/dashboard/seller/detail/${props.data.id}`}>
                <BiDetail className="text-theme-primary hover:text-theme-primaryHover" />
            </Link>
        );
    };

    const ImageCell = (props) => (
        <img
            src={props.value || "../img/logo.png"}
            alt="item"
            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
        />
    );

    const [rowData] = useState(() =>
        Array.from({ length: 40 }, (_, index) => ({
            id: `00${index + 1}`,
            image: `http://localhost:3000/img/category/${Math.floor(Math.random() * 5) + 1}.jpg`,
            name: `User ${index + 1}`,
            email: `user${index + 1}@example.com`,
            shop: `Shop ${Math.floor(Math.random() * 100 + 1)}`,
            button: null,
        }))
    );

    const [colDefs] = useState([
        { field: "id", headerName: "NO.", flex: 1 },
        { field: "image", headerName: "Image", cellRenderer: ImageCell, flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "shop", headerName: "Shop Name", flex: 1 },
        { field: "button", headerName: "Action", cellRenderer: CustomButtonComponent, flex: 1 },
    ]);

    return (
        <div className="container mx-auto p-4 px-2 lg:px-7 pt-5 text-theme-text">
            <h1 className="text-2xl font-bold mb-3">Sellers</h1>
            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border">
                <input
                    type="text"
                    id="filter-text-box"
                    placeholder="Search sellers..."
                    onInput={onFilterTextBoxChanged}
                    className="px-3 py-2 mb-4 w-full rounded-md outline-none border bg-white
                        border-theme-border text-theme-text placeholder-gray-500
                        focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
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

export default Seller;