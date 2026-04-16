<script setup lang="ts">
import { ref, computed } from 'vue'

import { useI18n } from '../i18n'
import { getHiddenCharacterTags, getHiddenCharacterTitle, getLocalizedCharacterName, getLocalizedCharacterSeries, isHiddenCharacter } from '../i18n/characters'
import type { QuizResult } from '../types/quiz'
import { getCharacterRarityMeta } from '../utils/characterRarity'
import AppIcon from './AppIcon.vue'

const props = defineProps<{
  result: QuizResult
}>()

const rootEl = ref<HTMLElement | null>(null)
const { locale, t } = useI18n()

defineExpose({
  rootEl,
})

const primaryCharacter = computed(() => props.result.characterMatches[0] ?? null)
const resultThemeColor = computed(() => primaryCharacter.value?.accent ?? props.result.archetype.accent ?? '#e2ad3b')
const posterSubtitle = computed(() => {
  if (primaryCharacter.value) {
    if (isHiddenCharacter(primaryCharacter.value)) {
      return getHiddenCharacterTitle(locale.value, primaryCharacter.value)
    }

    return t(`characters.${primaryCharacter.value.id}.title`, undefined, primaryCharacter.value.title)
  }

  return t(`archetypes.${props.result.archetype.id}.subtitle`, undefined, props.result.archetype.subtitle)
})
const posterTags = computed(() => {
  if (primaryCharacter.value) {
    if (isHiddenCharacter(primaryCharacter.value)) {
      return getHiddenCharacterTags(locale.value)
    }

    return primaryCharacter.value.tags
      .map((tag, index) => t(`characters.${primaryCharacter.value!.id}.tags.${index}`, undefined, tag))
      .slice(0, 4)
  }

  const fallbackTags = props.result.tags.length ? props.result.tags : props.result.archetype.tags
  return fallbackTags
    .map((tag, index) => t(`archetypes.${props.result.archetype.id}.tags.${index}`, undefined, tag))
    .slice(0, 4)
})
const posterNarrativeRole = computed(() =>
  t(`archetypes.${props.result.archetype.id}.narrativeRole`, undefined, props.result.archetype.narrativeRole),
)
function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const full = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized

  return {
    r: parseInt(full.substring(0, 2), 16),
    g: parseInt(full.substring(2, 4), 16),
    b: parseInt(full.substring(4, 6), 16),
  }
}

function mixRgb(base: { r: number; g: number; b: number }, target: { r: number; g: number; b: number }, weight: number) {
  const ratio = Math.max(0, Math.min(1, weight))
  return {
    r: Math.round(base.r * (1 - ratio) + target.r * ratio),
    g: Math.round(base.g * (1 - ratio) + target.g * ratio),
    b: Math.round(base.b * (1 - ratio) + target.b * ratio),
  }
}

function toRgbString(color: { r: number; g: number; b: number }, alpha?: number) {
  if (alpha === undefined) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
  }

  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
}

const rarityMeta = computed(() => getCharacterRarityMeta(primaryCharacter.value?.id))
const rarityTierLabel = computed(() => {
  const tier = rarityMeta.value?.tier
  return tier
    ? t(`result.rarityTiers.${tier}`, undefined, tier)
    : '--'
})
const rarityTierStyle = computed(() => {
  const base = hexToRgb(resultThemeColor.value)
  const white = { r: 255, g: 255, b: 255 }
  const dark = { r: 47, g: 58, b: 69 }

  switch (rarityMeta.value?.tier) {
    case 'ur': {
      const text = mixRgb(base, dark, 0.22)
      return {
        color: toRgbString(text),
        background: toRgbString(base, 0.28),
        borderColor: toRgbString(base, 0.5),
      }
    }
    case 'ssr': {
      const text = mixRgb(base, dark, 0.3)
      return {
        color: toRgbString(text),
        background: toRgbString(base, 0.18),
        borderColor: toRgbString(base, 0.34),
      }
    }
    case 'sr': {
      const text = mixRgb(base, dark, 0.4)
      return {
        color: toRgbString(text),
        background: toRgbString(base, 0.1),
        borderColor: toRgbString(base, 0.22),
      }
    }
    default: {
      const muted = mixRgb(base, white, 0.72)
      const text = mixRgb(base, dark, 0.52)
      return {
        color: toRgbString(text),
        background: toRgbString(muted, 0.32),
        borderColor: toRgbString(base, 0.16),
      }
    }
  }
})
const raritySummaryLabel = computed(() => {
  if (!rarityMeta.value) {
    return ''
  }

  return t(`result.rarityTierDescriptions.${rarityMeta.value.tier}`, {
    start: rarityMeta.value.startRank,
    end: rarityMeta.value.endRank,
  })
})
</script>

