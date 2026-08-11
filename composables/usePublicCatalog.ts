export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
}

export interface PublicTag {
  id: number;
  name: string;
  slug: string;
}

export const usePublicCatalog = () => ({
  categories: () => $fetch<PublicCategory[]>('/api/categories'),
  tags: () => $fetch<PublicTag[]>('/api/tags'),
});
