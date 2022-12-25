---
title: "[Next]Dynamic Import "
date: 2022-12-24 20:56:SS +/- TTTT
categories: [Nextjs]
tags: [nextjs, dynamic import] # TAG는 반드시 소문자로 이루어져야함!
---

# Next 에서의 dynamic import

## 왜 찾아 봤나...?

next framework page 의 경우, 서버사이드 렌더링이 있다.
canvas framework 중 하나인 konva-react 를 썼는데 , 첫 로딩때는 렌더링이 잘 되었으나
이후 새로고침을 하면 module 에러가 떴다...

에러의 내용은 다음과 같았다.

```ts
require() 를 쓸 수 없다. commonJS 에서 쓰는 require() 말고,
dynamic import 를 써라.
```

konva-react module 에서 실제로 require() 를 쓰고있긴 했다. 하지만, 모듈 코드를 고치는것은 아닌것 같아서 구글링 해보았다.

## dynamic import 를 왜 써야돼? (코드분할)

> 모든 웹 페이지의 속도를 결정 짓는 첫번째 요소는 첫 페이지를 그릴때 필요한 자원양이다.

필요한 자원이 많으면 많을 수록 네트워크 상에서 다운받는 시간이 오래걸린다.
웹페이지의 경우, JS파일을 불러오기 전까지는 Rendering 을 멈춘다.
즉, 페이지에서 가장 큰 용량을 차지하는 JS파일을 불러오기 전까지는 첫 화면을 보여주지 못하기 때문에 좋지 못한 사용자 경험이 될 수 있다.

그럼 어떻게 첫 페이지 로딩을 빠르게 할 수 있을까?
결국은 서버에서 보내는 절대적인 전송량을 줄이면 좋겠지만, 이미 작성된 코드량을 줄이는 것은 쉽지 않다.

첫페이지 렌더링에는 최소한의 코드만 (즉 사용자가 볼 수 있게끔) 전송하고, 이후 특정 이벤트 발생시에만 코드를 호출한다면 첫페이지 렌더링이 더 빨라질 수 있다.

- 이것을 Lazy Loading 이라고 할 수 있겠다.

dynamic import 를 사용하여 런타임시 필요한 `module` 을 `import` 할 수 있다.
여기서는 dynamic import 를 통해 첫페이지를 빠르게 로딩할 수 있는 방법을 알아보겠다.

## dynamic import 에 관한 개념

next 공식 홈페이지에서 dynamic import 에 대한 document 가 있다.

[next 공식홈페이지 dynamic import](https://nextjs.org/docs/advanced-features/dynamic-import)

> Next.js supports lazy loading external libraries with `import()` and React components with `next/dynamic`. Deferred loading helps improve the initial loading performance by decreasing the amount of JavaScript necessary to render the page. Components or libraries are only imported and included in the JavaScript bundle when they're used.

Next.js 는 외부 라이브러리를 `import()` lazy loading 으로 지원하고, 리액트 컴포넌트를 `next/dynamic` 으로 지원한다. 다른방법으로의 로딩은 페이지를 렌더할 때 필요한 자바스크립트의 양을 감소시킴으로서 기본 로딩 퍼포먼스를 향상시켜준다.

이러한 **다른 방법의 import 를 통해서 페이지를 렌더하기 때문에**, 서버사이드 렌더링을 지원하지 않는 라이브러리의 경우 설정을 해줘야 한다.

### Examples

#### 1. With named exports

> To dynamically import a named export, you can return it from the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) returned by [`import()`](https://github.com/tc39/proposal-dynamic-import#example):

`import()` 를 통해 반환된 Promise 로 dynamically import 된 모듈을 사용할 수 있다.

```ts
// components/hello.js

export function Hello() {
  return <p>Hello!</p>;
}

// pages/index.js

import dynamic from "next/dynamic";

const DynamicComponent = dynamic(() =>
  import("../components/hello").then((mod) => mod.Hello)
);

const Home = () => {
  return (
    <div>
      <DynamicComponent />
    </div>
  );
};
```

#### 2. With no SSR

다음은 내가 작성한 코드이다 .
여기서 사용한 모듈중에 `konva-react ` 가 있는데, SSR (Server-Side-Rendering)을 지원하지 않는다.
Next 에서 사용을 원한다면, dynamic import 를 통해 SSR 을 false 로 설정해 주어야 한다.

```ts
// drawcenterkonva.tsx

import dynamic from "next/dynamic";

const DrawCenter = () => {
  const DynamicDrawKonva = dynamic(() => import("../components/DrawKonva"), {
    ssr: false,
  });

  return (
    <>
      <DynamicDrawKonva />
    </>
  );
};

export default DrawCenter;
```

#### 3. With External Libraries

> The module is only loaded in the browser after the user types in the search input.

이거는 해보지 않아서 잘 모르겠다.
예시에서의 기능은 , 사용자가 input 창에 입력을 시작하면 그때만 모듈을 가져와서 사용하게 된다.

```ts
<input
	onChange = (async (e) => {
          const { value } = e.currentTarget
          // Dynamically load fuse.js
          const Fuse = (await import('fuse.js')).default
          const fuse = new Fuse(names)

          setResults(fuse.search(value))

		})
/>
```

## 출처

[next 공식홈페이지 dynamic import](https://nextjs.org/docs/advanced-features/dynamic-import)
[Dynamic Import 로 웹페이지 성능 올리기 ](https://pks2974.medium.com/dynamic-import-%EB%A1%9C%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80-%EC%84%B1%EB%8A%A5-%EC%98%AC%EB%A6%AC%EA%B8%B0-caf62cc8c375)
