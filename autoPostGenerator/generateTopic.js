require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const topicsFilePath = path.join(__dirname, 'topics.json');
const nextTopicsFilePath = path.join(__dirname, 'nextTopics.json');

const topics = fs.existsSync(topicsFilePath)
  ? JSON.parse(fs.readFileSync(topicsFilePath, 'utf8'))
  : {};

const nextTopics = fs.existsSync(nextTopicsFilePath)
  ? JSON.parse(fs.readFileSync(nextTopicsFilePath, 'utf8'))
  : {};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getNextTopic(previousTopics) {
  const prompt = `
당신은 프론트엔드 공부 계획을 세우는 AI입니다.
아래는 지금까지 사용자가 공부한 주제입니다:

${previousTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

이어서 학습하면 좋은 주제를 1개만, 추천해주세요.
이전 내용에 대해 심화학습도 괜찮아. 깊게 파고들 수 있는 주제 + 심화학습도 같이 추천해;
블로그 제목은 주제를 포함해서 작성해. 블로그 제목으로 쓸거니까.
prefix 붙일 필요 없어. 주제: 이렇게 붙이지 말고 바로 태그로 쓸수있는 단어를 처음에 시작하도록 해.
블로그 제목 이런것도 붙이지 말고, 바로 쓸수 있는 블로그 제목으로 전달해. 한줄로. 더블쿼테이션도 쓰지마. 텍스트만 전달하도록.
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content.trim().replace(/^[-•\d.]\s*/, '');
}

async function appendTopic() {
  const previousTopics = Object.values(topics);
  const newTopic = await getNextTopic(previousTopics);
  
  // 현재 날짜와 시간을 키로 사용
  const now = new Date();
  const dateTimeStr = now.toISOString().slice(0, 19).replace('T', ' ');
  nextTopics[dateTimeStr] = newTopic;

  fs.writeFileSync(nextTopicsFilePath, JSON.stringify(nextTopics, null, 2), 'utf8');
  console.log(`[${dateTimeStr}][SUCCESS] ${newTopic}`);
}

appendTopic();
