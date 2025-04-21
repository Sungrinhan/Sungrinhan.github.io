require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const filePath = path.join(__dirname, 'topics.json');

const topics = fs.existsSync(filePath)
  ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
  : {};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getNextTopic(previousTopics) {
  const prompt = `
당신은 프론트엔드 공부 계획을 세우는 AI입니다.
아래는 지금까지 사용자가 공부한 주제입니다:

${previousTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

이어서 학습하면 좋은 주제를 1개만, 간결하게 추천해주세요.
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content.trim().replace(/^[-•\d.]\s*/, '');
}

async function appendTopic() {
  const previousDates = Object.keys(topics).sort();
  const previousTopics = previousDates.map(date => topics[date]);

  const lastDate = new Date(previousDates.at(-1));
  const nextDate = new Date(lastDate);
  nextDate.setDate(lastDate.getDate() + 1);

  const yyyy = nextDate.getFullYear();
  const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
  const dd = String(nextDate.getDate()).padStart(2, '0');
  const nextDateStr = `${yyyy}-${mm}-${dd}`;

  const newTopic = await getNextTopic(previousTopics);
  topics[nextDateStr] = newTopic;

  fs.writeFileSync(filePath, JSON.stringify(topics, null, 2), 'utf8');
  console.log(`[${nextDateStr}][SUCCESS] ${newTopic}`);
}

appendTopic();
