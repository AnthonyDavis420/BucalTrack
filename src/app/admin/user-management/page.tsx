"use client";

import { useState } from "react";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Edit, Trash2 } from "lucide-react";

type StaffAccount = {
  id: number;
  name: string;
  position: string;
  email: string;
  accessCode: string;
  status: "Active" | "Inactive";
};

const btnNavy =
  "bg-[#071689] text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-[#071689]";
const btnOutline =
  "border border-[#071689] text-[#071689] bg-white hover:bg-[#f0f2ff] focus:ring-2 focus:ring-offset-2 focus:ring-[#071689]";

/** Generate an access code (default 8 chars, no ambiguous characters) */
function generateAccessCode(len = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const arr = new Uint32Array(len);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (v) => chars[v % chars.length]).join("");
  }
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState<StaffAccount[]>([
    {
      id: 1,
      name: "Juan Dela Cruz",
      position: "Coach",
      email: "staff1@example.com",
      accessCode: "ABC123",
      status: "Active",
    },
    {
      id: 2,
      name: "Maria Santos",
      position: "Assistant",
      email: "staff2@example.com",
      accessCode: "XYZ789",
      status: "Inactive",
    },
  ]);

  const [newName, setNewName] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCode, setNewCode] = useState("");

  const [editing, setEditing] = useState<StaffAccount | null>(null);

  const handleAddAccount = () => {
    if (!newName || !newPosition || !newEmail || !newCode) return;
    setAccounts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newName,
        position: newPosition,
        email: newEmail,
        accessCode: newCode,
        status: "Active",
      },
    ]);
    setNewName("");
    setNewPosition("");
    setNewEmail("");
    setNewCode("");
  };

  const handleDelete = (id: number) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    setAccounts((prev) => prev.map((acc) => (acc.id === editing.id ? editing : acc)));
    setEditing(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="pt-8">
        <h1 className="text-3xl font-semibold text-gray-900">Account Management</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage staff accounts, including names, positions, access codes, and emails.
        </p>
      </header>

      {/* Add Form */}
      <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Add Staff Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Staff Name"
          />
          <Input
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value)}
            placeholder="Position"
          />
          <Input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Staff Email"
            type="email"
          />
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-2">
            <div className="flex gap-2">
              <Input
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Access Code"
                className="flex-1"
              />
              <Button
                onClick={() => setNewCode(generateAccessCode())}
                variant="secondary"
                className="!border-2 !border-[#071689] !text-[#071689] !bg-white hover:!bg-[#071689] hover:!text-white whitespace-nowrap"
              >
                Generate
              </Button>
            </div>
          </div>

          <Button
            onClick={handleAddAccount}
            className={`w-full ${btnNavy} col-span-1 sm:col-span-2 lg:col-span-1`}
          >
            Add Account
          </Button>
        </div>
      </section>

      {/* Accounts Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Position</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Access Code</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {accounts.map((acc) => (
              <tr key={acc.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{acc.name}</td>
                <td className="px-6 py-4 text-gray-600">{acc.position}</td>
                <td className="px-6 py-4 text-gray-600">{acc.email}</td>
                <td className="px-6 py-4 text-gray-600">{acc.accessCode}</td>
                <td className="px-6 py-4 text-gray-600">
                  <Badge
                    className={
                      acc.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {acc.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditing(acc)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title="Edit account"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                      title="Delete account"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {accounts.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No staff accounts yet.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Staff Account
            </h3>

            <div className="space-y-4">
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="Staff Name"
              />
              <Input
                value={editing.position}
                onChange={(e) =>
                  setEditing({ ...editing, position: e.target.value })
                }
                placeholder="Position"
              />
              <Input
                value={editing.email}
                onChange={(e) =>
                  setEditing({ ...editing, email: e.target.value })
                }
                placeholder="Staff Email"
                type="email"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Access Code
                </label>
                <div className="flex gap-2">
                  <Input
                    value={editing.accessCode}
                    onChange={(e) =>
                      setEditing({ ...editing, accessCode: e.target.value })
                    }
                    placeholder="Access Code"
                    className="flex-1"
                  />
                  <Button
                    onClick={() =>
                      setEditing((prev) =>
                        prev ? { ...prev, accessCode: generateAccessCode() } : prev
                      )
                    }
                    variant="secondary"
                    className="!border-2 !border-[#071689] !text-[#071689] !bg-white hover:!bg-[#071689] hover:!text-white whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as "Active" | "Inactive",
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#071689] focus:border-[#071689]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={() => setEditing(null)}
                variant="secondary"
                className="!bg-white !border !border-gray-300 !text-gray-700 hover:!bg-gray-50"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} variant="primary">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
