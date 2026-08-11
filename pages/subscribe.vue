<template>
  <div class="container subscription-page">
    <p class="eyebrow">SUBSCRIPTION SERVICE</p>
    <h1>{{ text.title }}</h1>
    <p class="subscription-lead">{{ text.introduction }}</p>
    <section class="subscription-grid">
      <article><span>01</span><h2>{{ text.daily }}</h2><p>{{ text.dailyCopy }}</p></article>
      <article><span>02</span><h2>{{ text.weekly }}</h2><p>{{ text.weeklyCopy }}</p></article>
      <article><span>03</span><h2>{{ text.custom }}</h2><p>{{ text.customCopy }}</p></article>
    </section>
    <div class="subscription-coming"><strong>{{ text.coming }}</strong><p>{{ text.notice }}</p></div>
  </div>
</template>

<script setup lang="ts">
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const copy = {
  zh: { title: '让重要新闻主动抵达', introduction: '未来这里将提供中加网的文章推送、主题简报和企业新闻订阅服务。', daily: '每日新闻', dailyCopy: '每天精选重要新闻与政策变化。', weekly: '每周简报', weeklyCopy: '一封邮件回顾本周值得关注的中加动态。', custom: '主题订阅', customCopy: '按加拿大政策、移民、科技或社区等主题订阅。', coming: '订阅功能即将开放', notice: '当前页面为服务展示，暂不收集邮箱或产生费用。' },
  en: { title: 'News that reaches you', introduction: 'Article alerts, topic briefings, and enterprise subscriptions will be available here.', daily: 'Daily News', dailyCopy: 'A daily selection of major stories and policy updates.', weekly: 'Weekly Briefing', weeklyCopy: 'A concise review of the week across Canada and Chinese communities.', custom: 'Topic Alerts', customCopy: 'Follow policy, immigration, technology, community, and more.', coming: 'Subscriptions are coming soon', notice: 'This is a preview page. No email addresses or payments are collected yet.' },
} as const;
const text = computed(() => copy[language.value]);
useHead({ title: () => text.value.title });
</script>
