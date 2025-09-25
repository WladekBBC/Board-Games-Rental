"use client";
import { Spinner } from "@/components/Messages/Spinner";
import { useLang } from "@/contexts/LanguageContext";
import { SearchBar } from "@/components/Helpers/SearchBar";
import ErrorField from "@/components/Messages/ErrorField";
import SuccessField from "@/components/Messages/SuccessField";
import { useOrders } from "@/contexts/OrdersContext";
import { IOrder } from "@/interfaces/order";
import React, { useEffect, useState } from "react";
import { Status } from "@/interfaces/statuses";

/**
 * A page component that displays and manages user orders.
 * It allows accepting or cancelling orders and shows their status.
 * @returns A page that displays and manages user orders.
 */
export default function OrdersPage() {
  const { language } = useLang();
  const { orders, acceptOrder, cancelOrder, fetchOrders } = useOrders();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [processingOrderId, setProcessingOrderId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleAcceptOrder = async (orderId: number) => {
    setProcessingOrderId(orderId);
    setError(undefined);
    setSuccess(undefined);

    try {
      await acceptOrder(orderId);
      setSuccess("Order accepted and rental created successfully!");
      setTimeout(() => setSuccess(undefined), 5000);
    } catch (err: any) {
      console.error("Failed to accept order:", err);
      setError("Failed to accept order and create rental");
      setTimeout(() => setError(undefined), 5000);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    setProcessingOrderId(orderId);
    setError(undefined);
    setSuccess(undefined);

    try {
      await cancelOrder(orderId);
      setSuccess("Order cancelled successfully!");
      setTimeout(() => setSuccess(undefined), 5000);
    } catch (err: any) {
      console.error("Failed to cancel order:", err);
      setError("Failed to cancel order");
      setTimeout(() => setError(undefined), 5000);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const getStatusDisplay = (status: Status) => {
    switch (status) {
      case Status.W:
        return "Waiting";
      case Status.A:
        return "Accepted";
      case Status.C:
        return "Cancelled";
      case Status.E:
        return "Expired";
      default:
        return status;
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.W:
        return "text-blue-600 dark:text-blue-400";
      case Status.A:
        return "text-green-600 dark:text-green-400";
      case Status.C:
        return "text-red-600 dark:text-red-400";
      case Status.E:
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {language.reservation || "Reservations"}
      </h1>

      {error && <ErrorField error={`${error}`} />}
      {success && <SuccessField success={`${success}`} />}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ID {language.order || "Order"}
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language.email || "Email"}
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language.gameTitle || "Game"}
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language.status || "Status"}
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language.orderDate || "Created"}
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language.actions || "Actions"}
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => {
              const isProcessing = processingOrderId === order.id;
              const canAccept = order.status === Status.W;
              const canCancel = order.status === Status.W;

              return (
                <tr key={order.id}>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    {order.id}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    {order.user.email}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    {order.game.title}
                  </td>
                  <td
                    className={`px-2 py-2 whitespace-nowrap text-sm text-center font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusDisplay(order.status)}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        disabled={!canAccept || isProcessing}
                        onClick={() => handleAcceptOrder(order.id)}
                        className={`font-bold py-1 px-2 rounded text-xs ${
                          canAccept && !isProcessing
                            ? "bg-green-500 hover:bg-green-700 text-white"
                            : "bg-green-900 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {isProcessing ? language.loading : language.accept}
                      </button>
                      <button
                        disabled={!canCancel || isProcessing}
                        onClick={() => handleCancelOrder(order.id)}
                        className={`font-bold py-1 px-2 rounded text-xs ${
                          canCancel && !isProcessing
                            ? "bg-red-500 hover:bg-red-700 text-white"
                            : "bg-red-900 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {language.cancel || "Cancel"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {/*language.noOrdersFound ||*/ "No orders found"}
          </div>
        )}
      </div>
    </div>
  );
}
