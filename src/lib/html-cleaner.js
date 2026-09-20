/**
 * 清理 Typora 导出的 HTML 内容
 * 从原文章详情页提取出来，build.js 和 server.js 共用
 */

/**
 * 清理 Typora 代码块中的 CodeMirror 编辑器结构
 */
function cleanCodeBlocks(html) {
  const fenceRegex = /<pre[^>]*class=["'][^"']*md-fences[^"']*["'][^>]*>/gi;
  const matches = [];
  let m;
  while ((m = fenceRegex.exec(html)) !== null) {
    matches.push({ start: m.index, match: m[0] });
  }

  for (let i = matches.length - 1; i >= 0; i--) {
    const { start, match } = matches[i];

    let depth = 1;
    let pos = start + match.length;
    let endPos = -1;

    while (depth > 0 && pos < html.length) {
      const nextPre = html.indexOf('<pre', pos);
      const nextClose = html.indexOf('</pre>', pos);
      if (nextClose === -1) break;
      if (nextPre !== -1 && nextPre < nextClose) {
        depth++;
        pos = nextPre + 4;
      } else {
        depth--;
        pos = nextClose + 6;
      }
    }

    if (depth !== 0) continue;

    endPos = pos;
    const innerContent = html.substring(start + match.length, endPos - 6);

    const langMatch = match.match(/lang=["']([^"']+)["']/);
    const lang = langMatch ? langMatch[1] : '';

    const codeLines = [];
    let lineMatch;
    const lineRegex = /<pre[^>]*class=["']\s*CodeMirror-line\s*["'][^>]*>([\s\S]*?)<\/pre>/g;
    while ((lineMatch = lineRegex.exec(innerContent)) !== null) {
      const text = lineMatch[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();
      codeLines.push(text);
    }

    let codeText;
    if (codeLines.length > 0) {
      codeText = codeLines.join('\n');
    } else {
      codeText = innerContent
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
    }

    const replacement = `<pre><code${lang ? ` class="language-${lang}"` : ''}>${codeText}</code></pre>`;
    html = html.substring(0, start) + replacement + html.substring(endPos);
  }

  return html;
}

/**
 * 保护数学公式内容不被清理
 */
function protectMathContent(html) {
  html = html.replace(/<script[^>]*type=["']math\/tex[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, (match) => {
    return `<!-- MATH_PROTECTED -->${match}<!-- END_MATH_PROTECTED -->`;
  });
  html = html.replace(/<mjx-container[^>]*>[\s\S]*?<\/mjx-container>/gi, (match) => {
    return `<!-- MATH_PROTECTED -->${match}<!-- END_MATH_PROTECTED -->`;
  });
  html = html.replace(/<math[^>]*>[\s\S]*?<\/math>/gi, (match) => {
    return `<!-- MATH_PROTECTED -->${match}<!-- END_MATH_PROTECTED -->`;
  });
  return html;
}

/**
 * 恢复被保护的数学公式内容
 */
function restoreMathContent(html) {
  html = html.replace(/<!-- MATH_PROTECTED -->([\s\S]*?)<!-- END_MATH_PROTECTED -->/g, '$1');
  return html;
}

/**
 * 清理 Typora 导出的 HTML 内容（对外主入口）
 */
function cleanTyporaHtml(html) {
  html = protectMathContent(html);

  let cleaned = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*class=["'][^"']*typora-export-content[^"']*["'][^>]*>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*id=["']write["'][^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/div>\s*<\/div>\s*<\/div>/gi, '</div>');

  cleaned = cleanCodeBlocks(cleaned);

  cleaned = cleaned.replace(/\sstyle=["'][^"']*["']/gi, (match) => {
    if (/width|height|max-width|max-height/i.test(match)) return match;
    return '';
  });

  cleaned = cleaned.replace(/\sclass=["'][^"']*["']/gi, (match) => {
    if (/math|MathJax|mjx/i.test(match)) return match;
    return '';
  });

  cleaned = cleaned.replace(/\sdata-[a-z-]+=["'][^"']*["']/gi, '');
  cleaned = cleaned.replace(/<p>\s*(?:&nbsp;|\s|<br\s*\/?>)*\s*<\/p>/gi, '');

  cleaned = cleaned.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, (match, content) => {
    if (/math|MathJax|mjx|\\[a-zA-Z]+/.test(content)) return match;
    return content;
  });

  cleaned = cleaned.replace(/<sup(?![^>]*class=["'][^"']*math[^"']*["'])[^>]*>[\s\S]*?<\/sup>/gi, '');
  cleaned = cleaned.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
  cleaned = cleaned.replace(/\swriting-mode[^;]*;?/gi, '');

  cleaned = restoreMathContent(cleaned);

  return cleaned.trim();
}

module.exports = { cleanTyporaHtml };
