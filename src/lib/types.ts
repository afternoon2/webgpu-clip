export type Point = { X: number; Y: number };

export type Line = [Point, Point];

export type Polyline = [Point, Point, ...Point[]];

export type PolygonRing = [Point, Point, Point, ...Point[]];

export type Polygon = [PolygonRing, ...PolygonRing[]];

export type PolylineCollection = Polyline[];
