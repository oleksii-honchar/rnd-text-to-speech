// TextSource

export const TextSourceTypes = {
  TEXT: 'TEXT',
  EPUB: 'EPUB',
};

export type TextSourceType = (typeof TextSourceTypes)[keyof typeof TextSourceTypes];

export const TextSourceStatuses = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};
