import { FilterOptions } from "./guest";

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterOptions;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
