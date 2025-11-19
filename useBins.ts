import { useState, useEffect } from 'react';
import { Bin } from './src/types/bin';

export function useBins(pollInterval = 3000) {
  const [bins, setBins] = useState<Bin[]>([]);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await fetch('http://172.26.59.116:3000/api/bins');
        const data: Bin[] = await res.json();

        setBins(prevBins => {
          // Merge by binId
          const binMap = new Map(prevBins.map(b => [b.binId, b]));
          data.forEach(newBin => binMap.set(newBin.binId, newBin));
          return Array.from(binMap.values());
        });
      } catch (err) {
        console.error('Failed to fetch bins:', err);
      }
    };

    fetchBins();
    const interval = setInterval(fetchBins, pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval]);

  return { bins, setBins };
}
