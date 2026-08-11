<template>
  <div class="container">
    <section class="edition"><span>DAILY BRIEFING</span><p>{{ text.briefing }}</p></section>
    <ArticleCard v-if="articles[0]" :article="articles[0]" featured />
    <section class="section-head"><div><span>LATEST</span><h1>{{ text.latest }}</h1></div><NuxtLink to="/articles">{{ text.browse }}</NuxtLink></section>
    <div class="cards-grid"><ArticleCard v-for="article in articles.slice(1)" :key="article.id" :article="article" /></div>
    <section class="newsletter"><div><span>THE WEEKLY CURRENT</span><h2>{{ text.weekly }}</h2></div><button>{{ text.subscribe }}</button></section>
  </div>
</template>

<script setup lang="ts">
const { list } = usePublicArticles();
const { data: articles } = await useAsyncData('home-articles', list, { default: () => [] });
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const copy = {
  zh: { briefing: '理解变化，而不只是追逐变化。', latest: '最新报道', browse: '浏览全部 →', weekly: '把一周的重要变化，送到你的收件箱。', subscribe: '订阅功能即将开放', title: '首页' },
  en: { briefing: 'Understand change, rather than merely chasing it.', latest: 'Latest Stories', browse: 'View all →', weekly: "The week's most important developments, delivered to your inbox.", subscribe: 'Subscriptions coming soon', title: 'Home' },
} as const;
const text = computed(() => copy[language.value]);
useHead({ title: () => text.value.title });
</script>
