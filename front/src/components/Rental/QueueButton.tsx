"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useRentals } from "@/contexts/RentalsContext";

type QueueButtonProps = {
  gameId: number;
  quantity: number;
  onQueueJoin?: () => void;
  onQueueLeave?: () => void;
  onAutoRent?: () => void;
};

export const QueueButton = ({
  gameId,
  quantity,
  onQueueJoin,
  onQueueLeave,
  onAutoRent,
}: QueueButtonProps) => {
  const { JWT, user } = useAuth();
  const { language } = useLang();
  const { queueAction, onQueueJoined, onQueueUpdated, onAutoRented } =
    useRentals();
  const [inQueue, setInQueue] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showMessage = useCallback((text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  // Check queue status on mount
  useEffect(() => {
    if (!JWT || !user) return;

    queueAction("getQueueStatus", { gameId }, (res: any) => {
      if (res?.inQueue) {
        setInQueue(true);
        setPosition(res.position ?? null);
      }
    });
  }, [JWT, user, gameId, queueAction]);

  // Listen for queue events from the shared socket
  useEffect(() => {
    if (!JWT) return;

    const unsubscribeJoin = onQueueJoined(
      gameId,
      (data: { position: number }) => {
        setInQueue(true);
        setPosition(data.position);
      },
    );

    const unsubscribeUpdate = onQueueUpdated(
      gameId,
      (data: { position: number }) => {
        setPosition(data.position);
      },
    );

    const unsubscribeAutoRent = onAutoRented(gameId, () => {
      setInQueue(false);
      setPosition(null);
      showMessage(language.autoRented, "success");
      onAutoRent?.();
    });

    return () => {
      unsubscribeJoin();
      unsubscribeUpdate();
      unsubscribeAutoRent();
    };
  }, [JWT, gameId, queueAction, language.autoRented, onAutoRent, showMessage]);

  const handleJoinQueue = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    queueAction(
      "joinQueue",
      { gameId },
      (res: any) => {
        setIsProcessing(false);
        if (res?.status === 200) {
          setInQueue(true);
          setPosition(res.position ?? null);
          showMessage(language.queueJoined, "success");
          onQueueJoin?.();
        } else {
          showMessage(res?.message ?? language.queueError, "error");
        }
      },
      () => {
        setIsProcessing(false);
        showMessage(language.queueError, "error");
      },
    );
  };

  const handleLeaveQueue = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    queueAction(
      "leaveQueue",
      { gameId },
      (res: any) => {
        setIsProcessing(false);
        if (res?.status === 200) {
          setInQueue(false);
          setPosition(null);
          showMessage(language.queueLeft, "success");
          onQueueLeave?.();
        } else {
          showMessage(res?.message ?? language.queueError, "error");
        }
      },
      () => {
        setIsProcessing(false);
        showMessage(language.queueError, "error");
      },
    );
  };

  // Don't show queue button if game is available
  if (quantity > 0) return null;

  return (
    <div className="space-y-2">
      {message && (
        <div
          className={`text-sm ${message.type === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
        >
          {message.text}
        </div>
      )}

      {!inQueue ? (
        <button
          onClick={handleJoinQueue}
          disabled={isProcessing}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {isProcessing ? language.gameAdding : language.joinQueue}
        </button>
      ) : (
        <div className="space-y-2">
          <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                {language.inQueue}
              </span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {language.position}: {position}
              </span>
            </div>
          </div>

          <button
            onClick={handleLeaveQueue}
            disabled={isProcessing}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {isProcessing ? language.gameAdding : language.leaveQueue}
          </button>
        </div>
      )}
    </div>
  );
};
