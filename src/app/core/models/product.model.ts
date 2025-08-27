export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
  createdAt?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}
