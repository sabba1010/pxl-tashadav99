// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useAuthHook } from "../../hook/useAuthHook";
// import { sendNotification } from "../Notification/Notification";
// import { toast } from "sonner";

// import type { IconType } from "react-icons";
// import {
//   FaInstagram,
//   FaFacebookF,
//   FaTwitter,
//   FaWhatsapp,
//   FaTelegram,
//   FaTimes,
//   FaEye,
//   FaComments,
//   FaGlobe,
//   FaPaperPlane,
//   FaBan,
//   FaFlag,
// } from "react-icons/fa";

// // Icon Casting
// const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
// const FaEyeIcon = FaEye as unknown as React.ComponentType<any>;
// const FaCommentsIcon = FaComments as unknown as React.ComponentType<any>;
// const FaPaperPlaneIcon = FaPaperPlane as unknown as React.ComponentType<any>;
// const FaBanIcon = FaBan as unknown as React.ComponentType<any>;
// const FaFlagIcon = FaFlag as unknown as React.ComponentType<any>;

// const ICON_COLOR_MAP = new Map<IconType, string>([
//   [FaInstagram, "#E1306C"],
//   [FaFacebookF, "#1877F2"],
//   [FaTwitter, "#1DA1F2"],
//   [FaWhatsapp, "#25D366"],
//   [FaTelegram, "#0088cc"],
// ]);

// const vibrantGradients = [
//   "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
//   "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
//   "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
//   "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
// ];

// type OrderStatus = "Pending" | "Completed" | "Cancelled";
// type PlatformType = "instagram" | "facebook" | "twitter" | "whatsapp" | "telegram" | "other";

// interface Order {
//   id: string;
//   platform: PlatformType;
//   title: string;
//   desc?: string;
//   buyerEmail: string;
//   price: number;
//   date: string;
//   status: OrderStatus;
//   orderNumber?: string;
// }

// interface ApiOrder {
//   _id: string;
//   buyerEmail: string;
//   productName: string;
//   price: number;
//   sellerEmail: string;
//   productId: string;
//   purchaseDate: string;
//   status: string;
// }

// interface IMessage {
//   _id?: string;
//   senderId: string;
//   receiverId: string;
//   message: string;
//   orderId?: string;
//   createdAt?: string;
// }

// interface ApiUser {
//   _id: string;
//   name: string;
//   email: string;
// }

// const inferPlatform = (name: string): PlatformType => {
//   const n = name.toLowerCase();
//   if (n.includes("instagram")) return "instagram";
//   if (n.includes("facebook")) return "facebook";
//   if (n.includes("twitter")) return "twitter";
//   if (n.includes("whatsapp")) return "whatsapp";
//   if (n.includes("telegram")) return "telegram";
//   return "other";
// };

// const getPlatformIcon = (platform: PlatformType): IconType => {
//   switch (platform) {
//     case "instagram": return FaInstagram;
//     case "facebook": return FaFacebookF;
//     case "twitter": return FaTwitter;
//     case "whatsapp": return FaWhatsapp;
//     case "telegram": return FaTelegram;
//     default: return FaGlobe;
//   }
// };

// const formatDate = (d: string) =>
//   new Date(d).toLocaleString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// const timeAgo = (dateString?: string) => {
//   if (!dateString) return "Just now";
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
//   if (diffInSeconds < 60) return "Just now";
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) return `${diffInHours}h ago`;
//   const diffInDays = Math.floor(diffInHours / 24);
//   if (diffInDays < 7) return `${diffInDays}d ago`;
//   return date.toLocaleDateString();
// };

// const renderBadge = (platform: PlatformType, size = 36) => {
//   const IconComp = getPlatformIcon(platform);
//   const brandHex = ICON_COLOR_MAP.get(IconComp);
//   const bg = brandHex ?? vibrantGradients[platform.length % vibrantGradients.length];
//   const C = IconComp as any;
//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//         borderRadius: 12,
//         display: "inline-flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: bg,
//         boxShadow: "0 10px 20px rgba(16,24,40,0.08)",
//       }}
//     >
//       <C size={Math.round(size * 0.6)} style={{ color: "#fff" }} />
//     </div>
//   );
// };

// const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
// type Tab = (typeof TABS)[number];

// const SELLER_REPORT_REASONS = [
//   "Scam or Fraud",
//   "Fake Payment Proof",
//   "Abusive Language",
//   "Not Following Instructions",
//   "Harassment",
//   "Other",
// ];

// const MyOrder: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<Tab>("All");
//   const [selected, setSelected] = useState<Order | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [buyerNames, setBuyerNames] = useState<Record<string, string>>({});

//   const loginUserData = useAuthHook();
//   const sellerId = loginUserData.data?.email || localStorage.getItem("userEmail");

//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
//   const [typedMessage, setTypedMessage] = useState("");
//   const [activeChatBuyerEmail, setActiveChatBuyerEmail] = useState<string | null>(null);
//   const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
//   const [activeChatProductTitle, setActiveChatProductTitle] = useState<string>("");
//   const [unreadState, setUnreadState] = useState<Record<string, boolean>>({});

//   const scrollRef = useRef<HTMLDivElement>(null);
//   const chatLengthRef = useRef(0);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const PURCHASE_API = "http://localhost:3200/purchase";
//   const CHAT_API = "http://localhost:3200/chat";
//   const USER_API = "http://localhost:3200/user";

//   // Report states
//   const [isReportModalOpen, setIsReportModalOpen] = useState(false);
//   const [reportTargetOrder, setReportTargetOrder] = useState<Order | null>(null);
//   const [reportReason, setReportReason] = useState(SELLER_REPORT_REASONS[0]);
//   const [reportMessage, setReportMessage] = useState("");
//   const [isSubmittingReport, setIsSubmittingReport] = useState(false);

//   // Fetch Orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!sellerId) {
//         setIsLoading(false);
//         return;
//       }
//       try {
//         setIsLoading(true);
//         const res = await axios.get<ApiOrder[]>(`${PURCHASE_API}/getall`);
//         const allData = res.data;
//         const mySales = allData.filter((item) => item.sellerEmail === sellerId);
//         const mapped: Order[] = mySales.map((item) => ({
//           id: item._id,
//           platform: inferPlatform(item.productName),
//           title: item.productName,
//           desc: `Product ID: ${item.productId}`,
//           buyerEmail: item.buyerEmail,
//           price: item.price,
//           date: formatDate(item.purchaseDate),
//           status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as OrderStatus,
//           orderNumber: `ORD-${item._id.slice(-6).toUpperCase()}`,
//         }));
//         setOrders(mapped);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load orders");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchOrders();
//   }, [sellerId]);

//   // Fetch buyer names - FIXED TS ERROR HERE
//   useEffect(() => {
//     const fetchNames = async () => {
//       if (orders.length === 0) return;
//       const uniqueEmails = Array.from(new Set(orders.map((o) => o.buyerEmail)));
//       const emailsToFetch = uniqueEmails.filter((e) => !buyerNames[e]);
//       if (emailsToFetch.length === 0) return;

//       const newNames: Record<string, string> = {};
//       await Promise.all(
//         emailsToFetch.map(async (email) => {
//           try {
//             const res = await axios.get<ApiUser>(`${USER_API}/${email}`);
//             newNames[email] = res.data.name || email.split("@")[0];
//           } catch {
//             newNames[email] = email.split("@")[0];
//           }
//         })
//       );
//       setBuyerNames((prev) => ({ ...prev, ...newNames }));
//     };
//     fetchNames();
//   }, [orders]);

