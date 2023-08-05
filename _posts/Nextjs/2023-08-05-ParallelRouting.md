---
title: "[Next Deep Dive] Parallel Routing"
date: 2023-08-05 14:24:SS +/- TTTT
categories: [NextJs]
tags: [nextjs, parallelrouting] # TAG는 반드시 소문자로 이루어져야함!
---

## 1. Parallel Routes

### a. 대시보드 혹은 피드

소셜 사이트의 대시보드 혹은 피드와 같이 **매우 동적인** 애플리케이션의 경우, 병렬 라우팅을 사용하여 복잡한 라우팅 패턴을 구현할 수 있다!

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fparallel-routes.png&w=3840&q=75&dpl=dpl_DMzbjJ6qfcbNz3HGySe9uGAgJ5sK)

### b. 독립적인 에러, 로딩 상태

병렬 라우팅을 사용하면, 독립적으로 fetch(스트리밍) 되는 각 경로(라우트)에 대해 독립적인 에러 바운더리, suspense boundary 상태를 정의할 수 있다.

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fparallel-routes-cinematic-universe.png&w=3840&q=75&dpl=dpl_DMzbjJ6qfcbNz3HGySe9uGAgJ5sK)

### c. 조건부 슬롯 렌더링

병렬 라우팅을 사용하면 인증상태와 같은 특정 조건에 따라 슬롯을 렌더링할 수 있다. 이렇게 하면 동일한 URL 에서 완전히 분리된 코드를 사용할 수있다.

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fconditional-routes-ui.png&w=3840&q=75&dpl=dpl_DMzbjJ6qfcbNz3HGySe9uGAgJ5sK)

### #. Convention

Parallel routes 는 슬롯을 사용하여 생성된다. 슬롯은 `@folder` 규칙으로 정의되고, 동일한 레벨의 레이아웃에 props 로 전달된다.

다음과 같은 예시를 보자. 파일 구조는 두개의 명시적 슬롯을 정의한다: `@analytics` 와 `@team`.

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fparallel-routes-file-system.png&w=3840&q=75&dpl=dpl_DMzbjJ6qfcbNz3HGySe9uGAgJ5sK)

위 사진에 있는 폴더 구조는 `app/layout.js` 가 `@analytics` 와 `@team` 라는 슬롯 props 를 허용하고, `children` prop 과 함께 병렬적으로 렌더링 할 수 있다.

```ts
export default function Layout(props: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <>
      {props.children}
      {props.team}
      {props.analytics}
    </>
  );
}
```

> 💡 **Good to know** > `children` prop 은 folder 에 매핑할 필요가 없는 암시적 슬롯이다. 이게 무슨 뜻이냐면, `app/page.js` 는 `app/@children/page.js` 와 동일하다.

### d. 맞지 않는 경로(unmatched routes)

기본적으로 슬롯 내에서 렌더링되는 컨텐츠는 현재 URL 과 동일하다.

만약 매치되지 않는 슬롯의 경우, Next.js 는 라우팅 기술과 폴더구조에 따라 다르게 렌더링 한다.

#### a. `default.js`

현재 URL 에 기반한 슬롯의 활성화 상태를 커버하지 못하는 경우, default.js 를 정의할 수 있다.

다음과 같은 폴더구조가 있다고 하자. `@team` 슬롯은 `settings` 경로가 있고, `@analytics` 는 없다고 하자.

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fparallel-routes-unmatched-routes.png&w=3840&q=75&dpl=dpl_DMzbjJ6qfcbNz3HGySe9uGAgJ5sK)

##### Navigation

Next.js 는 현재 URL과 일치하지 않더라도 슬롯의 이전 활성 상태를 렌더링한다.

##### Reload

새로고침(리로드)시 Next.js 는 먼저 일치하지 않는 슬롯의 default.js 파일을 렌더링하려고 시도한다. 사용할 수 없는 경우 404가 렌더링된다.

