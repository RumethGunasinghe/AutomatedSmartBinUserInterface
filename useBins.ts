// useBins.ts (custom hook)
import { useState, useEffect } from 'react';
import { Bin } from './src/types/bin';

export function useBins(pollInterval = 3000) {
  const [bins, setBins] = useState<Bin[]>([]);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/bins');
        const data: Bin[] = await res.json();
        setBins(data);
      } catch (err) {
        console.error('Failed to fetch bins:', err);
      }
    };

    fetchBins(); // initial fetch
    const interval = setInterval(fetchBins, pollInterval); // poll every 3s

    return () => clearInterval(interval); // cleanup
  }, [pollInterval]);

  return bins;
}
