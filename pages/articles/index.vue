<template>
  <div class="container listing">
    <header class="listing-head"><span>ARCHIVE</span><h1>全部新闻</h1><p>从技术、城市到公共政策，记录正在发生的变化。</p></header>
    <div class="filters"><button class="active">全部</button><button>科技</button><button>国际</button><button>城市</button></div>
    <div class="archive-list"><ArticleCard v-for="article in articles" :key="article.id" :article="article" /></div>
  </div>
</template>

<script setup lang="ts">
const { list } = usePublicArticles();
const { data: articles } = await useAsyncData('all-articles', list, { default: () => [] });
useHead({ title: '全部新闻' });
</script>
