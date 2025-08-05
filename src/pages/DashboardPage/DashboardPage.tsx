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
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query"
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

  const userList = users?.responseObject || []
  const allSelected =
    userList.length > 0 &&
    userList.every((u) => selectedUserIds.includes(String(u.id)))

  const queryClient = useQueryClient()

  const deleteUsersMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      return await userApi.deleteUsers(ids)
    },
    onSuccess: () => {
      toast.success("Users deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setSelectedUserIds([])
    },
    onError: () => {
      toast.error("Error deleting users")
    }
  })

  const blockUsersMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      return await userApi.updateUsersBlock(ids)
    },
    onSuccess: () => {
      toast.success("Users blocked successfully")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setSelectedUserIds([])
    },
    onError: () => {
      toast.error("Error blocking users")
    }
  })

  const unblockUsersMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      return await userApi.updateUsersUnblock(ids)
    },
    onSuccess: () => {
      toast.success("Users unblocked successfully")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setSelectedUserIds([])
    },
    onError: () => {
      toast.error("Error unblocking users")
    }
  })

  const handleDeleteSelected = () => {
    deleteUsersMutation.mutate(selectedUserIds.map(Number))
  }

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(userList.map((u) => String(u.id)))
    }
  }

  const toggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    )
  }

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
          Manage users, block or unblock them as needed.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Selected: {selectedUserIds.length}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDeleteSelected}
              disabled={selectedUserIds.length === 0 || deleteUsersMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleteUsersMutation.isPending ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => blockUsersMutation.mutate(selectedUserIds.map(Number))}
              disabled={selectedUserIds.length === 0 || blockUsersMutation.isPending}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 transition disabled:opacity-50"
            >
              <ShieldBan className="w-4 h-4" />
              {blockUsersMutation.isPending ? "Blocking..." : "Block"}
            </button>
            <button
              onClick={() => unblockUsersMutation.mutate(selectedUserIds.map(Number))}
              disabled={selectedUserIds.length === 0 || unblockUsersMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {unblockUsersMutation.isPending ? "Unblocking..." : "Unblock"}
            </button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[50px]">
                <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Last Active</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex justify-center items-center py-4 text-gray-500">
                    Updating...
                  </div>
                </TableCell>
              </TableRow>
            )}
            {userList.length === 0 && !isFetching ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex justify-center items-center min-h-[200px] text-gray-500">
                    No users found.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              userList.map((user, i) => (
                <TableRow
                  key={user.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : ""} ${
                    user.status === "blocked" ? "bg-red-50" : ""
                  }`}
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
                      ? formatDistanceToNow(new Date(user.last_login), {
                          addSuffix: true,
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? "Active" : "Blocked"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DashboardPage
