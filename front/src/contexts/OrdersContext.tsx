import { Method, request, stream } from "@/interfaces/api";
import { IOrder } from "@/interfaces/order";
import { Status } from "@/interfaces/statuses";
import { OrdersContextType } from "@/types/orderContext";
import { Rent } from "@/types/rentalContext";
import {
  ReactNode,
  useContext,
  useState,
  createContext,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { useRentals } from "./RentalsContext";
import { useGames } from "./GamesContext";

/**
 * Orders context type
 * @interface OrdersContextType
 */
const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

/**
 * Orders context provider
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Component children
 * @returns {JSX.Element} Orders context provider
 */
export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { JWT } = useAuth();
  const { addRental } = useRentals();
  const { games, changeQuantity } = useGames();

  useEffect(() => {
    setLoading(true);
    const getOrders = () => {
      if (JWT) stream("orders/stream-order", setOrders);
    };
    getOrders();
    setLoading(false);
  }, [JWT]);

  const fetchOrders = async () => {
    return request<IOrder[]>("order/orders", Method.GET)
      .then((data: IOrder[]) => {
        setOrders(data);
      })
      .catch((err: Error) => {
        console.error("Failed to fetch orders:", err);
        throw err;
      });
  };

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
    return request<IOrder>("order/accept/" + id, Method.PATCH).then(
      async () => {
        const order = orders.find((o) => o.id === id);

        if (order) {
          try {
            const rentalData: Rent = {
              index: order.user.email,
              game: order.game,
              rentedAt: new Date(Date.now()),
            };

            await addRental(rentalData);

            const currentGame = games.find((g) => g.id === order.game.id);
            if (currentGame) {
              await changeQuantity(order.game.id, currentGame.quantity - 1);
            }
          } catch (rentalError) {
            console.error("Failed to create rental:", rentalError);
            throw rentalError;
          }
        }

        setOrders(
          orders.map<IOrder>((order) => {
            if (order.id == id) order.status = Status.A;
            return order;
          })
        );
      }
    );
  };

  const cancelOrder = async (id: number) => {
    return request<IOrder>("order/cancel/" + id, Method.PATCH).then(() => {
      setOrders(
        orders.map<IOrder>((order) => {
          if (order.id == id) order.status = Status.C;
          return order;
        })
      );
    });
  };

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, acceptOrder, cancelOrder, fetchOrders }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within a OrdersProvider");
  }
  return context;
}
