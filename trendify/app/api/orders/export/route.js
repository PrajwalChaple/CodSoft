import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import User from "../../../../models/User";
import * as XLSX from "xlsx";

// GET — Download all orders as Excel
export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find({})
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    // Flatten orders for Excel
    const rows = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        rows.push({
          "Order ID": order._id.toString().slice(-8).toUpperCase(),
          "Order Date": new Date(order.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          "Customer Name": order.user?.name || "N/A",
          "Customer Email": order.user?.email || "N/A",
          "Customer Phone": order.shippingAddress?.phone || "N/A",
          "Shipping Address": `${order.shippingAddress?.address || ""}, ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}, ${order.shippingAddress?.country || ""}`,
          "Product Name": item.name,
          "Quantity": item.quantity,
          "Unit Price (₹)": item.price,
          "Item Total (₹)": item.price * item.quantity,
          "Color": item.color || "N/A",
          "Payment Method": order.paymentMethod?.toUpperCase() || "N/A",
          "Payment ID": order.paymentId || "N/A",
          "Is Paid": order.isPaid ? "Yes" : "No",
          "Subtotal (₹)": order.subtotal,
          "Shipping (₹)": order.shipping,
          "Discount (₹)": order.discount,
          "Order Total (₹)": order.total,
          "Order Status": order.status?.charAt(0).toUpperCase() + order.status?.slice(1),
        });
      });
    });

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Orders Detail Sheet
    const ws = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    ws["!cols"] = [
      { wch: 12 }, // Order ID
      { wch: 22 }, // Date
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 40 }, // Address
      { wch: 30 }, // Product
      { wch: 8 },  // Qty
      { wch: 14 }, // Unit Price
      { wch: 14 }, // Item Total
      { wch: 12 }, // Color
      { wch: 14 }, // Payment Method
      { wch: 25 }, // Payment ID
      { wch: 8 },  // Is Paid
      { wch: 14 }, // Subtotal
      { wch: 12 }, // Shipping
      { wch: 12 }, // Discount
      { wch: 14 }, // Total
      { wch: 14 }, // Status
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Summary Sheet
    const summaryData = [
      { Metric: "Total Orders", Value: orders.length },
      { Metric: "Total Revenue (₹)", Value: orders.reduce((sum, o) => sum + o.total, 0) },
      { Metric: "Paid Orders", Value: orders.filter((o) => o.isPaid).length },
      { Metric: "COD Orders", Value: orders.filter((o) => o.paymentMethod === "cod").length },
      { Metric: "Online Payments", Value: orders.filter((o) => o.isPaid && o.paymentMethod !== "cod").length },
      { Metric: "Processing", Value: orders.filter((o) => o.status === "processing").length },
      { Metric: "Shipped", Value: orders.filter((o) => o.status === "shipped").length },
      { Metric: "Delivered", Value: orders.filter((o) => o.status === "delivered").length },
      { Metric: "Cancelled", Value: orders.filter((o) => o.status === "cancelled").length },
      { Metric: "Report Generated", Value: new Date().toLocaleString("en-IN") },
    ];
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    summaryWs["!cols"] = [{ wch: 20 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const filename = `Trendify_Orders_${new Date().toISOString().split("T")[0]}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json({ error: "Failed to export orders" }, { status: 500 });
  }
}
