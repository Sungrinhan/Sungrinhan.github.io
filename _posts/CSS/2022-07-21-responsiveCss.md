---
title: "[CSS] 반응형 코드 이쁘게 작성하기"
date: 2022-07-21 15:12:SS +/- TTTT
categories: [CSS]
tags: [css, responsive] # TAG는 반드시 소문자로 이루어져야함!
---

css 반응형 코드를 이쁘게 작성하기!

```ts
// 반응형을 위한 브레이크 포인트(width)

const breakpoints = [768, 1200];

// 각 요소를 미디어문으로 변경
export const media = breakpoints.map((bp) => `@media (max-width: ${bp}px)`);

// 실제 적용하기
// 필요한 breakpoint 를 가져다 쓰면 된다.
export const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1vh;

  ${media[1]} {
    width: 100%;
  }
`;
```

## 참조

없음.
