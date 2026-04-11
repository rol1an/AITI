<template>
  <div class="page-stack">
    <section class="hero-panel center compact">
      <p class="eyebrow">角色图鉴</p>
      <h1 class="display-title">所有测试结果角色</h1>
      <p class="lead">
        你可以浏览 ACGTI 目前收录的所有二次元角色。他们各自代表了独特的 MBTI 性格模型。
      </p>
    </section>

    <section class="characters-grid">
      <RouterLink
        v-for="character in characters"
        :key="character.id"
        :to="{ path: '/result', query: { character: character.id } }"
        class="character-card"
        :style="{ '--accent-color': character.accent }"
      >
        <div class="card-image-wrap">
          <img :src="character.image" :alt="character.name" class="card-image" loading="lazy" />
        </div>
        <div class="card-content">
          <div class="card-tags">
            <span class="card-code">{{ character.code }}</span>
            <span class="card-mbti">{{ character.matchCode }}</span>
          </div>
          <h2 class="card-name">{{ character.name }}</h2>
          <p class="card-source">{{ character.series }}</p>
          <p class="card-title">{{ character.title }}</p>
        </div>
      </RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useQuiz } from '../composables/useQuiz'

const { characters } = useQuiz()
</script>

<style scoped>
.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.character-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  color: inherit;
  border: 2px solid transparent;
}

.character-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color, #42b883);
}

.card-image-wrap {
  width: 100%;
  aspect-ratio: 1;
  background-color: #f8f9fa;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background: linear-gradient(to bottom, #f8f9fa, color-mix(in srgb, var(--accent-color, #e9ecef) 20%, transparent));
}

.card-image {
  width: 90%;
  height: 90%;
  object-fit: contain;
  object-position: bottom;
  transform-origin: bottom center;
  transition: transform 0.3s ease;
}

.character-card:hover .card-image {
  transform: scale(1.05);
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.card-code {
  font-weight: 800;
  font-size: 0.85rem;
  color: var(--accent-color, #42b883);
  background: color-mix(in srgb, var(--accent-color, #42b883) 15%, transparent);
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
}

.card-mbti {
  font-weight: 700;
  font-size: 0.85rem;
  color: #6c757d;
  background: #e9ecef;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
}

.card-name {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  color: #212529;
}

.card-source {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

.card-title {
  font-size: 0.9rem;
  color: #495057;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 600px) {
  .characters-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1rem;
  }
  
  .card-content {
    padding: 0.75rem;
  }
  
  .card-name {
    font-size: 1.1rem;
  }

  .card-tags {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .card-title {
    font-size: 0.8rem;
  }
}
</style>
