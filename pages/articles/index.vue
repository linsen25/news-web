<template>
  <div class="container listing">
    <header class="listing-head">
      <span>ARCHIVE</span>
      <h1>全部新闻</h1>
      <p>从科技、国际到公共政策，记录正在发生的变化。</p>
    </header>

    <nav class="filters" aria-label="新闻分类">
      <NuxtLink :to="allNewsLocation" :class="{ active: !selectedCategory }">全部</NuxtLink>
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="categoryLocation(category.slug)"
        :class="{ active: selectedCategory === category.slug }"
      >{{ category.name }}</NuxtLink>
    </nav>

    <nav v-if="tags.length" class="tag-filters" aria-label="新闻标签">
      <span>热门标签</span>
      <NuxtLink
        v-for="tag in tags"
        :key="tag.id"
        :to="tagLocation(tag.slug)"
        :class="{ active: selectedTag === tag.slug }"
      ># {{ tag.name }}</NuxtLink>
    </nav>

    <div v-if="filteredArticles.length" class="archive-list">
      <ArticleCard v-for="article in filteredArticles" :key="article.id" :article="article" />
    </div>
    <p v-else class="empty-results">当前筛选条件下还没有已发布的新闻。</p>
  </div>
</template>

<script setup lang="ts">
import type { PublicCategory } from '~/composables/usePublicCatalog';

const route = useRoute();
const { list } = usePublicArticles();
const catalog = usePublicCatalog();

const [{ data: articles }, { data: categories }, { data: tags }] = await Promise.all([
  useAsyncData('all-articles', list, { default: () => [] }),
  useAsyncData('public-categories', catalog.categories, { default: () => [] }),
  useAsyncData('public-tags', catalog.tags, { default: () => [] }),
]);

const selectedCategory = computed(() => String(route.query.category || ''));
const selectedTag = computed(() => String(route.query.tag || ''));

const descendantIds = (selected: PublicCategory) => {
  const ids = new Set<number>([selected.id]);
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
  return result;
});

const allNewsLocation = computed(() => selectedTag.value
  ? { path: '/articles', query: { tag: selectedTag.value } }
  : { path: '/articles' });
const categoryLocation = (slug: string) => ({
  path: '/articles',
  query: { category: slug, ...(selectedTag.value ? { tag: selectedTag.value } : {}) },
});
const tagLocation = (slug: string) => ({
  path: '/articles',
  query: { ...(selectedCategory.value ? { category: selectedCategory.value } : {}), tag: slug },
});

useHead({ title: '全部新闻' });
</script>
