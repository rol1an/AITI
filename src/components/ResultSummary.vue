<script setup lang="ts">
import { ref, computed } from 'vue'
import type { QuizResult } from '../types/quiz'
import { getRoleForType, getStrategyForVariant, TRAIT_CONFIG } from '../utils/quizEngine'

const props = defineProps<{
  result: QuizResult
}>()

const currentSlide = ref(0)

const slides = computed(() => [
  {
    id: 'personality',
    title: 'Their Personality',
    subtitle: `${props.result.archetype.name} (${props.result.code})`,
    description: props.result.archetype.description,
    learnMoreText: 'Learn more'
  },
  {
    id: 'role',
    title: 'Their Role',
    subtitle: getRoleForType(props.result.code).name,
    description: getRoleForType(props.result.code).description,
    learnMoreText: 'Learn more'
  },
  {
    id: 'strategy',
    title: 'Their Strategy',
    subtitle: getStrategyForVariant(props.result.code.slice(5)).name,
    description: getStrategyForVariant(props.result.code.slice(5)).description,
    learnMoreText: 'Learn more'
  }
])

const traits = computed(() => {
  const result = props.result
  return [
    {
      label: 'Energy',
      leftLabel: 'Extraverted',
      rightLabel: 'Introverted',
      percentage: result.scores.E_I.percentage,
      dominant: result.scores.E_I.dominant === 'E' ? 'left' : 'right',
      color: TRAIT_CONFIG.E_I.color
    },
    {
      label: 'Mind',
      leftLabel: 'Intuitive',
      rightLabel: 'Observant',
      percentage: result.scores.S_N.percentage,
      dominant: result.scores.S_N.dominant === 'N' ? 'left' : 'right',
      color: TRAIT_CONFIG.S_N.color
    },
    {
      label: 'Nature',
      leftLabel: 'Thinking',
      rightLabel: 'Feeling',
      percentage: result.scores.T_F.percentage,
      dominant: result.scores.T_F.dominant === 'T' ? 'left' : 'right',
      color: TRAIT_CONFIG.T_F.color
    },
    {
      label: 'Tactics',
      leftLabel: 'Judging',
      rightLabel: 'Prospecting',
      percentage: result.scores.J_P.percentage,
      dominant: result.scores.J_P.dominant === 'J' ? 'left' : 'right',
      color: TRAIT_CONFIG.J_P.color
    }
  ]
})
</script>

