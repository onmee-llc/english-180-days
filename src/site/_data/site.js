/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const locale = require('../../../shared/locale');
const {PAGINATION_COUNT} = require('../_utils/constants');

module.exports = {
  env: process.env.ELEVENTY_ENV || 'dev',
  isProd: () => process.env.ELEVENTY_ENV === 'prod',
  percy: process.env.PERCY || false,
  contentDir: path.join('src/site/content/', process.env.ELEVENTY_LANG || ''),
  title: 'Daily Mastery',
  titleVariation: 'Home',
  defaultLocale: locale.defaultLocale,
  url: 'https://onmee.vn',
  buildDate: new Date(),
  repo: 'https://github.com/onmee-vn/web',
  subscribe: 'https://onmee.vn/newsletter',
  subscribeForm: '',
  thumbnail: 'image/FNkVSAX8UDTTQWQkKftSgGe9clO2/uZ3hQS2EPrA9csOgkoXI.png',
  isBannerEnabled: false,
  banner: '',
  paginationCount: PAGINATION_COUNT,
  imgixDomain: 'onmee-vn.imgix.net',
  bucket: 'onmee-vn-uploads',
  gitlocalize: '',
  analytics: {
    ids: {
      gtm: '',
    },
    version: 15,
  },
  firebase: {
    prod: {
      apiKey: 'AIzaSyDG2xe1oIY6KywRLLiSx_9iPAVHDjnKs3Q',
      authDomain: 'aevo-labs.firebaseapp.com',
      databaseURL: '',
      projectId: 'aevo-labs',
      storageBucket: 'aevo-labs.firebasestorage.app',
      messagingSenderId: '372316750039',
      appId: '1:372316750039:web:dd0018f4275ac35201f092',
      measurementId: '',
    },
    staging: {
      apiKey: 'AIzaSyDG2xe1oIY6KywRLLiSx_9iPAVHDjnKs3Q',
      authDomain: 'aevo-labs.firebaseapp.com',
      databaseURL: '',
      projectId: 'aevo-labs',
      storageBucket: 'aevo-labs.firebasestorage.app',
      messagingSenderId: '372316750039',
      appId: '1:372316750039:web:dd0018f4275ac35201f092',
    },
  },
  maps: {
    apiKey: '',
  },
  recaptchaSiteKey: '',
};
