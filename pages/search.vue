<template>
  <div class="container search-page">
    <header class="search-page-heading">
      <div class="search-heading-top">
        <span>SEARCH</span>
        <NuxtLink v-if="query" to="/search">× {{ text.cancelSearch }}</NuxtLink>
      </div>
      <h1>{{ text.title }}</h1>
      <p v-if="query">“{{ query }}” · {{ resultCount }}</p>
      <p v-else>{{ text.prompt }}</p>
    </header>

    <template v-if="query && groupedResults.length">
      <section v-for="group in groupedResults" :key="group.category.id" class="search-channel-group">
        <header>
          <h2>{{ localizedName(group.category) }} <small>{{ group.articles.length }}</small></h2>
          <NuxtLink :to="{ path: `/category/${group.category.slug}`, query: { q: query } }">{{ text.viewChannel }} →</NuxtLink>
        </header>
        <div class="search-result-grid">
          <ArticleCard v-for="article in group.articles" :key="article.id" :article="article" />
        </div>
      </section>
    </template>
    <p v-else-if="query" class="empty-results">{{ text.empty }}</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const query = computed(() => String(route.query.q || '').trim());
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const { list } = usePublicArticles();
const catalog = usePublicCatalog();
const [{ data: articles }, { data: categories }] = await Promise.all([
  useAsyncData('search-articles', list, { default: () => [] }),
  useAsyncData('search-categories', catalog.categories, { default: () => [] }),
]);
const localizedName = (item: { name: string; nameEn?: string }) => language.value === 'en' && item.nameEn ? item.nameEn : item.name;
const matches = computed(() => {
  const needle = query.value.toLocaleLowerCase();
  if (!needle) return [];
  return articles.value.filter((article) => [
    article.title, article.summary, article.category.name, article.category.nameEn,
    ...article.tags.flatMap((tag) => [tag.name, tag.nameEn]),
  ].join(' ').toLocaleLowerCase().includes(needle));
});
const groupedResults = computed(() => categories.value.map((category) => ({
  category,
  articles: matches.value.filter((article) => article.category.id === category.id),
})).filter((group) => group.articles.length));
const copy = {
  zh: { title: '搜索新闻', prompt: '在顶部搜索框输入关键词，查找相关报道。', viewChannel: '在频道中查看', empty: '没有找到匹配的已发布文章。', cancelSearch: '取消搜索' },
  en: { title: 'Search News', prompt: 'Enter a keyword in the header search box to find stories.', viewChannel: 'View in channel', empty: 'No published stories match this search.', cancelSearch: 'Clear search' },
} as const;
const text = computed(() => copy[language.value]);
const resultCount = computed(() => language.value === 'zh' ? `共 ${matches.value.length} 篇` : `${matches.value.length} ${matches.value.length === 1 ? 'story' : 'stories'}`);
useHead({ title: () => text.value.title });
</script>
