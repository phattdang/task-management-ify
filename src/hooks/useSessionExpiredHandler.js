import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useToast } from "../contexts/ToastContext";
import authEvents from "../utils/authEvents";

/**
 * Listens for "session-expired" events emitted by axiosClient
 * and performs a graceful logout with toast notification + soft navigation.
 */
export default function useSessionExpiredHandler() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const handledRef = useRef(false);

  useEffect(() => {
    const unsubscribeSession = authEvents.on("session-expired", () => {
      if (handledRef.current) return;
      handledRef.current = true;

      dispatch(logout());
      toast.warning("Session expired. Please log in again.");
      navigate("/login", { replace: true });

      setTimeout(() => {
        handledRef.current = false;
      }, 2000);
    });

    const unsubscribeForbidden = authEvents.on("forbidden", () => {
      toast.error("You do not have permission to perform this action.");
    });

    return () => {
      unsubscribeSession();
      unsubscribeForbidden();
    };
  }, [navigate, dispatch, toast]);
}
