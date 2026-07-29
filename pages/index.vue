<template>
  <div class="container">
    <section class="edition"><span>DAILY BRIEFING</span><p>理解变化，而不只是追逐变化。</p></section>
    <ArticleCard v-if="articles[0]" :article="articles[0]" featured />
    <section class="section-head"><div><span>LATEST</span><h1>最新报道</h1></div><NuxtLink to="/articles">浏览全部 →</NuxtLink></section>
    <div class="cards-grid"><ArticleCard v-for="article in articles.slice(1)" :key="article.id" :article="article" /></div>
    <section class="newsletter"><div><span>THE WEEKLY CURRENT</span><h2>把一周的重要变化，送到你的收件箱。</h2></div><button>订阅功能即将开放</button></section>
  </div>
</template>

<script setup lang="ts">
const { list } = usePublicArticles();
const { data: articles } = await useAsyncData('home-articles', list, { default: () => [] });
useHead({ title: '首页' });
</script>
