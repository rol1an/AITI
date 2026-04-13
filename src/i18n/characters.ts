import type { CharacterMatch } from '../types/quiz'
import type { AppLocale } from './types'

type LocalizedText = Record<AppLocale, string>

const hiddenCharacterNameI18n: LocalizedText = {
  'zh-CN': '隐藏角色',
  'zh-TW': '隱藏角色',
  en: 'Hidden Character',
  ja: '隠しキャラ',
}

const hiddenCharacterSeriesI18n: LocalizedText = {
  'zh-CN': '有隐藏角色',
  'zh-TW': '有隱藏角色',
  en: 'Hidden Result Exists',
  ja: '隠し結果あり',
}

const hiddenCharacterTitleI18n: LocalizedText = {
  'zh-CN': '已触发隐藏结果',
  'zh-TW': '已觸發隱藏結果',
  en: 'Hidden Result Triggered',
  ja: '隠し結果を解放',
}

const hiddenCharacterNoteI18n: LocalizedText = {
  'zh-CN': '你命中了一个隐藏角色结果。ACGTI 不会直接公开其角色名，结果页仅保留角色代码、形象和气质解读。',
  'zh-TW': '你命中了一個隱藏角色結果。ACGTI 不會直接公開其角色名，結果頁僅保留角色代碼、形象與氣質解讀。',
  en: 'You hit a hidden result. ACGTI keeps the actual character name masked and only shows the code, image, and personality reading.',
  ja: '隠し結果に命中しました。ACGTIでは実際のキャラ名は伏せたまま、コードとビジュアル、解説のみを表示します。',
}

const hiddenCharacterTagsI18n: Record<AppLocale, string[]> = {
  'zh-CN': ['隐藏结果', '低概率命中', '特殊气质'],
  'zh-TW': ['隱藏結果', '低機率命中', '特殊氣質'],
  en: ['Hidden Result', 'Low Probability Hit', 'Special Aura'],
  ja: ['隠し結果', '低確率ヒット', '特殊な気配'],
}

