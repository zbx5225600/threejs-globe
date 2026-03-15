/**
 * 大洲数据接口
 */
export interface Continent {
  lat: number;
  lng: number;
  zh: string;
  en: string;
}

/**
 * 排放点数据接口 [纬度，经度，排放值，可选值]
 */
export type EmissionPoint = [number, number, number, number?];

/**
 * 航线起点/终点接口
 */
export interface RouteEndpoint {
  lat: number;
  lng: number;
}

/**
 * 航线数据接口
 */
export interface Route {
  from: RouteEndpoint;
  to: RouteEndpoint;
}

/**
 * 模拟数据接口
 */
export interface SimulatedData {
  continents: Continent[];
  globe: EmissionPoint[];
  flat?: number[][];
}

/**
 * 基础数据接口
 */
export interface BaseData {
  continents: Continent[];
  routes: Route[];
  flat?: number[][];
}
