import { useRoutes } from "react-router-dom";

import { ClientRoutes } from "./ClientRoutes";
import { CommonRoutes } from "./CommonRoutes";

export const AppRoutes = () => {
  return useRoutes([...CommonRoutes, ...ClientRoutes]);
};