const characterNameI18n: Record<string, LocalizedText> = {
  'hatsune-miku': {
    'zh-CN': '初音未来',
    'zh-TW': '初音未來',
    en: 'Hatsune Miku',
    ja: '初音ミク',
  },
  'ayanami-rei': {
    'zh-CN': '绫波丽',
    'zh-TW': '綾波零',
    en: 'Rei Ayanami',
    ja: '綾波レイ',
  },
  'asuka-langley': {
    'zh-CN': '明日香',
    'zh-TW': '明日香',
    en: 'Asuka Langley',
    ja: '惣流・アスカ・ラングレー',
  },
  'edogawa-conan': {
    'zh-CN': '江户川柯南',
    'zh-TW': '江戶川柯南',
    en: 'Conan Edogawa',
    ja: '江戸川コナン',
  },
  'hakurei-reimu': {
    'zh-CN': '博丽灵梦',
    'zh-TW': '博麗靈夢',
    en: 'Reimu Hakurei',
    ja: '博麗霊夢',
  },
  'gotoh-hitori': {
    'zh-CN': '后藤一里',
    'zh-TW': '後藤一里',
    en: 'Hitori Gotoh',
    ja: '後藤ひとり',
  },
  'fujiwara-chika': {
    'zh-CN': '藤原千花',
    'zh-TW': '藤原千花',
    en: 'Chika Fujiwara',
    ja: '藤原千花',
  },
  cirno: {
    'zh-CN': '琪露诺',
    'zh-TW': '琪露諾',
    en: 'Cirno',
    ja: 'チルノ',
  },
  'misaka-mikoto': {
    'zh-CN': '御坂美琴',
    'zh-TW': '御坂美琴',
    en: 'Mikoto Misaka',
    ja: '御坂美琴',
  },
  'kaname-madoka': {
    'zh-CN': '鹿目圆',
    'zh-TW': '鹿目圓',
    en: 'Madoka Kaname',
    ja: '鹿目まどか',
  },
  furina: {
    'zh-CN': '芙宁娜',
    'zh-TW': '芙寧娜',
    en: 'Furina',
    ja: 'フリーナ',
  },
  'takamatsu-tomori': {
    'zh-CN': '高松灯',
    'zh-TW': '高松燈',
    en: 'Tomori Takamatsu',
    ja: '高松燈',
  },
  'chihaya-anon': {
    'zh-CN': '千早爱音',
    'zh-TW': '千早愛音',
    en: 'Anon Chihaya',
    ja: '千早愛音',
  },
  'yo-rana': {
    'zh-CN': '要乐奈',
    'zh-TW': '要樂奈',
    en: 'Rana Kaname',
    ja: '要楽奈',
  },
  'nagasaki-soyo': {
    'zh-CN': '长崎爽世',
    'zh-TW': '長崎爽世',
    en: 'Soyo Nagasaki',
    ja: '長崎そよ',
  },
  'shiina-taki': {
    'zh-CN': '椎名立希',
    'zh-TW': '椎名立希',
    en: 'Taki Shiina',
    ja: '椎名立希',
  },
  'togawa-sakiko': {
    'zh-CN': '丰川祥子',
    'zh-TW': '豐川祥子',
    en: 'Sakiko Togawa',
    ja: '豊川祥子',
  },
  'wakaba-mutsumi': {
    'zh-CN': '若叶睦',
    'zh-TW': '若葉睦',
    en: 'Mutsumi Wakaba',
    ja: '若葉睦',
  },
  mortis: {
    'zh-CN': 'Mortis',
    'zh-TW': 'Mortis',
    en: 'Mortis',
    ja: 'モーティス',
  },
  'misumi-uika': {
    'zh-CN': '三角初华 / Doloris',
    'zh-TW': '三角初華 / Doloris',
    en: 'Uika Misumi / Doloris',
    ja: '三角初華 / Doloris',
  },
  'yahata-umiri': {
    'zh-CN': '八幡海铃 / Timoris',
    'zh-TW': '八幡海鈴 / Timoris',
    en: 'Umiri Yahata / Timoris',
    ja: '八幡海鈴 / Timoris',
  },
  'uika-nyubara': {
    'zh-CN': '祐天寺若麦 / Amoris',
    'zh-TW': '祐天寺若麥 / Amoris',
    en: 'Nyubara Uika / Amoris',
    ja: '祐天寺若麦 / Amoris',
  },
  'jia-ran': {
    'zh-CN': '嘉然',
    'zh-TW': '嘉然',
    en: 'Diana',
    ja: '嘉然',
  },
  'eis-taffy': {
    'zh-CN': '永雏塔菲',
    'zh-TW': '永雛塔菲',
    en: 'Eis Taffy',
    ja: '永雛タフィ',
  },
  'neuro-sama': {
    'zh-CN': 'Neuro-sama',
    'zh-TW': 'Neuro-sama',
    en: 'Neuro-sama',
    ja: 'Neuro-sama',
  },
  'evil-neuro': {
    'zh-CN': 'Evil Neuro',
    'zh-TW': 'Evil Neuro',
    en: 'Evil Neuro',
    ja: 'Evil Neuro',
  },
  'kagamine-rin': {
    'zh-CN': '镜音铃',
    'zh-TW': '鏡音鈴',
    en: 'Kagamine Rin',
    ja: '鏡音リン',
  },
  'luo-tianyi': {
    'zh-CN': '洛天依',
    'zh-TW': '洛天依',
    en: 'Luo Tianyi',
    ja: '洛天依',
  },
  'runami-yachiyo': {
    'zh-CN': '月见八千代',
    'zh-TW': '月見八千代',
    en: 'Yachiyo Tsukimi',
    ja: '月見八千代',
  },
  murasame: {
    'zh-CN': '丛雨',
    'zh-TW': '叢雨',
    en: 'Murasame',
    ja: 'ムラサメ',
  },
  'ayachi-nene': {
    'zh-CN': '绫地宁宁',
    'zh-TW': '綾地寧寧',
    en: 'Nene Ayachi',
    ja: '綾地寧々',
  },
  'tomotake-yoshino': {
    'zh-CN': '朝武芳乃',
    'zh-TW': '朝武芳乃',
    en: 'Yoshino Tomotake',
    ja: '朝武芳乃',
  },
  atri: {
    'zh-CN': '亚托莉',
    'zh-TW': '亞托莉',
    en: 'ATRI',
    ja: 'アトリ',
  },
  'yanami-anna': {
    'zh-CN': '八奈见杏菜',
    'zh-TW': '八奈見杏菜',
    en: 'Anna Yanami',
    ja: '八奈見杏菜',
  },
  'nukumizu-kaju': {
    'zh-CN': '温水佳树',
    'zh-TW': '溫水佳樹',
    en: 'Kaju Nukumizu',
    ja: '温水佳樹',
  },
  elysia: {
    'zh-CN': '爱莉希雅',
    'zh-TW': '愛莉希雅',
    en: 'Elysia',
    ja: 'エリシア',
  },
  'haibara-ai': {
    'zh-CN': '灰原哀',
    'zh-TW': '灰原哀',
    en: 'Ai Haibara',
    ja: '灰原哀',
  },
  'arima-kana': {
    'zh-CN': '有马加奈',
    'zh-TW': '有馬加奈',
    en: 'Kana Arima',
    ja: '有馬かな',
  },
  'nishikigi-chisato': {
    'zh-CN': '锦木千束',
    'zh-TW': '錦木千束',
    en: 'Chisato Nishikigi',
    ja: '錦木千束',
  },
  'tanikaze-amane': {
    'zh-CN': '谷风天音',
    'zh-TW': '谷風天音',
    en: 'Amane Tanikaze',
    ja: '谷風天音',
  },
}

