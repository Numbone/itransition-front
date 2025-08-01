import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { userApi } from "@/shared/api/user"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { UserStatusSwitch } from "./UserStatusSwitch"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner" 

const DashboardPage = () => {
  const { data: users, isFetching, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await userApi.getUsers()
      return res
    }
  })

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

  const userList = users?.responseObject || []

  const allSelected = userList.length > 0 && userList.every((u) => selectedUserIds.includes(String(u.id)))

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
    onError: (error) => {
      console.error(error)
      toast.error("Error deleting users")
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
      prev.includes(id)
        ? prev.filter((uid) => uid !== id)
        : [...prev, id]
    )
  }

  if (isFetching) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (isError || !users) {
    return <div className="p-4 text-red-500">Error loading users.</div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedUserIds.length === 0}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Delete Selected
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUserIds.includes(String(user.id))}
                  onCheckedChange={() => toggleUser(String(user.id))}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.last_login
                  ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true })
                  : "—"}
              </TableCell>
              <UserStatusSwitch user={user} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default DashboardPage
