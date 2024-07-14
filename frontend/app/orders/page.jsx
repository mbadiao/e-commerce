"use client";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ORDERS_URL } from "../config";

function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      console.log(token)
      try {
        const response = await fetch(ORDERS_URL, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (selectedStatus === "all") return true;
        return order.status.toLowerCase() === selectedStatus.toLowerCase();
      })
      .filter((order) => {
        return (
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.totalAmount.toString().includes(searchTerm.toLowerCase())
        );
      });
  }, [orders, selectedStatus, searchTerm]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <div className="flex items-center gap-4">
          <Input
            type="search"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background text-foreground border-muted rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Filter by status</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => setSelectedStatus("all")}
                className={selectedStatus === "all" ? "bg-accent text-accent-foreground" : ""}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setSelectedStatus("delivered")}
                className={selectedStatus === "delivered" ? "bg-accent text-accent-foreground" : ""}
              >
                Delivered
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setSelectedStatus("shipped")}
                className={selectedStatus === "shipped" ? "bg-accent text-accent-foreground" : ""}
              >
                Shipped
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setSelectedStatus("pending")}
                className={selectedStatus === "pending" ? "bg-accent text-accent-foreground" : ""}
              >
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order._id}>
              <CardHeader>
                <CardTitle>Order #{order._id}</CardTitle>
                <CardDescription>{new Date(order.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">XOF{order.totalAmount.toFixed(2)}</span>
                  <Badge
                    variant={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Shipped"
                        ? "info"
                        : "warning"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>Your order list is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Orders;

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