const seriesI18n: Record<string, LocalizedText> = {
  VOCALOID: {
    'zh-CN': 'VOCALOID',
    'zh-TW': 'VOCALOID',
    en: 'VOCALOID',
    ja: 'VOCALOID',
  },
  Vsinger: {
    'zh-CN': 'Vsinger',
    'zh-TW': 'Vsinger',
    en: 'Vsinger',
    ja: 'Vsinger',
  },
  '新世纪福音战士': {
    'zh-CN': '新世纪福音战士',
    'zh-TW': '新世紀福音戰士',
    en: 'Neon Genesis Evangelion',
    ja: '新世紀エヴァンゲリオン',
  },
  '名侦探柯南': {
    'zh-CN': '名侦探柯南',
    'zh-TW': '名偵探柯南',
    en: 'Detective Conan',
    ja: '名探偵コナン',
  },
  '东方Project': {
    'zh-CN': '东方Project',
    'zh-TW': '東方Project',
    en: 'Touhou Project',
    ja: '東方Project',
  },
  '孤独摇滚！': {
    'zh-CN': '孤独摇滚！',
    'zh-TW': '孤獨搖滾！',
    en: 'Bocchi the Rock!',
    ja: 'ぼっち・ざ・ろっく！',
  },
  '辉夜大小姐想让我告白': {
    'zh-CN': '辉夜大小姐想让我告白',
    'zh-TW': '輝夜姬想讓人告白',
    en: 'Kaguya-sama: Love Is War',
    ja: 'かぐや様は告らせたい',
  },
  '某科学的超电磁炮': {
    'zh-CN': '某科学的超电磁炮',
    'zh-TW': '科學超電磁砲',
    en: 'A Certain Scientific Railgun',
    ja: 'とある科学の超電磁砲',
  },
  '魔法少女小圆': {
    'zh-CN': '魔法少女小圆',
    'zh-TW': '魔法少女小圓',
    en: 'Puella Magi Madoka Magica',
    ja: '魔法少女まどか☆マギカ',
  },
  '原神': {
    'zh-CN': '原神',
    'zh-TW': '原神',
    en: 'Genshin Impact',
    ja: '原神',
  },
  "BanG Dream! It's MyGO!!!!!": {
    'zh-CN': "BanG Dream! It's MyGO!!!!!",
    'zh-TW': "BanG Dream! It's MyGO!!!!!",
    en: "BanG Dream! It's MyGO!!!!!",
    ja: "BanG Dream! It's MyGO!!!!!",
  },
  'BanG Dream! Ave Mujica': {
    'zh-CN': 'BanG Dream! Ave Mujica',
    'zh-TW': 'BanG Dream! Ave Mujica',
    en: 'BanG Dream! Ave Mujica',
    ja: 'BanG Dream! Ave Mujica',
  },
  'A-SOUL': {
    'zh-CN': 'A-SOUL',
    'zh-TW': 'A-SOUL',
    en: 'A-SOUL',
    ja: 'A-SOUL',
  },
  '虚拟主播': {
    'zh-CN': '虚拟主播',
    'zh-TW': '虛擬主播',
    en: 'VTuber',
    ja: 'バーチャルYouTuber',
  },
  '超时空辉夜姬！': {
    'zh-CN': '超时空辉夜姬！',
    'zh-TW': '超時空輝耀姬！',
    en: 'Cho-Kaguyahime!',
    ja: '超かぐや姫！',
  },
  '千恋＊万花': {
    'zh-CN': '千恋＊万花',
    'zh-TW': '千戀＊萬花',
    en: 'Senren * Banka',
    ja: '千恋＊万花',
  },
  '魔女的夜宴': {
    'zh-CN': '魔女的夜宴',
    'zh-TW': '魔女的夜宴',
    en: 'Sabbat of the Witch',
    ja: 'サノバウィッチ',
  },
  'ATRI -My Dear Moments-': {
    'zh-CN': 'ATRI -My Dear Moments-',
    'zh-TW': 'ATRI -My Dear Moments-',
    en: 'ATRI -My Dear Moments-',
    ja: 'ATRI -My Dear Moments-',
  },
  '败犬女主太多了！': {
    'zh-CN': '败犬女主太多了！',
    'zh-TW': '敗北女角太多了！',
    en: 'Too Many Losing Heroines!',
    ja: '負けヒロインが多すぎる！',
  },
  '崩坏3': {
    'zh-CN': '崩坏3',
    'zh-TW': '崩壞3rd',
    en: 'Honkai Impact 3rd',
    ja: '崩壊3rd',
  },
  '我推的孩子': {
    'zh-CN': '我推的孩子',
    'zh-TW': '我推的孩子',
    en: 'Oshi no Ko',
    ja: '【推しの子】',
  },
  '莉可丽丝': {
    'zh-CN': '莉可丽丝',
    'zh-TW': '莉可麗絲',
    en: 'Lycoris Recoil',
    ja: 'リコリス・リコイル',
  },
  '天使☆骚动 RE-BOOT!': {
    'zh-CN': '天使☆骚动 RE-BOOT!',
    'zh-TW': '天使☆囂囂 RE-BOOT!',
    en: 'Tenshi Souzou RE-BOOT!',
    ja: '天使☆騒々 RE-BOOT!',
  },
}

