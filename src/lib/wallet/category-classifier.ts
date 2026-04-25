/**
 * category-classifier.ts
 *
 * Pure rule engine that maps Korean merchant name patterns to budget category names.
 * No external dependencies — safe to import in both server and client contexts.
 */

export interface ClassifierRule {
  pattern: string | RegExp; // case-insensitive substring or regex
  categoryName: string; // must match a category name in DB
  priority: number; // higher wins on ties
}

// ---------------------------------------------------------------------------
// Built-in rules — Korean merchant ecosystem
// ---------------------------------------------------------------------------

const BUILTIN_RULES: ClassifierRule[] = [
  // 카페/간식
  { pattern: /스타벅스|starbucks/i, categoryName: "카페/간식", priority: 90 },
  { pattern: /투썸|twosome/i, categoryName: "카페/간식", priority: 90 },
  { pattern: /이디야|ediya/i, categoryName: "카페/간식", priority: 90 },
  { pattern: /메가|mega.*coffee/i, categoryName: "카페/간식", priority: 90 },
  { pattern: /컴포즈|compose/i, categoryName: "카페/간식", priority: 90 },
  { pattern: /빽다방/i, categoryName: "카페/간식", priority: 90 },
  { pattern: /폴바셋/i, categoryName: "카페/간식", priority: 90 },
  { pattern: /파리바게뜨|뚜레쥬르/i, categoryName: "카페/간식", priority: 85 },
  { pattern: /배스킨|던킨|빙수|아이스크림/i, categoryName: "카페/간식", priority: 80 },

  // 식비 (convenience stores classified as food — common Korean budgeting convention)
  { pattern: /^cu\b|cu\s|cu편의점/i, categoryName: "식비", priority: 85 },
  { pattern: /gs25|지에스25/i, categoryName: "식비", priority: 85 },
  { pattern: /세븐일레븐|7-eleven|seven/i, categoryName: "식비", priority: 85 },
  { pattern: /이마트24|emart24/i, categoryName: "식비", priority: 85 },
  { pattern: /미니스톱/i, categoryName: "식비", priority: 80 },
  { pattern: /배달의민족|배민|baemin/i, categoryName: "식비", priority: 95 },
  { pattern: /요기요|yogiyo/i, categoryName: "식비", priority: 95 },
  { pattern: /쿠팡이츠|coupang.*eats/i, categoryName: "식비", priority: 95 },
  { pattern: /맥도날드|mcdonald/i, categoryName: "식비", priority: 90 },
  { pattern: /버거킹|burger.*king/i, categoryName: "식비", priority: 90 },
  { pattern: /롯데리아/i, categoryName: "식비", priority: 90 },
  { pattern: /kfc|케이에프씨/i, categoryName: "식비", priority: 90 },
  { pattern: /도미노|피자헛|pizza/i, categoryName: "식비", priority: 90 },
  { pattern: /본죽|본도시락/i, categoryName: "식비", priority: 80 },
  { pattern: /김밥천국|김밥/i, categoryName: "식비", priority: 75 },
  { pattern: /스시로|스시|초밥/i, categoryName: "식비", priority: 80 },
  { pattern: /고기집|치킨|족발|보쌈|국밥|냉면|짜장|짬뽕/i, categoryName: "식비", priority: 70 },

  // 쇼핑
  { pattern: /다이소|daiso/i, categoryName: "쇼핑", priority: 90 },
  { pattern: /이마트(?!24)|emart(?!24)/i, categoryName: "쇼핑", priority: 85 },
  { pattern: /홈플러스|homeplus/i, categoryName: "쇼핑", priority: 85 },
  { pattern: /롯데마트|코스트코|costco/i, categoryName: "쇼핑", priority: 85 },
  { pattern: /쿠팡|coupang/i, categoryName: "쇼핑", priority: 85 },
  { pattern: /11번가|11st/i, categoryName: "쇼핑", priority: 85 },
  { pattern: /옥션|gmarket|지마켓|티몬|위메프/i, categoryName: "쇼핑", priority: 85 },
  { pattern: /무신사|musinsa/i, categoryName: "쇼핑", priority: 90 },
  { pattern: /지그재그|에이블리|29cm/i, categoryName: "쇼핑", priority: 85 },
  { pattern: /올리브영|olive.*young/i, categoryName: "쇼핑", priority: 90 },

  // 교통
  { pattern: /택시|카카오\s?t|카카오모빌리티|우티|uber/i, categoryName: "교통", priority: 95 },
  { pattern: /지하철|버스|교통카드|tmoney|티머니|cashbee/i, categoryName: "교통", priority: 95 },
  { pattern: /ktx|srt|코레일|korail/i, categoryName: "교통", priority: 90 },
  { pattern: /고속버스|시외버스/i, categoryName: "교통", priority: 90 },
  { pattern: /주유|gs칼텍스|sk에너지|s-oil|현대오일|gasoline/i, categoryName: "교통", priority: 85 },

  // 문화/여가
  { pattern: /cgv|메가박스|롯데시네마|cinema|영화/i, categoryName: "문화/여가", priority: 90 },
  { pattern: /yes24|교보문고|알라딘|영풍문고|book/i, categoryName: "문화/여가", priority: 90 },
  { pattern: /넷플릭스|netflix|디즈니|disney|왓챠|티빙|웨이브/i, categoryName: "문화/여가", priority: 90 },
  { pattern: /노래방|볼링|당구|pc방/i, categoryName: "문화/여가", priority: 85 },

  // 의료/건강
  { pattern: /약국|pharmacy|온누리/i, categoryName: "의료/건강", priority: 95 },
  { pattern: /병원|의원|한의원|치과|hospital/i, categoryName: "의료/건강", priority: 95 },
  { pattern: /헬스장|피트니스|gym|요가|필라테스/i, categoryName: "의료/건강", priority: 85 },

  // 교육
  { pattern: /학원|과외|온라인.*강의|inflearn|인프런|udemy|유데미|coursera/i, categoryName: "교육", priority: 90 },
  { pattern: /class101|클래스101/i, categoryName: "교육", priority: 90 },

  // 주거/통신
  { pattern: /월세|전세|관리비|아파트|관리실/i, categoryName: "주거/통신", priority: 95 },
  { pattern: /kt(?!\w)|sk\s?t|skt|lg\s?u\+?|lgu\+?|통신비|telecom/i, categoryName: "주거/통신", priority: 90 },
  { pattern: /전기|한국전력|kepco|가스|도시가스|수도|상하수도/i, categoryName: "주거/통신", priority: 90 },
  { pattern: /스포티파이|spotify|apple\s?music|youtube\s?premium|구독/i, categoryName: "주거/통신", priority: 70 },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ClassificationResult {
  categoryName: string;
  confidence: number; // 0..1
  source: "user-history" | "builtin" | "fallback";
}

/**
 * Find the best matching builtin rule for a given merchant/memo string.
 * Returns null when no rule matches.
 */
export function classifyByBuiltin(input: string): ClassificationResult | null {
  const text = input.trim();
  if (!text) return null;

  let best: { rule: ClassifierRule; matchLen: number } | null = null;

  for (const rule of BUILTIN_RULES) {
    const isMatch =
      rule.pattern instanceof RegExp
        ? rule.pattern.test(text)
        : text.toLowerCase().includes(rule.pattern.toLowerCase());

    if (!isMatch) continue;

    const matchLen =
      rule.pattern instanceof RegExp
        ? (text.match(rule.pattern)?.[0]?.length ?? 0)
        : rule.pattern.length;

    if (
      !best ||
      rule.priority > best.rule.priority ||
      (rule.priority === best.rule.priority && matchLen > best.matchLen)
    ) {
      best = { rule, matchLen };
    }
  }

  if (!best) return null;

  return {
    categoryName: best.rule.categoryName,
    // Scale priority (70-95) to confidence range 0.6-0.95
    confidence: Math.min(0.6 + best.rule.priority / 200, 0.95),
    source: "builtin",
  };
}

/** Exported for unit testing only — not part of the public API surface. */
export const __testing = { BUILTIN_RULES };
