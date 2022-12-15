#!/usr/bin/env node
const http = require('http');
const package = require('../packages/engine/package.json');
const version = package.version;
const options = {
  method: 'PUT',
  // 暂时使用 日常环境的 uipaas-node，上线后可切换成线上环境 https://uipaas-node.alibaba-inc.com
  hostname: 'uipaas-node.alibaba.net',
  path: '/staticAssets/cdn/packages',
  headers: {
    'Content-Type': 'application/json',
    Cookie: 'locale=en-us',
  },
  maxRedirects: 20,
};

const onResponse = function (res) {
  const chunks = [];
  res.on('data', (chunk) => {
    chunks.push(chunk);
  });

  res.on('end', (chunk) => {
    const body = Buffer.concat(chunks);
    console.table(JSON.stringify(JSON.parse(body.toString()), null, 2));
  });

  res.on('error', (error) => {
    console.error(error);
  });
};

const req = http.request(options, onResponse);

const postData = JSON.stringify({
  packages: [
    {
      packageName: '@alilc/lowcode-engine',
      version,
      // 可以指定要发布的文件或者文件夹，如果没指定，会取 package.json 中定义的 files 字段值，如果为空，尝试 build 和 dist 目录文件
      files: [
        'dist',
      ],
    },
    {
      packageName: '@alilc/lowcode-designer',
      version,
    },
    {
      packageName: '@alilc/lowcode-editor-core',
      version,
    },
    {
      packageName: '@alilc/lowcode-editor-skeleton',
      version,
    },
    {
      packageName: '@alilc/lowcode-plugin-designer',
      version,
    },
    {
      packageName: '@alilc/lowcode-plugin-outline-pane',
      version,
    },
    {
      packageName: '@alilc/lowcode-rax-renderer',
      version,
    },
    {
      packageName: '@alilc/lowcode-rax-simulator-renderer',
      version,
    },
    {
      packageName: '@alilc/lowcode-react-renderer',
      version,
    },
    {
      packageName: '@alilc/lowcode-react-simulator-renderer',
      version,
    },
    {
      packageName: '@alilc/lowcode-renderer-core',
      version,
    },
    {
      packageName: '@alilc/lowcode-shell',
      version,
    },
    {
      packageName: '@alilc/lowcode-types',
      version,
    },
    {
      packageName: '@alilc/lowcode-utils',
      version,
    },
    {
      packageName: '@alilc/lowcode-workspace',
      version,
    },
  ],
  // 可以发布指定源的 npm 包，默认公网 npm
  useTnpm: false,
});

req.write(postData);

req.end();