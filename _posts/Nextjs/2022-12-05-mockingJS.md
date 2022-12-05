---
title: "[Nextjs, Mocking] 프엔개발 빠르게하기 (Mocking.js Next 에서 사용하기)"
date: 2022-12-05 15:08:SS +/- TTTT
categories: [Nextjs]
tags: [nextjs, mockingjs] # TAG는 반드시 소문자로 이루어져야함!
---

# Mocking 으로 FE 개발을 빠르게 시작해보자.

# 작업계기

우리 회사는 개발인원이 소수다. 백엔드 1(CTO, 이하 이사님) , 프엔드 2(신입 2) 이렇게 구성되어 있다.
백엔드에서 api개발이 완료가 되어야만 우리 프론트가 작업을 시작하는 구조였다.

```
요구사항 분석 및 기획 -> 백엔드 개발 -> 프론트엔드 개발
```

하지만 인원은 적고, 좀더 효율적으로 일하기 위해서는 백과 프론트가 같이 일을 시작하는게 좋을 것 같아 이사님이 mockup library 라는 것을 추천해 주셨다.

### 기존 mocking 방법에 대해서

기존에도 mocking 을 사용하지 않은 것은 아니다. 백엔드에서 미리 view 값을 알려주면, data 를 활용해 우리(프론트)가 mockup-data 를 만들고, 어떻게 구현할지는 미리 개발시작이 가능했다. 즉, api 통신을 통해서 데이터를 가져오는 것이 아니고, mockup data 를 통해 data 가공 및 css 만 처리가 가능했던 부분이다.

하지만 api 와 프론트의 종속관계가 복잡해 지면 어떡할까?
예를들어 CRUD 같이 http 메소드경우나, 서버와의 상태가 복잡한 어플리케이션일 경우는 서버상태의 응답에 대해 테스트 및 디버깅이 쉽지 않다는 단점이 있었다.
따라서 위와 같이 복잡한 구조같은 경우는 백엔드에서 api 를 만들때 까지 기다려야 했었다.

### 실제 API 를 사용하는 것처럼 네트워크 수준에서 mocking 하기

mockup-data 로 끝나는 것 만이 아닌, 실제 API 를 사용하는 것처럼 네트워크 request 를 보내고 response 를 받을 수 있는 mocking 수준이 필요했다.

