import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AgGridReact} from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import {FaEdit} from "react-icons/fa";
import {FaTrashCan} from "react-icons/fa6";
import {useDispatch, useSelector} from "react-redux";
import {addCategory, deleteCategory, getCategory, messageClear} from "../../store/Reducers/categoryReducer";
import {PropagateLoader} from "react-spinners";
import toast from "react-hot-toast";

ModuleRegistry.registerModules([AllCommunityModule]);

function Category(props) {

    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [5, 10, 20, 50, 100];
    const gridRef = useRef(null);

    const dispatch = useDispatch();
    const {loader,successMessage, errorMessage, categories} = useSelector(state => state.category);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setGridOption(
            "quickFilterText",
            document.getElementById("filter-text-box").value,
        );
    }, []);

    const[state, setState] = useState({
        categoryName: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        const category = state
        dispatch(addCategory(category))
    }

    useEffect(() => {
        dispatch(getCategory());

    }, [dispatch]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setTimeout(() => {
                dispatch(getCategory());
            }, 0);
            setState({ categoryName: '' });
        }
    },[successMessage,errorMessage, dispatch])

    const CustomButtonComponent = (props) => {
        const handleView = () => {
            const id = props.data.id;
            window.alert(`View：${id}`);
        };

        const handleDelete = () => {
            const id = props.data.id;
            if (window.confirm(`Are you sure you want to delete category ${props.data.categoryName}?`)) {
                if (gridRef.current?.api) {
                    gridRef.current.api.deselectAll();      // ✨ 取消选中
                    gridRef.current.api.clearFocusedCell(); // ✨ 清除焦点
                }
                dispatch(deleteCategory(id));
            }

        };

        return (
            <div className="flex justify-start items-center gap-5 h-full">
                <button onClick={handleView}>
                    <FaEdit className="text-theme-primary hover:text-theme-hover" />
                </button>
                <button onClick={handleDelete}>
                    <FaTrashCan className="text-red-500 hover:text-red-700" />
                </button>
            </div>
        );
    };


    // 假设 categories 来自 Redux store
    const rowData = Array.isArray(categories)
        ? categories
            .filter(cat => cat && cat.categoryName) // 过滤掉未定义项
            .map((cat, index) => ({
                displayID: 'Cate' + String(index + 1).padStart(2, '0'),
                id: cat._id,
                categoryName: cat.categoryName,
            }))
        : [];

    const colDefs =[
        { field: "displayID", headerName: "Category ID", flex: 1 },
        { field: "categoryName", headerName: "Category Name", flex: 1 },
        { field: "action", cellRenderer: CustomButtonComponent, flex: 1 },
    ]

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className="flex flex-col lg:flex-row gap-5 w-full">
                <div className='w-full lg:w-7/12'>
                    <div className='w-full p-4 bg-white rounded-md border border-theme-border'>
                        <input
                            type="text"
                            id="filter-text-box"
                            placeholder="Search..."
                            onInput={onFilterTextBoxChanged}
                            className='px-3 py-2 rounded-md outline-none border bg-theme-bgSecondary
                            border-theme-border text-theme-text placeholder-gray-500
                            focus:border-theme-primary focus:bg-white mb-2 w-full'
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

                <div
                    className={`w-full lg:w-5/12 transition-all duration-500`}
                    style={{ height: 585, overflow: "hidden" }}
                >
                    <div className='w-full p-4 bg-white rounded-md border border-theme-border pl-5 h-full overflow-auto flex flex-col min-h-[400px]'>
                        <div className="flex-grow">
                            <h1 className="text-2xl font-bold mb-3 text-center text-theme-text">Add Category</h1>
                            <label className="block text-sm font-bold mb-2 text-theme-text" htmlFor="categoryName">
                                Category Name
                            </label>
                            <input
                                id="categoryName"
                                type="text"
                                value={state.categoryName}
                                onChange={
                                    (e)=>setState({ ...state, categoryName: e.target.value })
                                }
                                placeholder="Enter Category Name"
                                className="px-3 py-2 rounded-md outline-none border bg-theme-bgSecondary
                                border-theme-border text-theme-text placeholder-gray-500 focus:border-theme-primary
                                focus:bg-white mb-4 w-full"
                            />
                        </div>
                        <button
                            className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-theme-hover w-full"
                            onClick={handleCreate}
                        >
                            Confirm
                        </button>

                        {!loader && (
                            <div className='flex justify-center items-center pt-2'>
                                <PropagateLoader color="#4f93ce" />
                            </div>
                        )}

                        <br/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Category;