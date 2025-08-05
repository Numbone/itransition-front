import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { userApi } from "@/shared/api/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"
import { ShieldBan, ShieldCheck, Trash2 } from "lucide-react"

const DashboardPage = () => {
  const { data: users, isLoading, isError, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await userApi.getUsers()
      return res
    }
  })

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"name" | "email" | "last_login" | "status">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const queryClient = useQueryClient()
  const userList = users?.responseObject || []

  const allSelected =
    userList.length > 0 &&
    userList.every((u) => selectedUserIds.includes(String(u.id)))

  const handleSelectAll = () => {
    setSelectedUserIds(allSelected ? [] : userList.map((u) => String(u.id)))
  }

  const toggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    )
  }

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const renderArrow = (field: typeof sortBy) => {
    if (sortBy !== field) return ""
    return sortOrder === "asc" ? "↑" : "↓"
  }

  const sortedUsers = [...userList].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]

    if (aVal == null) return 1
    if (bVal == null) return -1

    if (sortBy === "last_login") {
      const aDate = new Date(aVal)
      const bDate = new Date(bVal)
      return sortOrder === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime()
    }

    return sortOrder === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal))
  })

  const deleteUsersMutation = useMutation({
    mutationFn: async (ids: number[]) => await userApi.deleteUsers(ids),
    onSuccess: () => {
      toast.success("Users deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setSelectedUserIds([])
    },
    onError: () => toast.error("Error deleting users"),
  })

  const blockUsersMutation = useMutation({
    mutationFn: async (ids: number[]) => await userApi.updateUsersBlock(ids),
    onSuccess: () => {
      toast.success("Users blocked")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setSelectedUserIds([])
    },
    onError: () => toast.error("Error blocking users"),
  })

  const unblockUsersMutation = useMutation({
    mutationFn: async (ids: number[]) => await userApi.updateUsersUnblock(ids),
    onSuccess: () => {
      toast.success("Users unblocked")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setSelectedUserIds([])
    },
    onError: () => toast.error("Error unblocking users"),
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded bg-gray-200" />
        ))}
      </div>
    )
  }

  if (isError || !users) {
    return <div className="p-6 text-red-500">Error loading users.</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-1">
          User Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage, sort, block or unblock your users below.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 mb-6 border">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Selected: {selectedUserIds.length}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => deleteUsersMutation.mutate(selectedUserIds.map(Number))}
              disabled={selectedUserIds.length === 0}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={() => blockUsersMutation.mutate(selectedUserIds.map(Number))}
              disabled={selectedUserIds.length === 0}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 transition disabled:opacity-50"
            >
              <ShieldBan className="w-4 h-4" />
              Block
            </button>
            <button
              onClick={() => unblockUsersMutation.mutate(selectedUserIds.map(Number))}
              disabled={selectedUserIds.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              Unblock
            </button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[50px]">
                <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("name")}
              >
                Name {renderArrow("name")}
              </TableHead>
              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("email")}
              >
                Email {renderArrow("email")}
              </TableHead>
              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("last_login")}
              >
                Last Active {renderArrow("last_login")}
              </TableHead>
              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("status")}
              >
                Status {renderArrow("status")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="py-4 text-center text-gray-500">Refreshing data...</div>
                </TableCell>
              </TableRow>
            )}
            {sortedUsers.map((user, index) => (
              <TableRow
                key={user.id}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedUserIds.includes(String(user.id))}
                    onCheckedChange={() => toggleUser(String(user.id))}
                  />
                </TableCell>
                <TableCell className="text-center">{user.name}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">
                  {user.last_login
                    ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true })
                    : "—"}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "active" ? "Active" : "Blocked"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DashboardPage
