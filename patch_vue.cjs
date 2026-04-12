const fs = require('fs');
let c = fs.readFileSync('src/pages/ResultPage.vue', 'utf-8');

c = c.replace(/<h1 class="hero-title">{{ primaryCharacter\?\.name \|\| result\.archetype\.name }}<\/h1>/g,
  "<h1 class=\"hero-title\">{{ primaryCharacter ? t('characters.' + primaryCharacter.id + '.name', undefined, primaryCharacter.name) : t('archetypes.' + result.archetype.id + '.name', undefined, result.archetype.name) }}</h1>");

c = c.replace(/<span class="hero-archetype">{{ result\.archetype\.subtitle }}<\/span>/g,
  "<span class=\"hero-archetype\">{{ t('archetypes.' + result.archetype.id + '.subtitle', undefined, result.archetype.subtitle) }}</span>");

c = c.replace(/<p class="hero-quote">“{{ result\.archetype\.oneLiner }}”<\/p>/g,
  "<p class=\"hero-quote\">“{{ t('archetypes.' + result.archetype.id + '.oneLiner', undefined, result.archetype.oneLiner) }}”</p>");

c = c.replace(/<p>{{ result\.archetype\.description }}<\/p>/g,
  "<p>{{ t('archetypes.' + result.archetype.id + '.description', undefined, result.archetype.description) }}</p>");

c = c.replace(/<p>{{ primaryCharacter\?\.note }}<\/p>/g,
  "<p>{{ primaryCharacter ? t('characters.' + primaryCharacter.id + '.note', undefined, primaryCharacter.note) : '' }}</p>");

c = c.replace(/<h3>\s*<AppIcon name="star" \/>\s*亮点表现\s*<\/h3>/g,
  "<h3>\n                <AppIcon name=\"star\" />\n                {{ t('result.spotlight', undefined, '亮点表现') }}\n              </h3>");

c = c.replace(/<p>{{ result\.archetype\.spotlight }}<\/p>/g,
  "<p>{{ t('archetypes.' + result.archetype.id + '.spotlight', undefined, result.archetype.spotlight) }}</p>");

c = c.replace(/<h3>\s*<AppIcon name="warning" \/>\s*短板分析\s*<\/h3>/g,
  "<h3>\n                <AppIcon name=\"warning\" />\n                {{ t('result.weakness', undefined, '短板分析') }}\n              </h3>");

c = c.replace(/<p>{{ result\.archetype\.weakness }}<\/p>/g,
  "<p>{{ t('archetypes.' + result.archetype.id + '.weakness', undefined, result.archetype.weakness) }}</p>");

c = c.replace(/<h3>维度分析<\/h3>/g, "<h3>{{ t('result.dimensionAnalysis', undefined, '维度分析') }}</h3>");
c = c.replace(/<p class="top-trait">最显著特质：<strong>{{ strongestTrait\.label }} \({{ strongestTrait\.percentage }}%\)<\/strong><\/p>/g,
  "<p class=\"top-trait\">{{ t('result.topTrait', undefined, '最显著特质：') }}<strong>{{ t('result.traits.' + strongestTrait.dimension, undefined, strongestTrait.label) }} ({{ strongestTrait.percentage }}%)</strong></p>");

c = c.replace(/<h3>类型关键词<\/h3>/g, "<h3>{{ t('result.keywords', undefined, '类型关键词') }}</h3>");
c = c.replace(/<span v-for="tag in result\.archetype\.keywords" :key="tag"># {{ tag }}<\/span>/g,
  "<span v-for=\"tag in result.archetype.keywords\" :key=\"tag\"># {{ t('archetypes.' + result.archetype.id + '.keywords.' + tag, undefined, tag) }}</span>");

c = c.replace(/<h3>角色标签<\/h3>/g, "<h3>{{ t('result.characterTags', undefined, '角色标签') }}</h3>");
c = c.replace(/<span v-for="tag in primaryCharacter\.tags" :key="tag"># {{ tag }}<\/span>/g,
  "<span v-for=\"(tag, idx) in primaryCharacter.tags\" :key=\"tag\"># {{ t('characters.' + primaryCharacter.id + '.tags.' + idx, undefined, tag) }}</span>");

c = c.replace(/<h3>{{ primaryCharacter\?\.name \|\| result\.archetype\.name }}<\/h3>/g,
  "<h3>{{ primaryCharacter ? t('characters.' + primaryCharacter.id + '.name', undefined, primaryCharacter.name) : t('archetypes.' + result.archetype.id + '.name', undefined, result.archetype.name) }}</h3>");

c = c.replace(/<p class="small-title">角色映射<\/p>/g, "<p class=\"small-title\">{{ t('result.narrativeRole', undefined, '角色映射') }}</p>");
c = c.replace(/<p class="role-text">{{ result\.archetype\.narrativeRole }}<\/p>/g,
  "<p class=\"role-text\">{{ t('archetypes.' + result.archetype.id + '.narrativeRole', undefined, result.archetype.narrativeRole) }}</p>");

fs.writeFileSync('src/pages/ResultPage.vue', c);
console.log('ResultPage patched');

let sum = fs.readFileSync('src/components/ResultSummary.vue', 'utf-8');
sum = sum.replace(/<h3>{{ character\.name }}<\/h3>/g, "<h3>{{ t('characters.' + character.id + '.name', undefined, character.name) }}</h3>");
sum = sum.replace(/<p class="character-series">{{ character\.series }}<\/p>/g, "<p class=\"character-series\">{{ t('characters.' + character.id + '.series', undefined, character.series) }}</p>");
sum = sum.replace(/<span v-for="tag in character\.tags" :key="tag" class="character-tag">{{ tag }}<\/span>/g, "<span v-for=\"(tag, idx) in character.tags\" :key=\"tag\" class=\"character-tag\">{{ t('characters.' + character.id + '.tags.' + idx, undefined, tag) }}</span>");
sum = sum.replace(/<p class="character-note">{{ character\.note }}<\/p>/g, "<p class=\"character-note\">{{ t('characters.' + character.id + '.note', undefined, character.note) }}</p>");

fs.writeFileSync('src/components/ResultSummary.vue', sum);
console.log('ResultSummary patched');

let chp = fs.readFileSync('src/pages/CharactersPage.vue', 'utf-8');
chp = chp.replace(/<h2 class="card-name">{{ character\.name }}<\/h2>/g, "<h2 class=\"card-name\">{{ t('characters.' + character.id + '.name', undefined, character.name) }}</h2>");
chp = chp.replace(/<p class="card-source">{{ character\.series }}<\/p>/g, "<p class=\"card-source\">{{ t('characters.' + character.id + '.series', undefined, character.series) }}</p>");
chp = chp.replace(/<p class="card-title">{{ character\.title }}<\/p>/g, "<p class=\"card-title\">{{ t('characters.' + character.id + '.title', undefined, character.title) }}</p>");

fs.writeFileSync('src/pages/CharactersPage.vue', chp);
console.log('CharactersPage patched');

let i18n = fs.readFileSync('src/i18n/index.ts', 'utf-8');
if(!i18n.includes('defaultVal?: string')){
  i18n = i18n.replace(/export function t\(key: string, params\?: Record<string, string \| number>\) \{/g, 
    "export function t(key: string, params?: Record<string, string | number>, defaultVal?: string) {");
  i18n = i18n.replace(/return interpolate\(typeof value === 'string' \? value : key, params\)/g,
    "return interpolate(typeof value === 'string' ? value : (defaultVal ?? key), params)");
  fs.writeFileSync('src/i18n/index.ts', i18n);
  console.log('i18n t() updated with defaultVal');
}