//   // Unread message check
//   useEffect(() => {
//     const checkUnread = async () => {
//       if (!sellerId || orders.length === 0) return;
//       const newUnread: Record<string, boolean> = { ...unreadState };
//       let changed = false;

//       for (const order of orders) {
//         if (isChatOpen && activeChatOrderId === order.id) continue;
//         try {
//           const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${order.buyerEmail}`, {
//             params: { orderId: order.id },
//           });
//           const msgs = res.data;
//           if (msgs.length > 0) {
//             const last = msgs[msgs.length - 1];
//             if (last.senderId.toLowerCase() !== sellerId.toLowerCase()) {
//               if (!newUnread[order.id]) {
//                 newUnread[order.id] = true;
//                 changed = true;
//               }
//             }
//           }
//         } catch {}
//       }
//       if (changed) setUnreadState(newUnread);
//     };

//     if (orders.length > 0) {
//       checkUnread();
//       const interval = setInterval(checkUnread, 10000);
//       return () => clearInterval(interval);
//     }
//   }, [orders, sellerId, isChatOpen, activeChatOrderId]);

//   // Cancel order
//   const updateOrderStatus = async (orderId: string) => {
//     try {
//       setIsUpdating(true);
//       await axios.patch(`${PURCHASE_API}/update-status/${orderId}`, { status: "Cancelled" });
//       setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o)));
//       if (selected?.id === orderId) setSelected({ ...selected, status: "Cancelled" });
//       toast.success("Order cancelled");
//     } catch {
//       toast.error("Failed to cancel");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // Chat functions
//   const fetchChat = async (buyerEmail: string, orderId: string) => {
//     if (!sellerId) return;
//     try {
//       const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${buyerEmail}`, {
//         params: { orderId },
//       });
//       const newMsgs = res.data;
//       if (newMsgs.length > chatLengthRef.current && chatLengthRef.current > 0) {
//         const last = newMsgs[newMsgs.length - 1];
//         if (last.senderId.toLowerCase() !== sellerId.toLowerCase()) {
//           new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3").play().catch(() => {});
//         }
//       }
//       chatLengthRef.current = newMsgs.length;
//       setChatMessages(newMsgs);
//     } catch {}
//   };

//   useEffect(() => {
//     chatLengthRef.current = 0;
//   }, [isChatOpen]);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isChatOpen && activeChatBuyerEmail && activeChatOrderId) {
//       setUnreadState((prev) => ({ ...prev, [activeChatOrderId]: false }));
//       fetchChat(activeChatBuyerEmail, activeChatOrderId);
//       interval = setInterval(() => fetchChat(activeChatBuyerEmail, activeChatOrderId), 3000);
//     }
//     return () => clearInterval(interval);
//   }, [isChatOpen, activeChatBuyerEmail, activeChatOrderId]);

//   const sendChat = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!typedMessage.trim() || !activeChatBuyerEmail || !activeChatOrderId) return;
//     try {
//       await axios.post(`${CHAT_API}/send`, {
//         senderId: sellerId,
//         receiverId: activeChatBuyerEmail,
//         message: typedMessage,
//         orderId: activeChatOrderId,
//       });
//       setTypedMessage("");
//       fetchChat(activeChatBuyerEmail, activeChatOrderId);
//     } catch {
//       toast.error("Failed to send message");
//     }
//   };

//   const handleOpenChat = (order: Order) => {
//     setActiveChatBuyerEmail(order.buyerEmail);
//     setActiveChatOrderId(order.id);
//     setActiveChatProductTitle(order.title);
//     setIsChatOpen(true);
//   };

//   const getBuyerDisplayName = (email: string | null) => {
//     if (!email) return "Unknown";
//     return buyerNames[email] || email.split("@")[0];
//   };

//   // Report submit - same as buyer side
//   const handleReportSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!reportMessage.trim() || !reportTargetOrder || !sellerId) return;
//     setIsSubmittingReport(true);
//     try {
//       await axios.post(`${PURCHASE_API}/report/create`, {
//         orderId: reportTargetOrder.id,
//         reporterEmail: sellerId,
//         sellerEmail: sellerId,
//         buyerEmail: reportTargetOrder.buyerEmail,
//         reason: reportReason,
//         message: reportMessage,
//       });
//       toast.success("Report submitted successfully");
//       setIsReportModalOpen(false);
//       setReportMessage("");
//       setReportReason(SELLER_REPORT_REASONS[0]);
//       setReportTargetOrder(null);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to submit report");
//     } finally {
//       setIsSubmittingReport(false);
//     }
//   };

//   const filteredOrders = useMemo(() => {
//     if (activeTab === "All") return orders;
//     return orders.filter((o) => o.status === activeTab);
//   }, [activeTab, orders]);

//   const paginatedOrders = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredOrders.slice(start, start + itemsPerPage);
//   }, [filteredOrders, currentPage]);

//   return (
//     <>
//       <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20 px-4">
//         <div className="max-w-screen-xl mx-auto">
//           <h1 className="text-3xl font-bold text-[#0A1A3A] mb-6">My Sales</h1>

