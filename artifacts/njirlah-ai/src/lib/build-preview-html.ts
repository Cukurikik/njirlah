import type { AgentFile } from "@/types/agent-types";

function guessLanguage(filename: string): "html" | "css" | "js" | "jsx" | "unknown" {
  if (filename.endsWith(".html")) return "html";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".jsx") || filename.endsWith(".tsx")) return "jsx";
  if (filename.endsWith(".js") || filename.endsWith(".ts")) return "js";
  return "unknown";
}

export function buildPreviewHtml(files: Record<string, AgentFile>): string {
  const fileValues = Object.values(files).filter((f) => f.content.trim());

  const htmlFile = fileValues.find((f) => guessLanguage(f.filename) === "html");
  const cssFiles = fileValues.filter((f) => guessLanguage(f.filename) === "css");
  const jsxFiles = fileValues.filter(
    (f) => guessLanguage(f.filename) === "jsx",
  );
  const jsFiles = fileValues.filter((f) => guessLanguage(f.filename) === "js");

  const hasJsx = jsxFiles.length > 0;

  if (htmlFile && !hasJsx) {
    let html = htmlFile.content;
    for (const css of cssFiles) {
      html = html.replace(
        /<\/head>/i,
        `<style>\n${css.content}\n</style>\n</head>`,
      );
    }
    for (const js of jsFiles) {
      html = html.replace(
        /<\/body>/i,
        `<script>\n${js.content}\n</script>\n</body>`,
      );
    }
    return html;
  }

  if (hasJsx) {
    const cssContent = cssFiles.map((f) => f.content).join("\n\n");
    const jsxContent = jsxFiles.map((f) => f.content).join("\n\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NJIRLAH AI Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; }
    ${cssContent}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    ${jsxContent}
    
    const rootEl = document.getElementById('root');
    if (rootEl) {
      const root = ReactDOM.createRoot(rootEl);
      root.render(React.createElement(typeof App !== 'undefined' ? App : 'div', null, 
        typeof App === 'undefined' ? 'App component not found' : null
      ));
    }
  </script>
</body>
</html>`;
  }

  if (htmlFile) {
    return htmlFile.content;
  }

  const cssContent = cssFiles.map((f) => f.content).join("\n\n");
  const jsContent = jsFiles.map((f) => f.content).join("\n\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NJIRLAH AI Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; }
    ${cssContent}
  </style>
</head>
<body>
  ${fileValues.filter(f => guessLanguage(f.filename) === "unknown").map(f => f.content).join("\n")}
  ${jsContent ? `<script>\n${jsContent}\n</script>` : ""}
</body>
</html>`;
}

export function getFileLanguage(filename: string): string {
  if (filename.endsWith(".html")) return "html";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".jsx")) return "jsx";
  if (filename.endsWith(".tsx")) return "tsx";
  if (filename.endsWith(".ts")) return "typescript";
  if (filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".json")) return "json";
  if (filename.endsWith(".md")) return "markdown";
  return "text";
}
