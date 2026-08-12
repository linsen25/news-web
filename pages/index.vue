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
const { list } = usePublicArticles();
const catalog = usePublicCatalog();
const [{ data: articles }, { data: categories }] = await Promise.all([
  useAsyncData('home-articles', list, { default: () => [] }),
  useAsyncData('home-categories', catalog.categories, { default: () => [] }),
]);
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const copy = {
  zh: { briefing: '理解变化，而不只是追逐变化。', headlines: '今日头条', mostRead: '热门阅读', weekly: '把一周的重要变化，送到你的收件箱。', subscribe: '订阅功能即将开放', title: '首页' },
  en: { briefing: 'Understand change, rather than merely chasing it.', headlines: 'Top Stories', mostRead: 'Most Read', weekly: "The week's most important developments, delivered to your inbox.", subscribe: 'Subscriptions coming soon', title: 'Home' },
} as const;
const text = computed(() => copy[language.value]);
const stableScore = (value: string) => [...value].reduce((score, character) => ((score * 31) + character.charCodeAt(0)) >>> 0, 7);
const editorialOrder = (items: ArticleDTO[]) => [...items].sort((a, b) =>
  (b.viewCount - a.viewCount) || (stableScore(a.id) - stableScore(b.id)),
);
const headlineArticles = computed(() => editorialOrder(articles.value).slice(0, 5));
const channelGroups = computed(() => categories.value.map((category) => ({
  category,
  articles: editorialOrder(articles.value.filter((article) => article.category.id === category.id)),
})).filter((group) => group.articles.length));
const popularArticles = computed(() => editorialOrder(articles.value));
useHead({ title: () => text.value.title });
</script>
