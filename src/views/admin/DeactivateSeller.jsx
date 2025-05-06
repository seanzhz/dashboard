import React, {useCallback, useRef, useState} from 'react';
import {AgGridReact} from "ag-grid-react";
import {Link} from "react-router-dom";
import {FaEdit} from "react-icons/fa";
import {BiDetail} from "react-icons/bi";
import {ImCancelCircle} from "react-icons/im";

function DeactivateSeller(props) {

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
        return <button onClick={handleClick} >
            <Link>
                <div className="text-red-500 hover:text-red-700 flex items-center">
                    <ImCancelCircle />
                    <span className="ml-2">Deactivate</span>
                </div>
            </Link></button>;
    };

    const ImageCell = (props) => {
        return (
            <img
                src={props.value || "../img/logo.png"}
                alt="item"
                style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
            />
        );
    };

    const [rowData, setRowData] = useState(() =>
        Array.from({length: 40}, (_, index) => ({
            id: `#00${index + 1}`,
            image: `http://localhost:3000/img/category/${Math.floor(Math.random() * 5) + 1}.jpg`,
            name: `User ${index + 1}`,
            email: `user${index + 1}@example.com`,
            shop: `Shop ${Math.floor(Math.random() * 100 + 1)}`,
            button: null,
        }))
    );

    const [colDefs, setColDefs] = useState([
        { field: "id", headerName: "NO.", flex: 1 },
        { field: "image", headerName: "Image", cellRenderer: ImageCell, flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "shop", headerName: "Shop Name", flex: 1 },
        { field: "button", headerName: "Action", cellRenderer: CustomButtonComponent, flex: 1 },
    ]);

    return (
        <div className="px-2 lg:px-7 pt-5">
            <h1 className="text-2xl font-bold mb-3">Sellers</h1>
            <div className="w-full p-4 bg-white border border-theme-border rounded-md">
                <input
                    type="text"
                    id="filter-text-box"
                    placeholder="Filter..."
                    onInput={onFilterTextBoxChanged}
                    className='px-3 py-2 rounded-md outline-none border bg-theme-bgSecondary
                        border-theme-border text-black placeholder-gray-500
                        focus:border-blue-500 focus:bg-white mb-2'
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

export default DeactivateSeller;