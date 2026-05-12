import { createContext, useContext, useState } from "react";

const TriageContext = createContext(null);

export function TriageProvider({ children }) {
  const [selections, setSelections] = useState(() => {
    try {
      const cached = sessionStorage.getItem("triage-selections");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  function saveSelections(data) {
    sessionStorage.setItem("triage-selections", JSON.stringify(data));
    setSelections(data);
  }

  function clearSelections() {
    sessionStorage.removeItem("triage-selections");
    setSelections(null);
  }

  return (
    <TriageContext.Provider
      value={{ selections, saveSelections, clearSelections }}
    >
      {children}
    </TriageContext.Provider>
  );
}

export function useTriageSelections() {
  return useContext(TriageContext);
}
