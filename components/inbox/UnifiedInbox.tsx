"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ThreadCard } from "./ThreadCard";
import { MessagePanel } from "./MessagePanel";

export function UnifiedInbox() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["threads", filterStatus],
    queryFn: async () => {
      const url = new URL("/api/threads", window.location.origin);
      if (filterStatus) url.searchParams.set("status", filterStatus);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch threads");
      return res.json();
    },
  });

  const filteredThreads = threads.filter(
    (thread: any) =>
      thread.contact.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      thread.contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.contact.phoneNumber?.includes(searchTerm)
  );

  return (
    <div className="flex h-full gap-4 p-4">
      {/* Left Panel: Threads List */}
      <div className="w-96 flex flex-col gap-4 border-r pr-4">
        <div className="space-y-3">
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            {["OPEN", "WAITING", "CLOSED"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setFilterStatus(filterStatus === status ? null : status)
                }
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredThreads.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No threads found</p>
          ) : (
            filteredThreads.map((thread: any) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                isSelected={selectedThreadId === thread.id}
                onSelect={() => setSelectedThreadId(thread.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Message View */}
      <div className="flex-1">
        {selectedThreadId ? (
          <MessagePanel threadId={selectedThreadId} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>👈 Select a conversation to start</p>
          </div>
        )}
      </div>
    </div>
  );
}
