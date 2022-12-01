---
title: "[Nextjs] Next에서 _app, _document에 대해서"
date: 2022-08-31 16:22:SS +/- TTTT
categories: [Nextjs]
tags: [nextjs, app, document] # TAG는 반드시 소문자로 이루어져야함!
---

기본적으로 next.js를 처음 설치하면 pages 폴더 안에 \_app 파일이 있다.
\_document가 없을 경우 따로 만들면 된다.
![](https://blog.kakaocdn.net/dn/Jtgq3/btrBEenBroP/uRqm6Vu0hDMSExtzp1UWY0/img.png)

## 1. \_app

가장 먼저 실행되는 컴포넌트로 모든 페이지는 \_app 을 통해 실행된다.

Next.js는 'App' 구성 요소를 사용해서 페이지를 초기화 한다. 이를 재정의하고 페이지 초기화를 제어할 수 있다. -> 다음과 같은 일을 할 수있는데 :

- 페이지 변경간에 레이아웃 유지
- 페이지 탐색 시 상태유지
- `componentDidCatch` 를 사용해서 자용자 정의 오류를 처리
- 페이지에 추가 데이터 삽입
- Global CSS 추가
- header 와 footer 같이 공통적으로 사용하는 레이아웃은 이곳에 추가

```ts
import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

기본적인 \_app.tsx 의 구조다.
props 로 `Component` 와 `pageProps` 를 받아온다.

### Component

Component는 현재 페이지를 의미한다.
페이지가 변경되면 Component가 변경된다.

ex) "http://localhost:3000/" 은 index.tsx 를 가리키며, "http://localhost:3000/about" 은 about 컴포넌트를 가리킨다.

### pageProps

**getInitialProps**, **getStaticProps**, **getServerSideProps** 를 통해 가져온 초기 속성값을 의미한다. 위의 값들이 없다면 빈 객체를 반환한다.

```ts
// about.tsx
...
export async function getStaticProps() {
	const test = "Hello";
	return {
		props: {
			test,
		},
	};
}
```

```ts
_app.tsx
...
function MyApp({ Component, pageProps }: AppProps) {
	console.log(pageProps); // {test: 'Hello'}
	return <Component {...pageProps} />;
}
```

만약 위와 같이 about.tsx 에서 getStaticProps 를 사용한다고 했을 때,
\_app.tsx에서 pageProps를 콘솔로 찍으면 `{test:'Hello'}`가 출력된다.

### \_app - getStaticProps, getServerSideProps

app은 getStaticProps 와 getServerSideProps를 지원하지 않는다.

### \_app - getInitialProps

\_app에서 getInitialProps를 사용한다면 Automatic Static Optimization 이 비활성화 되어 모든 페이지가 서버 사이드 렌더링 된다.

```ts
import App from "next/app";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp;
```

> \_app에서 getInitialProps 에서 사용할 때는 getInitialProps 안에 App을 통해 볼러온 App.getInitialProps 를 통해 반환해야 한다.

## 2. \_document

모든 페이지에서 공통적으로 사용하는 html, head(meta) 혹은 body 태그 안에 들어가는 요소를 커스텀할 때 사용한다.

- 서버에서만 렌더링 됨
- onClick 같은 이벤트나 custom CSS(like `styled-jsx`) 는 들어가면 안된다.

```ts
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

위의 코드는 Next.js에 의해 추가된 가장 기본 `Document`다. 사용자 정의 속성이 허용되는데, 예를 들어 `<html>`태그에 `lang="en"`을 추가할 수 있다.

```ts
<Html lang="en">
```

또는 `<body>`태그에 `className`을 추가할 수 있다.

```ts
<body claassName="bg-white" >
```

`<Html>` `<Head />` `<Main />` `<NextScript />` 는 페이지가 제대로 렌더링 되는데 필요하다.

### 주의사항!

- `_document` 에서 사용된 `<Head />` 컴포넌트는 `next/head ` 와 같지 않다.
  - `<Head />` 컴포넌트는 모든페이지에서 공통적으로 사용하는 `<head>` 에만 사용되는 것이어야 한다.
  - 다른 상황에서는, 예를 들어 `<title>` 태그는, 해당 페이지나 컴포넌트에서 `next/head` 를 사용하는 것을 권장한다.
- `<Main />` 밖에서 사용하는 React components 는 브라우저에서 준비되지 않는다.
  - application logic 이나 custom CSS(like `styled-jsx`) 는 추가해서는 안됨.
  - 모든페이지에 shared components(공유 컴포넌트)가 필요하다면, Layout을 참고하자.
- `Document` 는 Next.js 의 Data Fetching methods를 지원하지 않는다. such as `getStaticProps` or `getServerSideProps`

### Conclusion

- 모든 페이지는 \_app 과 \_document 를 거쳐간다.
- \_app 이후에 \_document 가 실행.
- \_app 은 어플리케이션 로직, 글로벌 스타일 등을 다룬다.
- \_document 는 HTML 마크업 자체에 집중.

참고

---

https://nextjs.org/docs/advanced-features/custom-document
https://nextjs.org/docs/advanced-features/custom-app
https://talkwithcode.tistory.com/96
