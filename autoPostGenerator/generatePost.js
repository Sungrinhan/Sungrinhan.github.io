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

const now = new Date();
const dateTimeStr = now.toISOString().slice(0, 19).replace('T', ' ');
const today = now.toISOString().slice(0, 10);
const topic = nextTopics[dateTimeStr] || "웹 프론트엔드 기초 정리";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `
당신은 개발 블로그 작가입니다. 아래 주제로 Jekyll 블로그용 글을 Markdown 형식으로 써주세요.

제목: ${topic}

요구사항:
- 개념 설명 (500자 이상)
- 실제 코드 예시 (코드는 \`\`\`로 감싸기)
- 실무에서 사용할 법한 예시 및 꿀팁 
- 응용버전 예시 
- 완전 자세하게 적어줘. 내용에 대한 질문을 2번정도 더한것처럼 설명을 자세히, 예시도 자세히 해.
- 제목은 내가 알아서 할테니 그냥 컨텐트 내용만 적어. 
`;

async function generatePost() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content;

    const fileName = `${today}-${topic.toLowerCase().replace(/\s+/g, '-')}.md`;
    const filePath = path.join(__dirname, '../_posts', fileName);

    const markdown = `---
layout: post
title: "${topic}"
date: ${dateTimeStr}
categories: 프론트엔드
tags: ${topic.split(' ')[0]}
---

${content}
`;

    fs.writeFileSync(filePath, markdown, 'utf8');
    
    // 작성된 토픽을 topics.json으로 이동
    topics[dateTimeStr] = topic;
    delete nextTopics[dateTimeStr];
    
    fs.writeFileSync(topicsFilePath, JSON.stringify(topics, null, 2), 'utf8');
    fs.writeFileSync(nextTopicsFilePath, JSON.stringify(nextTopics, null, 2), 'utf8');
    
    console.log(`[${dateTimeStr}][SUCCESS] ${fileName}`);
  } catch (error) {
    console.error(`[${dateTimeStr}][ERROR] ${error.message}`);
  }
}

generatePost();
