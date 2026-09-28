import { LeakyBucketLogEntry } from '../types/network';

export interface LeakyBucketConfig {
  bucketCapacity: number;
  outputRate: number; // packets leaked/processed per time-slot
}

export interface LeakyBucketResult {
  logs: LeakyBucketLogEntry[];
  totalIncoming: number;
  totalTransmitted: number;
  totalDropped: number;
  remainingInBucket: number;
  dropRatePercent: number;
}

/**
 * Simulates the Leaky Bucket congestion control algorithm over a sequence of arrival time steps.
 */
export function simulateLeakyBucket(
  arrivals: number[],
  config: LeakyBucketConfig
): LeakyBucketResult {
  const { bucketCapacity, outputRate } = config;
  const logs: LeakyBucketLogEntry[] = [];

  let currentBucket = 0;
  let totalIncoming = 0;
  let totalTransmitted = 0;
  let totalDropped = 0;

  for (let t = 0; t < arrivals.length; t++) {
    const incoming = arrivals[t];
    totalIncoming += incoming;

    // Check if incoming packets fit into the bucket
    let dropped = 0;
    let inBucketBeforeLeak = currentBucket + incoming;

    if (inBucketBeforeLeak > bucketCapacity) {
      dropped = inBucketBeforeLeak - bucketCapacity;
      inBucketBeforeLeak = bucketCapacity;
    }

    totalDropped += dropped;

    // Transmit up to outputRate packets
    const transmitted = Math.min(outputRate, inBucketBeforeLeak);
    totalTransmitted += transmitted;

    // Remaining in bucket after leak
    currentBucket = inBucketBeforeLeak - transmitted;

    logs.push({
      timeStep: t + 1,
      incoming,
      beforeLeak: inBucketBeforeLeak,
      transmitted,
      dropped,
      remainingInBucket: currentBucket,
    });
  }

  // Drain remaining packets in the bucket if no more incoming
  let extraTime = arrivals.length + 1;
  while (currentBucket > 0 && extraTime <= arrivals.length + 10) {
    const transmitted = Math.min(outputRate, currentBucket);
    totalTransmitted += transmitted;
    currentBucket -= transmitted;

    logs.push({
      timeStep: extraTime++,
      incoming: 0,
      beforeLeak: currentBucket + transmitted,
      transmitted,
      dropped: 0,
      remainingInBucket: currentBucket,
    });
  }

  const dropRatePercent = totalIncoming > 0 ? (totalDropped / totalIncoming) * 100 : 0;

  return {
    logs,
    totalIncoming,
    totalTransmitted,
    totalDropped,
    remainingInBucket: currentBucket,
    dropRatePercent: parseFloat(dropRatePercent.toFixed(1)),
  };
}
