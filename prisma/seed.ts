/**
 * Seed script for Smart Budget database.
 * Creates a demo user with default categories, accounts, and sample transactions.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: "식비", icon: "Utensils", color: "#ef4444", sortOrder: 0 },
  { name: "교통", icon: "Car", color: "#f97316", sortOrder: 1 },
  { name: "쇼핑", icon: "ShoppingBag", color: "#eab308", sortOrder: 2 },
  { name: "문화/여가", icon: "Film", color: "#22c55e", sortOrder: 3 },
  { name: "의료/건강", icon: "Heart", color: "#ec4899", sortOrder: 4 },
  { name: "교육", icon: "GraduationCap", color: "#8b5cf6", sortOrder: 5 },
  { name: "주거/통신", icon: "Home", color: "#3b82f6", sortOrder: 6 },
  { name: "카페/간식", icon: "Coffee", color: "#a16207", sortOrder: 7 },
  { name: "미분류", icon: "HelpCircle", color: "#6b7280", sortOrder: 99 },
];

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@smartbudget.app" },
    update: {},
    create: {
      email: "demo@smartbudget.app",
      name: "데모 사용자",
      image: null,
    },
  });
  console.log(`  User: ${user.name} (${user.email})`);

  // Create default categories
  const categories: Record<string, string> = {};
  for (const cat of DEFAULT_CATEGORIES) {
    const created = await prisma.category.upsert({
      where: {
        id: `default-${cat.name}`,
      },
      update: {},
      create: {
        id: `default-${cat.name}`,
        userId: user.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        isDefault: true,
        sortOrder: cat.sortOrder,
      },
    });
    categories[cat.name] = created.id;
  }
  console.log(`  Categories: ${DEFAULT_CATEGORIES.length} defaults created`);

  // Create default accounts
  const cashAccount = await prisma.account.upsert({
    where: { id: "demo-cash" },
    update: {},
    create: {
      id: "demo-cash",
      userId: user.id,
      name: "현금",
      type: "CASH",
      balance: 500000,
      color: "#22c55e",
      icon: "Banknote",
    },
  });

  const bankAccount = await prisma.account.upsert({
    where: { id: "demo-bank" },
    update: {},
    create: {
      id: "demo-bank",
      userId: user.id,
      name: "국민은행",
      type: "BANK",
      balance: 3200000,
      color: "#3b82f6",
      icon: "Building",
    },
  });

  const cardAccount = await prisma.account.upsert({
    where: { id: "demo-card" },
    update: {},
    create: {
      id: "demo-card",
      userId: user.id,
      name: "삼성카드",
      type: "CARD",
      balance: 0,
      color: "#8b5cf6",
      icon: "CreditCard",
    },
  });

  const kakaoAccount = await prisma.account.upsert({
    where: { id: "demo-kakao" },
    update: {},
    create: {
      id: "demo-kakao",
      userId: user.id,
      name: "카카오페이",
      type: "EPAY",
      balance: 45000,
      color: "#facc15",
      icon: "Smartphone",
    },
  });
  console.log("  Accounts: 4 created (현금, 국민은행, 삼성카드, 카카오페이)");

  // Create sample transactions for this month
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const sampleTransactions = [
    { type: "EXPENSE" as const, amount: 8500, date: new Date(y, m, 1), categoryId: categories["카페/간식"], accountId: cardAccount.id, merchantName: "스타벅스", memo: "아메리카노 + 케이크" },
    { type: "EXPENSE" as const, amount: 32000, date: new Date(y, m, 2), categoryId: categories["식비"], accountId: cardAccount.id, merchantName: "배달의민족", memo: "치킨 배달" },
    { type: "INCOME" as const, amount: 3500000, date: new Date(y, m, 5), categoryId: categories["미분류"], accountId: bankAccount.id, merchantName: "회사", memo: "4월 급여" },
    { type: "EXPENSE" as const, amount: 650000, date: new Date(y, m, 5), categoryId: categories["주거/통신"], accountId: bankAccount.id, merchantName: "월세", memo: "4월 월세" },
    { type: "EXPENSE" as const, amount: 1350, date: new Date(y, m, 6), categoryId: categories["교통"], accountId: kakaoAccount.id, merchantName: "서울교통", memo: "지하철" },
    { type: "EXPENSE" as const, amount: 15900, date: new Date(y, m, 7), categoryId: categories["쇼핑"], accountId: cardAccount.id, merchantName: "다이소", memo: "생활용품" },
    { type: "EXPENSE" as const, amount: 45000, date: new Date(y, m, 8), categoryId: categories["문화/여가"], accountId: cardAccount.id, merchantName: "CGV", memo: "영화 + 팝콘" },
    { type: "EXPENSE" as const, amount: 28000, date: new Date(y, m, 10), categoryId: categories["식비"], accountId: cashAccount.id, merchantName: "고기집", memo: "친구 식사" },
    { type: "EXPENSE" as const, amount: 12000, date: new Date(y, m, 12), categoryId: categories["의료/건강"], accountId: cardAccount.id, merchantName: "약국", memo: "감기약" },
    { type: "EXPENSE" as const, amount: 5500, date: new Date(y, m, 13), categoryId: categories["카페/간식"], accountId: kakaoAccount.id, merchantName: "CU", memo: "편의점 간식" },
    { type: "EXPENSE" as const, amount: 89000, date: new Date(y, m, 15), categoryId: categories["교육"], accountId: bankAccount.id, merchantName: "유데미", memo: "온라인 강의" },
    { type: "INCOME" as const, amount: 150000, date: new Date(y, m, 16), categoryId: categories["미분류"], accountId: bankAccount.id, merchantName: "프리랜서", memo: "부수입" },
  ];

  for (const tx of sampleTransactions) {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        ...tx,
      },
    });
  }
  console.log(`  Transactions: ${sampleTransactions.length} samples created`);

  // Create sample budget
  const budgets = [
    { categoryId: categories["식비"], amount: 300000 },
    { categoryId: categories["교통"], amount: 100000 },
    { categoryId: categories["카페/간식"], amount: 50000 },
    { categoryId: categories["쇼핑"], amount: 150000 },
    { categoryId: categories["문화/여가"], amount: 100000 },
  ];

  for (const b of budgets) {
    await prisma.budget.create({
      data: {
        userId: user.id,
        categoryId: b.categoryId,
        amount: b.amount,
        month: m + 1,
        year: y,
      },
    });
  }
  console.log(`  Budgets: ${budgets.length} monthly budgets set`);

  // Create sample points
  const points = [
    { provider: "NAVER_PAY", type: "APPTECH" as const, balance: 12500 },
    { provider: "TOSS", type: "APPTECH" as const, balance: 3200 },
    { provider: "KAKAO_PAY", type: "APPTECH" as const, balance: 8900 },
    { provider: "OK_CASHBAG", type: "LOYALTY" as const, balance: 4500 },
    { provider: "OLIVE_YOUNG", type: "LOYALTY" as const, balance: 2300 },
    { provider: "DAISO", type: "LOYALTY" as const, balance: 1000 },
  ];

  for (const p of points) {
    await prisma.point.create({
      data: {
        userId: user.id,
        provider: p.provider,
        type: p.type,
        balance: p.balance,
        lastUpdated: now,
      },
    });
  }
  console.log(`  Points: ${points.length} providers added`);

  // Create sample goal
  await prisma.goal.create({
    data: {
      userId: user.id,
      title: "제주도 여행 자금",
      targetAmount: 1000000,
      currentAmount: 350000,
      startDate: new Date(y, m - 1, 1),
      endDate: new Date(y, m + 2, 30),
      status: "ACTIVE",
      icon: "Plane",
      color: "#3b82f6",
    },
  });
  console.log("  Goals: 1 savings goal created");

  console.log("\nSeed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
