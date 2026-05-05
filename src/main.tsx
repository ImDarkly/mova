import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/lib/i18n"

import "@/index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { RouterProvider } from "react-router"
import { Toaster } from "@/components/ui/sonner.tsx"
import { router } from "@/routes/index.tsx"
import { i18nReady } from "@/lib/i18n"

const onI18nReady = () => {
  const rootEl = document.getElementById("root")
  if (!rootEl) {
    throw new Error("[root] #root element not found in DOM")
  }
  createRoot(rootEl).render(
    <StrictMode>
      <ThemeProvider>
        <div className="flex h-svh min-h-0 w-full items-center justify-center p-4">
          <RouterProvider router={router} />
        </div>
        <Toaster position="top-center" />
      </ThemeProvider>
    </StrictMode>
  )
}

const onI18nFailed = (err: unknown) => {
  console.error("[i18n] Initialization failed:", err)
}

i18nReady.then(onI18nReady, onI18nFailed).catch((err: unknown) => {
  console.error("[root] Mount/render failed:", err)
})
