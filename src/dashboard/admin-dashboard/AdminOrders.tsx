import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    IconButton,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Cancel, Visibility, Chat, CheckCircle } from "@mui/icons-material";
import ChatWindow from "../../components/Chat/ChatWindow";
import { useAuthHook } from "../../hook/useAuthHook";
import { toast } from "sonner";
import { formatToWAT } from "../../lib/timeUtils";

const BASE_URL = "http://localhost:3200";

interface Order {
    _id: string;
    orderId?: string;
    buyerEmail: string;
    sellerEmail: string;
    productName: string;
    price: number;
    status: string;
    purchaseDate: string;
}

// ✅ 1. Native JavaScript date formatting (No moment.js)
const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return formatToWAT(dateString, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const AdminOrders: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
    const [openChatDialog, setOpenChatDialog] = useState(false);
    const [activeChatOrder, setActiveChatOrder] = useState<Order | null>(null);

    const { data: userData } = useAuthHook();
    const adminEmail = userData?.email || localStorage.getItem("userEmail") || "admin@platform.com";
    const { data: orders = [], isLoading } = useQuery<Order[]>({
        queryKey: ["adminAllOrders"],
        queryFn: async () => {
            const response = await axios.get(`${BASE_URL}/purchase/getall`);
            return response.data as Order[];
        },
    });

    // Mutation to cancel order
    const cancelMutation = useMutation({
        mutationFn: async (orderId: string) => {
            // 🔒 Passing role: 'admin' to bypass backend restriction
            return axios.patch(`${BASE_URL}/purchase/update-status/${orderId}`, {
                status: "cancelled",
                role: "admin",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminAllOrders"] });
            toast.success("Order cancelled successfully");
            setOpenCancelDialog(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        },
    });

    // Mutation to complete order
    const completeMutation = useMutation({
        mutationFn: async (order: Order) => {
            return axios.patch(`${BASE_URL}/purchase/update-status/${order._id}`, {
                status: "completed",
                sellerEmail: order.sellerEmail,
                role: "admin",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminAllOrders"] });
            toast.success("Order marked as completed");
            setOpenCompleteDialog(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to complete order");
        },
    });

    const handleCancelClick = (order: Order) => {
        setSelectedOrder(order);
        setOpenCancelDialog(true);
    };

    const confirmCancel = () => {
        if (selectedOrder) {
            cancelMutation.mutate(selectedOrder._id);
        }
    };

    const handleCompleteClick = (order: Order) => {
        setSelectedOrder(order);
        setOpenCompleteDialog(true);
    };

    const confirmComplete = () => {
        if (selectedOrder) {
            completeMutation.mutate(selectedOrder);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "success";
            case "pending":
                return "warning";
            case "cancelled":
                return "error";
            case "refunded":
                return "info";
            default:
                return "default";
        }
    };

    return (
        // ✅ Responsive Padding
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1B2559]">Order Management</h1>
                    <p className="text-gray-500 text-sm">View and manage all platform orders</p>
                </div>
            </div>

            <TableContainer component={Paper} className="shadow-lg rounded-xl overflow-hidden">
                <Table sx={{ minWidth: 650 }} aria-label="admin orders table">
                    <TableHead className="bg-[#F4F7FE]">
                        <TableRow>
                            <TableCell className="font-bold text-[#1B2559]">Product</TableCell>
                            <TableCell className="font-bold text-[#1B2559]">Buyer</TableCell>
                            <TableCell className="font-bold text-[#1B2559]">Seller</TableCell>
                            <TableCell className="font-bold text-[#1B2559]">Price</TableCell>
                            <TableCell className="font-bold text-[#1B2559]">Date</TableCell>
                            <TableCell className="font-bold text-[#1B2559]">Status</TableCell>
                            <TableCell className="font-bold text-[#1B2559]" align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" className="py-10">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" className="py-10 text-gray-500">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow
                                    key={order._id}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <TableCell component="th" scope="row">
                                        <span className="font-semibold text-indigo-900">{order.productName}</span>
                                        <br />
                                        <span className="text-xs text-gray-400">ID: {order._id.slice(-6)}</span>
                                    </TableCell>
                                    <TableCell>{order.buyerEmail}</TableCell>
                                    <TableCell>{order.sellerEmail}</TableCell>
                                    <TableCell className="font-mono font-bold">${order.price}</TableCell>
                                    <TableCell>{formatDate(order.purchaseDate)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status.toUpperCase()}
                                            color={getStatusColor(order.status) as any}
                                            size="small"
                                            variant="filled"
                                            className="font-bold shadow-sm"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {/* Only allow cancelling non-terminal states if desired, or just show button always but handle backend error */}
                                        {["pending", "ongoing"].includes(order.status.toLowerCase()) && (
                                            <>
                                                <Tooltip title="Complete Order">
                                                    <IconButton
                                                        color="success"
                                                        onClick={() => handleCompleteClick(order)}
                                                        size="small"
                                                        className="bg-green-50 hover:bg-green-100 mr-2"
                                                    >
                                                        <CheckCircle fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Cancel Order">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleCancelClick(order)}
                                                        size="small"
                                                        className="bg-red-50 hover:bg-red-100"
                                                    >
                                                        <Cancel fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}

                                        <Tooltip title="View Chat">
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    setActiveChatOrder(order);
                                                    setOpenChatDialog(true);
                                                }}
                                                size="small"
                                                className="bg-blue-50 hover:bg-blue-100 ml-2"
                                            >
                                                <Chat fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Cancel Confirmation Dialog */}
            <Dialog
                open={openCancelDialog}
                onClose={() => setOpenCancelDialog(false)}
            >
                <DialogTitle className="text-red-600 font-bold">
                    {"Confirm Order Cancellation?"}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to cancel this order for <strong>{selectedOrder?.productName}</strong>?
                        <br />
                        <br />
                        This action cannot be undone and will refund the buyer if applicable.
                    </Typography>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setOpenCancelDialog(false)} className="text-gray-500 hover:bg-gray-100">
                        No, Keep it
                    </Button>
                    <Button
                        onClick={confirmCancel}
                        variant="contained"
                        color="error"
                        autoFocus
                        disabled={cancelMutation.isPending}
                        className="shadow-md"
                    >
                        {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel Order"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Complete Confirmation Dialog */}
            <Dialog
                open={openCompleteDialog}
                onClose={() => setOpenCompleteDialog(false)}
            >
                <DialogTitle className="text-green-600 font-bold">
                    {"Confirm Order Completion?"}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to mark <strong>{selectedOrder?.productName}</strong> as completed?
                        <br />
                        <br />
                        This will transfer funds to the seller and mark the transaction as finished.
                    </Typography>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setOpenCompleteDialog(false)} className="text-gray-500 hover:bg-gray-100">
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmComplete}
                        variant="contained"
                        color="success"
                        disabled={completeMutation.isPending}
                        className="shadow-md"
                    >
                        {completeMutation.isPending ? "Processing..." : "Mark as Completed"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Chat Dialog */}
            <Dialog
                open={openChatDialog}
                onClose={() => setOpenChatDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        height: "auto",
                        maxHeight: "90vh",
                        bgcolor: "transparent",
                        boxShadow: "none"
                    }
                }}
            >
                {activeChatOrder && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ChatWindow
                            orderId={activeChatOrder._id}
                            buyerEmail={activeChatOrder.buyerEmail}
                            sellerEmail={activeChatOrder.sellerEmail}
                            currentUserEmail={adminEmail}
                            readOnly={true}
                            onClose={() => setOpenChatDialog(false)}
                            productTitle={activeChatOrder.productName}
                        />
                    </Box>
                )}
            </Dialog>
        </Box>
    );
};

export default AdminOrders;