function resolveLocalizedText(
  table: Record<string, LocalizedText>,
  key: string,
  locale: AppLocale,
  fallback: string,
) {
  return table[key]?.[locale] ?? fallback
}

export function isHiddenCharacter(character: Pick<CharacterMatch, 'hidden'> | null | undefined) {
  return Boolean(character?.hidden)
}

export function getHiddenCharacterTitle(locale: AppLocale) {
  return hiddenCharacterTitleI18n[locale]
}

export function getHiddenCharacterNote(locale: AppLocale) {
  return hiddenCharacterNoteI18n[locale]
}

export function getHiddenCharacterTags(locale: AppLocale) {
  return hiddenCharacterTagsI18n[locale]
}

export function getLocalizedCharacterName(
  character: Pick<CharacterMatch, 'id' | 'name' | 'hidden'>,
  locale: AppLocale,
  options?: { revealHidden?: boolean },
) {
  if (isHiddenCharacter(character as CharacterMatch) && !options?.revealHidden) {
    return hiddenCharacterNameI18n[locale]
  }
  return resolveLocalizedText(characterNameI18n, character.id, locale, character.name)
}

export function getLocalizedCharacterSeries(character: Pick<CharacterMatch, 'series' | 'hidden'>, locale: AppLocale) {
  if (isHiddenCharacter(character as CharacterMatch)) {
    return hiddenCharacterSeriesI18n[locale]
  }
  return resolveLocalizedText(seriesI18n, character.series, locale, character.series)
}
