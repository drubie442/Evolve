import { createContext, useContext, useEffect, useState } from "react";

const CACHE_KEY = "support-services-v3";

const ServicesContext = createContext(null);

export function ServicesProvider({ children }) {
  const [services, setServices] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!services);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (services) return; // already cached in state from sessionStorage

    fetch("/api/support-services")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load services (${res.status})`);
        return res.json();
      })
      .then((data) => {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        setServices(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ServicesContext.Provider value={{ services, loading, error }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  return useContext(ServicesContext);
}
