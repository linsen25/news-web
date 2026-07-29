import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import type { TipTapDocument } from '~/types/article';
import { MediaImage } from '~/extensions/MediaImage';

export const renderTipTap = (content: TipTapDocument): string =>
  generateHTML(content, [StarterKit, MediaImage]);