<template>
  <div class="result-page">
    <!-- Hero Section -->
    <section class="result-hero">
      <div class="hero-content">
        <h1 class="hero-title">
          {{ result.archetype.name }} ({{ result.code }})
        </h1>
        <p class="hero-description">
          Review their personality test results and learn more about their personality type and core traits.
        </p>
      </div>
      <div class="hero-image" :style="{ background: result.archetype.accent }">
        <span class="hero-initial">{{ result.code.charAt(0) }}</span>
      </div>
    </section>

    <!-- Slides Section -->
    <section class="slides-section">
      <div class="slides-container">
        <transition name="slide">
          <div v-if="currentSlide === 0" class="slide-card" key="personality">
            <h3>{{ slides[0].title }}</h3>
            <h4>{{ slides[0].subtitle }}</h4>
            <p>{{ slides[0].description }}</p>
            <a href="#" class="learn-more">
              {{ slides[0].learnMoreText }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          <div v-else-if="currentSlide === 1" class="slide-card" key="role">
            <h3>{{ slides[1].title }}</h3>
            <h4>{{ slides[1].subtitle }}</h4>
            <p>{{ slides[1].description }}</p>
            <a href="#" class="learn-more">
              {{ slides[1].learnMoreText }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          <div v-else class="slide-card" key="strategy">
            <h3>{{ slides[2].title }}</h3>
            <h4>{{ slides[2].subtitle }}</h4>
            <p>{{ slides[2].description }}</p>
            <a href="#" class="learn-more">
              {{ slides[2].learnMoreText }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </transition>
      </div>

      <div class="slide-dots">
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="slide-dot"
          :class="{ active: currentSlide === index }"
          :aria-label="`Slide ${index + 1} of ${slides.length}`"
          @click="currentSlide = index"
        >
          <span>Slide {{ index + 1 }} of {{ slides.length }}</span>
        </button>
      </div>
    </section>

    <!-- Traits Section -->
    <section class="traits-section">
      <h2 class="traits-title">Their Traits</h2>

      <div class="traits-list">
        <div v-for="trait in traits" :key="trait.label" class="trait-item">
          <div class="trait-header">
            <span class="trait-label">{{ trait.label }}:</span>
            <span class="trait-value">
              {{ trait.dominant === 'left' ? trait.rightLabel : trait.leftLabel }}
              <strong>{{ trait.percentage }}%</strong>
            </span>
          </div>

          <div class="trait-bar">
            <div
              class="trait-fill"
              :class="trait.dominant"
              :style="{
                width: trait.dominant === 'left' ? `${trait.percentage}%` : `${100 - trait.percentage}%`,
                backgroundColor: trait.color
              }"
            ></div>
          </div>

          <div class="trait-labels">
            <span class="trait-left-label">{{ trait.leftLabel }}</span>
            <span class="trait-right-label">{{ trait.rightLabel }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Character Matches Section -->
    <section class="characters-section">
      <h2 class="characters-title">Character Matches</h2>

      <div v-if="result.characterMatches.length > 0" class="characters-list">
        <article
          v-for="(character, index) in result.characterMatches"
          :key="character.id"
          class="character-card"
          :class="{ featured: index === 0 }"
        >
          <div class="character-header">
            <div>
              <h3>{{ character.name }}</h3>
              <p class="character-series">{{ character.series }}</p>
            </div>
            <div class="character-tags">
              <span v-for="tag in character.tags" :key="tag" class="character-tag">{{ tag }}</span>
            </div>
          </div>
          <p class="character-note">{{ character.note }}</p>
        </article>
      </div>

      <div v-else class="no-characters">
        <p>No character matches available for this personality type.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.result-page {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Hero Section */
.result-hero {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: center;
  padding: 48px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  color: var(--text);
  line-height: 1.2;
}

.hero-description {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.hero-image {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hero-initial {
  font-size: 4rem;
  font-weight: 700;
}

/* Slides Section */
.slides-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.slides-container {
  position: relative;
  min-height: 280px;
}

.slide-card {
  padding: 32px;
  background: var(--panel);
  border-radius: 16px;
  border: 1px solid var(--border);
}

.slide-card h3 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.slide-card h4 {
  margin: 0 0 16px;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
}

.slide-card p {
  margin: 0 0 20px;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-muted);
}

.learn-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--accent-2);
  font-weight: 500;
  text-decoration: none;
  transition: gap 0.2s ease;
}

.learn-more:hover {
  gap: 12px;
}

.slide-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.slide-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: background 0.2s ease;
  padding: 0;
}

.slide-dot:hover {
  background: rgba(255, 255, 255, 0.4);
}

.slide-dot.active {
  background: var(--accent-2);
}

.slide-dot span {
  display: none;
}

/* Traits Section */
.traits-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.traits-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
}

.traits-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.trait-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trait-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trait-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.trait-value {
  font-size: 1rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.trait-value strong {
  font-size: 1.1rem;
}

.trait-bar {
  position: relative;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.trait-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s ease;
}

.trait-fill.left {
  margin-left: auto;
}

.trait-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Characters Section */
.characters-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.characters-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
}

.characters-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.character-card {
  padding: 24px;
  background: var(--panel);
  border-radius: 16px;
  border: 1px solid var(--border);
  transition: border-color 0.2s ease;
}

.character-card.featured {
  border-color: var(--accent-2);
  background: linear-gradient(135deg, rgba(110, 197, 255, 0.1), transparent);
}

.character-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 16px;
  margin-bottom: 12px;
}

.character-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text);
}

.character-series {
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.character-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.character-tag {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.character-note {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.no-characters {
  padding: 48px;
  text-align: center;
  color: var(--text-muted);
}

/* Slide Transition */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .result-hero {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-image {
    width: 120px;
    height: 120px;
    font-size: 3rem;
  }

  .hero-initial {
    font-size: 3rem;
  }

  .character-header {
    flex-direction: column;
  }
}
</style>
