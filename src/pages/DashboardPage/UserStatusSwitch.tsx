import { Switch } from "@/components/ui/switch"
import { TableCell } from "@/components/ui/table"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userApi } from "@/shared/api/user"
import { toast } from "sonner"
import type { IUser } from "@/types/user"

export function UserStatusSwitch({ user }: { user: IUser }) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async (status: "active" | "blocked") => {
      await userApi.updateUserStatus(user.id, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Статус обновлен")
    },
    onError: () => {
      toast.error("Не удалось обновить статус")
    },
  })

  const handleToggle = (checked: boolean) => {
    mutate(checked ? "active" : "blocked")
  }

  return (
    <TableCell>
      <Switch
        checked={user.status === "active"}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
    </TableCell>
  )
}
