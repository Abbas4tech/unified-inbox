import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ThreadCardProps {
  thread: any;
  isSelected: boolean;
  onSelect: () => void;
}

export function ThreadCard({ thread, isSelected, onSelect }: ThreadCardProps) {
  const lastMessage = thread.messages;
  const initials =
    thread.contact.firstName +
    (thread.contact.lastName || thread.contact.firstName || "");

  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer p-4 transition hover:shadow ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }`}
    >
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback className="bg-blue-200 text-blue-900 font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-sm truncate">
              {thread.contact.firstName} {thread.contact.lastName || ""}
            </h3>
            <span className="text-xs text-gray-500 ml-2 shrink-0">
              {thread.lastMessageAt
                ? formatDistanceToNow(new Date(thread.lastMessageAt), {
                    addSuffix: true,
                  })
                : "No messages"}
            </span>
          </div>
          {lastMessage && (
            <p className="text-sm text-gray-600 truncate mt-1">
              {lastMessage.body}
            </p>
          )}
          <div className="flex gap-2 mt-2">
            <span className="text-xs text-gray-500 truncate">
              {thread.contact.phoneNumber || thread.contact.email}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
