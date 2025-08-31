"use client";
import { Spinner } from "@/components/Messages/Spinner";
import { useLang } from "@/contexts/LanguageContext";
import { SearchBar } from "@/components/Helpers/SearchBar";
import ErrorField from "@/components/Messages/ErrorField";
import SuccessField from "@/components/Messages/SuccessField";
import { useOrders } from "@/contexts/OrdersContext";
import { IOrder } from "@/interfaces/order";
import React, { useEffect } from "react";

export default function UsersPage() {
  const { language } = useLang();
  const { orders, acceptOrder, addOrder, cancelOrder, fetchOrders } =
    useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {language.reservation}
      </h1>
      {/* {error && <ErrorField error={`${error}`} />}
      {success && <SuccessField success={`${success}`} />} */}

      {
        <>
          {/* <SearchBar
            options={[
              { value: "email", label: language.searchByEmail },
              { value: "permissions", label: language.searchByPerm },
            ]}
            value={searchQuery}
            onValueChange={setSearchQuery}
            selected={searchType}
            onSelectChange={(val) =>
              setSearchType(val as "email" | "permissions")
            }
            placeholder={
              searchType === "email"
                ? language.searchByEmail
                : language.searchByPerm
            }
            className="mb-4"
          /> */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                    ID {language.order}
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                    {language.email}
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                    {language.status}
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                    {language.actions}
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => {
                  return (
                    <tr key={order.id}>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                        {order.id}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                        {order.user.email}{" "}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                        {order.status}{" "}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                        <button
                          onClick={() => acceptOrder(order.id)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >
                          {language.accept}
                        </button>
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        >
                          {language.cancel}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      }
    </div>
  );
}