<template>
  <div class="poster-container">
    <section ref="rootEl" class="share-poster" :style="{ '--poster-accent': resultThemeColor }">
      <div class="share-poster__accent-bar"></div>
      
      <div class="share-poster__inner">
        <div class="share-poster__header">
          <p class="share-poster__kicker">{{ t('result.shareCard', undefined, 'ACG TYPE INDICATOR') }} · {{ result.code }}</p>
          <h2 class="share-poster__title" :style="{ color: resultThemeColor }">
            {{ primaryCharacter ? getLocalizedCharacterName(primaryCharacter, locale, { revealHidden: true }) : t('archetypes.' + result.archetype.id + '.name', undefined, result.archetype.name) }}
          </h2>
          <p class="share-poster__subtitle">{{ posterSubtitle }}</p>
        </div>

        <div class="share-poster__metrics">
          <div class="share-poster__metric">
            <span class="metric-label">{{ t('result.match') }}</span>
            <strong class="metric-value" :style="{ color: resultThemeColor }">{{ result.matchScore }}%</strong>
          </div>
          <div class="share-poster__metric-divider"></div>
          <div class="share-poster__metric">
            <span class="metric-label">{{ t('result.rarity') }}</span>
            <strong class="metric-value metric-value--rarity" :style="rarityTierStyle">{{ rarityTierLabel }}</strong>
            <span class="metric-subvalue">{{ raritySummaryLabel }}</span>
          </div>
        </div>

        <div class="share-poster__tags">
          <span
            v-for="tag in posterTags"
            :key="tag"
            class="tag-pill"
            :style="{ backgroundColor: resultThemeColor + '15', color: resultThemeColor }"
          ># {{ tag }}</span>
        </div>

        <div class="share-poster__body">
          <div class="share-poster__block">
            <p class="block-label"><AppIcon name="star" /> {{ t('result.spotlight', undefined, '亮点表现') }}</p>
            <p class="block-content">{{ t('archetypes.' + result.archetype.id + '.spotlight', undefined, result.archetype.spotlight) }}</p>
          </div>
          <div class="share-poster__block">
            <p class="block-label"><AppIcon name="book" /> {{ t('result.narrativeRole', undefined, '剧情位置') }}</p>
            <p class="block-content">{{ posterNarrativeRole }}</p>
          </div>
          <div class="share-poster__block">
            <p class="block-label"><AppIcon name="character" /> {{ t('result.hitCharacter', undefined, '对应角色') }}</p>
            <p class="block-content" style="font-weight: bold; color: #333e49;">
              {{ primaryCharacter ? getLocalizedCharacterName(primaryCharacter, locale) : t('app.common.unknownCharacter') }}
              <span style="font-weight: normal; color: #8c9ba5; font-size: 0.9em; margin-left: 4px;">{{ primaryCharacter ? getLocalizedCharacterSeries(primaryCharacter, locale) : t('app.common.unknownSeries') }}</span>
            </p>
            <p v-if="primaryCharacter?.personaBasis?.type === 'fandom-impression'" style="margin: 6px 0 0; font-size: 11px; color: #a08a3a; font-weight: 600; line-height: 1.5;">
              {{ t('result.personaBasisBadge') }}：{{ t('result.personaBasisTip') }}
            </p>
          </div>
        </div>

        <div class="share-poster__footer">
          <div class="footer-logo">ACGTI</div>
          <div class="footer-desc">{{ t('result.testNote', undefined, '你的社交白皮书') }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.poster-container {
  display: flex;
  justify-content: center;
  
}

.share-poster {
  position: relative;
  width: 440px; 
  background: var(--bg, #ffffff);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  text-align: left;
  border: 1px solid #eaeaea;
}

.share-poster__accent-bar {
  height: 12px;
  
  background: var(--poster-accent);
}

.share-poster__inner {
  padding: 30px 32px;
}

.share-poster__header {
  margin-bottom: 24px;
}

.share-poster__kicker {
  font-size: 13px;
  font-weight: 800;
  color: #8c9ba5;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 8px;
}

.share-poster__title {
  font-size: 40px;
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 6px;
  font-family: system-ui, -apple-system, sans-serif;
  letter-spacing: -0.5px;
}

.share-poster__subtitle {
  font-size: 15px;
  color: #5f6b75;
  margin: 0;
  font-weight: 600;
}

.share-poster__metrics {
  display: flex;
  align-items: center;
  background: #f4f6f8;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 20px;
}

.share-poster__metric {
  flex: 1;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #5f6b75;
  font-weight: 700;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.metric-value {
  display: block;
  font-size: 26px;
  font-weight: 800;
  color: #333e49;
  line-height: 1;
}

.metric-value--rarity {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 18px;
  letter-spacing: 0.04em;
}

.metric-subvalue {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  line-height: 1.4;
  color: #7b8892;
  font-weight: 700;
}

.share-poster__metric-divider {
  width: 1px;
  height: 36px;
  background: #dfe3e8;
  margin: 0 20px;
}

.share-poster__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
}

.tag-pill {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.share-poster__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 30px;
}

.share-poster__block {
  background: #fff;
  border: 1px solid #eaeaea;
  border-left: 4px solid var(--poster-accent);
  padding: 14px 18px;
  border-radius: 8px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.block-label {
  font-size: 12px;
  color: #5f6b75;
  font-weight: 800;
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.block-content {
  font-size: 15px;
  line-height: 1.5;
  color: #333e49;
  margin: 0;
}

.share-poster__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed #eaeaea;
  padding-top: 16px;
}

.footer-logo {
  font-weight: 900;
  font-size: 16px;
  color: #333e49;
  letter-spacing: 1px;
}

.footer-desc {
  font-size: 12px;
  color: #8c9ba5;
  font-weight: 700;
}
</style>
