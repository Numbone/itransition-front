import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mode } from "@/types/mode"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/shared/api/auth"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

interface LoginFormProps extends React.ComponentProps<"form"> {
    toggleMode: (m: Mode) => void
}

interface LoginFields {
    email: string
    password: string
}

export function LoginForm({
    className,
    toggleMode,
    ...props
}: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFields>({
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const navigate = useNavigate()
    const { mutate: login, isPending } = useMutation({
        mutationFn: async (data: LoginFields) => {
            const res = await authApi.login(data)
            return res
        },
        onSuccess: (data) => {

            if (!data.success) {
                toast.error(data.message)
            }
            if (data.responseObject?.user?.status==='blocked') {
                toast.error("Your account is blocked")
                return
            }
            if (data.responseObject?.accessToken && data.responseObject?.user?.status==="active") {
                localStorage.setItem("accessToken", data.responseObject?.accessToken)
                toast.success("Login successful")
                navigate("/dashboard")
            } else {
                toast.error("Something went wrong")
            }
            
        },
        onError: (err) => {
            toast.error(err.message+"gere")
        },
    })

    const onSubmit = (data: LoginFields) => {
        login(data)
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to login to your account
                </p>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-2">
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

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register("password", {
                            required: "Password required",
                            minLength: {
                                value: 1,
                                message: "Password must be at least 1 characters",
                            },
                        })}
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                </Button>
            </div>

            <div
                className="text-center text-sm cursor-pointer"
                onClick={() => toggleMode(Mode.REGISTER)}
            >
                Don&apos;t have an account?{" "}
                <p className="underline underline-offset-4">Sign up</p>
            </div>
        </form>
    )
}