> 일치하지 않는 경로에 대한 404 는 병렬 렌더링되지 않아야 하는 라우트를 실수로 렌더링하지 않도록 한다.

#### b. `useSelectedLayoutSegment(s)`

`useSelectedLayoutSegment` 와 `useSelectedLayoutSegments` 모두 해당 슬롯 내에서 활성 경로 세그먼트를 읽을 수 있도록 허용하는 parallelRoutesKey 를 허용한다.

```ts
"use client";

import { useSelectedLayoutSegment } from "next/navigation";

export default async function Layout(props: {
  //...
  auth: React.ReactNode;
}) {
  const loginSegments = useSelectedLayoutSegment("auth");
  // ...
}
```

유저가 `@auth/login` 혹은 `/login` 을 URL 바에 입력하면, `loginSegments` 는 string `"login"` 과 같아진다.

### e. 예시

#### Modals

모달을 구현하는데 병렬 라우팅을 쓸 수 있다.
![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fparallel-routes-auth-modal.png&w=3840&q=75&dpl=dpl_DMzbjJ6qfcbNz3HGySe9uGAgJ5sK)

`@auth`슬롯은 일치하는 경로(예를들어 /login)로 이동하여 표시할 수 있는 `<Modal>` 컴포넌트를 렌더링한다. 코드를 보고 이해해 보자.

```ts
// app/layout.tsx

export default async function Layout(props: {
  // ...
  auth: React.ReactNode;
}) {
  return (
    <>
      {/* ... */}
      {props.auth}
    </>
  );
}
```

```ts
// app/@auth/login/page.tsx

import { Modal } from "components/modal";

export default function Login() {
  return (
    <Modal>
      <h1>Login</h1>
      {/* ... */}
    </Modal>
  );
}
```

활성화되지 않은 상태에서 모달의 콘텐츠가 렌더링되지 않게 하려면, null 을 반환하는 default.js 파일을 만들 수 있다.

```ts
// app/@auth/default.tsx

export default function Default() {
  return null;
}
```

#### Modal 닫기

모달이 클라이언트 탐색을 통해 시작된 경우 (예를들어 `<Link href="/login">` ), `router.back()` 을 호출함으로서 모달을 닫을 수 있다.

```ts
// app/@auth/login/page.tsx

"use client";
import { useRouter } from "next/navigation";
import { Modal } from "components/modal";

export default async function Login() {
  const router = useRouter();
  return (
    <Modal>
      <span onClick={() => router.back()}>Close modal</span>
      <h1>Login</h1>
      ...
    </Modal>
  );
}
```

모달을 닫고 다른곳을 탐색하고 싶은 경우, catch-all route 를 사용할 수 있다.
![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fparallel-routes-catchall.png&w=3840&q=75&dpl=dpl_DMzbjJ6qfcbNz3HGySe9uGAgJ5sK)

```ts
// app/@auth/[...catchAll]/page.tsx

export default function CatchAll() {
  return null;
}
```

> 💡 Catch-all routes 는 `default.js` 보다 우선한다!

#### Conditional Routes (조건부 경로)

조건부 라우팅을 구현하는 데 병렬경로를 사용할 수 있다. 예를 들어, 인증 상태에 따라 `@dashboard` 혹은 `@login` 을 렌더링하고 싶을 때 사용한다.

```ts
import { getUser } from "@/lib/auth";

export default function Layout({
  dashboard,
  login
}: {
  dashboard: React.ReactNode;
  login: React.ReactNode;
}) {
  const isLoggedIn = getUser();

  return isLoggedIn ? dashboard : login;
}
```

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fconditional-routes-ui.png&w=3840&q=75&dpl=dpl_DMzbjJ6qfcbNz3HGySe9uGAgJ5sK)

> 출처
>
> - [Next.js 공식문서](https://nextjs.org/docs/app/building-your-application/routing#partial-rendering)
