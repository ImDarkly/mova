import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/lib/i18n"

import "@/index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { RouterProvider } from "react-router"
import { Toaster } from "@/components/ui/sonner.tsx"
import { router } from "@/routes/index.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <div className="flex h-svh min-h-0 w-full items-center justify-center p-4">
        <RouterProvider router={router} />
      </div>
      <Toaster position="top-center" />
    </ThemeProvider>
  </StrictMode>
)
