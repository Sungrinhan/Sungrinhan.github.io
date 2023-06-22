---
title: "[Next v13]React Essentials (1) "
date: 2023-06-20 19:33:SS +/- TTTT
categories: [NextJs]
tags: [nextjs, servercomponent] # TAG는 반드시 소문자로 이루어져야함!
---

# React Essentials (Next.js 13v) (1)

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

'use client' 의 위치 정하기

- 서버전용 코드와 클라이언트 코드 사이에 사용
- 파일의 가장 위에부분에 존재. 클라와 서버의 경계에 있다.
- 'use client' 의 child components 들 또한 client components 로 인식된다.

> ### Good to know:
>
> - Server Component module graph 에 있는 컴포넌트들은 서버에서만 렌더링되도록 보장된다.
> - Client Compponent module graph 에 있는 컴포넌트들은 주로 클라이언트에서 렌더링 되지만, Next.js 에서는 서버에서 사전 렌더링 되고 클라이언트쪽으로 내려줄 수 있다.
> - 'use client' 지시문은 모든 파일에 있을 필요는 없다. entry point 에만 있어도, 여기에 import 되는 모든 모듈들은 Client Component 로 구분된다.

## 그래서 언제 Server 랑 Client Component 로 쓰면될까?

| 무엇을 해야 되니?                                                                 | Server Component | Client Component |
| --------------------------------------------------------------------------------- | ---------------- | ---------------- |
| Fetch Data                                                                        | ✅               | ❌               |
| Access backend resources(directly)                                                | ✅               | ❌               |
| Keep sensitive information onthe server (access tokens, API keys, etc)            | ✅               | ❌               |
| Keep large dependencies on the server / Reduce client-side JavaScript             | ✅               | ❌               |
| Add interactivity and event listeners(`onClick()`, `onChange()`, etc)             | ❌               | ✅               |
| Use State and Lifecycle Effects(`useState()`, `useReducer()`, `useEffect()`, etc) | ❌               | ✅               |
| Use browser-only APIs                                                             | ❌               | ✅               |
| Use custom hooks that depend on state, effects, or browser-only APIs              | ❌               | ✅               |
| Use React Class components                                                        | ❌               | ✅               |

## Patterns

### Client Components 를 잎으로 보내라(아마 끝단으로 보내라는 뜻)

내 애플리케이션의 퍼모먼스를 향상시키기 위해, 공식문서에서는 Client Components 를 컴포넌트 트리에서 가능하면 잎쪽(끝단)으로 보내라고 한다.

#### 예시 (전체적인 Layout) 에 대해서.

간단한 예를 Layout 으로 들어보자. 여기에는 static elements 인 로고나 링크가 있고, 상호작용이 가능하고 상태를 사용하는 서치바가 있다고 하자.

모든 layout 을 Client Component 로 만드는 것보다, 상호작용이 필요한 로직만 Client Component 로 보내고, 다른 layout 을 Server Component 로 쓰는 것이다. 이렇게 하면 layout 에 있는 모든 자바스크립트 를 클라이언트로 보낼 필요가 없어진다는 것이다.

예를들어 다음과 같이 할 수 있다.

```ts
// SearchBar is a Client Component
import SearchBar from "./searchbar";
// Logo is a Server Component
import Logo from "./logo";

// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  );
}
```

## Client 와 Server 컴포넌트 지휘하기 혹은 구성하기

서버와 클라이언트 컴포넌트는 같은 컴포넌트 트리에서 결합될 수 있다.

리액트가 이 과정을 어떻게 처리하는지 이해해 보자:

- 서버에서, react 는 모든 server components 를 클라이언트에 보내기 전에 렌더링을 처리한다.
  - 여기에는 Client Components 안에 중첩된 Server Components 를 포함한다.
  - 이 단계에서 발생한 Client Components 는 모두 스킵된다.
- 클라이언트에서, React 는 Client Components 와 Server Components 에서 렌더된 결과인 **슬롯(영문으로는 slots 라고 되어있다. 아마 중간중간 비어있는, 혹은 채워져 있는 static 한 결과들인 것 같다, 즉 Server Components 의 결과일 것이다.)**들을 렌더링 하여, 서버와 클라이언트에서 수행된 작업을 병합한다.
  - 만약 Server Components 가 Client Component 안에 중첩된 경우, 렌더링된 컨텐츠는 Client Component 내에 올바르게 배치된다.

> Good to know:
> Next.js 에서는 초기페이지 (initial page) 로드 중에서는 server 와 client Components 들은 미리 렌더되어 서버에서 HTML 로 생성되고, 이로인해 사용자는 초기 더 빠른 응답을 받을 수 있다! (이거는 뭐 next 가 build 되면 생성되는 첫 페이지가 html 로 생긴것이니 알고있던 사실..)

### Client Components 에서 Server Components 를 중첩하기

위에서 설명한 렌더링 흐름을 고려할 때, 서버 컴포넌트를 클라이언트 컴포넌트 요소로 가져오는데는 제한이 있다. 이 접근 방식에는 추가 서버 왕복이 필요하기 때문이다.

- 지원하지 않는 패턴: `Importing` Server Components into Client Components
- 그러면 만약에, 이러한 패턴이 필요한 경우는 어떻게 할까?

#### Recommended Pattern: Passing Server Components to Client Components as Props

자~ sever components 를 직접적으로 import 하는것이 불가능하다면, client components 에는 서버 컴포넌트를 가져올 수 없는걸까?

결론적으로 말하면 방법은 있다. React 에서 react node 를 props 로 전달해 주면 된다. 보통 children 이라는 props로 전달하는데 다음 예시를 보자:

```ts
"use client";

import { useState } from "react";

export default function ExampleClientComponent({
  children
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {children}
    </>
  );
}
```

이렇게 작성하면, `<ExampleClientComponent>` 는 `children`이 무엇인지는 모른다.
`children`이 Server Component 로 채워질 것이라는 사실조차 모른다.

여기에는 그저 `children`이 배치될 위치를 결정하는 것만 책임지면 된다는 것!
그렇기 때문에 부모 페이지(Server Component) 에서는 client component 와 이에 중첩된 sever component 를 둘다 import 할 수 있다:

```ts
// app/page.tsx

// Client Component 의 props 나 자식 컴포넌트로 Server Component 전달가능
import ClientComponent from "./exampleClientComponent";
import ServerComponent from "./exampleServerComponent";

// 기본적으로 넥스트에서 페이지는 모두 서버컴포넌트다.
export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  );
}
```

이렇게 접근하는 경우 ClientComponent 와 ServerComponent 의 렌더링이 분리되고, 클라이언트 컴포넌트보다 먼저 서버에서 렌더링되는 서버 컴포넌트 요소와 정렬하여 독립적으로 렌더링할 수 있다.

> 출처
>
> - [NEXT.JS 공식 홈페이지](https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive)
