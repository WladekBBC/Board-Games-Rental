import { useOrders } from "@/contexts/OrdersContext";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGames } from "@/contexts/GamesContext";
import { IOrder } from "@/interfaces/order";
import { IGame } from "@/interfaces/game";
import { Status } from "@/interfaces/statuses";
import { useState } from "react";
import { IUser } from "@/interfaces/user";

type OrderFormType = {
  handleError: (message: string) => any;
  handleSuccess: (message: string) => any;
  gameId: number;
};

export const OrderForm = ({
  handleError,
  handleSuccess,
  gameId,
}: OrderFormType) => {
  const { addOrder } = useOrders();
  const { games } = useGames();
  const { language } = useLang();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const game = games.find((g) => g.id === gameId);

  /**
   * Handle adding a new order/reservation
   * @param {React.FormEvent<HTMLFormElement>} e - Form event
   */
  const handleAddOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!user) {
      handleError(/*language.userNotLoggedIn || */ "User not logged in");
      setIsProcessing(false);
      return;
    }

    if (!game) {
      handleError(language.gameNotFound);
      setIsProcessing(false);
      return;
    }

    if (game.quantity < 1) {
      handleError(language.gameUnavailable || "Game is not available");
      setIsProcessing(false);
      return;
    }

    const orderData: Partial<IOrder> = {
      user: user as IUser,
      game: game,
      status: Status.W, // Assuming P = Pending
      createdAt: new Date(Date.now()),
    };

    try {
      await addOrder(orderData);
      handleSuccess(/*language.gameReserved ||*/ "Game reserved successfully!");
    } catch (err: any) {
      const errorMessage =
        err.cause === 406
          ? /*language.reserveGameError ||*/ "Failed to reserve game"
          : language.serverError || "Server error occurred";
      handleError(errorMessage);
    }

    setIsProcessing(false);
  };

  if (!game) {
    return (
      <div className="p-4 text-center text-red-600 dark:text-red-400">
        {language.gameNotFound || "Game not found"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Game confirmation display */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {/*language.confirmReservation ||*/ "Confirm Reservation"}
        </h4>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>{language.gameTitle || "Game"}:</strong> {game.title}
          </p>
          {game.category && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>{/*language.category || */ "Category"}:</strong>{" "}
              {game.category}
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>{language.available || "Available"}:</strong>{" "}
            {game.quantity} / {game.amount}
          </p>
          {user && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>{/*language.reservingFor || */ "Reserving for"}:</strong>{" "}
              {user.email}
            </p>
          )}
        </div>
      </div>

      {/* Confirmation message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {
            /*language.reservationConfirmText || */
            "Are you sure you want to reserve this game? "
          }
        </p>
      </div>

      <form onSubmit={handleAddOrder} className="space-y-4">
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => handleSuccess("")}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {language.cancel || "Cancel"}
          </button>

          <button
            type="submit"
            disabled={isProcessing || !user || game.quantity < 1}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing
              ? /*language.processing || */ "Processing..."
              : /*language.confirmReservation || */ "Confirm Reservation"}
          </button>
        </div>
      </form>
    </div>
  );
};
