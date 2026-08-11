export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

export interface PublicTag {
  id: string;
  name: string;
  slug: string;
  categoryId?: string | null;
}

export const usePublicCatalog = () => ({
  categories: () => $fetch<PublicCategory[]>('/api/categories'),
  tags: () => $fetch<PublicTag[]>('/api/tags'),
});
