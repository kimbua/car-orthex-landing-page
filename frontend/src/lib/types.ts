export interface Car {
  id: number;
  slug: string;
  name: string;
  modelLine: string;
  variant: string;
  badge: string;
  series: string;
  category: string;
  fuel: string;
  isM: boolean;
  year: number;
  price: number | null;
  priceNote: string | null;
  shortDesc: string;
  description: string;
  heroImage: string;
  galleryExterior: string[];
  galleryInterior: string[];
  specs: Record<string, unknown>;
  sourceUrl: string;
  sourceName: string;
  sortOrder: number;
}

export interface Dealer {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  isServiceCenter: boolean;
}

export interface CompareRow {
  label: string;
  values: Array<string | number | null>;
}

export interface CompareData {
  columns: { label: string; key: string; unit: string }[];
  cars: Car[];
  rows: CompareRow[];
}
