export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface CreateCategoryDto {
  name: string;
  color: string;
  description?: string;
}

export interface UpdateCategoryDto extends CreateCategoryDto {
  id: string;
}
