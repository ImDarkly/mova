import Home from "@/pages/home"
import NotFound from "@/pages/NotFound"
import Room from "@/pages/room"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "*", element: <NotFound /> },
  { path: "/room/:roomId", element: <Room /> },
])
