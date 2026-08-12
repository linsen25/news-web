<template>
  <section v-if="articles.length" class="ranked-stories" :class="{ compact }">
    <header><h2>{{ title }}</h2></header>
    <ol>
      <li v-for="(article, index) in articles.slice(0, limit)" :key="article.id">
        <span>{{ index + 1 }}</span>
        <NuxtLink :to="`/articles/${article.slug}`">{{ article.title }}</NuxtLink>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import type { ArticleDTO } from '~/types/article';
withDefaults(defineProps<{ title: string; articles: ArticleDTO[]; limit?: number; compact?: boolean }>(), { limit: 10, compact: false });
</script>
