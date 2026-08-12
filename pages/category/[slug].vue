<template>
  <div v-if="category" class="container channel-page">
    <nav class="channel-breadcrumb" :aria-label="text.breadcrumb">
      <NuxtLink to="/">{{ text.home }}</NuxtLink><span>›</span><span>{{ localizedName(category) }}</span>
    </nav>
    <header class="channel-hero">
      <span>CHANNEL</span>
      <h1>{{ localizedName(category) }}</h1>
      <p>{{ channelDescription }}</p>
    </header>
    <nav class="channel-tags" :aria-label="text.tags">
      <NuxtLink :to="{ path: `/category/${category.slug}`, query: searchKeyword ? { q: searchKeyword } : {} }" :class="{ active: !selectedTag }">{{ text.all }}</NuxtLink>
      <NuxtLink
        v-for="tag in categoryTags"
        :key="tag.id"
        :to="{ path: `/category/${category.slug}`, query: { tag: tag.slug, ...(searchKeyword ? { q: searchKeyword } : {}) } }"
        :class="{ active: selectedTag === tag.slug }"
      >{{ localizedName(tag) }}</NuxtLink>
    </nav>

    <div v-if="searchKeyword" class="channel-search-state">
      <span>{{ language === 'zh' ? '频道内搜索' : 'Search within channel' }}</span>
      <strong>“{{ searchKeyword }}”</strong>
      <NuxtLink :to="`/category/${category.slug}`">× {{ language === 'zh' ? '清除' : 'Clear' }}</NuxtLink>
    </div>

    <div v-if="filteredArticles.length" class="channel-page-content">
      <ArticleCard :article="filteredArticles[0]" featured />
      <div v-if="filteredArticles.length > 1" class="cards-grid channel-secondary">
        <ArticleCard v-for="article in filteredArticles.slice(1, 5)" :key="article.id" :article="article" />
      </div>
      <section v-if="filteredArticles.length > 5" class="channel-latest">
        <header><h2>{{ text.latest }}</h2></header>
        <div class="archive-list"><ArticleCard v-for="article in filteredArticles.slice(5)" :key="article.id" :article="article" /></div>
      </section>
    </div>
    <p v-else class="empty-results">{{ text.empty }}</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = computed(() => String(route.params.slug));
const selectedTag = computed(() => String(route.query.tag || ''));
const searchKeyword = computed(() => String(route.query.q || '').trim());
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const catalog = usePublicCatalog();
const { list } = usePublicArticles();
const [{ data: categories }, { data: tags }, { data: articles }] = await Promise.all([
  useAsyncData('channel-categories', catalog.categories, { default: () => [] }),
  useAsyncData('channel-tags', catalog.tags, { default: () => [] }),
  useAsyncData('channel-articles', list, { default: () => [] }),
]);
const category = computed(() => categories.value.find((item) => item.slug === slug.value));
if (!category.value) throw createError({ statusCode: 404, statusMessage: '频道不存在' });
const categoryTags = computed(() => tags.value.filter((tag) => tag.categoryId === category.value?.id));
const filteredArticles = computed(() => articles.value.filter((article) =>
  article.category.id === category.value?.id
  && (!selectedTag.value || article.tags.some((tag) => tag.slug === selectedTag.value)),
).filter((article) => !searchKeyword.value || [
  article.title, article.summary, article.category.name, article.category.nameEn,
  ...article.tags.flatMap((tag) => [tag.name, tag.nameEn]),
].join(' ').toLocaleLowerCase().includes(searchKeyword.value.toLocaleLowerCase())));
const localizedName = (item: { name: string; nameEn?: string }) => language.value === 'en' && item.nameEn ? item.nameEn : item.name;
const copy = {
  zh: { home: '首页', breadcrumb: '频道导航', tags: '频道标签', all: '全部报道', latest: '更多报道', empty: '当前频道或标签下暂无已发布文章。' },
  en: { home: 'Home', breadcrumb: 'Channel navigation', tags: 'Channel topics', all: 'All stories', latest: 'More stories', empty: 'There are no published stories in this channel or topic.' },
} as const;
const text = computed(() => copy[language.value]);
const descriptions: Record<string, { zh: string; en: string }> = {
  canada: { zh: '关注加拿大政策、教育、移民与社会生活的重要变化。', en: 'Reporting the policies, education, immigration and social changes shaping Canada.' },
  world: { zh: '观察全球局势、外交关系与跨国议题的发展脉络。', en: 'Tracking global affairs, diplomacy and the issues connecting countries.' },
  technology: { zh: '理解人工智能、数字产业与创新如何改变现实世界。', en: 'Understanding how AI, digital industries and innovation reshape the world.' },
  business: { zh: '解读市场趋势、企业创新与中加经贸合作机会。', en: 'Explaining markets, business innovation and China–Canada economic ties.' },
  society: { zh: '记录华人社区、城市生活与普通人的真实故事。', en: 'Stories from Chinese communities, city life and the people within them.' },
};
const channelDescription = computed(() => descriptions[slug.value]?.[language.value] || '');
useHead({ title: () => category.value ? localizedName(category.value) : '' });
</script>
