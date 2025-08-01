import { AuthPage, DashboardPage } from '@/pages'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Toaster } from "@/components/ui/sonner"
function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
       <Toaster />
    </QueryClientProvider>
  )
}

export default App
