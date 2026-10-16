// Helpers for rich-text HTML saved from the dashboard's TinyMCE editor.

// The CMS emits raw <table> markup with cramped inline styles. Wrap each table
// so globals.css (.blog-content) can restyle it: multi-cell tables become
// scrollable data grids, single-cell tables become callout boxes.
export const wrapTables = (html: string) =>
  html.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi, (_m, attrs, inner) => {
    const cellCount = (inner.match(/<t[dh]\b/gi) || []).length;
    const isCallout = cellCount <= 1;
    const wrapClass = isCallout ? 'blog-callout-wrap' : 'blog-table-wrap';
    const tableClass = isCallout ? 'blog-callout' : 'blog-data-table';
    const cleanAttrs = attrs.replace(/\sclass=("[^"]*"|'[^']*')/i, '');
    return `<div class="${wrapClass}"><table class="${tableClass}"${cleanAttrs}>${inner}</table></div>`;
  });

const plainText = (cellHtml: string) =>
  cellHtml
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/"/g, '&quot;')
    .trim();

// Marks each table's first row as its header and copies the header text onto
// the cells below as data-label, so phones can show every row as a labelled
// card (.stack-tables in globals.css) instead of squeezing the columns.
export const labelTableCells = (html: string) =>
  html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => {
    const rows = table.match(/<tr\b[\s\S]*?<\/tr>/gi) || [];
    const [headRow] = rows;
    if (!headRow || rows.length < 2) return table;
    const labels = (headRow.match(/<t[hd]\b[^>]*>[\s\S]*?<\/t[hd]>/gi) || []).map(plainText);
    let rowIndex = 0;
    return table.replace(/<tr\b[\s\S]*?<\/tr>/gi, (row) => {
      if (rowIndex++ === 0) return row.replace(/^<tr\b/i, '<tr data-head-row');
      let col = 0;
      return row.replace(/<td\b/gi, () => `<td data-label="${labels[col++] ?? ''}"`);
    });
  });

// Editors split a category description with TinyMCE's Insert > Page break,
// which is saved as <!-- pagebreak --> (sometimes inside its own <p>). The
// text before it always shows; the rest stays hidden behind Read More.
const READ_MORE_BREAK = /(?:<p\b[^>]*>\s*)?<!--\s*pagebreak\s*-->(?:\s*<\/p>)?/i;

export const splitReadMore = (html: string) => {
  const match = READ_MORE_BREAK.exec(html);
  if (!match) return { intro: html, more: '' };
  return {
    intro: html.slice(0, match.index),
    more: html.slice(match.index + match[0].length).trim()
  };
};
