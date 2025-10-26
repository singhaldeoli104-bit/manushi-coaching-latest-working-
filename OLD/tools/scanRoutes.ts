// tools/scanRoutes.ts
import { Project, SyntaxKind } from "ts-morph";
import path from "path";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
project.addSourceFilesAtPaths("src/**/*.{ts,tsx}");

type Row = { path: string; kind: string; exports: string[]; routes: string[] };

const rows: Row[] = [];

for (const sf of project.getSourceFiles()) {
  const filePath = sf.getFilePath();
  const text = sf.getFullText();
  const lower = text.toLowerCase();
  const kind =
    filePath.includes("/screens/") ? "screen" :
    /create(bottom|native|material)/i.test(text) ? "navigator" :
    filePath.includes("/components/") ? "component" :
    filePath.includes("/theme/") ? "theme" :
    filePath.includes("/hooks/") ? "hook" : "misc";

  // exported identifiers
  const exports = sf.getExportedDeclarations()
    .map(([name]) => name)
    .filter(Boolean);

  // route names from Tab/Stack.Screen name="..."
  const routes: string[] = [];
  sf.forEachDescendant((node) => {
    if (node.getKind() === SyntaxKind.JsxSelfClosingElement || node.getKind() === SyntaxKind.JsxOpeningElement) {
      const tag = (node as any).getTagNameNode()?.getText?.() || "";
      if (/^(Tab|Stack|NativeStack|MaterialTopTab)\.Screen$/.test(tag)) {
        const nameAttr = (node as any).getAttributes?.().find((a: any) => a.getName?.() === "name");
        const routeName = nameAttr?.getInitializer()?.getText()?.replace(/['"`]/g, "");
        if (routeName) routes.push(routeName);
      }
    }
  });

  rows.push({ path: path.relative(process.cwd(), filePath), kind, exports, routes });
}

console.log(JSON.stringify(rows, null, 2));
