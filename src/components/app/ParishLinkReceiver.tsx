import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { parishFromSearch, setParish } from "@/lib/parish";
import { showSuccess } from "@/utils/toast";

// Opening a parish's link ("…/today?parish=…&parishName=St%20Nicholas") joins that parish for the fasts, then
// tidies the address so the link is not shared onward from this page by accident.
export function ParishLinkReceiver() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const parish = parishFromSearch(location.search);
    if (!parish) return;
    setParish(parish);
    showSuccess(`You're keeping the fasts with ${parish.name}.`);
    const params = new URLSearchParams(location.search);
    params.delete("parish");
    params.delete("parishName");
    const rest = params.toString();
    navigate(`${location.pathname}${rest ? `?${rest}` : ""}${location.hash}`, { replace: true });
  }, [location.search, location.pathname, location.hash, navigate]);

  return null;
}
