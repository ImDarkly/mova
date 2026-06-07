import Game from "@/pages/Game"
import Home from "@/pages/Home"
import NotFound from "@/pages/NotFound"
import Room from "@/pages/Room"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "*", element: <NotFound /> },
  { path: "/room/:roomId", element: <Room /> },
  { path: "/game/:roomId", element: <Game /> },
])
