<template>
  <div class="container home-page">
    <section class="edition"><span>DAILY BRIEFING</span><p>{{ text.briefing }}</p></section>

    <section v-if="headlineArticles.length" class="headline-zone">
      <header class="headline-heading"><span>TOP STORIES</span><h1>{{ text.headlines }}</h1></header>
      <div class="headline-grid">
        <ArticleCard :article="headlineArticles[0]" featured />
        <div class="headline-side">
          <ArticleCard v-for="article in headlineArticles.slice(1, 5)" :key="article.id" :article="article" />
        </div>
      </div>
    </section>

    <template v-for="(group, index) in channelGroups" :key="group.category.id">
      <ChannelSection :category="group.category" :articles="group.articles" :variant="index" />
      <RankedStories
        v-if="index === 1"
        :title="text.mostRead"
        :articles="popularArticles"
        :limit="10"
      />
    </template>

    <section class="newsletter"><div><span>THE WEEKLY CURRENT</span><h2>{{ text.weekly }}</h2></div><button>{{ text.subscribe }}</button></section>
  </div>
</template>

<script setup lang="ts">
import type { ArticleDTO } from '~/types/article';
import type { components } from '~/types/generated/api';
type HomepageLayoutDTO = components['schemas']['HomepageLayoutDto'];
const { list } = usePublicArticles();
const catalog = usePublicCatalog();
const [{ data: articles }, { data: categories }, { data: homepageLayout }] = await Promise.all([
  useAsyncData('home-articles', list, { default: () => [] }),
  useAsyncData('home-categories', catalog.categories, { default: () => [] }),
  useAsyncData('home-editorial-layout', () => $fetch<HomepageLayoutDTO>('/api/homepage'), { default: () => ({ slots: [] }) }),
]);
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const copy = {
  zh: { briefing: '理解变化，而不只是追逐变化。', headlines: '今日头条', mostRead: '热门阅读', weekly: '把一周的重要变化，送到你的收件箱。', subscribe: '订阅功能即将开放', title: '首页' },
  en: { briefing: 'Understand change, rather than merely chasing it.', headlines: 'Top Stories', mostRead: 'Most Read', weekly: "The week's most important developments, delivered to your inbox.", subscribe: 'Subscriptions coming soon', title: 'Home' },
} as const;
const text = computed(() => copy[language.value]);
const stableScore = (value: string) => [...value].reduce((score, character) => ((score * 31) + character.charCodeAt(0)) >>> 0, 7);
const audienceScore = (article: ArticleDTO) => {
  const ageDays = Math.max(0, (Date.now() - new Date(article.publishedAt || article.articleDate).getTime()) / 86_400_000);
  return article.viewCount / Math.sqrt(ageDays + 1);
};
const editorialOrder = (items: ArticleDTO[], preferHeadline = false) => [...items].sort((a, b) =>
  (preferHeadline ? Number(Boolean(b.isHeadline)) - Number(Boolean(a.isHeadline)) : 0)
  || ((b.homepagePriority ?? 0) - (a.homepagePriority ?? 0))
  || (audienceScore(b) - audienceScore(a))
  || (stableScore(a.id) - stableScore(b.id)),
);
const uniqueArticles = (preferred: ArticleDTO[], fallback: ArticleDTO[], limit: number) => {
  const seen = new Set<string>();
  return [...preferred, ...fallback].filter((article) => !seen.has(article.id) && Boolean(seen.add(article.id))).slice(0, limit);
};
const headlineArticles = computed(() => {
  const slots = homepageLayout.value.slots
    .filter((slot) => slot.section === 'headline_main' || slot.section === 'headline_secondary')
    .sort((a, b) => (a.section === 'headline_main' ? -1 : b.section === 'headline_main' ? 1 : a.position - b.position))
    .map((slot) => slot.article);
  return uniqueArticles(slots, editorialOrder(articles.value, true), 5);
});
const channelGroups = computed(() => categories.value.map((category) => ({
  category,
  articles: uniqueArticles(
    homepageLayout.value.slots.filter((slot) => slot.section === 'category_featured' && slot.scope === category.id).sort((a,b)=>a.position-b.position).map((slot)=>slot.article),
    editorialOrder(articles.value.filter((article) => article.category.id === category.id)),
    10,
  ),
})).filter((group) => group.articles.length));
const popularArticles = computed(() => editorialOrder(articles.value));
useHead({ title: () => text.value.title });
</script>