//           <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//             <div className="flex gap-6 p-4 border-b overflow-x-auto">
//               {TABS.map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`pb-2 text-sm font-bold transition ${
//                     activeTab === tab ? "text-[#d4a643] border-b-2 border-[#d4a643]" : "text-gray-500"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             <div className="p-6 space-y-4">
//               {isLoading ? (
//                 <p className="text-center py-10 text-gray-400">Loading...</p>
//               ) : filteredOrders.length === 0 ? (
//                 <div className="text-center py-20">
//                   <p className="text-gray-500 mb-4">No sales found</p>
//                   <Link to="/add-product" className="bg-[#33ac6f] text-white px-6 py-3 rounded-full">
//                     Add Product
//                   </Link>
//                 </div>
//               ) : (
//                 paginatedOrders.map((order) => (
//                   <div
//                     key={order.id}
//                     onClick={() => setSelected(order)}
//                     className="bg-[#F8FAFB] rounded-xl p-4 flex items-center gap-4 border hover:shadow-md cursor-pointer transition"
//                   >
//                     {renderBadge(order.platform)}
//                     <div className="flex-1">
//                       <h3 className="font-bold text-[#0A1A3A]">{order.title}</h3>
//                       <p className="text-sm text-gray-500">Buyer: {getBuyerDisplayName(order.buyerEmail)}</p>
//                       <span
//                         className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-bold ${
//                           order.status === "Pending"
//                             ? "bg-amber-100 text-amber-700"
//                             : order.status === "Completed"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {order.status}
//                       </span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold">${order.price.toFixed(2)}</p>
//                       <p className="text-xs text-gray-500">{order.date}</p>
//                       {order.status === "Pending" && (
//                         <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
//                           <button onClick={() => setSelected(order)} className="p-2 border rounded hover:bg-gray-100">
//                             <FaEyeIcon size={14} />
//                           </button>
//                           <button onClick={() => handleOpenChat(order)} className="p-2 border rounded hover:bg-blue-100 text-blue-600 relative">
//                             <FaCommentsIcon size={14} />
//                             {unreadState[order.id] && (
//                               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
//                             )}
//                           </button>
//                           <button
//                             onClick={() => {
//                               setReportTargetOrder(order);
//                               setIsReportModalOpen(true);
//                             }}
//                             className="p-2 border border-red-200 rounded hover:bg-red-50 text-red-600"
//                           >
//                             <FaFlagIcon size={14} />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Details Modal */}
//       {selected && (
//         <>
//           <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelected(null)} />
//           <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 max-w-lg w-full bg-white rounded-t-3xl sm:rounded-3xl z-50 shadow-2xl">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold">{selected.title}</h2>
//                 <p className="text-sm text-gray-500">{selected.date}</p>
//               </div>
//               <button onClick={() => setSelected(null)}>
//                 <FaTimesIcon size={20} />
//               </button>
//             </div>
//             <div className="p-6 text-center">
//               {renderBadge(selected.platform, 80)}
//               <p className="text-3xl font-bold mt-4">${selected.price.toFixed(2)}</p>
//               <div className="mt-6 text-left space-y-3">
//                 <p><span className="text-gray-500">Status:</span> <strong>{selected.status}</strong></p>
//                 <p><span className="text-gray-500">Order No:</span> {selected.orderNumber}</p>
//                 <p><span className="text-gray-500">Buyer:</span> {getBuyerDisplayName(selected.buyerEmail)}</p>
//                 <p><span className="text-gray-500">Description:</span> {selected.desc}</p>
//               </div>
//               {selected.status === "Pending" && (
//                 <div className="mt-8 grid grid-cols-2 gap-4">
//                   <button
//                     disabled={isUpdating}
//                     onClick={() => updateOrderStatus(selected.id)}
//                     className="py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
//                   >
//                     <FaBanIcon /> Cancel Order
//                   </button>
//                   <button
//                     onClick={() => {
//                       setReportTargetOrder(selected);
//                       setIsReportModalOpen(true);
//                     }}
//                     className="py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"
//                   >
//                     <FaFlagIcon /> Report Buyer
//                   </button>
//                 </div>
//               )}
//               <div className="mt-6 flex gap-3">
//                 {selected.status === "Pending" && (
//                   <button
//                     onClick={() => {
//                       setSelected(null);
//                       handleOpenChat(selected);
//                     }}
//                     className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//                   >
//                     <FaCommentsIcon /> Chat with Buyer
//                   </button>
//                 )}
//                 <button onClick={() => setSelected(null)} className="flex-1 py-3 border rounded-lg">
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Chat Modal */}
//       {isChatOpen && activeChatBuyerEmail && (
//         <>
//           <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setIsChatOpen(false)} />
//           <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 max-w-md w-full bg-[#ECE5DD] rounded-t-3xl sm:rounded-2xl z-50 shadow-2xl flex flex-col h-[90vh] sm:h-[600px]">
//             <div className="bg-white p-4 flex justify-between items-center border-b">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
//                   {getBuyerDisplayName(activeChatBuyerEmail)[0]}
//                 </div>
//                 <div>
//                   <h3 className="font-bold">{getBuyerDisplayName(activeChatBuyerEmail)}</h3>
//                   <p className="text-xs text-gray-500">{activeChatProductTitle}</p>
//                 </div>
//               </div>
//               <button onClick={() => setIsChatOpen(false)}>
//                 <FaTimesIcon size={20} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {chatMessages.map((msg, i) => {
//                 const isMe = msg.senderId.toLowerCase() === sellerId?.toLowerCase();
//                 return (
//                   <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                     <div
//                       className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
//                         isMe ? "bg-[#33ac6f] text-white" : "bg-white shadow"
//                       }`}
//                     >
//                       {msg.message}
//                       <div className="text-xs opacity-70 mt-1 text-right">{timeAgo(msg.createdAt)}</div>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={scrollRef} />
//             </div>
//             <form onSubmit={sendChat} className="p-4 bg-white border-t flex gap-2">
//               <input
//                 value={typedMessage}
//                 onChange={(e) => setTypedMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm"
//               />
//               <button type="submit" className="bg-[#33ac6f] text-white p-3 rounded-full">
//                 <FaPaperPlaneIcon size={16} />
//               </button>
//             </form>
//           </div>
//         </>
//       )}

//       {/* Report Modal */}
//       {isReportModalOpen && reportTargetOrder && (
//         <>
//           <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setIsReportModalOpen(false)} />
//           <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl shadow-2xl z-50">
//             <div className="bg-red-600 text-white p-4 font-bold flex justify-between items-center">
//               <span className="flex items-center gap-2">
//                 <FaFlagIcon /> Report Buyer
//               </span>
//               <button onClick={() => setIsReportModalOpen(false)}>
//                 <FaTimesIcon />
//               </button>
//             </div>
//             <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
//               <select
//                 value={reportReason}
//                 onChange={(e) => setReportReason(e.target.value)}
//                 className="w-full border p-3 rounded-lg"
//               >
//                 {SELLER_REPORT_REASONS.map((r) => (
//                   <option key={r} value={r}>{r}</option>
//                 ))}
//               </select>
//               <textarea
//                 value={reportMessage}
//                 onChange={(e) => setReportMessage(e.target.value)}
//                 placeholder="Describe the issue..."
//                 required
//                 rows={5}
//                 className="w-full border p-3 rounded-lg resize-none"
//               />
//               <div className="flex gap-3">
//                 <button type="button" onClick={() => setIsReportModalOpen(false)} className="flex-1 py-3 border rounded-lg">
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmittingReport}
//                   className="flex-1 py-3 bg-red-600 text-white rounded-lg disabled:opacity-50"
//                 >
//                   {isSubmittingReport ? "Submitting..." : "Submit Report"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default MyOrder;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook";
import { toast } from "sonner";

import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaTimes,
  FaEye,
  FaComments,
  FaGlobe,
  FaPaperPlane,
  FaBan,
  FaFlag,
  FaImage,
} from "react-icons/fa";

// Icon Casting
const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
const FaEyeIcon = FaEye as unknown as React.ComponentType<any>;
const FaCommentsIcon = FaComments as unknown as React.ComponentType<any>;
const FaPaperPlaneIcon = FaPaperPlane as unknown as React.ComponentType<any>;
const FaBanIcon = FaBan as unknown as React.ComponentType<any>;
const FaFlagIcon = FaFlag as unknown as React.ComponentType<any>;
const FaImageIcon = FaImage as unknown as React.ComponentType<any>;

const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaInstagram, "#E1306C"],
  [FaFacebookF, "#1877F2"],
  [FaTwitter, "#1DA1F2"],
  [FaWhatsapp, "#25D366"],
  [FaTelegram, "#0088cc"],
]);

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
];

type OrderStatus = "Pending" | "Completed" | "Cancelled";
type PlatformType = "instagram" | "facebook" | "twitter" | "whatsapp" | "telegram" | "other";

interface Order {
  id: string;
  platform: PlatformType;
  title: string;
  desc?: string;
  buyerEmail: string;
  price: number;
  date: string;
  status: OrderStatus;
  orderNumber?: string;
}

interface ApiOrder {
  _id: string;
  buyerEmail: string;
  productName: string;
  price: number;
  sellerEmail: string;
  productId: string;
  purchaseDate: string;
  status: string;
}

interface IMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  imageUrl?: string; // ব্যাকএন্ড থেকে এই ফিল্ড নামে ডেটা আসে
  orderId?: string;
  createdAt?: string;
}

interface ApiUser {
  _id: string;
  name: string;
  email: string;
}

interface PresenceResponse {
  userId: string;
  lastSeen?: string | null;
  online?: boolean;
}

