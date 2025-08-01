export const Mode= {
    LOGIN: 'login',
    REGISTER: 'register'
} as const 

export type Mode = typeof Mode[keyof typeof Mode]