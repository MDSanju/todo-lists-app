import { RouteType } from "./Types";

import { Home } from "../Pages";
import { NotFound } from "../Shared/Pages";

export const CommonRoutes: RouteType[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