const inferPlatform = (name: string): PlatformType => {
  const n = name.toLowerCase();
  if (n.includes("instagram")) return "instagram";
  if (n.includes("facebook")) return "facebook";
  if (n.includes("twitter")) return "twitter";
  if (n.includes("whatsapp")) return "whatsapp";
  if (n.includes("telegram")) return "telegram";
  return "other";
};

const getPlatformIcon = (platform: PlatformType): IconType => {
  switch (platform) {
    case "instagram": return FaInstagram;
    case "facebook": return FaFacebookF;
    case "twitter": return FaTwitter;
    case "whatsapp": return FaWhatsapp;
    case "telegram": return FaTelegram;
    default: return FaGlobe;
  }
};

const formatDate = (d: string) =>
  new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const timeAgo = (dateString?: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

const renderBadge = (platform: PlatformType, size = 36) => {
  const IconComp = getPlatformIcon(platform);
  const brandHex = ICON_COLOR_MAP.get(IconComp);
  const bg = brandHex ?? vibrantGradients[platform.length % vibrantGradients.length];
  const C = IconComp as any;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 10px 20px rgba(16,24,40,0.08)",
      }}
    >
      <C size={Math.round(size * 0.6)} style={{ color: "#fff" }} />
    </div>
  );
};

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

const SELLER_REPORT_REASONS = [
  "Scam or Fraud",
  "Fake Payment Proof",
  "Abusive Language",
  "Not Following Instructions",
  "Harassment",
  "Other",
];

