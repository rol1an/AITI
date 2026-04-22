<template>
  <div class="home">
    <HeroSection />

    <section class="feature feature-light text-center" v-reveal>
      <div class="container">
        <p class="feature-copy stats-copy">
          {{ t('home.statsLink').replace(' →', '') }}
        </p>
        <RouterLink to="/stats" class="btn btn-green stats-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 20V10"/>
            <path d="M12 20V4"/>
            <path d="M6 20v-6"/>
          </svg>
          {{ t('home.statsLink') }}
        </RouterLink>
      </div>
    </section>

    <section class="feature feature-light text-center" v-reveal>
      <div class="container">
        <h2 class="feature-title">{{ t('home.ossTitle') }}</h2>
        <p class="feature-copy oss-copy">{{ t('home.ossCopy') }}</p>
        <a href="https://github.com/rol1an" target="_blank" rel="noopener noreferrer" class="btn btn-green oss-btn">
          <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          {{ t('home.ossButton') }}
        </a>
        <p class="feature-copy oss-hint">
          {{ t('home.ossHint') }}
          <a href="https://github.com/rol1an/issues" target="_blank" rel="noopener noreferrer">{{ t('home.ossIssue') }}</a>
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeroSection from '../components/home/HeroSection.vue'
import { useI18n } from '../i18n'
import { useSeo } from '../composables/useSeo'

useSeo({
  title: 'AITI 官网 - AI Type Indicator | AI 模型画像测试',
  description: 'AITI 官网，AI Type Indicator 模型画像测试。回答 25 道情境式问题，获得唯一命中的模型代码，查看偏好维度倾向与 AI 模型画像解析。',
  path: '/',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AITI',
    alternateName: 'AI Type Indicator',
    url: 'https://aititest.com',
    description: '以偏好维度为基础的 AI 模型画像测试',
    potentialAction: {
      '@type': 'TakeAction',
      target: 'https://aititest.com/quiz',
      name: '开始测试',
    },
  },
})

const { t } = useI18n()
</script>

<style scoped>
.home {
  background: #fff;
  color: #333;
}

.container {
  width: min(1200px, calc(100% - 2rem));
  margin: 0 auto;
}

.feature {
  position: relative;
  padding: 4.5rem 0;
}

.feature-light {
  background: linear-gradient(170deg, #f7f8f9 0%, #fff 55%);
}

.text-center {
  text-align: center;
}

.feature-title {
  margin: 0;
  font-size: clamp(2rem, 4.5vw, 2.7rem);
  line-height: 1.2;
}

.feature-copy {
  margin: 1.3rem auto 1.8rem;
  color: #666;
  font-size: 1.125rem;
  line-height: 1.75;
}

.stats-copy {
  max-width: 500px;
}

.oss-copy,
.oss-hint {
  max-width: 600px;
}

.oss-hint {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #6b7680;
}

.oss-hint a {
  color: #3ba17c;
  font-weight: 700;
  text-decoration: none;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  border-radius: 999px;
  padding: 0 1.6rem;
  color: #fff;
  font-weight: 700;
}

.btn-green {
  background: #3ba17c;
}

.stats-btn,
.oss-btn {
  gap: 0.5rem;
}

.stats-btn svg {
  width: 1.1rem;
  height: 1.1rem;
}

.oss-btn {
  max-width: 250px;
  margin: 0 auto;
}

.oss-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
