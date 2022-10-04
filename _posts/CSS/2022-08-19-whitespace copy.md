---
title: "[CSS] React에서 텍스트 줄바꿈(whitespace: pre-wrap)"
date: 2022-10-04 16:23:SS +/- TTTT
categories: [CSS]
tags: [css, whitespace, pre-wrap] # TAG는 반드시 소문자로 이루어져야함!
---

## React 에서 텍스트의 줄바꿈은 어떻게 될까?

Antd의 카드를 만들면서 <Meta > 태그를 작성하는데, `<br/>`태그 혹은 `\n` 을 인식하지 못하고

그대로 출력하는 상황이 있었다.

jsx 형식에서는 다음과 같은 결과를 출력한다.
참고로 antd Card.Meta 의 <Meta> 태그는 타입이 `ReactNode` 이다.

```ts
const Meta = Card.Meta
<Meta
  title="카페 24"

  description={
    "대표운영자 ID를 입력하고 연동시작일을 설정하면 자동으로 연동이 됩니다. \n 카페24 연동하러 가기"
  }

  // \n 이 string 형식으로 그대로 출력된다.
/>
```

## 해결법

css 스타일을 적용시켜줘야 한다.

```ts
white-space: pre-line;
```

위와 같이 적용하면, 개행문자 ('\n') 을 잘 인식해서 줄바꿈한 결과를 출력하게 된다.

```ts
const Meta = Card.Meta
<Meta
  // Card.Meta 의 <Meta> 태그는 타입이 'ReactNode'
  // 따라서 white-space 가 아닌, whitespace 로 설정해야한다.
  style={{ whiteSpace: 'pre-line}}
  description = { "대표운영자 ID를 입력하고 연동시작일을 설정하면 자동으로 연동이 됩니다. \n 카페24 연동하러 가기" }
>
```

## 참고

[white-space mdn](https://developer.mozilla.org/ko/docs/Web/CSS/white-space)
