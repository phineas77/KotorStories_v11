/** Pure GPS logic, independent from Expo so it can be tested separately. */
export type Point = { latitude: number; longitude: number };
const R = 6371000;
export function distanceMeters(a: Point, b: Point): number {
  const lat1 = a.latitude * Math.PI / 180;
  const lat2 = b.latitude * Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * Math.PI / 180;
  const dLon = (b.longitude - a.longitude) * Math.PI / 180;
  const t = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(t), Math.sqrt(1 - t));
}

export type GPSReading = Point & { accuracyMeters: number | null };
export interface GeofenceInput extends Point { id: string; radiusMeters: number }
/**
 * Accept a trigger only for accurate, close readings. Caller requires >=2
 * consecutive readings for the NEXT unvisited stop (order prevents collisions).
 */
export function insideStop(reading: GPSReading, stop: GeofenceInput): boolean {
  if (reading.accuracyMeters == null || reading.accuracyMeters > 35) return false;
  return distanceMeters(reading, stop) <= stop.radiusMeters;
}
