import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { authApi } from "@/shared/api/auth"
import { Mode } from "@/types/mode"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface RegisterFormProps extends React.ComponentProps<"form"> {
  toggleMode: (m: Mode) => void
}

interface RegisterFields {
  name: string
  email: string
  password: string
}

export function RegisterForm({
  className,
  toggleMode,
  ...props
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: async (data: RegisterFields) => {
      const res = await authApi.register(data)
      return res
    },
    onSuccess: (data) => {   
      if (!data.success) {
        toast.error(data.message)
        return
      }
      if (data.success) {
        toggleMode(Mode.LOGIN)
      } 
      toast.success("Account created")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const onSubmit = (data: RegisterFields) => {
    registerUser(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your information to register
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name", { required: "Name required" })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email", {
              required: "Email required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Sign Up"}
        </Button>
      </div>

      <div
        className="text-center text-sm cursor-pointer"
        onClick={() => toggleMode(Mode.LOGIN)}
      >
        Already have an account?{" "}
        <p className="underline underline-offset-4">Login</p>
      </div>
    </form>
  )
}
