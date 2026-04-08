"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type Status = "Active" | "Inactive" | "Pending";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: Status;
  joined: string;
};

const mockUsers: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", joined: "2024-01-12" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", status: "Inactive", joined: "2024-02-08" },
  { id: 3, name: "Carol White", email: "carol@example.com", role: "Editor", status: "Active", joined: "2024-03-15" },
  { id: 4, name: "David Brown", email: "david@example.com", role: "User", status: "Pending", joined: "2024-04-01" },
  { id: 5, name: "Eva Green", email: "eva@example.com", role: "Admin", status: "Active", joined: "2024-04-20" },
  { id: 6, name: "Frank Lee", email: "frank@example.com", role: "User", status: "Inactive", joined: "2024-05-03" },
  { id: 7, name: "Grace Kim", email: "grace@example.com", role: "Editor", status: "Active", joined: "2024-05-18" },
  { id: 8, name: "Henry Park", email: "henry@example.com", role: "User", status: "Pending", joined: "2024-06-02" },
];

const statusStyles: Record<Status, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
  Pending: "bg-yellow-100 text-yellow-700",
};

const PAGE_SIZE = 5;

type SortKey = keyof User;
type SortDir = "asc" | "desc";

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = mockUsers
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? (
        <ChevronUp className="h-3 w-3 inline ml-1" />
      ) : (
        <ChevronDown className="h-3 w-3 inline ml-1" />
      )
    ) : (
      <ChevronUp className="h-3 w-3 inline ml-1 opacity-20" />
    );

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="font-semibold text-base">Users</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filtered.length} total records
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search name, email, role..."
              className="pl-9 h-9 text-sm focus-visible:ring-0"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                {[
                  { label: "#", key: "id" },
                  { label: "Name", key: "name" },
                  { label: "Email", key: "email" },
                  { label: "Role", key: "role" },
                  { label: "Status", key: "status" },
                  { label: "Joined", key: "joined" },
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left font-medium cursor-pointer select-none whitespace-nowrap"
                    onClick={() => handleSort(key as SortKey)}
                  >
                    {label}
                    <SortIcon col={key as SortKey} />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No results found.
                  </td>
                </tr>
              ) : (
                paginated.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{u.id}</td>
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">{u.role}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${statusStyles[u.status]}`}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <p>
            Page {page} of {totalPages || 1}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}