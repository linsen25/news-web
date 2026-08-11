<template>
  <div class="container about-page">
    <header class="about-hero">
      <p class="eyebrow">ABOUT ZHONGJIA</p>
      <h1>{{ text.title }}</h1>
      <p>{{ text.lead }}</p>
    </header>

    <section class="about-story">
      <div><span>01</span><h2>{{ text.originTitle }}</h2></div>
      <div><p>{{ text.originOne }}</p><p>{{ text.originTwo }}</p></div>
    </section>
    <section class="about-story">
      <div><span>02</span><h2>{{ text.focusTitle }}</h2></div>
      <div><p>{{ text.focus }}</p></div>
    </section>
    <section class="about-story">
      <div><span>03</span><h2>{{ text.principlesTitle }}</h2></div>
      <div class="principles-grid">
        <article><strong>{{ text.accuracy }}</strong><p>{{ text.accuracyCopy }}</p></article>
        <article><strong>{{ text.clarity }}</strong><p>{{ text.clarityCopy }}</p></article>
        <article><strong>{{ text.community }}</strong><p>{{ text.communityCopy }}</p></article>
      </div>
    </section>

    <aside class="independence-note">
      <strong>{{ text.independentTitle }}</strong>
      <p>{{ text.independent }}</p>
    </aside>
  </div>
</template>

<script setup lang="ts">
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const copy = {
  zh: {
    title: '理解加拿大，也连接华人世界',
    lead: '中加网是一个面向加拿大及全球中文读者的数字新闻平台。我们希望用清晰、可靠且贴近现场的内容，帮助读者理解正在发生的变化。',
    originTitle: '我们的开始', originOne: '中加网于 2026 年启动建设，从一套服务新闻采编、审核、发布与阅读的数字内容平台开始。', originTwo: '平台仍处于创立和完善阶段，未来将逐步发展原创报道、专题内容、社区资讯与中英文新闻服务。',
    focusTitle: '关注方向', focus: '我们关注加拿大公共政策、经济、科技、移民、教育与社区生活，也关注中国、加拿大及全球华人之间的交流与联系。',
    principlesTitle: '编辑原则', accuracy: '准确', accuracyCopy: '区分事实、观点与推测，及时更正错误。', clarity: '清晰', clarityCopy: '减少不必要的行话，让复杂议题容易理解。', community: '连接', communityCopy: '倾听不同背景读者的经验，关注真实社区。',
    independentTitle: '独立说明', independent: '中加网目前为独立建设的新闻平台，不是新华社、新华网、中国新闻社或其他新闻机构的分社、子公司或官方频道。任何未来合作关系均会在网站上明确披露。',
  },
  en: {
    title: 'Understanding Canada, connecting Chinese communities',
    lead: 'Zhongjia is a digital news platform for readers in Canada and Chinese-speaking communities worldwide, built around clear, reliable, and grounded reporting.',
    originTitle: 'Our Beginning', originOne: 'Zhongjia began development in 2026 as a digital platform supporting newsroom editing, review, publishing, and reading.', originTwo: 'The platform is still evolving and will gradually expand into original reporting, special coverage, community news, and bilingual services.',
    focusTitle: 'Our Focus', focus: 'We cover Canadian public policy, the economy, technology, immigration, education, and community life, alongside connections between China, Canada, and Chinese communities worldwide.',
    principlesTitle: 'Editorial Principles', accuracy: 'Accuracy', accuracyCopy: 'Separate fact, opinion, and inference, and correct errors promptly.', clarity: 'Clarity', clarityCopy: 'Make complex issues understandable without unnecessary jargon.', community: 'Connection', communityCopy: 'Listen to people with different backgrounds and remain grounded in real communities.',
    independentTitle: 'Independence', independent: 'Zhongjia is independently developed. It is not a bureau, subsidiary, or official channel of Xinhua News Agency, Xinhua News, China News Service, or any other news organization. Any future partnership will be disclosed clearly.',
  },
} as const;
const text = computed(() => copy[language.value]);
useHead({ title: () => language.value === 'zh' ? '关于中加网' : 'About Zhongjia' });
</script>
