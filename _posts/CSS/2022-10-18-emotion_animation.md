---
title: "[CSS] emotion 으로 animation 구현하기"
date: 2022-10-18 16:36:SS +/- TTTT
categories: [CSS]
tags: [css, emotion, animation] # TAG는 반드시 소문자로 이루어져야함!
---

# Emotion keyframes 사용하기

![](../../assets/img/emotion_animation.png)

새로운 sider menu 를 임시로 만들었는데, 눈에 확 띄지 않아 `new`텍스트에 animation 을 추가해 보려고 했다. html 에서는 알고있지만, 프로젝트는 `emotion/react, emotion/react` 를 쓰고 있어서 사용법을 검색해 보았다.

## html 에서의 keyframe

- 일반적인 css 의 경우 `@keyframes` 를 사용한다.

```ts
@keyframes blink-effect {
	50% {
		opacity: 0;
	}
}

.blink {
	animation: blink-effect 1s step-end infinite;
	}
```

- 지속적인 애니메이션 효과를 위해서 `infinite `를 준다 .

## react 에서 emotion 으로 keyframe 구현하기

- `emotion/react` 에서 import 해올 수 있다. `css, keyframes`
- 기본적으로 html 과 구조는 같다.

```ts
// SideBar.tsx
// 이곳에는 삽입할 스타일에 대한 코드만 적었다.
import { css, keyframes } from "@emotion/react";

export const Blink = keyframes`
0%{
transform: translatex(0)
}
20%{
transform: translatex(1px);
opacity: 100%;
}
40%{
transform: translatex(2px);
opacity: 50%;
}
60%{
transform: translatex(3px);
opacity: 50%;
}
80%{
transform: translatex(2px);
opacity: 50%;
}
90%{
transform: translatex(1px);
opacity: 70%;
}
100%{
transform: translatex(0);
opacity: 100%;
}
`;

export const BlinkText = css`
  display: inline-block;
  margin-left: 5px;
  animation: ${Blink} 1s ease-out infinite;
`;
```

이제 css 에 대한 정의를 해줬으니, jsx 에 삽입해주면 완성이다.

```ts
// siderItems.tsx
<a
href="https://modument.notion.site/9efb074fcd2c4b8e8b4fe656e6b7c281"
target="_blank"
rel="noopener noreferrer"
>
공지사항
<span  css={BlinkText}>new</span>
</a>,
```

- 적용하려고 하는 태그 안에 `css` props 를 전달하고, value 로 기존에 만들어 두었던 `BlinkText` 를 입력하면 된다.

## 더 알아두면 좋은것들

### emotion 기본 문법

emotion 에서의 꽃은 `css()` 함수이다. 위 프로젝트 예제에서 볼 수 있지만, `@emotion/react` 패키지에서 불러올 수 있다.

`css()`함수는 CSS 스타일 선언 내용을 인자로 받는다 :

- 인자를 객체형으로 넘겨도 되고
- 문자형으로 넘겨도 된다.
  `css()` 반환 결과를 해당 스타일을 적용하고 싶은 컴포넌트에 `css` 라는 prop에 넘겨주면 된다.

객체형으로 전달하는 것이 훨씬 좋다. 왜냐?

> 타입스크립트를 사용하면 타입체킹(type checking) 을 통해 오타를 줄일 수 있기 때문이다.

## 참고

[emotion keyframes공식문서 ](https://emotion.sh/docs/keyframes),
[daleseo 블로그](https://www.daleseo.com/emotion/)
