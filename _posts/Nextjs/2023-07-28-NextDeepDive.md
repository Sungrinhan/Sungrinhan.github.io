---
title: "[Next Deep Dive] Routing 기초 "
date: 2023-07-28 22:01:SS +/- TTTT
categories: [NextJs]
tags: [nextjs, routing] # TAG는 반드시 소문자로 이루어져야함!
---

모든 애플리케이션의 골격은 라우팅이다. 이번 블로깅에서 부터는 나만의 Next.js - Deep Dive 를 정리해보려 한다.

# 1. The `app` Router

13v Next.js 에서는 `React Server Components` 에 기반한 새로운 App Router 를 소개했다. shared layouts, nested routing, loading states, error handling 과 같은 기능도 지원한다.

App Router 는 `app` 이라는 새로운 디렉토리에서 작동한다. 앱 디렉토리는 점진적 채용을 허용하기 위해 `pages` 디렉토리와 함께 작동한다.

> 💡 Tips
>
> - App Router 는 Pages Router 보다 우선시 된다.
> - 동일한 URL 경로가 있어서는 안된다.
> - 동일한 경로가 있을 경우 빌드 때 오류발생!

기본적으로, `app` 안의 components 들은 React Server Components 다. 성능 최적화를 위해 선택했으며, Client Components 로도 사용이 가능하다.

# 2. 폴더와 파일의 역할

- **폴더**는 routes 를 정의하는데 쓰인다.
- Route(경로) : 루트 폴더에서 `page.js` 를 포함하는 최종 leaf folder 까지 파일 시스템 계층 구조를 따르는 중첩 폴더의 단일경로
- **파일** 은 경로에서 보여주는 UI를 생성한다.

# 3. File Conventions

Next.js 에서는 중첩된 경로에서 특정 상황을 나타내주는 UI를 생성하는 특별한 파일들을 제공한다.

- `layout`: Shared UI for a segment and its children
- `page` : Unique UI of a route and make routes publicly accessible
- `loading` : Loading UI for a segment and its children
- `note-found` : Not found UI for a segment and its children
- `error` : Error UI for a segment and its children
- `global-error`: Global Error UI
- `route`: Server-side API endpoint

# 4. 컴포넌트 계층구조

특정 파일들은 특정 계층 구조를 갖는다. 순서를 정리하자면 다음과 같다.

- `layout.js`
- `template.js`
- `error.js` : React error boundary
- `loading,js` : React suspense boundary
- `not-found.js` : React error boundary
- `page.js` or nested `layout.js`

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Ffile-conventions-component-hierarchy.png&w=3840&q=75&dpl=dpl_E1xtmPp6BtoZW5f8puYPYkiCnxEf)

중첩 경로인 상황에서는 , 상위 세그먼트의 구성 요소내에 중첩된다.

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fnested-file-conventions-component-hierarchy.png&w=3840&q=75&dpl=dpl_E1xtmPp6BtoZW5f8puYPYkiCnxEf)

# 5. Colocation (co-location: 같이 배치? co-operate 같이 co가 접두사로 쓰인듯...)

`app` 디렉토리에 있는 폴더 안에는, 컴포넌트들을 같이 배치해도 된다.

폴더가 경로를 정의하는 반면, `page.js` 나 `route.js` 만 라우팅을 하기 때문이다.

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fproject-organization-colocation.png&w=3840&q=75&dpl=dpl_E1xtmPp6BtoZW5f8puYPYkiCnxEf)

새로운 디자인 패턴을 쓸 수 있을것같다.

내가 생각했을 때 다음과 같이 쓸수있을 것 같다.

- 각 페이지에 있는 컴포넌트를 폴더별로 정리할 수있을 것이다.
- 공통 컴포넌트가 있다고 하더라도, 공통컴포넌트를 import 해서 쓰는 새로운 컴포넌트를 만들어서 쓴다.
- 즉 , 어떤 페이지에 있는 컴포넌트를 보려고 다른 폴더에서 찾을 필요없이 경로를 찾아 폴더에 들어가면 컴포넌트 들을 볼 수 있는 것이다.

성능적으로도 문제가 없냐고 말한다면, 사실 모른다. 다만, 여러명이서 개발하는 특성상 보기가 매우 편해질 것 같다는 생각이 문득 들었다 ㅎㅎ..(책임없는 생각)

# 6. 서버 중심 라우팅 with Client-side Navigation

`pages` 디렉토리에서는 클라이언트-사이드-라우팅을 사용하는 것과는 달리, App Router 는 서버중심 라우팅(**server-centric routing**)을 사용해서 서버 구성요소(서버 컴포넌트) 및 서버의 데이터 fetching 에 맞춘다.

왜? sever-centring routing 을 사용하면:

- 클라이언트는 route map 을 다운로드 할 필요가 없다.
- 서버 컴포넌트에 대한 동일한 요청을 사용해서 경로를 조회할 수 있다.
- 이 **최적화**는 모든 애플리케이션에 유용하지만, 많은 경로를 갖고있는 애플리케이션에 더 큰 효과가 있다.

서버 중심 라우팅이지만, 라우터는 SPA 의 동작과 유사한 링크 컴포넌트를 이용해서 client-side navigation 을 사용한다.

이 말이 무슨뜻이냐.. 유저가 새로운 경로로 이동하면 브라우저는 페이지를 새로고침하지 않는다. 대신, URL 이 업데이트 되고 **Next.js 는 바뀌는 부분(세그먼트= segements)만 렌더할 것이다.**

유저가 앱을 탐색할 때:

- 라우터는 리액트 서버 컴포넌트 페이로드 결과를 클라이언트 캐시 메모리에 저장한다.
- 캐시는 경로 세그먼츠에 의해 나눠지며, 이는 리액트의 동시 렌더링에서 일관성을 보장함
- 이전에 요청한 세그먼트의 캐시를 재사용함 -> 최적화(성능 향상)

# 6. 부분 렌더링

자매 경로를 navigate 할 때, Next.js 는 바뀌는 부분만 fetch 하고 render 할 것이다. subtree에서 상위 세그먼츠에 있는 것은 re-fetch 하거나 re-render 하지 않는다!

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fpartial-rendering.png&w=3840&q=75&dpl=dpl_E1xtmPp6BtoZW5f8puYPYkiCnxEf)

업데이트 된 세그먼트만 렌더링하면 서버에 전송되는 데이터의 양과 실행 시간이 줄어들어 성능이 향상!

알고있는 사실이지만 적어보았다. 간혹 너무나도 당연하게 생각해서 이렇게 하는 목적을 까먹을 수 있기 때문에 적어보았다. ㅎㅎ

# 7. 심화 라우팅 패턴

- Parallel Routes: 독립적으로 탐색할 수 있는 두개 이상의 페이지를 하나의 view 로 표시할 수 있다. split view로 보여줄 수 있음 (예를들어 대쉬보드)
- Intercepting Routes: 경로를 다로채 다른 경로의 컨텍스트에 표시할 수 있다. 현재 페이지에서 context 를 유지하는 것이 중요할 때 사용가능! (예를들어 하나의 작업을 편집하거나 피드에서 사진을 확장하는 동안 모든 작업보기)

자세한 advanced routing pattern 을 알아보자.

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

> 출처
>
> - [Next.js 공식문서](https://nextjs.org/docs/app/building-your-application/routing#partial-rendering)
