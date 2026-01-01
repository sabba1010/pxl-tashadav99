import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IReport {
    _id: string;
    orderId: string;
    reporterEmail: string;
    sellerEmail: string;
    reason: string;
    message: string;
    status: string;
    createdAt: string;
}

const ReportAdmin: React.FC = () => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // Generics ব্যবহার করে টাইপ ডিফাইন করা হয়েছে
                const response = await axios.get<IReport[]>('http://localhost:5000/purchase/reports'); 
                setReports(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching reports:", error);
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading Reports...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-red-600">User Reports & Complaints</h2>
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                <table className="table w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border text-left">Order ID</th>
                            <th className="p-3 border text-left">Reporter</th>
                            <th className="p-3 border text-left">Seller</th>
                            <th className="p-3 border text-left">Reason</th>
                            <th className="p-3 border text-left">Message</th>
                            <th className="p-3 border text-center">Status</th>
                            <th className="p-3 border text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id} className="hover:bg-gray-50 transition-colors border-b">
                                <td className="p-3 border text-xs font-mono">{report.orderId}</td>
                                <td className="p-3 border font-semibold">{report.reporterEmail}</td>
                                <td className="p-3 border text-sm">{report.sellerEmail}</td>
                                <td className="p-3 border text-red-600 text-sm font-medium">{report.reason}</td>
                                <td className="p-3 border italic text-gray-600 text-sm">"{report.message}"</td>
                                <td className="p-3 border text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
                                        report.status === 'Pending' 
                                        ? 'bg-yellow-100 text-yellow-700' 
                                        : 'bg-green-100 text-green-700'
                                    }`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="p-3 border text-[11px] text-gray-500">
                                    {new Date(report.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportAdmin;