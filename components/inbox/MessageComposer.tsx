"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface MessageComposerProps {
  threadId: string;
}

export function MessageComposer({ threadId }: MessageComposerProps) {
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId,
          body,
          channel: "SMS",
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["messages", threadId] });
    },
  });

  const handleSend = async () => {
    if (!body.trim()) return;
    sendMutation.mutate();
  };

  return (
    <div className="border-t p-4 space-y-2 bg-white">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            handleSend();
          }
        }}
        rows={3}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSend}
          disabled={sendMutation.isPending || !body.trim()}
          className="gap-2"
        >
          {sendMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <Send className="h-4 w-4" />
          Send
        </Button>
      </div>
    </div>
  );
}
