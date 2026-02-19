import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthHook as useAuth } from '../../hook/useAuthHook'; 
import axios from 'axios';
import Swal from 'sweetalert2';

interface Report {
    _id: string;
    orderId: string;
    reporterEmail: string;
    sellerEmail: string;
    reason: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const MyReport: React.FC = () => {
    // @ts-ignore
    const { user } = useAuth();

    const { data: reports = [] as Report[], isLoading, refetch } = useQuery<Report[]>({
        queryKey: ['my-reports', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            // Sending current user email as a query parameter
            const res = await axios.get<Report[]>(`https://tasha-vps-backend-2.onrender.com/my-reports?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email 
    });

    const handleMarkSold = async (id: string) => {
        try {
            const res = await axios.patch<any>(`https://tasha-vps-backend-2.onrender.com/report/mark-sold/${id}`);
            if (res.data.success) {
                Swal.fire("Success!", "Report marked as Sold", "success");
                refetch();
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    if (isLoading) return <div className="text-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 text-uppercase">
                My Reports ({reports.length})
            </h2>
            
            <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200">
                <table className="table w-full">
                    <thead className="bg-slate-800 text-white text-center">
                        <tr>
                            <th>#</th>
                            <th>Order ID</th>
                            <th>Reason</th>
                            <th>Reporter</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {reports.length > 0 ? (
                            reports.map((report: Report, index: number) => (
                                <tr key={report._id} className="hover:bg-slate-50 border-b">
                                    <th>{index + 1}</th>
                                    <td className="text-xs">{report.orderId}</td>
                                    <td className="font-semibold text-red-500">{report.reason}</td>
                                    <td className="text-gray-500 text-xs">{report.reporterEmail}</td>
                                    <td>
                                        <div className={`badge badge-md p-3 font-bold ${
                                            report.status === 'Sold' ? 'badge-success text-white' : 'badge-warning'
                                        }`}>
                                            {report.status}
                                        </div>
                                    </td>
                                    <td>
                                        {report.status !== 'Sold' && (
                                            <button 
                                                onClick={() => handleMarkSold(report._id)}
                                                className="btn btn-xs btn-primary"
                                            >
                                                Mark Sold
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                           <tr>
                               <td colSpan={6} className="py-20 text-gray-400">No reports matched your email ({user?.email})</td>
                           </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyReport;