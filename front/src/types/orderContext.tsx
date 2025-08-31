import { IOrder } from "@/interfaces/order";

/**
 * Orders context type
 * @param {IOrder[]} orders - Orders
 * @param {function} addOrder - Add order
 * @param {function} acceptOrder - Accept order
 * @param {function} cancelOrder - Cancel order // Poprawiona literówka
 */
export type OrdersContextType = {
  orders: IOrder[];
  addOrder: (order: Partial<IOrder>) => Promise<void>;
  acceptOrder: (id: number) => Promise<void>;
  cancelOrder: (id: number) => Promise<void>; // Poprawiona literówka
  fetchOrders: () => Promise<void>;
};
