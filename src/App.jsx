import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import useSessionExpiredHandler from "./hooks/useSessionExpiredHandler";

function SessionGuard({ children }) {
  useSessionExpiredHandler();
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionGuard>
        <AppRoutes />
      </SessionGuard>
    </BrowserRouter>
  );
}
