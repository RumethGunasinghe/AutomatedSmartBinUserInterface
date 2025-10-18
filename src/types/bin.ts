export interface Bin {
  binId: string;
  timestamp: string;
  fill_level: number;
  battery: number;
  signal_strength: number;
  temperature: number;
  humidity: number;
  is_master: boolean;
  master_id: string | null;
  cluster_id: string;
}
