// useBins.ts
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
          const updatedBins = [...prevBins];

          data.forEach(newBin => {
            const index = updatedBins.findIndex(b => b.binId === newBin.binId);
            if (index >= 0) {
              // Update existing bin
              updatedBins[index] = newBin;
            } else {
              // Add new bin
              updatedBins.push(newBin);
            }
          });

          return updatedBins;
        });

      } catch (err) {
        console.error('Failed to fetch bins:', err);
      }
    };

    fetchBins(); // initial fetch

    const interval = setInterval(fetchBins, pollInterval); // poll periodically
    return () => clearInterval(interval);
  }, [pollInterval]);

  // Return both bins and setBins so the consumer can modify the bins (e.g., delete)
  return { bins, setBins };
}
