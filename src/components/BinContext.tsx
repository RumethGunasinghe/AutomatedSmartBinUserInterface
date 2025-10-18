// BinContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

export interface BinData {
  binId: string;
  status: string;
  battery: number;
  temperature: number;
}

interface BinContextProps {
  bins: BinData[];
  refreshBins: () => void;
  sendCommand: (binId: string, command: string) => void;
}

const BinContext = createContext<BinContextProps | null>(null);

export const BinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bins, setBins] = useState<BinData[]>([]);

  // Fetch bins from backend
  const refreshBins = async () => {
    try {
      const res = await fetch("http://<ZEROTIER_IP>:3000/api/bins");
      const data: BinData[] = await res.json();
      setBins(data);
    } catch (err) {
      console.error("Error fetching bins:", err);
    }
  };

  // Send command to backend
  const sendCommand = async (binId: string, command: string) => {
    try {
      await fetch("http://<ZEROTIER_IP>:3000/api/send-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ binId, command }),
      });
      console.log(`Command sent: ${command} to ${binId}`);
    } catch (err) {
      console.error("Error sending command:", err);
    }
  };

  useEffect(() => {
    refreshBins();
    const interval = setInterval(refreshBins, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <BinContext.Provider value={{ bins, refreshBins, sendCommand }}>
      {children}
    </BinContext.Provider>
  );
};

// Hook for easy access
export const useBinContext = () => {
  const context = useContext(BinContext);
  if (!context) throw new Error("useBinContext must be used within BinProvider");
  return context;
};
