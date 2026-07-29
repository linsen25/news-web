import type { ArticleDTO } from '~/types/article';

export const publicArticles: ArticleDTO[] = [
  {
    id: 'article-001',
    slug: 'generative-ai-newsroom',
    title: '生成式 AI 正在改变新闻编辑流程',
    summary: '从资料整理到内容校对，AI 工具正在成为编辑部的新助手。真正重要的问题，是如何保留人的判断。',
    content: {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: '生成式 AI 正在进入新闻生产的多个环节，从采访资料整理、文本转写，到标题建议和内容校对，都出现了新的工作方式。' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '工具之外，判断仍是核心' }] },
        { type: 'paragraph', content: [{ type: 'text', text: '速度不是新闻工作的唯一尺度。事实核查、来源判断和公共价值仍然需要编辑负责。' }] },
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: '新闻的可信度，最终来自透明的方法与可以负责的人。' }] }] },
      ],
    },
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=85',
    author: { id: 'user-author', name: '林作者' },
    currentEditor: { id: 'user-editor', name: '陈编辑' },
    category: { id: 'cat-ai', name: 'AI', slug: 'ai' },
    tags: [
      { id: 'tag-openai', name: 'OpenAI', slug: 'openai' },
      { id: 'tag-chatgpt', name: 'ChatGPT', slug: 'chatgpt' },
    ],
    status: 'published',
    createdAt: '2026-07-20T08:00:00.000Z',
    updatedAt: '2026-07-22T10:30:00.000Z',
    publishedAt: '2026-07-22T12:00:00.000Z',
  },
  {
    id: 'article-004',
    slug: 'city-heat-public-space',
    title: '城市如何为持续高温重新设计公共空间',
    summary: '树荫、饮水点和开放时间，正在成为城市韧性的新指标。',
    content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '多个城市开始重新评估公共空间在高温天气中的作用。' }] }] },
    coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=85',
    author: { id: 'user-editor', name: '周闻' },
    currentEditor: { id: 'user-editor', name: '周闻' },
    category: { id: 'cat-news', name: '城市', slug: 'city' },
    tags: [{ id: 'tag-policy', name: '城市', slug: 'city' }],
    status: 'published',
    createdAt: '2026-07-20T08:00:00.000Z',
    updatedAt: '2026-07-21T09:00:00.000Z',
    publishedAt: '2026-07-21T09:00:00.000Z',
  },
];
