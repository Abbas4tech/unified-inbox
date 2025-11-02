import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="border-b bg-white px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
      <Separator className="mt-4" />
    </header>
  );
}
