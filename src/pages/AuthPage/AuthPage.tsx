import { LoginForm } from '@/components/LoginForm'
import { RegisterForm } from '@/components/RegisterForm'
import { cn } from '@/lib/utils'
import { Mode } from '@/types/mode'
import React from 'react'
import BgImg from '@/shared/assets/bg.jpg'
const AuthPage = () => {
    const [mode, setMode] = React.useState<Mode>(Mode.LOGIN)

    const toggleMode = (m: Mode) => {
        setMode(m)
    }

    return (
        <div className="grid min-h-svh grid-rows-[auto,1fr] lg:grid-cols-2 lg:grid-rows-1">
            <div
                className={cn(
                    "flex flex-col gap-4 p-6 md:p-10",
                    mode === Mode.LOGIN ? "order-2 lg:order-1" : "order-2 lg:order-2"
                )}
            >
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        {mode === Mode.LOGIN ? (
                            <LoginForm toggleMode={toggleMode} />
                        ) : (
                            <RegisterForm toggleMode={toggleMode} />
                        )}
                    </div>
                </div>
            </div>
            <div
                className={cn(
                    " relative hidden lg:block",
                    mode === Mode.LOGIN ? "order-1 lg:order-2" : "order-1 lg:order-1"
                )}
            >
                <img
                    src={BgImg}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale "
                />
            </div>
        </div>
    )
}

export default AuthPage
