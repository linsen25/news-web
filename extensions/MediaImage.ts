import { mergeAttributes } from '@tiptap/core';
import Image from '@tiptap/extension-image';

export const MediaImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-caption'),
        renderHTML: (attributes) =>
          attributes.caption
            ? { 'data-caption': attributes.caption as string }
            : {},
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...imageAttributes } = HTMLAttributes;
    const src = typeof imageAttributes.src === 'string' && imageAttributes.src.includes('/image/upload/')
      ? imageAttributes.src.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_1400,c_limit/')
      : imageAttributes.src;
    return [
      'figure',
      { class: 'media-image' },
      ['img', mergeAttributes(this.options.HTMLAttributes, imageAttributes, { src, loading:'lazy', decoding:'async' })],
      ...(caption ? [['figcaption', {}, String(caption)]] : []),
    ] as never;
  },
});
