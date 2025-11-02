"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageComposer } from "./MessageComposer";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface MessagePanelProps {
  threadId: string;
}

export function MessagePanel({ threadId }: MessagePanelProps) {
  const { data: result, isLoading } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: async () => {
      const res = await fetch(`/api/messages?threadId=${threadId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });

  const messages = result?.messages || [];

  return (
    <div className="flex flex-col h-full border rounded-lg bg-white">
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No messages yet</p>
          ) : (
            messages.map((message: any) => (
              <div
                key={message.id}
                className={`flex ${
                  message.direction === "OUTBOUND"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    message.direction === "OUTBOUND"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.body}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.direction === "OUTBOUND"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {format(new Date(message.createdAt), "HH:mm")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <MessageComposer threadId={threadId} />
    </div>
  );
}
