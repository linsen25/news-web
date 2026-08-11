<template>
  <div class="container listing">
    <header class="listing-head">
      <span>ARCHIVE</span>
      <h1>{{ text.title }}</h1>
      <p>{{ text.introduction }}</p>
    </header>

    <div v-if="rawSearchKeyword" class="search-state">
      <div><span>{{ text.searchResults }}</span><strong>“{{ rawSearchKeyword }}”</strong><small>{{ resultCount }}</small></div>
      <NuxtLink to="/articles">× {{ text.clearSearch }}</NuxtLink>
    </div>

    <nav class="filters" aria-label="新闻分类">
      <span v-if="rawSearchKeyword" class="filter-context">{{ text.filterSearchByCategory }}</span>
      <NuxtLink :to="allNewsLocation" :class="{ active: !selectedCategory && !rawSearchKeyword }">{{ text.all }}</NuxtLink>
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="categoryLocation(category.slug)"
        :class="{ active: selectedCategory === category.slug }"
      >{{ localizedName(category) }}</NuxtLink>
    </nav>

    <nav v-if="displayedTags.length" class="tag-filters" aria-label="文章标签">
      <span>{{ text.filterByTag }}</span>
      <NuxtLink :to="allTagsLocation" :class="{ active: !selectedTag }">{{ text.allTags }}</NuxtLink>
      <NuxtLink
        v-for="tag in displayedTags"
        :key="tag.id"
        :to="tagLocation(tag.slug)"
        :class="{ active: selectedTag === tag.slug }"
      ># {{ localizedName(tag) }}</NuxtLink>
    </nav>

    <div v-if="filteredArticles.length" class="archive-list">
      <ArticleCard v-for="article in filteredArticles" :key="article.id" :article="article" />
    </div>
    <p v-else class="empty-results">{{ text.empty }}</p>
  </div>
</template>

<script setup lang="ts">
import type { PublicCategory } from '~/composables/usePublicCatalog';

const route = useRoute();
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const copy = {
  zh: { title: '全部新闻', introduction: '从科技、国际到公共政策，记录正在发生的变化。', searchResults: '搜索结果', clearSearch: '清除搜索', filterSearchByCategory: '在搜索结果中按分类筛选', all: '全部', filterByTag: '按标签筛选', allTags: '全部标签', empty: '当前筛选条件下还没有已发布的新闻。', pageTitle: '全部新闻' },
  en: { title: 'All News', introduction: 'Reporting the changes shaping technology, international affairs, and public policy.', searchResults: 'Search Results', clearSearch: 'Clear Search', filterSearchByCategory: 'Filter search results by category', all: 'All', filterByTag: 'Filter by tag', allTags: 'All Tags', empty: 'No published stories match the current filters.', pageTitle: 'All News' },
} as const;
const text = computed(() => copy[language.value]);
const localizedName = (item: { name: string; nameEn?: string }) => language.value === 'en' && item.nameEn ? item.nameEn : item.name;
const { list } = usePublicArticles();
const catalog = usePublicCatalog();

const [{ data: articles }, { data: categories }, { data: tags }] = await Promise.all([
  useAsyncData('all-articles', list, { default: () => [] }),
  useAsyncData('public-categories', catalog.categories, { default: () => [] }),
  useAsyncData('public-tags', catalog.tags, { default: () => [] }),
]);

const selectedCategory = computed(() => String(route.query.category || ''));
const selectedTag = computed(() => String(route.query.tag || ''));
const rawSearchKeyword = computed(() => String(route.query.q || '').trim());
const searchKeyword = computed(() => String(route.query.q || '').trim().toLocaleLowerCase());
const resultCount = computed(() => language.value === 'zh' ? `共 ${filteredArticles.value.length} 篇` : `${filteredArticles.value.length} ${filteredArticles.value.length === 1 ? 'story' : 'stories'}`);
const displayedTags = computed(() => {
  if (!selectedCategory.value) return tags.value;
  const category = categories.value.find((item) => item.slug === selectedCategory.value);
  return category ? tags.value.filter((tag) => tag.categoryId === category.id) : [];
});

const descendantIds = (selected: PublicCategory) => {
  const ids = new Set<string>([selected.id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories.value) {
      if (category.parentId && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
    }
  }
  return ids;
};

const filteredArticles = computed(() => {
  let result = articles.value;
  if (selectedCategory.value) {
    const category = categories.value.find((item) => item.slug === selectedCategory.value);
    result = category
      ? result.filter((article) => descendantIds(category).has(article.category.id))
      : [];
  }
  if (selectedTag.value) {
    result = result.filter((article) => article.tags.some((tag) => tag.slug === selectedTag.value));
  }
  if (searchKeyword.value) {
    result = result.filter((article) => [
      article.title,
      article.summary,
      article.category.name,
      article.category.nameEn,
      ...article.tags.flatMap((tag) => [tag.name, tag.nameEn]),
    ].join(' ').toLocaleLowerCase().includes(searchKeyword.value));
  }
  return result;
});

const allNewsLocation = computed(() => ({
  path: '/articles',
  query: {
    ...(selectedTag.value ? { tag: selectedTag.value } : {}),
  },
}));
const allTagsLocation = computed(() => ({
  path: '/articles',
  query: {
    ...(selectedCategory.value ? { category: selectedCategory.value } : {}),
  },
}));
const categoryLocation = (slug: string) => ({
  path: '/articles',
  query: {
    category: slug,
    ...(tags.value.some((tag) => tag.slug === selectedTag.value && tag.categoryId === categories.value.find((category) => category.slug === slug)?.id) ? { tag: selectedTag.value } : {}),
  },
});
const tagLocation = (slug: string) => ({
  path: '/articles',
  query: {
    ...(selectedCategory.value ? { category: selectedCategory.value } : {}),
    tag: slug,
  },
});

useHead({ title: () => text.value.pageTitle });
</script>
