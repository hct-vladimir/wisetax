import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
assert.equal(pkg.name, 'wisetax-desktop');
assert.equal(pkg.private, true);
assert.equal(
    pkg.scripts.validate,
    'node tools/validate.mjs && npm run format:check && npm run check:architecture && npm run typecheck && npm test',
);
for (const directory of [
    'src/presentation/desktop/ipc',
    'src/presentation/ui/features/purchases',
    'src/presentation/ui/features/rcv',
    'src/presentation/ui/features/declarations',
    'src/presentation/cli',
    'src/application/features/purchases/commands',
    'src/application/features/purchases/queries',
    'src/application/features/rcv',
    'src/application/features/declarations',
    'src/application/repositories',
    'src/application/services',
    'src/application/workflows',
    'src/domain/purchases',
    'src/infrastructure/sin',
    'src/infrastructure/persistence/repositories',
    'src/infrastructure/credentials',
    'src/infrastructure/files',
    'src/bootstrap',
    'migrations',
    'tests',
]) {
    assert.ok(fs.statSync(path.join(root, directory)).isDirectory(), directory);
}
const ids = new Set();
for (const file of [
    'README.md',
    'AGENTS.md',
    'docs/DESKTOP_STANDARDS.md',
    'docs/NODE_TYPESCRIPT_PROFILE.md',
    'docs/CODING_STANDARDS.md',
    'docs/VISUAL_STANDARDS.md',
    'docs/decisions/ADR-0001-desktop-architecture.md',
]) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    const id = text.match(/^id: (.+)$/m)?.[1];
    assert.ok(id && !ids.has(id), 'Missing or duplicate ID: ' + file);
    ids.add(id);
    assert.match(text, /^language: en$/m, 'English document metadata required: ' + file);
    assert.match(text, /^---\n[\s\S]*?\ntype: [a-z-]+\n[\s\S]*?\n---\n/);
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const target = match[1].split('#')[0];
        if (!target || /^(https?:|mailto:)/i.test(target)) continue;
        assert.ok(
            fs.existsSync(path.resolve(path.dirname(path.join(root, file)), target)),
            'Broken link in ' + file + ': ' + target,
        );
    }
}
const ignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
for (const rule of ['node_modules/', '.auth/', 'data/', '*.sqlite', '*.sqlite-*', '*.db-*'])
    assert.ok(ignore.split(/\r?\n/).includes(rule), rule);
console.log(
    'WiseTax Desktop document and structure checks passed. Functional checks run separately in the validate pipeline; no SIN integration tested.',
);
