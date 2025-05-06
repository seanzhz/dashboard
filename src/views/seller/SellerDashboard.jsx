import React, { useEffect } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers, FaCartShopping } from "react-icons/fa6";
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import moment from 'moment';

const SellerDashboard = () => {
    const totalSale = 1225;
    const totalOrder = 27;
    const totalProduct = 19;
    const totalSeller = 13;

    const recentOrder = [
        { _id: "001", price: 250, payment_status: "Paid", delivery_status: "Delivered" },
        { _id: "002", price: 300, payment_status: "Pending", delivery_status: "Processing" },
        { _id: "003", price: 150, payment_status: "Paid", delivery_status: "Shipped" },
    ];

    const recentMessage = [
        { senderId: "1", senderName: "Alice", message: "Please update order status.", createdAt: new Date().toISOString() },
        { senderId: "2", senderName: "Bob", message: "Need more details.", createdAt: new Date().toISOString() },
    ];

    const userInfo = {
        _id: "1",
        image: "http://localhost:3000/img/user.png",
    };

    const chartData = {
        series: [
            { name: "Orders", data: [23, 34, 45, 56, 76, 34, 23, 76, 87, 78, 34, 45] },
            { name: "Revenue", data: [67, 39, 45, 56, 90, 56, 23, 56, 87, 78, 67, 78] },
            { name: "Sellers", data: [34, 39, 56, 56, 80, 67, 23, 56, 98, 78, 45, 56] },
        ],
        options: {
            chart: { background: 'transparent', foreColor: '#1e2a36' },
            dataLabels: { enabled: false },
            stroke: {
                show: true,
                curve: 'smooth',
                lineCap: 'butt',
                colors: ['#c3d4e3'],
                width: 0.5,
                dashArray: 0
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apl', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            legend: { position: 'top' },
            responsive: [{
                breakpoint: 565,
                options: {
                    plotOptions: { bar: { horizontal: true } },
                    chart: { height: "550px" }
                }
            }]
        }
    };


    return (
        <div className='px-2 md:px-7 py-5 text-theme-text'>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
                <div className='flex justify-between items-center p-5 bg-theme-bgSecondary rounded-md gap-3'>
                    <div className='flex flex-col text-theme-subtext'>
                        <h2 className='text-3xl font-bold'>${totalSale}</h2>
                        <span className='text-md font-medium'>Total Sales</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-theme-error flex justify-center items-center text-xl'>
                        <MdCurrencyExchange className='text-theme-bgSecondary shadow-lg' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-theme-bgSecondary rounded-md gap-3'>
                    <div className='flex flex-col text-theme-subtext'>
                        <h2 className='text-3xl font-bold'>{totalProduct}</h2>
                        <span className='text-md font-medium'>Products</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-theme-primary flex justify-center items-center text-xl'>
                        <MdProductionQuantityLimits className='text-theme-bgSecondary shadow-lg' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-theme-bgSecondary rounded-md gap-3'>
                    <div className='flex flex-col text-theme-subtext'>
                        <h2 className='text-3xl font-bold'>{totalSeller}</h2>
                        <span className='text-md font-medium'>Sellers</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-theme-success flex justify-center items-center text-xl'>
                        <FaUsers className='text-theme-bgSecondary shadow-lg' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-theme-bgSecondary rounded-md gap-3'>
                    <div className='flex flex-col text-theme-subtext'>
                        <h2 className='text-3xl font-bold'>{totalOrder}</h2>
                        <span className='text-md font-medium'>Orders</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-theme-hover flex justify-center items-center text-xl'>
                        <FaCartShopping className='text-theme-bgSecondary shadow-lg' />
                    </div>
                </div>
            </div>

            <div className='w-full flex flex-wrap mt-7'>
                <div className='w-full lg:w-7/12 lg:pr-3'>
                    <div className='w-full bg-theme-card p-4 border border-theme-border rounded-md'>
                        <Chart options={chartData.options} series={chartData.series} type='bar' height={350} />
                    </div>
                </div>

                <div className='w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0'>
                    <div className='w-full bg-theme-card p-4 border border-theme-border rounded-md'>
                        <div className='flex justify-between items-center'>
                            <h2 className='font-semibold text-lg pb-3'>Recent Seller Message</h2>
                            <Link className='font-semibold text-sm'>View All</Link>
                        </div>
                        <div className='flex flex-col gap-2 pt-6'>
                            <ol className='relative border-l border-theme-border ml-4'>
                                {recentMessage.map((m, i) => (
                                    <li key={i} className='mb-3 ml-6'>
                                        <div className='flex absolute -left-5 justify-center items-center w-10 h-10 p-1 bg-theme-border rounded-full shadow-md'>
                                            <img className='w-full rounded-full h-full' src={userInfo.image} alt="User" />
                                        </div>
                                        <div className='p-3 bg-theme-bgSecondary rounded-lg border border-theme-border'>
                                            <div className='flex justify-between items-center mb-2'>
                                                <Link className='text-md font-normal'>{m.senderName}</Link>
                                                <time className='text-sm font-normal'>{moment(m.createdAt).startOf('hour').fromNow()}</time>
                                            </div>
                                            <div className='p-2 text-xs font-normal bg-theme-card border border-theme-border rounded-lg'>
                                                {m.message}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full p-4 bg-theme-card rounded-md border border-theme-border mt-6'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-semibold text-lg pb-3'>Recent Orders</h2>
                    <Link className='font-semibold text-sm'>View All</Link>
                </div>
                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left'>
                        <thead className='text-sm uppercase border-b border-theme-border'>
                        <tr>
                            <th className='py-3 px-4'>Order Id</th>
                            <th className='py-3 px-4'>Price</th>
                            <th className='py-3 px-4'>Payment Status</th>
                            <th className='py-3 px-4'>Order Status</th>
                            <th className='py-3 px-4'>Active</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentOrder.map((d, i) => (
                            <tr key={i} className='border-b border-theme-border'>
                                <td className='py-3 px-4 font-medium whitespace-nowrap'>#{d._id}</td>
                                <td className='py-3 px-4 font-medium whitespace-nowrap'>${d.price}</td>
                                <td className='py-3 px-4 font-medium whitespace-nowrap'>{d.payment_status}</td>
                                <td className='py-3 px-4 font-medium whitespace-nowrap'>{d.delivery_status}</td>
                                <td className='py-3 px-4 font-medium whitespace-nowrap'>
                                    <Link to={`/admin/dashboard/order/details/${d._id}`} className='text-theme-primary hover:underline'>View</Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
