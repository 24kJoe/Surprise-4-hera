import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function actionsHarness() {
  const events = [];
  let failWrites = false;
  const write = async () => {
    if (failWrites) throw new Error('Unavailable');
    events.push('write');
    return { id: 'id', publicId: null };
  };
  const model = {
    findUnique: async () => null,
    findMany: async () => [],
    create: write, update: write, updateMany: write, delete: write,
  };
  const mocks = {
    '@/lib/services/prisma': { prisma: {
      collection: model,
      mediaItem: { ...model, findUnique: async () => ({ id: 'id', publicId: null }) },
    } },
    '@/lib/gallery/cache': { GALLERY_CACHE_TAG: 'gallery-data' },
    '@prisma/client': { MediaType: { IMAGE: 'IMAGE', VIDEO: 'VIDEO' } },
    'next/cache': {
      updateTag: (tag) => events.push(`invalidate:${tag}`),
      revalidatePath: () => events.push('path'),
    },
    cloudinary: { v2: { config: () => {}, uploader: {
      destroy: async () => {},
      upload_stream: (_options, callback) => ({ end: () => callback(null, { secure_url: 'https://example.com/image.jpg', public_id: 'test' }) }),
    } } },
  };
  const code = ts.transpileModule(fs.readFileSync('lib/gallery/actions.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: (name) => mocks[name], process, Buffer, console: { error() {} } });
  return { actions: exports, events, fail: () => { failWrites = true; } };
}

function form(fields) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

test('all gallery edits expire shared data after saving and before refreshing pages', async () => {
  const cases = [
    ['createCollectionAction', form({ title: 'Album' })],
    ['updateCollectionAction', form({ id: 'id', title: 'Album' })],
    ['deleteCollectionAction', 'id'],
    ['reorderCollectionsAction', [{ id: 'id', order: 1 }]],
    ['saveDirectMediaAction', { url: 'https://example.com/a.jpg', publicId: 'test', type: 'IMAGE' }],
    ['reorderMediaAction', [{ id: 'id', order: 1 }]],
    ['uploadMediaAction', form({ files: new File(['image'], 'test.jpg', { type: 'image/jpeg' }) })],
    ['updateMediaAction', form({ id: 'id', caption: 'Updated' })],
    ['deleteMediaAction', 'id'],
    ['bulkAssignMediaAction', ['id'], 'collection'],
  ];
  for (const [name, ...args] of cases) {
    const { actions, events } = actionsHarness();
    const result = await actions[name](...args);
    assert.equal(result.success, true, name);
    assert.deepEqual(events, ['write', 'invalidate:gallery-data', 'path'], name);
  }
});

test('failed writes and rejected input do not report successful cache invalidation', async () => {
  const { actions, events, fail } = actionsHarness();
  assert.equal((await actions.createCollectionAction(form({ title: ' ' }))).success, false);
  assert.deepEqual(events, []);
  fail();
  assert.equal((await actions.updateMediaAction(form({ id: 'id' }))).success, false);
  assert.deepEqual(events, []);
});
