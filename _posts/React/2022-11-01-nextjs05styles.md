---
title: "[React][Next.js] Next.js CSS Style 적용하기(05)"
date: 2022-11-01 17:35:SS +/- TTTT
categories: [React, NextJs]
tags: [react, nextjs, css, style] # TAG는 반드시 소문자로 이루어져야함!
---

Next.js 에서 css 적용하기

Next.js 팁

> Library 와 Framework 차이점
>
> Library
>
> - something that i call
> - i call library to use it.
> - 자유도가 높은대신, 많은 설정을 직접 해주어야 함. 파편화가 될 위험도 있음.
>
> Framework
>
> - framework calls my code.
> - 틀이 짜여져 있고, 내코드를 프레임워크가 가져다가 쓰는 것 .
> - 자유도가 적은 대신, boilerPlate 작성하기 간편하다는 점.
> - 단지 코드를 올바른 장소에 넣기만 하면 나머지는 프레임워크가 알아서 해줌.

## 파일이름.module.css

- 일반적인 css 와 같다. 사용하고자 하는 컴포넌트 내에서 import 로 css모듈을 불러온다.
- 다른점은, css 모듈을 자바스크립트 객체로 불러오기 때문에 className 에 중괄호로 value 값을 가져와야 한다.
- css module 이 해당 클래스이름을 무작위화 할 것이다.
- 파일을 여러개 만들어야 되기 때문에 , 선호하는 방식은 아니다.

```ts
//NavBar.tsx

import styles from "styles/NavBar.module.css";

<div className={styles.greeting}>Hello</div>;

// html 요소를 보면 , <div class="greeting-bio5"> 같이 무작위 클래스명이 생성된다.
```

```ts
// NavBar.module.css

.greeting {
	color: red;
}

```

## styled.jsx

- React 태그가 아닌, normal html tag다.
- Component Scope 이다. 왜냐? 얘도 컴파일 될 때 클래스네임에 난수가 들어가는데, 각 컴포넌트에 같은 이름이 있어도 결국 다르게 생성된다. (태그이름으로 해도 된다)
- Prop으로 `jsx` 를 넣어주어야 한다.
-

```ts
const NavBar = () => {
  const router = useRouter();
  return (
    <nav>
      <Link href="/">
        <a className={router.pathname === "/" ? "active" : ""}>Home</a>
      </Link>
      <Link href="/about">
        <a className={router.pathname === "/about" ? "active " : ""}>About</a>
      </Link>
      <style jsx>
        {`
          // nav 태그를 넣어도 난수로 생성된다.
          nav {
            background-color: none;
          }

          .active {
            color: tomato;
          }
        `}
      </style>
    </nav>
  );
};
```

## Custom App Component(a.k.a `_app.tsx`)

- 가장 첫번째로 렌더되는 페이지라고 생각하면 된다.
- 페이지를 렌더링 할때마다 사용한다.
- Props 로 `Component, pageProps` 가 있다.
- NextJS 는 렌더링 하길 원하는 페이지를 첫 번째 prop `Component` 에 넣어준다.
- 필수로 만들어야 하는 페이지는 아니다. 하지만 템플릿을 만들고 싶다면 ? 하는게 매우좋다. -> 글로벌 layout 이라든지, 매 페이지에 필수적으로 들어가는 Navigation을 추가해 주던지...
- 어떤 페이지에서는 NavBar 가 필요 없을 수도 있기 때문에, 항상 디자인에 신경써야 한다.

```ts
// _app.tsx

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <NavBar />
      <Component {...pageProps} />
      <span>Hello, this text is written in _app.tsx</span>
      <style jsx global>
        {`
          a {
            color: white;
          }
        `}
      </style>
    </div>
  );
}

export default MyApp;
```