구글링 해 본 결과, 우리 프로젝트(next 프레임워크)에는 이미 **MSW(Mock Service Worker)** 라는 API Mocking 라이브러리가 있다는 것을 알게 되었다.
[next github exaple 에 있는 msw](https://github.com/vercel/next.js/tree/canary/examples/with-msw)

# MSW.js

Mock Service Worker( 이하 MSW ) 는 api mocking 라이브러리로, 서버향의 네트워크를 가로채서 모의 응답(Mocked response)을 보내주는 역할을 한다. 따로 서버를 구축하지 않아도 API를 네트워크 수준에서 mocking 할 수 있다.

MSW 가 이러한 기능을 할 수 있는 이유는 Service Worker 를 통해 HTTP 요청을 가로채기 때문이다.

## Service Worker 란?

Service Worker는 웹 애플리케이션의 메인스레드와 분리된 별도의 백그라운드 스레드에서 실행시킬 수 있는 기술 중 하나이다.
Service Worker 덕분에 애플리케이션의 UI Block 없이 연산을 처리할 수 있다.

![](https://tech.kakao.com/wp-content/uploads/2022/01/07-3.png)
출처: [https://tech.kakao.com/2021/09/29/mocking-fe/%ED%95%9C](https://tech.kakao.com/2021/09/29/mocking-fe/%ED%95%9C)

이러한 특징으로 인해 다음과 같은 기능에 많이 사용되고 있다.

- 네트워크가 원활할 때 동기화를 시켜주는 백그라운도 동기화 기능이나, 높은 비용의 계산을 처리할 때 또는 푸시 이벤트를 생성할 때 주로 사용됨.
- MSW 의 동작 방식과 관계되어 있는, 네트워크 요청을 가로채는 행위도 수행할 수 있음. Service Worker 가 애플리케이션과 서버 사이에서 Request 를 가로채서, 직접 Fetch 에 대한 컨트롤도 할 수 있기 때문에 색다른 작업이 가능해진다. 예를 들어, HTTP Request 와 Response 를 보고 캐싱처리를 한다든지, 로깅을 한다든지 하는 여러가지 새로운 동작을 만들어 낼 수 있다. MSW 도 이 과정을 통해서 Request 를 가로채고 Response 를 Mocking 하는 원리를 사용한다.

참고로 Service Worker 의 사용이 제한되는 경우도 있다.

- 대부분의 모던 브라우저에서 지원하나, IE와 같은 일부 브라우저에서는 지원하지 않는다.
- 그 외에은, 기본적으로 localhost 가 아닌 환경이라면 HTTPS 보안 프로토콜 환경이 필요하다. Service Worker는 중간에서 네트워크 연결을 가로채고 조작할 수 있는 강력한 기능을 갖고 있기 때문에, Service Worker 에서는 HTTPS 가 기본적으로 제공되는 환경에서만 사용할 수 있다.

즉 MSW 는 Service Worker를 기반으로 모의 API 를 만들어내기 때문에 다른 프론트엔드에서 사용하는 수많은 라이브러리나 프레임워크에 종속적이지 않고 호환성에 문제없이 동작한다.

## MSW 동작 원리

![카카오테크 ](https://tech.kakao.com/wp-content/uploads/2022/01/08-3.png)
출처: [카카오테크 ](https://tech.kakao.com/wp-content/uploads/2022/01/08-3.png)

먼저, 브라우저에 Service Worker 를 설치한다.

설치 이후부터는 브라우저에서 실제 이루어지는 요청을 Service Worker가 가로채게 됩니다.

Service Worker 에서는 해당하는 실제 요청을 복사해서 MSW 에게 해당 요청과 일치하는 모의 응답을 제공받고 이를 브라우저에게 그대로 전달하게 된다.

이러한 과정을 통해서 실제 서버 존재 여부와 상관없이 실제 요청으로 이어지지 않고 예상할 수 있는 요청에 대해 Mocking 이 가능해진다. 이렇게 Mocking 이 가능해지면 API 가 아직 준비되지 않았어도 다음과 같은 개발 방식을 선택할 수 있다.

## MSW를 활용한 개발 방식

![](https://tech.kakao.com/wp-content/uploads/2022/01/09-2.png)
출처: [카카오테크 ](https://tech.kakao.com/wp-content/uploads/2022/01/09-2.png)

기획자가 요구 사항을 전달하면, 프론트엔드 개발자와 백엔드 개발자가 API 스펙을 합의하고 백엔드 개발자는 프론트엔드 개발자에게 API의 스펙을 제공한다. 그 이후, 프론트엔드 개발자는 MSW를 통해 네트워크 레벨에서의 Mocking 을 진행한 후, 애플리케이션을 개발하게 된다.

API 없이도 프론트엔드 개발자는 높은 완성도를 갖고 있는 수준에서 기획자와 미리 프론트엔드 애플리케이션을 확인하며 피드백을 주고받고, 그 사이 백엔드 개발자는 API 개발을 진행한다. 이후 백엔드 개발자가 API를 제공하면, 프론트엔드 개발자는 별다른 작업 없이 MSW를 스위치 오프만 하면 Production 으로 배포할 수 있는 형태로 개발을 진행할 수 있다.

MSW는 디버깅이 필요한 상황에서도 좋은 시너지를 만들어 낼 수 있다.

예를 들어, 특정 API 응답을 기준으로 에러가 발생해 디버깅이 필요한 상황이라면, 기존 서비스 로직을 전혀 건드리지 않고 오로지 MSW 에서 Mocking 을 만들어 내어 쉽게 디버깅 할 수 있다.

## MSW 사용 방법

### MSW 설치 및 구성

리액트 기준으로 살펴보자.
![](https://tech.kakao.com/wp-content/uploads/2022/01/10-2.png)
출처: [카카오테크](https://tech.kakao.com/wp-content/uploads/2022/01/10-2.png)

먼저 MSW 패키지를 설치한다.

```python
npm install msw --save-dev

# or

yarn add msw --dev
```

설치하고자 하는 프로젝트에 MSW 를 세팅한다. Service Worker 를 제공하기 위해서 MSW는 전용 CLI를 제공하고 있다. 이 CLI 의 init 명령어와 함께 사용하고자 하는 프로젝트의 public directory를 지정해서 실행해 준다.

```ts
npx msw init ./public --save
// public 폴더 directory 를 적어주면 된다. 보통 next, cra 에서는 root 에서 바로 public 폴더가 있다.
```

위 명령어 실행 후 public directory 에 `mockServiceWorker.js` 파일이 생성되었다.

이제 Mocking 할 API를 핸들링할 핸들러를 만들어 보자.

```ts
// mocks/handler.ts

import { rest } from "msw";
import { Book, Review } from "./types";

export const handlers = [
  // HTTP GET 메서드 + API URL
  rest.get("https://my.backend/book", (_req, res, ctx) => {
    return res(
      ctx.status(200), // 응답 상태 설정
      ctx.delay(3000), // 응답 시간 설정
      ctx.json<Book>({
        // 응답 결과 설정(view에서 내려오는 값을 여기서 설정하면 됨!)
        title: "Lord of the Rings",
        imageUrl: "/book-cover.jpg",
        description:
          "The Lordof the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
      })
    );
  }),
  rest.get("/reviews", (_req, res, ctx) => {
    return res(
      ctx.json<Review[]>([
        {
          id: "60333292-7ca1-4361-bf38-b6b43b90cb16",
          author: "John Maverick",
          text: "Lord of The Rings, is with no absolute hesitation, my most favored and adored book by‑far. The trilogy is wonderful‑ and I really consider this a legendary fantasy series. It will always keep you at the edge of your seat‑ and the characters you will grow and fall in love with!",
        },
      ])
    );
  }),
];
```

위의 예시는 next 깃헙에 등록된 예제다. API URL 지정 후 , 응답코드 200, 딜레이시간 3초, 응답 body 값으로는 영화에 관한 객체로 응답하고 있다.

이렇게 가로챈 네트워크 요청에 대해서 모의 API 를 생성할 수 있다.

모의 응답을 위한 핸들러를 MSW 에서 사용할 수 있도록 import 한다.

```ts
// mocks/browser.ts

import { setupWorker } from "msw";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

마지막으로 MSW 를 실행시키기 위한 코드를 추가한다. 노드 환경 변수에 따라 MSW를 사용하기 위한 분기를 포함해, 다음과 같이 작성한다.

```ts
// pages/_app.tsx

import { AppProps } from "next/app";

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("../mocks");
}
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

## 참조

[테크카카오 블로그\_Mocking으로 생산성까지 챙기는 FE 개발](https://tech.kakao.com/2021/09/29/mocking-fe/)
[next 에서 msw사용하기 공식 깃헙](https://github.com/vercel/next.js/tree/canary/examples/with-msw)
