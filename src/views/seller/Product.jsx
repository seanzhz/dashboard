import React, {useCallback, useEffect, useRef, useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Link } from "react-router-dom";
import { BiDetail } from "react-icons/bi";
import {useDispatch, useSelector} from "react-redux";
import {getCorrespondingProduct, deleteProduct} from "../../store/Reducers/productReducer";
// import toast from "react-hot-toast"; // Uncomment when using toast

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Product component
 * Displays a list of products in a data grid with filtering, pagination, and actions (view/edit, delete).
 */
function Product() {
    // Grid settings
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [5, 10, 20, 50, 100];
    const gridRef = useRef(null);

    // Quick filter logic
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setGridOption(
            "quickFilterText",
            document.getElementById("filter-text-box").value,
        );
    }, []);

    const dispatch = useDispatch();
    const {products} = useSelector(state => state.product);

    // Toast control state (optional enhancement)
    // Uncomment these states if using toast to avoid showing it immediately after navigation
    // const [justNavigated, setJustNavigated] = useState(true); // Initially true when first entering the page
    // const [hasShownToast, setHasShownToast] = useState(false); // Prevent multiple toasts

    // Load corresponding products on component mount
    useEffect(() => {
        dispatch(getCorrespondingProduct());
        // Enable toast after short delay to avoid showing toast on initial navigation
        // const timer = setTimeout(() => {
        //     setJustNavigated(false);
        // }, 300); // 300ms safer than 100ms
        //
        // return () => clearTimeout(timer);
    }, [dispatch]);

    // Toast handling logic (optional enhancement)
    // useEffect(() => {
    //     if (!justNavigated && successMessage && !hasShownToast) {
    //         toast.success(successMessage);
    //         setHasShownToast(true); // Mark toast as shown
    //         dispatch(messageClear());
    //     }
    //     if (!justNavigated && errorMessage) {
    //         toast.error(errorMessage);
    //         dispatch(messageClear());
    //     }
    // }, [successMessage, errorMessage, justNavigated, hasShownToast, dispatch]);

    /**
     * Action buttons component for each row (View / Delete)
     */
    const ActionButtons = (props) => {
        const id = props.data.id;

        return (
            <div className="flex gap-4 items-center h-full">
                {/* View */}
                <Link to={`/products/${id}`} title="Update">
                    <div className="text-theme-primary hover:text-theme-primaryHover flex items-center">
                        <BiDetail />
                        <span className="ml-2">View and Update</span>
                    </div>
                </Link>

                {/* Delete button (optional — restore if needed)
                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-600"
                >
                    Delete
                </button> */}
            </div>
        );
    };

    /**
     * Image cell renderer for product image
     */
    const ImageCell = (props) => {
        const src = props.value;
        if (!src) return null;

        return (
            <img
                src={src}
                alt="product"
                className="w-10 h-10 object-cover rounded"
            />
        );
    };

    // Map product data to grid row data
    const rowData = Array.isArray(products)
        ? products.map((product, index) => ({
            id: product._id,
            displayID: index + 1,
            image: product.promotionalImage?.[0] || '',
            name: product.name,
            category: product.category?.categoryName || '',
            exchange: product.exchange ? '✅' : '❌',
        }))
        : [];

    // Grid column definitions
    const [colDefs] = useState([
        { field: "displayID", headerName: "ID", flex: 1 },
        { field: "image", headerName: "Image", cellRenderer: ImageCell, flex: 1 },
        { field: "name", headerName: "Name", flex: 2 },
        { field: "category", headerName: "Category", flex: 2 },
        { field: "exchange", headerName: "Exchangeable", flex: 1.5 },
        { field: "actions", headerName: "Action", cellRenderer: ActionButtons, flex: 1.5 }
    ]);

    return (
        <div className="container mx-auto p-4 px-2 lg:px-7 pt-5 text-theme-text">
            {/* Page header */}
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link to="/add-product"
                      className="px-4 py-2 text-sm font-medium bg-theme-primary text-white rounded-md hover:bg-theme-hover transition"
                >
                    Add Product
                </Link>
            </div>

            {/* Grid and search */}
            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border">
                {/* Quick filter */}
                <input
                    type="text"
                    id="filter-text-box"
                    placeholder="Search products..."
                    onInput={onFilterTextBoxChanged}
                    className='px-3 py-2 mb-4 w-full rounded-md outline-none border bg-white
                        border-theme-border text-theme-text placeholder-gray-500
                        focus:border-theme-primary focus:ring-1 focus:ring-theme-primary'
                />
                {/* Data grid */}
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

export default Product;