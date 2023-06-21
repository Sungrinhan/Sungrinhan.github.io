---
title: "[Next]Server Components(13v) "
date: 2023-06-20 19:33:SS +/- TTTT
categories: [NextJs]
tags: [nextjs, servercomponent] # TAG는 반드시 소문자로 이루어져야함!
---

# React Essentials (Next.js 13v)

Next.js 로 어플리케이션을 구축하면, Server Components 와 같은 React 의 최신 기능에 익숙해지는 것에 도움이 된다.

> 이번 블로깅 목표:
>
> - 서버 구성 요소와 클라이언트 구성 요소의 차이점
> - 사용 시기 및 권장패턴 알아보기

## Server Components

서버와 클라이언트 컴포넌트를 통해 클라이언트 측 앱의 풍부한 상호 작용과 기존 서버 렌더링의 향상된 성능을 결합하여 **서버와 클라이언트에 걸쳐있는** 애플리케이션을 빌드할 수 있다.

### 서버 컴포넌트에 대해 생각하기

리액트는 전체 애플리케이션 클라이언트 사이드( 예를 들어 SPA)를 렌더링하는 대신 이제 용도에 따라 컴포넌트를 렌더링할 위치를 선택할 수 있는 유연성을 제공한다.

예를 들어 다음과 같은 애플리케이션에 있는 페이지를 보자:

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fthinking-in-server-components.png&w=3840&q=75&dpl=dpl_7Ady22XSCKE7RPpVv81xJEFA3SVc)
페이지를 더 작은 컴포넌트로 분할하면 대부분의 구성요소가 non-interactive 이며, Server Components 로 렌더링 될 수 있음을 알 수 있다.

### 그래서 왜 Server Components 인데?

Client Components 보다 무엇이 좋길래 이렇게 구분되는 걸까? React 는 새로운 버전을 출시하면서, 어떤 장점을 보았던걸까?

#### 1. Server Components 를 통해 개발자는 서버 인프라를 더 잘 활용할 수 있다.

예를 들어, data-fetching 을 서버로 보내고, 데이터베이스에 더 가깝게 이동하고, 이전에는 서버의 client JavaScript bundle size 에 영향을 미쳤던 큰 종속성을 유지하여 성능을 향상 시킬 수 있다.

#### 2. 첫 페이지 로딩이 빨라지고, 클라이언트 사이드의 자바스크립트 번들크기는 감소된다.

기본 client-side 런타임은 캐싱이 가능하고 크기를 예측할 수 있으며, 애플리케이션이 커져도 증가하지 않는다. 추가 자바스크립트는 Client Components 를 통해 상호작용이 사용되는 경우에만 추가된다.

#### 3. Next.js 로 route가 로드 되고, 초기 HTML 은 서버에서 렌더링 된다.

이 HTML 은 브라우저에서 점진적으로 확장(향상)되어 클라이언트가 Next.js 및 React Client Components 런타임을 비동기식으로 로드하여 애플리케이션을 인계하고 상호 작용을 추가할 수 있다.

> 즉, lazy-loading 과 비슷하다고 할 수 있다.
> 유저와 상호작용이 필요없는 부분들은 서버렌더링을 통해 빠르게 보여주고, 상호작용이 필요한 client component 는 비동기적으로 불러오는 것... 원래는 페이지 단위로 client, sever 를 나눴지만 이제는 컴포넌트 단위로 server, client 가 나뉘게 된것...!

Server Components 로의 전환을 더 쉽게 하기 위해 앱 라우터 내부의 모든것들(특수 파일, 공동 배치 구성요소)은 default로 Server Components이다.

선택적으로 'use client' 를 사용해 Client Components 로 바꿀 수 있다.

## Client Components

Client Components 는 내 애플리케이션에 클라이언트 사이드 상호작용을 추가할수 있게 해준다. Next.js 에서는 서버에서 사전 렌더링 되고, 클라이언트에 전달된다. Pages Router 가 원래 작동하던거라고 생각하면 된다.

### 'use client' 지시문

이 지시문은 서버와 클라이언트 컴포넌트 모듈 그래프 사이의 경계를 선언하는 규칙이다. 말이 좀 어려운데... 다음을 보자.

```ts
// app/counter.tsx

"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p> You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fuse-client-directive.png&w=3840&q=75&dpl=dpl_7Ady22XSCKE7RPpVv81xJEFA3SVc)

> 'use client' 의 위치 정하기
>
> - 서버전용 코드와 클라이언트 코드 사이에 사용
>   파일의 가장 위에부분에 존재. 클라와 서버의 경계에 있다.
> - 'use client' 의 child components 들 또한 client components 로 인식된다.

> 출처
>
> - [NEXT.JS 공식 홈페이지](https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive)
