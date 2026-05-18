/**
 * Minimal Lexical → HTML renderer for the rich text fields produced by
 * Payload v3's lexicalEditor. Handles the nodes a content site actually
 * needs (paragraphs, headings, lists, links, formatting, line breaks).
 *
 * For more exotic nodes (uploads, blocks, equations…) add a case in
 * renderNode below.
 */

type LexicalText = {
  type: 'text';
  text: string;
  format?: number; // bitfield: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
};

type LexicalElement = {
  type: string;
  tag?: string;
  format?: string | number;
  listType?: 'bullet' | 'number';
  url?: string;
  newTab?: boolean;
  children?: LexicalNode[];
  value?: unknown;
  fields?: Record<string, unknown>;
};

export type LexicalNode = LexicalText | LexicalElement;

export type LexicalRoot = {
  root: { children?: LexicalNode[] };
};

const FMT_BOLD = 1;
const FMT_ITALIC = 2;
const FMT_STRIKETHROUGH = 4;
const FMT_UNDERLINE = 8;
const FMT_CODE = 16;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wrapFormat(text: string, format: number): string {
  let out = escapeHtml(text);
  if (format & FMT_CODE) out = `<code>${out}</code>`;
  if (format & FMT_BOLD) out = `<strong>${out}</strong>`;
  if (format & FMT_ITALIC) out = `<em>${out}</em>`;
  if (format & FMT_UNDERLINE) out = `<u>${out}</u>`;
  if (format & FMT_STRIKETHROUGH) out = `<s>${out}</s>`;
  return out;
}

function renderChildren(children: LexicalNode[] | undefined): string {
  if (!children?.length) return '';
  return children.map(renderNode).join('');
}

function renderNode(node: LexicalNode): string {
  if (node.type === 'text') {
    const t = node as LexicalText;
    return wrapFormat(t.text ?? '', t.format ?? 0);
  }

  const el = node as LexicalElement;
  const inner = renderChildren(el.children);

  switch (el.type) {
    case 'paragraph':
      return `<p>${inner}</p>`;
    case 'heading': {
      const level = el.tag && /^h[1-6]$/.test(el.tag) ? el.tag : 'h2';
      return `<${level}>${inner}</${level}>`;
    }
    case 'quote':
      return `<blockquote>${inner}</blockquote>`;
    case 'list': {
      const t = el.listType === 'number' ? 'ol' : 'ul';
      return `<${t}>${inner}</${t}>`;
    }
    case 'listitem':
      return `<li>${inner}</li>`;
    case 'link': {
      const url = (el.fields as { url?: string })?.url ?? el.url ?? '#';
      const target = el.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escapeHtml(url)}"${target}>${inner}</a>`;
    }
    case 'linebreak':
      return '<br />';
    case 'horizontalrule':
      return '<hr />';
    case 'root':
      return inner;
    default:
      return inner;
  }
}

export function lexicalToHtml(data: LexicalRoot | null | undefined): string {
  if (!data?.root?.children) return '';
  return renderChildren(data.root.children);
}
