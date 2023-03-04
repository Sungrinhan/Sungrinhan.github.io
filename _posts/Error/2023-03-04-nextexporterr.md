---
title: "[Next][Error] next export 시 발생한 에러(image loader 관련)"
date: 2023-03-04 17:57:SS +/- TTTT
categories: [Git, Errors]
tags: [antd, next, export, cicd] # TAG는 반드시 소문자로 이루어져야함!
---

[Errors] Image Optimization using Next.js' default loader is not compatible with `next export`

## 버그가 발생한 과정

- Next.js 를 aws s3 버킷에 올리는 과정에서 발생한 문제
- Static 한 페이지로 만들기 위해서는, Next build 가 아닌 `next export`명령어가 필요.
- next 파일이 생기는 빌드와는 달리, `next export` 는 out 폴더가 생성됨.
- out 폴더에는 스태틱한 html 파일이 생성되고, 이를 aws s3 메인페이지에 올리면 됨.

```json
"scripts" : {
	"build": "next build && next export",
	}
```

사내 프로젝트를 CI/CD 하려고 연구하던 중 , 다음과 같은 오류가 발생함.

Image Optimization using Next.js' default loader is not compatible with `next export`.

해석하면 다음과 같다 :
"이미지 최적화를 위해 Next.js 의 기본 로더를 사용하는 것은 next export 와는 호환하지 않는다."

## Laoder 란 무엇이지..?

Next.js 에서는 다음과 같이 정의하고 있다.

> A custom function used to resolve image URLs.

다음은 custom loader 사용 예시다.

```ts
import Image from "next/image";

const myLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`;
};

const MyImage = (props) => {
  return (
    <Image
      loader={myLoader}
      src="me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  );
};
```

- URL을 확인하는 데 사용되는 사용자 지정 함수. 이미지 컴포넌트에서 loader 를 prop 으로 설정하면 next.config.js 의 이미지 영역에 정의된 기본 loader 를 오버라이드 한다.

## Loader Configuration

만일 Next.js 내장 이미지 최적화 API 를 사용하는 대신 이미지를 최적화하기 위해 클라우드 제공자를 사용하길 원한다면, 자신의 next.config.js 파일에서 loader 와 경로 prefix 를 구성할 수 있다.

-> 이미지 경로를 위한 상대적 URL 을 사용하는 것과 제공자에 대한 올바른 절대 URL 을 자동으로 생성하는 것이 가능해진다.

```ts
// next.config.js 파일

module.exports = {
  imgages: {
    loader: "imgix",
    path: "https://example.com/myaccount/",
  },
};
```

## 문제 해결법 (Built-in Loaders)

다음과 같은 이미지 최적화 클라우드 제공이 포함된다:

- Default: next dev, next start 나 커스텀 서버와 자동으로 작동
- Vercel: Vercel 에서 배포하면 자동으로 loader 가 된다. 따로 설정을 해줄 필요가 없음!
- Imgix
- Akamai
- Custom: loader: 'custom' 은 next/image 컴포넌트에 loader prop 을 구현하여 커스텀 클라우드 제공자를 사용함.

## 출처

[Next.js 공식 다큐먼트](https://nextjs.org/docs/api-reference/next/image#built-in-loaders)
[birdmee 블로그](https://birdmee.tistory.com/38)
