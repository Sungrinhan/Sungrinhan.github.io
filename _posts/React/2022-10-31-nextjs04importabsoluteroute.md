---
title: "[React][Next.js] Next.js 에서 절대경로로 컴포넌트추가(import)"
date: 2022-10-31 15:15:SS +/- TTTT
categories: [React, NextJs]
tags: [react, nextjs, import, absoluteroute] # TAG는 반드시 소문자로 이루어져야함!
---

## 절대 경로로 컴포넌트 추가(import)

### tsconfig.json 파일 수정

TypeScript 가 적용된 Next.js에서 절대 경로를 사용하여 컴포넌트를 추가하기 위해서는, `tsconfig.json` 파일을 열고 다음과 같이 `baseUrl` 을 추가한다.

```ts
{
	"compilerOptions": {
	...
	"baseUrl":"./"
	},
	...
}
```

### 무엇이 바뀌었나?

```ts
// 기존 import 방식
import something from "../../styles/wms/register";

// 절대경로 방식
import something from "styles/wms/register";
```

### 좀더 보기 편한 방식

파일이 많은경우? 다음과 같이 세분화 할 수도 있다.
`paths` 에 각 파일의 경로를 미리 적어두고 해도 된다. 상대경로는 `/ ` 로, 절대경로는 아래와 같이 작성한다.

```ts
{
"compilerOptions": {
	...,
	"baseUrl": ".",
	"paths": {
		"@hooks/*": ["hooks/*"],
		"@components/*": ["components/*"],
		"@styles/*": ["styles/*"],
		"@utils/*": ["utils/*"],
		"@typings/*": ["typings/*"],
		"@public/*": ["public/*"],
		"@redux/*": ["redux/*"],
		"@data/*": ["data/*"]
		},
"incremental": true
	},
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
"exclude": ["node_modules"]
}

// 실제로 사용해보기
import something from '@styles/wms/register'

```

## 참고

[deku 블로그](https://dev-yakuza.posstree.com/ko/react/nextjs/absolute_path/)
