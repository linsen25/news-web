<template>
  <div class="container about-page">
    <header class="about-hero">
      <p class="eyebrow">ABOUT CHINA CANADA NET</p>
      <h1>{{ text.title }}</h1>
      <p>{{ text.lead }}</p>
    </header>

    <section class="about-introduction">
      <p v-for="paragraph in text.introduction" :key="paragraph">{{ paragraph }}</p>
    </section>

    <header class="services-heading">
      <p class="eyebrow">PRODUCTS & SERVICES</p>
      <h2>{{ text.servicesTitle }}</h2>
      <p>{{ text.servicesLead }}</p>
    </header>

    <section v-for="(group, groupIndex) in text.groups" :key="group.title" class="service-group">
      <div class="service-group-heading">
        <span>0{{ groupIndex + 1 }}</span>
        <div><h2>{{ group.title }}</h2><p>{{ group.introduction }}</p></div>
      </div>
      <div class="service-grid">
        <article v-for="(item, itemIndex) in group.items" :key="item.title" class="service-card">
          <span>{{ String(itemIndex + 1).padStart(2, '0') }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const copy = {
  zh: {
    title: '中加网（China Canada Net）是连接中国与加拿大的权威综合性网络门户',
    lead: '汇聚双边资讯与优质资源，建设集资讯发布、精准对接与业务支持于一体的一站式服务平台。',
    introduction: [
      '中加网（China Canada Net）是加拿大综合性权威网络门户，致力于打造中加两国资讯与资源共享的一站式服务平台。平台立足中加双边交流核心需求，深度聚焦政治、经济、教育、科技、文化及社会发展等关键领域，通过整合双边优质资源，构建起集资讯发布、精准对接与业务支持于一体的全方位服务体系。',
      '作为联结中加两国社会的重要桥梁与纽带，中加网持续推动双边交流与公共对话，促进双方在全方位、多层次、宽领域的务实合作，不断提升国际传播能力与专业服务能级，全力打造兼具广泛影响力与高度公信力的跨国综合性交流平台。',
    ],
    servicesTitle: '核心产品与服务',
    servicesLead: '围绕公共关系、双边活动和媒体传播三大方向，为中加两国机构、企业与社会组织提供专业支持。',
    groups: [
      {
        title: '公共关系服务',
        introduction: '依托深耕中加两地的资源网络与专业服务团队，为政府机构、市场主体及社会组织提供全链条公共关系解决方案，覆盖品牌管理、政务对接、媒体运维、危机应对等核心场景，助力客户在双边市场构建良好声誉、拓展合作空间。',
        items: [
          { title: '品牌形象管理', description: '结合中加两地市场特性与客户发展定位，提供品牌战略定位、形象体系塑造、传播路径规划及市场口碑运维等全流程服务，助力客户在双边市场建立清晰、正向的品牌认知与市场影响力。' },
          { title: '两国政府关系支持', description: '基于对中加两国政策体系、政务规则与产业导向的深度研判，为双边机构、企业提供政策解读、政务对接、合规咨询及公共事务协调等专业支持，搭建政企高效沟通的畅通渠道。' },
          { title: '媒体关系拓展与维护', description: '整合中加两国主流媒体、行业媒体及新媒体资源，为客户提供媒体对接、采访协调、关系长效维护等服务，构建稳定多元的媒体传播网络，夯实客户传播发声的渠道基础。' },
          { title: '危机传播策略制定', description: '针对突发舆情与公共事件，提供全天候舆情研判、快速响应方案、传播路径引导及危机公关体系搭建服务，助力客户有效管控声誉风险，妥善应对各类公共关系突发状况。' },
        ],
      },
      {
        title: '活动策划与执行',
        introduction: '聚焦中加双边经贸往来、文化互鉴、教育合作等领域的交流需求，提供从方案策划、资源整合、嘉宾邀约到现场落地的全流程一站式活动服务，推动双边各领域务实合作落地见效。',
        items: [
          { title: '双边企业出海一站式服务', description: '面向中加两国跨境拓展的企业主体，提供目标市场调研、本地资源对接、品牌落地推广、商务合作匹配等全周期服务，助力企业快速适配海外市场环境，降低跨境运营成本，提升出海拓展效率。' },
          { title: '中加双边论坛与品牌推广业务', description: '策划并执行高端行业论坛、主题峰会、品牌发布会、产业推介会等各类活动，联动中加政商学界核心资源，打造高规格交流场景，助力客户传递核心价值、拓展行业话语权与市场影响力。' },
          { title: '文化、教育及商务交流项目', description: '策划运营中加文化展演、教育合作对接、商务考察互访、行业主题沙龙等多元交流项目，打通两国民间与行业的互动渠道，推动跨领域、多层次的深度交流与务实合作。' },
        ],
      },
      {
        title: '媒体发布与宣传',
        introduction: '依托全球多语种主流媒体矩阵与全平台传播渠道，为客户提供内容生产、分发传播、运营推广的整合营销传播服务，实现品牌与信息在中加两地及全球范围的精准、高效触达。',
        items: [
          { title: '全球多语种主流媒体信息分发', description: '联动中加及全球范围内的多语种主流媒体渠道，覆盖纸媒、新闻网站、移动端终端等多元载体，为客户提供新闻通稿、专题内容的定制化分发服务，有效扩大信息传播半径与受众覆盖范围。' },
          { title: '多平台媒体运维传播', description: '为客户提供官方网站、社交媒体账号、新媒体平台等多端口的内容运营与传播推广服务，结合不同平台的传播特性定制内容策略，实现品牌的持续曝光与目标用户的深度触达。' },
          { title: '专题报道与视频制作', description: '围绕客户核心诉求，策划制作深度专题报道、主题宣传片、纪录短视频、图文特稿等多元内容产品，以图文、音视频融合的融媒体形态，强化传播内容的深度与感染力，提升传播实效。' },
        ],
      },
    ],
  },
  en: {
    title: 'China Canada Net is an authoritative comprehensive digital portal connecting China and Canada',
    lead: 'Sharing bilateral information and quality resources through an integrated platform for news, targeted connections, and professional support.',
    introduction: [
      "China Canada Net is Canada's authoritative comprehensive digital portal. It provides a one-stop platform for China–Canada information and resource sharing, with a focus on politics, business, education, technology, culture, and social development.",
      'As a bridge between the two societies, China Canada Net promotes bilateral exchange, public dialogue, and practical cooperation while strengthening international communications and professional cross-border services.',
    ],
    servicesTitle: 'Core Products and Services',
    servicesLead: 'Professional support for institutions, businesses, and organizations across public relations, bilateral events, and media communications.',
    groups: [
      { title: 'Public Relations Services', introduction: 'End-to-end public relations solutions built on professional teams and networks across China and Canada.', items: [
        { title: 'Brand Image Management', description: 'Brand positioning, identity development, communications planning, and reputation management tailored to both markets.' },
        { title: 'Government Relations Support', description: 'Policy interpretation, government engagement, compliance consultation, and public affairs coordination.' },
        { title: 'Media Relations', description: 'Media outreach, interview coordination, and long-term relationship management across mainstream, trade, and digital media.' },
        { title: 'Crisis Communications', description: 'Issue monitoring, rapid-response planning, communications guidance, and reputation risk management.' },
      ] },
      { title: 'Event Planning and Execution', introduction: 'Full-service programs for bilateral trade, cultural exchange, and education cooperation, from strategy through on-site delivery.', items: [
        { title: 'Cross-Border Market Entry Services', description: 'Market research, local connections, brand launch support, and partnership matching for businesses expanding between China and Canada.' },
        { title: 'Bilateral Forums and Brand Promotion', description: 'Industry forums, summits, launches, and investment events connecting government, business, and academic leaders.' },
        { title: 'Cultural, Educational, and Business Exchange', description: 'Cultural programs, education partnerships, business delegations, and industry events that turn dialogue into practical cooperation.' },
      ] },
      { title: 'Media Publishing and Promotion', introduction: 'Integrated content production, distribution, and promotion through multilingual media and cross-platform channels.', items: [
        { title: 'Global Multilingual Distribution', description: 'Customized distribution of press releases and features through print, digital, and mobile media channels worldwide.' },
        { title: 'Multi-Platform Media Operations', description: 'Content strategy and ongoing operations for websites, social accounts, and emerging media platforms.' },
        { title: 'Features and Video Production', description: 'In-depth features, promotional films, documentary shorts, and multimedia storytelling designed for reach and impact.' },
      ] },
    ],
  },
} as const;
const text = computed(() => copy[language.value]);
useHead({ title: () => language.value === 'zh' ? '关于中加网' : 'About China Canada Net' });
</script>
