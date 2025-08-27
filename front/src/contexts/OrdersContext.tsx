import { Method, request } from "@/interfaces/api";
import { IOrder } from "@/interfaces/order";
import { Status } from "@/interfaces/statuses";
import { ReactNode, useState } from "react";

export function OrdersContext({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<IOrder[]>([]);

  const addOrder = async (order: Partial<IOrder>) => {
    return request<IOrder>(
      "order/add",
      Method.POST,
      JSON.stringify(order)
    ).then((newOrder) => {
      setOrders([...orders, newOrder]);
    });
  };

  const acceptOrder = async (id: number) => {
    return request<IOrder>("order/accept" + id, Method.PATCH).then(() => {
      setOrders(
        orders.map<IOrder>((order) => {
          if (order.id == id) order.status = Status.A;
          return order;
        })
      );
    });
  };

  const cencelOrder = async (id: number) => {
    return request<IOrder>("order/accept" + id, Method.PATCH).then(() => {
      setOrders(
        orders.map<IOrder>((order) => {
          if (order.id == id) order.status = Status.C;
          return order;
        })
      );
    });
  };
}