const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [buyerNames, setBuyerNames] = useState<Record<string, string>>({});

  const loginUserData = useAuthHook();
  const sellerId = loginUserData.data?.email || localStorage.getItem("userEmail");

  const BASE_URL = "http://localhost:3200"; // ব্যাকএন্ড পোর্ট
  const PURCHASE_API = `${BASE_URL}/purchase`;
  const CHAT_API = `${BASE_URL}/chat`;
  const USER_API = `${BASE_URL}/user`;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeChatBuyerEmail, setActiveChatBuyerEmail] = useState<string | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
  const [activeChatProductTitle, setActiveChatProductTitle] = useState<string>("");
  const [unreadState, setUnreadState] = useState<Record<string, boolean>>({});
  const [presenceMap, setPresenceMap] = useState<Record<string, { online: boolean; lastSeen?: string | null }>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatLengthRef = useRef(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchPresence = async (email: string) => {
    if (!email) return;
    try {
      const res = await axios.get<PresenceResponse>(`${CHAT_API}/status/${encodeURIComponent(email)}`);
      const data = res.data;
      setPresenceMap((p) => ({ ...p, [email]: { online: Boolean(data?.online), lastSeen: data?.lastSeen ?? null } }));
    } catch (e) {
      setPresenceMap((p) => ({ ...p, [email]: { online: false, lastSeen: null } }));
    }
  };

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetOrder, setReportTargetOrder] = useState<Order | null>(null);
  const [reportReason, setReportReason] = useState(SELLER_REPORT_REASONS[0]);
  const [reportMessage, setReportMessage] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!sellerId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const res = await axios.get<ApiOrder[]>(`${PURCHASE_API}/getall`);
        const allData = res.data;
        const mySales = allData.filter((item) => item.sellerEmail === sellerId);
        const mapped: Order[] = mySales.map((item) => ({
          id: item._id,
          platform: inferPlatform(item.productName),
          title: item.productName,
          desc: `Product ID: ${item.productId}`,
          buyerEmail: item.buyerEmail,
          price: item.price,
          date: formatDate(item.purchaseDate),
          status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as OrderStatus,
          orderNumber: `ORD-${item._id.slice(-6).toUpperCase()}`,
        }));
        setOrders(mapped);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [sellerId]);

  useEffect(() => {
    const fetchNames = async () => {
      if (orders.length === 0) return;
      const uniqueEmails = Array.from(new Set(orders.map((o) => o.buyerEmail)));
      const emailsToFetch = uniqueEmails.filter((e) => !buyerNames[e]);
      if (emailsToFetch.length === 0) return;

      const newNames: Record<string, string> = {};
      await Promise.all(
        emailsToFetch.map(async (email) => {
          try {
            const res = await axios.get<ApiUser>(`${USER_API}/${email}`);
            newNames[email] = res.data.name || email.split("@")[0];
          } catch {
            newNames[email] = email.split("@")[0];
          }
        })
      );
      setBuyerNames((prev) => ({ ...prev, ...newNames }));
    };
    fetchNames();
  }, [orders]);

  useEffect(() => {
    const checkUnread = async () => {
      if (!sellerId || orders.length === 0) return;
      const newUnread: Record<string, boolean> = { ...unreadState };
      let changed = false;

      for (const order of orders) {
        if (isChatOpen && activeChatOrderId === order.id) continue;
        try {
          const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${order.buyerEmail}`, {
            params: { orderId: order.id },
          });
          const msgs = res.data;
          if (msgs.length > 0) {
            const last = msgs[msgs.length - 1];
            if (last.senderId.toLowerCase() !== sellerId.toLowerCase()) {
              if (!newUnread[order.id]) {
                newUnread[order.id] = true;
                changed = true;
              }
            }
          }
        } catch {}
      }
      if (changed) setUnreadState(newUnread);
    };

    if (orders.length > 0) {
      checkUnread();
      const interval = setInterval(checkUnread, 10000);
      const unique = Array.from(new Set(orders.map((o) => o.buyerEmail)));
      unique.forEach((e) => fetchPresence(e));
      const presInterval = setInterval(() => unique.forEach((e) => fetchPresence(e)), 60000);
      return () => { clearInterval(interval); clearInterval(presInterval); };
    }
  }, [orders, sellerId, isChatOpen, activeChatOrderId]);

  const updateOrderStatus = async (orderId: string) => {
    try {
      setIsUpdating(true);
      await axios.patch(`${PURCHASE_API}/update-status/${orderId}`, { status: "Cancelled" });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o)));
      if (selected?.id === orderId) setSelected({ ...selected, status: "Cancelled" });
      toast.success("Order cancelled");
    } catch {
      toast.error("Failed to cancel");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large (max 5MB)");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fetchChat = async (buyerEmail: string, orderId: string) => {
    if (!sellerId) return;
    try {
      const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${buyerEmail}`, {
        params: { orderId },
      });
      const newMsgs = res.data;
      if (newMsgs.length > chatLengthRef.current && chatLengthRef.current > 0) {
        const last = newMsgs[newMsgs.length - 1];
        if (last.senderId.toLowerCase() !== sellerId.toLowerCase()) {
          new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3").play().catch(() => {});
        }
      }
      chatLengthRef.current = newMsgs.length;
      setChatMessages(newMsgs);
    } catch {}
  };

  useEffect(() => {
    chatLengthRef.current = 0;
  }, [isChatOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isChatOpen && activeChatBuyerEmail && activeChatOrderId) {
      setUnreadState((prev) => ({ ...prev, [activeChatOrderId]: false }));
      fetchChat(activeChatBuyerEmail, activeChatOrderId);
      interval = setInterval(() => fetchChat(activeChatBuyerEmail, activeChatOrderId), 3000);
    }
    return () => clearInterval(interval);
  }, [isChatOpen, activeChatBuyerEmail, activeChatOrderId]);

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!typedMessage.trim() && !selectedImage) || !activeChatBuyerEmail || !activeChatOrderId) return;
    
    try {
      const formData = new FormData();
      formData.append("senderId", sellerId!);
      formData.append("receiverId", activeChatBuyerEmail);
      formData.append("message", typedMessage);
      formData.append("orderId", activeChatOrderId);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await axios.post(`${CHAT_API}/send`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTypedMessage("");
      removeImage();
      fetchChat(activeChatBuyerEmail, activeChatOrderId);
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleOpenChat = (order: Order) => {
    setActiveChatBuyerEmail(order.buyerEmail);
    setActiveChatOrderId(order.id);
    setActiveChatProductTitle(order.title);
    setIsChatOpen(true);
  };

  const getBuyerDisplayName = (email: string | null) => {
    if (!email) return "Unknown";
    return buyerNames[email] || email.split("@")[0];
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMessage.trim() || !reportTargetOrder || !sellerId) return;
    setIsSubmittingReport(true);
    try {
      await axios.post(`${PURCHASE_API}/report/create`, {
        orderId: reportTargetOrder.id,
        reporterEmail: sellerId,
        sellerEmail: sellerId,
        buyerEmail: reportTargetOrder.buyerEmail,
        reason: reportReason,
        message: reportMessage,
      });
      toast.success("Report submitted successfully");
      setIsReportModalOpen(false);
      setReportMessage("");
      setReportReason(SELLER_REPORT_REASONS[0]);
      setReportTargetOrder(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [activeTab, orders]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold text-[#0A1A3A] mb-6">My Sales</h1>

          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="flex gap-6 p-4 border-b overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-bold transition ${
                    activeTab === tab ? "text-[#d4a643] border-b-2 border-[#d4a643]" : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
              {isLoading ? (
                <p className="text-center py-10 text-gray-400">Loading...</p>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 mb-4">No sales found</p>
                  <Link to="/add-product" className="bg-[#33ac6f] text-white px-6 py-3 rounded-full">
                    Add Product
                  </Link>
                </div>
              ) : (
                paginatedOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelected(order)}
                    className="bg-[#F8FAFB] rounded-xl p-4 flex items-center gap-4 border hover:shadow-md cursor-pointer transition"
                  >
                    {renderBadge(order.platform)}
                    <div className="flex-1">
                      <h3 className="font-bold text-[#0A1A3A]">{order.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span>Buyer: {getBuyerDisplayName(order.buyerEmail)}</span>
                        <span className={`inline-block w-2 h-2 rounded-full ${presenceMap[order.buyerEmail]?.online ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </p>
                      <span
                        className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${order.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                      {!["Cancelled", "Refunded"].includes(order.status) && (
                        <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => setSelected(order)} className="p-2 border rounded hover:bg-gray-100">
                            <FaEyeIcon size={14} />
                          </button>
                          <button onClick={() => handleOpenChat(order)} className="p-2 border rounded hover:bg-blue-100 text-blue-600 relative">
                            <FaCommentsIcon size={14} />
                            {unreadState[order.id] && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setReportTargetOrder(order);
                              setIsReportModalOpen(true);
                            }}
                            className="p-2 border border-red-200 rounded hover:bg-red-50 text-red-600"
                          >
                            <FaFlagIcon size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelected(null)} />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 max-w-lg w-full bg-white rounded-t-3xl sm:rounded-3xl z-50 shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{selected.title}</h2>
                <p className="text-sm text-gray-500">{selected.date}</p>
              </div>
              <button onClick={() => setSelected(null)}>
                <FaTimesIcon size={20} />
              </button>
            </div>
            <div className="p-6 text-center">
              {renderBadge(selected.platform, 80)}
              <p className="text-3xl font-bold mt-4">${selected.price.toFixed(2)}</p>
              <div className="mt-6 text-left space-y-3">
                <p><span className="text-gray-500">Status:</span> <strong>{selected.status}</strong></p>
                <p><span className="text-gray-500">Order No:</span> {selected.orderNumber}</p>
                <p><span className="text-gray-500">Buyer:</span> {getBuyerDisplayName(selected.buyerEmail)}</p>
                <p><span className="text-gray-500">Description:</span> {selected.desc}</p>
              </div>
              {selected.status !== "Cancelled" && (
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button
                    disabled={isUpdating}
                    onClick={() => updateOrderStatus(selected.id)}
                    className="py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <FaBanIcon /> Cancel Order
                  </button>
                  <button
                    onClick={() => {
                      setReportTargetOrder(selected);
                      setIsReportModalOpen(true);
                    }}
                    className="py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"
                  >
                    <FaFlagIcon /> Report Buyer
                  </button>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                {selected.status !== "Cancelled" && (
                  <button
                    onClick={() => {
                      setSelected(null);
                      handleOpenChat(selected);
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <FaCommentsIcon /> Chat with Buyer
                  </button>
                )}
                <button onClick={() => setSelected(null)} className="flex-1 py-3 border rounded-lg">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Chat Modal */}
      {isChatOpen && activeChatBuyerEmail && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setIsChatOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 max-w-md w-full bg-[#ECE5DD] rounded-t-3xl sm:rounded-2xl z-50 shadow-2xl flex flex-col h-[90vh] sm:h-[600px]">
            <div className="bg-white p-4 flex justify-between items-center border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {getBuyerDisplayName(activeChatBuyerEmail)[0]}
                </div>
                <div>
                  <h3 className="font-bold">{getBuyerDisplayName(activeChatBuyerEmail)}</h3>
                  <p className="text-xs text-gray-500">{activeChatProductTitle}</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)}>
                <FaTimesIcon size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => {
                const isMe = msg.senderId.toLowerCase() === sellerId?.toLowerCase();
                return (
                  <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow ${isMe ? "bg-[#33ac6f] text-white" : "bg-white"}`}>
                      {/* Image display fix: URL must point to backend */}
                      {msg.imageUrl && (
                        <img 
                          src={`${BASE_URL}${msg.imageUrl}`} 
                          alt="Sent content" 
                          className="rounded-lg mb-2 max-w-full h-auto cursor-pointer border shadow-sm"
                          onClick={() => window.open(`${BASE_URL}${msg.imageUrl}`, '_blank')}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <p>{msg.message}</p>
                      <div className="text-[10px] opacity-70 mt-1 text-right">{timeAgo(msg.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {imagePreview && (
              <div className="px-4 py-2 bg-white border-t flex items-center gap-3">
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border-2 border-green-500" />
                  <button onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md">
                    <FaTimesIcon size={10} />
                  </button>
                </div>
                <div className="text-xs text-gray-500">Image selected</div>
              </div>
            )}

            <form onSubmit={sendChat} className="p-4 bg-white border-t flex items-center gap-2">
              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageChange} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-green-600 p-2">
                <FaImageIcon size={22} />
              </button>
              <input
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
              />
              <button type="submit" className="bg-[#33ac6f] text-white p-3 rounded-full hover:bg-green-700">
                <FaPaperPlaneIcon size={16} />
              </button>
            </form>
          </div>
        </>
      )}

      {/* Report Modal */}
      {isReportModalOpen && reportTargetOrder && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setIsReportModalOpen(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl shadow-2xl z-50">
            <div className="bg-red-600 text-white p-4 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2"><FaFlagIcon /> Report Buyer</span>
              <button onClick={() => setIsReportModalOpen(false)}><FaTimesIcon /></button>
            </div>
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full border p-3 rounded-lg">
                {SELLER_REPORT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <textarea value={reportMessage} onChange={(e) => setReportMessage(e.target.value)} placeholder="Describe the issue..." required rows={5} className="w-full border p-3 rounded-lg resize-none" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="flex-1 py-3 border rounded-lg">Cancel</button>
                <button type="submit" disabled={isSubmittingReport} className="flex-1 py-3 bg-red-600 text-white rounded-lg">
                  {isSubmittingReport ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default MyOrder;



// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useAuthHook } from "../../hook/useAuthHook";
// //import { sendNotification } from "../Notification/Notification";
// import { toast } from "sonner";

// import type { IconType } from "react-icons";
// import {
//   FaInstagram,
//   FaFacebookF,
//   FaTwitter,
//   FaWhatsapp,
//   FaTelegram,
//   FaTimes,
//   FaEye,
//   FaComments,
//   FaGlobe,
//   FaPaperPlane,
//   FaBan,
//   FaFlag,
// } from "react-icons/fa";

// // Icon Casting
// const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
// const FaEyeIcon = FaEye as unknown as React.ComponentType<any>;
// const FaCommentsIcon = FaComments as unknown as React.ComponentType<any>;
// const FaPaperPlaneIcon = FaPaperPlane as unknown as React.ComponentType<any>;
// const FaBanIcon = FaBan as unknown as React.ComponentType<any>;
// const FaFlagIcon = FaFlag as unknown as React.ComponentType<any>;

// const ICON_COLOR_MAP = new Map<IconType, string>([
//   [FaInstagram, "#E1306C"],
//   [FaFacebookF, "#1877F2"],
//   [FaTwitter, "#1DA1F2"],
//   [FaWhatsapp, "#25D366"],
//   [FaTelegram, "#0088cc"],
// ]);

// const vibrantGradients = [
//   "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
//   "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
//   "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
//   "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
// ];

// type OrderStatus = "Pending" | "Completed" | "Cancelled";
// type PlatformType = "instagram" | "facebook" | "twitter" | "whatsapp" | "telegram" | "other";

// interface Order {
//   id: string;
//   platform: PlatformType;
//   title: string;
//   desc?: string;
//   buyerEmail: string;
//   price: number;
//   date: string;
//   status: OrderStatus;
//   orderNumber?: string;
// }

// interface ApiOrder {
//   _id: string;
//   buyerEmail: string;
//   productName: string;
//   price: number;
//   sellerEmail: string;
//   productId: string;
//   purchaseDate: string;
//   status: string;
// }

// interface IMessage {
//   _id?: string;
//   senderId: string;
//   receiverId: string;
//   message: string;
//   orderId?: string;
//   createdAt?: string;
// }

// interface ApiUser {
//   _id: string;
//   name: string;
//   email: string;
// }

// interface PresenceResponse {
//   userId: string;
//   lastSeen?: string | null;
//   online?: boolean;
// }

// const inferPlatform = (name: string): PlatformType => {
//   const n = name.toLowerCase();
//   if (n.includes("instagram")) return "instagram";
//   if (n.includes("facebook")) return "facebook";
//   if (n.includes("twitter")) return "twitter";
//   if (n.includes("whatsapp")) return "whatsapp";
//   if (n.includes("telegram")) return "telegram";
//   return "other";
// };

// const getPlatformIcon = (platform: PlatformType): IconType => {
//   switch (platform) {
//     case "instagram": return FaInstagram;
//     case "facebook": return FaFacebookF;
//     case "twitter": return FaTwitter;
//     case "whatsapp": return FaWhatsapp;
//     case "telegram": return FaTelegram;
//     default: return FaGlobe;
//   }
// };

// const formatDate = (d: string) =>
//   new Date(d).toLocaleString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// const timeAgo = (dateString?: string) => {
//   if (!dateString) return "Just now";
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
//   if (diffInSeconds < 60) return "Just now";
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) return `${diffInHours}h ago`;
//   const diffInDays = Math.floor(diffInHours / 24);
//   if (diffInDays < 7) return `${diffInDays}d ago`;
//   return date.toLocaleDateString();
// };

// const renderBadge = (platform: PlatformType, size = 36) => {
//   const IconComp = getPlatformIcon(platform);
//   const brandHex = ICON_COLOR_MAP.get(IconComp);
//   const bg = brandHex ?? vibrantGradients[platform.length % vibrantGradients.length];
//   const C = IconComp as any;
//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//         borderRadius: 12,
//         display: "inline-flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: bg,
//         boxShadow: "0 10px 20px rgba(16,24,40,0.08)",
//       }}
//     >
//       <C size={Math.round(size * 0.6)} style={{ color: "#fff" }} />
//     </div>
//   );
// };

// const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
// type Tab = (typeof TABS)[number];

// const SELLER_REPORT_REASONS = [
//   "Scam or Fraud",
//   "Fake Payment Proof",
//   "Abusive Language",
//   "Not Following Instructions",
//   "Harassment",
//   "Other",
// ];

// const MyOrder: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<Tab>("All");
//   const [selected, setSelected] = useState<Order | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [buyerNames, setBuyerNames] = useState<Record<string, string>>({});

//   const loginUserData = useAuthHook();
//   const sellerId = loginUserData.data?.email || localStorage.getItem("userEmail");

//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
//   const [typedMessage, setTypedMessage] = useState("");
//   const [activeChatBuyerEmail, setActiveChatBuyerEmail] = useState<string | null>(null);
//   const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
//   const [activeChatProductTitle, setActiveChatProductTitle] = useState<string>("");
//   const [unreadState, setUnreadState] = useState<Record<string, boolean>>({});
//   const [presenceMap, setPresenceMap] = useState<Record<string, { online: boolean; lastSeen?: string | null }>>({});

//   const scrollRef = useRef<HTMLDivElement>(null);
//   const chatLengthRef = useRef(0);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const PURCHASE_API = "http://localhost:3200/purchase";
//   const CHAT_API = "http://localhost:3200/chat";
//   const USER_API = "http://localhost:3200/user";

//   const fetchPresence = async (email: string) => {
//     if (!email) return;
//     try {
//       const res = await axios.get<PresenceResponse>(`${CHAT_API}/status/${encodeURIComponent(email)}`);
//       const data = res.data;
//       setPresenceMap((p) => ({ ...p, [email]: { online: Boolean(data?.online), lastSeen: data?.lastSeen ?? null } }));
//     } catch (e) {
//       setPresenceMap((p) => ({ ...p, [email]: { online: false, lastSeen: null } }));
//     }
//   };

//   // Report states
//   const [isReportModalOpen, setIsReportModalOpen] = useState(false);
//   const [reportTargetOrder, setReportTargetOrder] = useState<Order | null>(null);
//   const [reportReason, setReportReason] = useState(SELLER_REPORT_REASONS[0]);
//   const [reportMessage, setReportMessage] = useState("");
//   const [isSubmittingReport, setIsSubmittingReport] = useState(false);

//   // Fetch Orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!sellerId) {
//         setIsLoading(false);
//         return;
//       }
//       try {
//         setIsLoading(true);
//         const res = await axios.get<ApiOrder[]>(`${PURCHASE_API}/getall`);
//         const allData = res.data;
//         const mySales = allData.filter((item) => item.sellerEmail === sellerId);
//         const mapped: Order[] = mySales.map((item) => ({
//           id: item._id,
//           platform: inferPlatform(item.productName),
//           title: item.productName,
//           desc: `Product ID: ${item.productId}`,
//           buyerEmail: item.buyerEmail,
//           price: item.price,
//           date: formatDate(item.purchaseDate),
//           status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as OrderStatus,
//           orderNumber: `ORD-${item._id.slice(-6).toUpperCase()}`,
//         }));
//         setOrders(mapped);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load orders");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchOrders();
//   }, [sellerId]);

//   // Fetch buyer names - FIXED TS ERROR HERE
//   useEffect(() => {
//     const fetchNames = async () => {
//       if (orders.length === 0) return;
//       const uniqueEmails = Array.from(new Set(orders.map((o) => o.buyerEmail)));
//       const emailsToFetch = uniqueEmails.filter((e) => !buyerNames[e]);
//       if (emailsToFetch.length === 0) return;

//       const newNames: Record<string, string> = {};
//       await Promise.all(
//         emailsToFetch.map(async (email) => {
//           try {
//             const res = await axios.get<ApiUser>(`${USER_API}/${email}`);
//             newNames[email] = res.data.name || email.split("@")[0];
//           } catch {
//             newNames[email] = email.split("@")[0];
//           }
//         })
//       );
//       setBuyerNames((prev) => ({ ...prev, ...newNames }));
//     };
//     fetchNames();
//   }, [orders]);

//   // Unread message check
//   useEffect(() => {
//     const checkUnread = async () => {
//       if (!sellerId || orders.length === 0) return;
//       const newUnread: Record<string, boolean> = { ...unreadState };
//       let changed = false;

//       for (const order of orders) {
//         if (isChatOpen && activeChatOrderId === order.id) continue;
//         try {
//           const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${order.buyerEmail}`, {
//             params: { orderId: order.id },
//           });
//           const msgs = res.data;
//           if (msgs.length > 0) {
//             const last = msgs[msgs.length - 1];
//             if (last.senderId.toLowerCase() !== sellerId.toLowerCase()) {
//               if (!newUnread[order.id]) {
//                 newUnread[order.id] = true;
//                 changed = true;
//               }
//             }
//           }
//         } catch {}
//       }
//       if (changed) setUnreadState(newUnread);
//     };

//     if (orders.length > 0) {
//       checkUnread();
//       const interval = setInterval(checkUnread, 10000);
//       const unique = Array.from(new Set(orders.map((o) => o.buyerEmail)));
//       unique.forEach((e) => fetchPresence(e));
//       const presInterval = setInterval(() => unique.forEach((e) => fetchPresence(e)), 60000);
//       return () => { clearInterval(interval); clearInterval(presInterval); };
//     }
//   }, [orders, sellerId, isChatOpen, activeChatOrderId]);

//   // Cancel order
//   const updateOrderStatus = async (orderId: string) => {
//     try {
//       setIsUpdating(true);
//       await axios.patch(`${PURCHASE_API}/update-status/${orderId}`, { status: "Cancelled" });
//       setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o)));
//       if (selected?.id === orderId) setSelected({ ...selected, status: "Cancelled" });
//       toast.success("Order cancelled");
//     } catch {
//       toast.error("Failed to cancel");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // Chat functions
//   const fetchChat = async (buyerEmail: string, orderId: string) => {
//     if (!sellerId) return;
//     try {
//       const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${buyerEmail}`, {
//         params: { orderId },
//       });
//       const newMsgs = res.data;
//       if (newMsgs.length > chatLengthRef.current && chatLengthRef.current > 0) {
//         const last = newMsgs[newMsgs.length - 1];
//         if (last.senderId.toLowerCase() !== sellerId.toLowerCase()) {
//           new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3").play().catch(() => {});
//         }
//       }
//       chatLengthRef.current = newMsgs.length;
//       setChatMessages(newMsgs);
//     } catch {}
//   };

//   useEffect(() => {
//     chatLengthRef.current = 0;
//   }, [isChatOpen]);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isChatOpen && activeChatBuyerEmail && activeChatOrderId) {
//       setUnreadState((prev) => ({ ...prev, [activeChatOrderId]: false }));
//       fetchChat(activeChatBuyerEmail, activeChatOrderId);
//       interval = setInterval(() => fetchChat(activeChatBuyerEmail, activeChatOrderId), 3000);
//     }
//     return () => clearInterval(interval);
//   }, [isChatOpen, activeChatBuyerEmail, activeChatOrderId]);

//   const sendChat = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!typedMessage.trim() || !activeChatBuyerEmail || !activeChatOrderId) return;
//     try {
//       await axios.post(`${CHAT_API}/send`, {
//         senderId: sellerId,
//         receiverId: activeChatBuyerEmail,
//         message: typedMessage,
//         orderId: activeChatOrderId,
//       });
//       setTypedMessage("");
//       fetchChat(activeChatBuyerEmail, activeChatOrderId);
//     } catch {
//       toast.error("Failed to send message");
//     }
//   };

//   const handleOpenChat = (order: Order) => {
//     setActiveChatBuyerEmail(order.buyerEmail);
//     setActiveChatOrderId(order.id);
//     setActiveChatProductTitle(order.title);
//     setIsChatOpen(true);
//   };

//   const getBuyerDisplayName = (email: string | null) => {
//     if (!email) return "Unknown";
//     return buyerNames[email] || email.split("@")[0];
//   };

//   // Report submit - same as buyer side
//   const handleReportSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!reportMessage.trim() || !reportTargetOrder || !sellerId) return;
//     setIsSubmittingReport(true);
//     try {
//       await axios.post(`${PURCHASE_API}/report/create`, {
//         orderId: reportTargetOrder.id,
//         reporterEmail: sellerId,
//         sellerEmail: sellerId,
//         buyerEmail: reportTargetOrder.buyerEmail,
//         reason: reportReason,
//         message: reportMessage,
//       });
//       toast.success("Report submitted successfully");
//       setIsReportModalOpen(false);
//       setReportMessage("");
//       setReportReason(SELLER_REPORT_REASONS[0]);
//       setReportTargetOrder(null);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to submit report");
//     } finally {
//       setIsSubmittingReport(false);
//     }
//   };

//   const filteredOrders = useMemo(() => {
//     if (activeTab === "All") return orders;
//     return orders.filter((o) => o.status === activeTab);
//   }, [activeTab, orders]);

//   const paginatedOrders = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredOrders.slice(start, start + itemsPerPage);
//   }, [filteredOrders, currentPage]);

//   return (
//     <>
//       <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20 px-4">
//         <div className="max-w-screen-xl mx-auto">
//           <h1 className="text-3xl font-bold text-[#0A1A3A] mb-6">My Sales</h1>

//           <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//             <div className="flex gap-6 p-4 border-b overflow-x-auto">
//               {TABS.map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`pb-2 text-sm font-bold transition ${
//                     activeTab === tab ? "text-[#d4a643] border-b-2 border-[#d4a643]" : "text-gray-500"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             <div className="p-6 space-y-4">
//               {isLoading ? (
//                 <p className="text-center py-10 text-gray-400">Loading...</p>
//               ) : filteredOrders.length === 0 ? (
//                 <div className="text-center py-20">
//                   <p className="text-gray-500 mb-4">No sales found</p>
//                   <Link to="/add-product" className="bg-[#33ac6f] text-white px-6 py-3 rounded-full">
//                     Add Product
//                   </Link>
//                 </div>
//               ) : (
//                 paginatedOrders.map((order) => (
//                   <div
//                     key={order.id}
//                     onClick={() => setSelected(order)}
//                     className="bg-[#F8FAFB] rounded-xl p-4 flex items-center gap-4 border hover:shadow-md cursor-pointer transition"
//                   >
//                     {renderBadge(order.platform)}
//                     <div className="flex-1">
//                       <h3 className="font-bold text-[#0A1A3A]">{order.title}</h3>
//                       <p className="text-sm text-gray-500 flex items-center gap-2">
//                         <span>Buyer: {getBuyerDisplayName(order.buyerEmail)}</span>
//                         <span className={`inline-block w-2 h-2 rounded-full ${presenceMap[order.buyerEmail]?.online ? 'bg-green-500' : 'bg-gray-300'}`} />
//                       </p>
//                       <span
//                         className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-bold ${
//                           order.status === "Pending"
//                             ? "bg-amber-100 text-amber-700"
//                             : order.status === "Completed"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {order.status}
//                       </span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold">${order.price.toFixed(2)}</p>
//                       <p className="text-xs text-gray-500">{order.date}</p>
//                      {!["Cancelled", "Refunded"].includes(order.status) && (

//                         <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
//                           <button onClick={() => setSelected(order)} className="p-2 border rounded hover:bg-gray-100">
//                             <FaEyeIcon size={14} />
//                           </button>
//                           <button onClick={() => handleOpenChat(order)} className="p-2 border rounded hover:bg-blue-100 text-blue-600 relative">
//                             <FaCommentsIcon size={14} />
//                             {unreadState[order.id] && (
//                               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
//                             )}
//                           </button>
//                           <button
//                             onClick={() => {
//                               setReportTargetOrder(order);
//                               setIsReportModalOpen(true);
//                             }}
//                             className="p-2 border border-red-200 rounded hover:bg-red-50 text-red-600"
//                           >
//                             <FaFlagIcon size={14} />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Details Modal */}
//       {selected && (
//         <>
//           <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelected(null)} />
//           <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 max-w-lg w-full bg-white rounded-t-3xl sm:rounded-3xl z-50 shadow-2xl">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold">{selected.title}</h2>
//                 <p className="text-sm text-gray-500">{selected.date}</p>
//               </div>
//               <button onClick={() => setSelected(null)}>
//                 <FaTimesIcon size={20} />
//               </button>
//             </div>
//             <div className="p-6 text-center">
//               {renderBadge(selected.platform, 80)}
//               <p className="text-3xl font-bold mt-4">${selected.price.toFixed(2)}</p>
//               <div className="mt-6 text-left space-y-3">
//                 <p><span className="text-gray-500">Status:</span> <strong>{selected.status}</strong></p>
//                 <p><span className="text-gray-500">Order No:</span> {selected.orderNumber}</p>
//                 <p><span className="text-gray-500">Buyer:</span> {getBuyerDisplayName(selected.buyerEmail)}</p>
//                 <p><span className="text-gray-500">Description:</span> {selected.desc}</p>
//               </div>
//            {selected.status !== "Cancelled" && (
//                 <div className="mt-8 grid grid-cols-2 gap-4">
//                   <button
//                     disabled={isUpdating}
//                     onClick={() => updateOrderStatus(selected.id)}
//                     className="py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
//                   >
//                     <FaBanIcon /> Cancel Order
//                   </button>
//                   <button
//                     onClick={() => {
//                       setReportTargetOrder(selected);
//                       setIsReportModalOpen(true);
//                     }}
//                     className="py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"
//                   >
//                     <FaFlagIcon /> Report Buyer
//                   </button>
//                 </div>
//               )}
//               <div className="mt-6 flex gap-3">
//                {selected.status !== "Cancelled" && (
//   <button
//     onClick={() => {
//       setSelected(null);
//       handleOpenChat(selected);
//     }}
//     className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//   >
//     <FaCommentsIcon /> Chat with Buyer
//   </button>
// )}

//                 <button onClick={() => setSelected(null)} className="flex-1 py-3 border rounded-lg">
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Chat Modal */}
//       {isChatOpen && activeChatBuyerEmail && (
//         <>
//           <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setIsChatOpen(false)} />
//           <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 max-w-md w-full bg-[#ECE5DD] rounded-t-3xl sm:rounded-2xl z-50 shadow-2xl flex flex-col h-[90vh] sm:h-[600px]">
//             <div className="bg-white p-4 flex justify-between items-center border-b">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
//                   {getBuyerDisplayName(activeChatBuyerEmail)[0]}
//                 </div>
//                 <div>
//                   <h3 className="font-bold">{getBuyerDisplayName(activeChatBuyerEmail)}</h3>
//                   <p className="text-xs text-gray-500">{activeChatProductTitle}</p>
//                   <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
//                     <span className={`w-2 h-2 rounded-full ${presenceMap[activeChatBuyerEmail || '']?.online ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     {presenceMap[activeChatBuyerEmail || '']?.online ? (
//                       <span className="text-green-600">Online</span>
//                     ) : (
//                       <span>Last: {timeAgo(presenceMap[activeChatBuyerEmail || '']?.lastSeen ?? undefined)}</span>
//                     )}
//                   </p>
//                 </div>
//               </div>
//               <button onClick={() => setIsChatOpen(false)}>
//                 <FaTimesIcon size={20} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {chatMessages.map((msg, i) => {
//                 const isMe = msg.senderId.toLowerCase() === sellerId?.toLowerCase();
//                 return (
//                   <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                     <div
//                       className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
//                         isMe ? "bg-[#33ac6f] text-white" : "bg-white shadow"
//                       }`}
//                     >
//                       {msg.message}
//                       <div className="text-xs opacity-70 mt-1 text-right">{timeAgo(msg.createdAt)}</div>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={scrollRef} />
//             </div>
//             <form onSubmit={sendChat} className="p-4 bg-white border-t flex gap-2">
//               <input
//                 value={typedMessage}
//                 onChange={(e) => setTypedMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm"
//               />
//               <button type="submit" className="bg-[#33ac6f] text-white p-3 rounded-full">
//                 <FaPaperPlaneIcon size={16} />
//               </button>
//             </form>
//           </div>
//         </>
//       )}

//       {/* Report Modal */}
//       {isReportModalOpen && reportTargetOrder && (
//         <>
//           <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setIsReportModalOpen(false)} />
//           <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl shadow-2xl z-50">
//             <div className="bg-red-600 text-white p-4 font-bold flex justify-between items-center">
//               <span className="flex items-center gap-2">
//                 <FaFlagIcon /> Report Buyer
//               </span>
//               <button onClick={() => setIsReportModalOpen(false)}>
//                 <FaTimesIcon />
//               </button>
//             </div>
//             <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
//               <select
//                 value={reportReason}
//                 onChange={(e) => setReportReason(e.target.value)}
//                 className="w-full border p-3 rounded-lg"
//               >
//                 {SELLER_REPORT_REASONS.map((r) => (
//                   <option key={r} value={r}>{r}</option>
//                 ))}
//               </select>
//               <textarea
//                 value={reportMessage}
//                 onChange={(e) => setReportMessage(e.target.value)}
//                 placeholder="Describe the issue..."
//                 required
//                 rows={5}
//                 className="w-full border p-3 rounded-lg resize-none"
//               />
//               <div className="flex gap-3">
//                 <button type="button" onClick={() => setIsReportModalOpen(false)} className="flex-1 py-3 border rounded-lg">
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmittingReport}
//                   className="flex-1 py-3 bg-red-600 text-white rounded-lg disabled:opacity-50"
//                 >
//                   {isSubmittingReport ? "Submitting..." : "Submit Report"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default MyOrder;