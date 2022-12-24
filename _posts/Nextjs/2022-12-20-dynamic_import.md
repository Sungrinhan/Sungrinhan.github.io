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
require() 를 쓸 수 없다. commonJS 에서 쓰는 require() 말고, dynamic import 를 써라.
```

konva-react module 에서 실제로 require() 를 쓰고있긴 했다. 하지만, 모듈 코드를 고치는것은 아닌것 같아서 구글링 해보았다.

## dynamic import 에 관한 개념

next 공식 홈페이지에서 dynamic import 에 대한 document 가 있다.

[next 공식홈페이지 dynamic import](https://nextjs.org/docs/advanced-features/dynamic-import)

> Next.js supports lazy loading external libraries with `import()` and React components with `next/dynamic`. Deferred loading helps improve the initial loading performance by decreasing the amount of JavaScript necessary to render the page. Components or libraries are only imported and included in the JavaScript bundle when they're used.

Next.js 는 외부 라이브러리를 `import()` lazy loading 으로 지원하고, 리액트 컴포넌트를 `next/dynamic` 으로 지원한다. 다른방법으로의 로딩은 페이지를 렌더할 때 필요한 자바스크립트의 양을 감소시킴으로서 기본 로딩 퍼포먼스를 향상시켜준다.

즉 이러한 **다른 방법의 import 를 통해서 페이지를 렌더하기 때문에**, 서버사이드 렌더링을 지원하지 않는 라이브러리의 경우 설정을 해줘야 한다.

### Examples

## 출처

[next 공식홈페이지 dynamic import](https://nextjs.org/docs/advanced-features/dynamic-import)
