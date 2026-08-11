import type { components } from './generated/api';

export type ArticleDTO = components['schemas']['ArticleDto'];
export type ArticleStatus = ArticleDTO['status'];
export type TipTapDocument = components['schemas']['TipTapDocumentDto'];
export type TipTapNode = components['schemas']['TipTapNodeDto'];
export type WithdrawalNoticeDTO = components['schemas']['WithdrawalNoticeDto'] & { withdrawn: true };
export type PublicArticleDetail = ArticleDTO | WithdrawalNoticeDTO;
