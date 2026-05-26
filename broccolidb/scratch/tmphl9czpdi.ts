import { setDbPath } from './infrastructure/db/Config.js';
const __hermesDb = process.env.HERMES_BROCCOLIDB_DB;
if (__hermesDb) setDbPath(__hermesDb);

import * as path from 'path';
import * as fs from 'fs';

async function run() {
  const cwd = process.cwd();
  try {
    
    const jz = await import('../utils/joy-zoning.js');
    const { SpiderEngine } = await import('../core/policy/SpiderEngine.js');
    
    const files = ["app/layout.tsx", "app/page.tsx"];
    const spider = new SpiderEngine(process.cwd());
    await spider.warmUp();

    const singleResults = [];
    let hasLayeringCheck = false;
    const layeringViolations = [];

    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        const stat = fs.statSync(file);
        if (stat.isDirectory()) continue;

        // Skip binary and non-JS/TS/JSON files
        if (!file.match(/\.[jt]sx?$/)) continue;

        // Run single-file tag checks
        const check = await jz.checkSingleFile(file);
        if (!check.valid) {
            singleResults.push({
                file,
                layer: check.layer,
                errors: check.errors,
            });
        }

        // Run dependency layering check
        const node = spider.nodes.get(file);
        if (node) {
            hasLayeringCheck = true;
            const sourceLayer = node.layer || jz.getLayer(node.path);
            
            // Domain & Core cannot import Infrastructure or UI
            const FORBIDDEN = {
                'domain': ['infrastructure', 'ui'],
                'core': ['infrastructure', 'ui'],
            };
            
            const forbidden = FORBIDDEN[sourceLayer];
            if (forbidden) {
                for (const imp of node.imports) {
                    const resolved = node.resolvedImports.get(imp.specifier);
                    if (!resolved) continue;
                    const targetNode = spider.nodes.get(resolved);
                    if (!targetNode) continue;
                    const targetLayer = targetNode.layer || jz.getLayer(targetNode.path);

                    if (forbidden.includes(targetLayer)) {
                        const err = `${sourceLayer} layer in ${file} cannot import from ${targetLayer} (${resolved}).`;
                        let existing = singleResults.find(r => r.file === file);
                        if (!existing) {
                            existing = { file, layer: sourceLayer, errors: [] };
                            singleResults.push(existing);
                        }
                        existing.errors.push(err);
                        layeringViolations.push({
                            file,
                            sourceLayer,
                            target: resolved,
                            targetLayer,
                            importSpec: imp.specifier,
                        });
                    }
                }
            }
        }
    }

    console.log(JSON.stringify({
        success: singleResults.length === 0,
        singleResults,
        layeringViolations,
        hasLayeringCheck,
    }));
    
  } catch (err) {
    console.log(JSON.stringify({
      success: false,
      error: err instanceof Error ? err.message : String(err),
      error_code: 'RUNTIME_ERROR',
    }));
  }
  process.exit(0);
}
run();
