<template>
  <section
    class="headline-carousel"
    :class="{ paused }"
    :aria-label="language === 'zh' ? '头条轮播' : 'Top stories carousel'"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <Transition name="headline-slide" mode="out-in">
      <article :key="activeArticle.id" class="headline-carousel-card">
        <NuxtLink :to="`/articles/${activeArticle.slug}`" class="headline-carousel-image">
          <img v-if="cardImage" :src="cardImage" :alt="activeArticle.title" :style="imagePosition" />
          <span v-else>CHINA CANADA NET</span>
        </NuxtLink>
        <div class="headline-carousel-shade" aria-hidden="true" />
        <div class="headline-carousel-copy">
          <NuxtLink class="headline-carousel-category" :to="`/category/${activeArticle.category.slug}`">
            {{ localizedName(activeArticle.category) }}
          </NuxtLink>
          <h2><NuxtLink :to="`/articles/${activeArticle.slug}`">{{ activeArticle.title }}</NuxtLink></h2>
          <p>{{ activeArticle.summary }}</p>
          <small><template v-if="activeArticle.byline">{{ activeArticle.byline }} · </template>{{ formatDate(activeArticle.articleDate) }}</small>
        </div>
      </article>
    </Transition>

    <template v-if="articles.length > 1">
      <button class="headline-carousel-arrow previous" type="button" :aria-label="language === 'zh' ? '上一篇' : 'Previous story'" @click="previous">&#8592;</button>
      <button class="headline-carousel-arrow next" type="button" :aria-label="language === 'zh' ? '下一篇' : 'Next story'" @click="next">&#8594;</button>
      <div class="headline-carousel-dots" role="tablist" :aria-label="language === 'zh' ? '选择头条' : 'Choose a headline'">
        <button
          v-for="(article, index) in articles"
          :key="article.id"
          type="button"
          :class="{ active: index === currentIndex }"
          :aria-label="`${index + 1}: ${article.title}`"
          :aria-selected="index === currentIndex"
          role="tab"
          @click="goTo(index)"
        />
      </div>
      <span class="headline-carousel-count">{{ currentIndex + 1 }} / {{ articles.length }}</span>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { ArticleDTO } from '~/types/article';

const props = defineProps<{ articles: ArticleDTO[] }>();
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const currentIndex = ref(0);
const paused = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

const activeArticle = computed(() => props.articles[currentIndex.value] || props.articles[0]);
const findFirstImage = (nodes: ArticleDTO['content']['content'] = []): string => {
  for (const node of nodes) {
    if (node.type === 'image' && typeof node.attrs?.src === 'string') return node.attrs.src;
    const nested = node.content ? findFirstImage(node.content) : '';
    if (nested) return nested;
  }
  return '';
};
const cardImage = computed(() => activeArticle.value.coverImage || findFirstImage(activeArticle.value.content.content));
const imagePosition = computed(() => ({ objectPosition: `${activeArticle.value.coverFocalX ?? 50}% ${activeArticle.value.coverFocalY ?? 50}%` }));
const localizedName = (item: { name: string; nameEn?: string }) => language.value === 'en' && item.nameEn ? item.nameEn : item.name;
const formatDate = (date: string | null) => date
  ? new Intl.DateTimeFormat(language.value === 'zh' ? 'zh-CN' : 'en-CA', { month: 'long', day: 'numeric' }).format(new Date(date))
  : language.value === 'zh' ? '未发布' : 'Unpublished';
const goTo = (index: number) => { currentIndex.value = index; };
const next = () => { currentIndex.value = (currentIndex.value + 1) % props.articles.length; };
const previous = () => { currentIndex.value = (currentIndex.value - 1 + props.articles.length) % props.articles.length; };

watch(() => props.articles.map((article) => article.id).join(','), () => { currentIndex.value = 0; });
onMounted(() => {
  timer = setInterval(() => {
    if (!paused.value && props.articles.length > 1 && !document.hidden) next();
  }, 5500);
});
onBeforeUnmount(() => { if (timer) clearInterval(timer); });
</script>
