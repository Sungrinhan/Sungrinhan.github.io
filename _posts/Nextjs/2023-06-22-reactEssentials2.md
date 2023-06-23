---
title: "[Next v13]React Essentials (2) "
date: 2023-06-22 20:01:SS +/- TTTT
categories: [NextJs]
tags: [nextjs, servercomponent, clientcomponent] # TAG는 반드시 소문자로 이루어져야함!
---

# [Next.js v13] React Essentials (2)

## 서버컴포넌트에서 클라이언트로 props 전달하기

서버에서 클라이언트 컴포넌트로 보내지는 Props 는 직렬화(serialization)가 필요하다. 이 말이 무엇이냐 하면, 함수, 날짜, 등등은 직접적으로 Client Components 로 전달이 되지 않는다.

> 직렬화 (serialization)
> 개체 또는 데이터 구조가 네트워크를 통한 전송 또는 스토리지(예: 배열 버퍼 또는 파일 형식)에 적합한 형식으로 변환되는 프로세스
> JavaScript 에서는 함수를 호출하여 개체를 JSON 문자열로 직렬화가 가능하다.

> Where is the Network Boundary?
> 앱 라우터에서, 네트워크 경계는 Server Components 와 Client Components 사이에 있다. 이 개념은, Page 에서 `getStaticProps` / `getServerSideProps` 와 Page Components 의 경계와는 다른 개념이다.
> Server Components 안에서 가져온 데이터는 Client Components 로 전달되지 않는 이상 네트워크 경계를 건너지 않기 때문에 직렬화가 필요하지 않다.

## 서버에서만 사용하는 코드는 Client Components 에서 분리해라.

자바스크립트 모듈은 서버와 클라이언트 컴포넌트 간에 공유될 수 있다. 서버에서만 실행되도록 의도된 코드가 클라이언트에 몰래 들어갈 수 있다.

다음과 같은 data-fetching function 을 보자:

```ts
// lib/data.ts

export async function getData() {
  const res = await fetch("https://external-service", {
    headers: {
      authorization: process.env.API_KEY
    }
  });

  return res.json();
}
```

언뜻 봐서는 `getData()` 함수가 서버, 클라이언트에서 모두 동작하는 것처럼 보인다. 하지만 환경변수 `API_KEY` 는 `NEXT_PUBLIC`에서 없는 값이다. 이 값은 서버에서만 접근 가능한 환경변수이다. Next.js 에서는 보안을 위해 클라이언트에서 환경변수를 빈 문자열로 바꾼다.

결론적으로 클라이언트에서 import 되고 실행도 가능하지만 예상대로 실행되지는 않는다. 그리고 변수를 공개하면 클라이언트에서 함수가 작동하지만 중요정보가 유출된다.

그래서 이 함수는 서버에서만 실행되어야 하는 이유다.

### The "server only" package

의도치 않은 서버코드를 클라이언트에서의 사용을 막기 위해, 우리는 `server-only` package 를 설치하여 빌드타임 에러를 낼 수 있다.

```ts
npm i server-only
```

이후에는, server only 를 import 하면 된다.

```ts
import "server-only";

export async function getData() {
  const res = await fetch("https://external-service.com/data", {
    headers: {
      authorization: process.env.API_KEY
    }
  });

  return res.json();
}
```

이제는 `getData()`를 실수로 Client Component 에서 import 해도, 빌드 타임에서 server 에서만 사용이 가능하다고 에러를 낼 것이다.

server-only 말고도 `client-only`라는 모듈도 있다. 예를들어 `window` 객체를 사용하는 경우, 클라에서만 사용가능 하기 때문에 해당 모듈을 사용해도 된다.

---

> 출처
>
> - [NEXT.JS 공식 홈페이지](https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive)
