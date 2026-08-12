<template>
  <div class="container home-page">
    <section class="edition"><span>DAILY BRIEFING</span><p>{{ text.briefing }}</p></section>

    <template v-for="(group, index) in channelGroups" :key="group.category.id">
      <ChannelSection :category="group.category" :articles="group.articles" :variant="index % 3" />
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
const { list } = usePublicArticles();
const catalog = usePublicCatalog();
const [{ data: articles }, { data: categories }] = await Promise.all([
  useAsyncData('home-articles', list, { default: () => [] }),
  useAsyncData('home-categories', catalog.categories, { default: () => [] }),
]);
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const copy = {
  zh: { briefing: '理解变化，而不只是追逐变化。', mostRead: '热门阅读', weekly: '把一周的重要变化，送到你的收件箱。', subscribe: '订阅功能即将开放', title: '首页' },
  en: { briefing: 'Understand change, rather than merely chasing it.', mostRead: 'Most Read', weekly: "The week's most important developments, delivered to your inbox.", subscribe: 'Subscriptions coming soon', title: 'Home' },
} as const;
const text = computed(() => copy[language.value]);
const channelGroups = computed(() => categories.value.map((category) => ({
  category,
  articles: articles.value.filter((article) => article.category.id === category.id),
})).filter((group) => group.articles.length));
const popularArticles = computed(() => [...articles.value].sort((a, b) =>
  new Date(b.publishedAt || b.articleDate || 0).getTime() - new Date(a.publishedAt || a.articleDate || 0).getTime(),
));
useHead({ title: () => text.value.title });
</script>
