import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '../src');
const allowed = {
    domain: ['domain'],
    application: ['application', 'domain'],
    infrastructure: ['infrastructure', 'application', 'domain'],
    bootstrap: ['bootstrap', 'infrastructure', 'application', 'domain'],
    presentation: ['presentation', 'bootstrap', 'application', 'domain'],
};

function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(file) : file.endsWith('.ts') ? [file] : [];
    });
}

let count = 0;
for (const file of walk(root)) {
    const relative = path.relative(root, file);
    const layer = relative.split(path.sep)[0];
    assert.ok(allowed[layer], `Unknown layer: ${relative}`);
    const source = ts.createSourceFile(
        file,
        fs.readFileSync(file, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
    );
    function checkImport(specifier) {
        assert.ok(ts.isStringLiteral(specifier), `Nonliteral import: ${relative}`);
        const target = specifier.text;
        if (!target.startsWith('.')) {
            assert.ok(
                !['domain', 'application'].includes(layer),
                `Core imports runtime dependency: ${relative} -> ${target}`,
            );
            return;
        }
        const resolved = path.resolve(path.dirname(file), target);
        assert.ok(resolved.startsWith(root + path.sep), `Import escapes src: ${relative}`);
        assert.ok(fs.existsSync(resolved), `Missing import: ${relative} -> ${target}`);
        const targetLayer = path.relative(root, resolved).split(path.sep)[0];
        assert.ok(
            allowed[layer].includes(targetLayer),
            `Forbidden layer import: ${relative} -> ${target}`,
        );
        if (relative.startsWith(`presentation${path.sep}ui${path.sep}`)) {
            assert.ok(
                !['bootstrap', 'infrastructure'].includes(targetLayer),
                `UI imports privileged implementation: ${relative}`,
            );
        }
    }
    function visit(node) {
        if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier)
            checkImport(node.moduleSpecifier);
        if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
            assert.equal(node.arguments.length, 1, `Invalid dynamic import: ${relative}`);
            checkImport(node.arguments[0]);
        }
        if (
            ts.isCallExpression(node) &&
            ts.isIdentifier(node.expression) &&
            node.expression.text === 'require'
        ) {
            assert.fail(`CommonJS require is not allowed in ESM src: ${relative}`);
        }
        ts.forEachChild(node, visit);
    }
    visit(source);
    count += 1;
}
console.log(`Architecture checks passed for ${count} TypeScript files.`);
