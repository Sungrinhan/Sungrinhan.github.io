---
title: "[React][Next.js] Next.js 시작하기 eslint, prettier(03)"
date: 2022-10-25 19:30:SS +/- TTTT
categories: [React, NextJs]
tags: [react, nextjs, eslint, prettier] # TAG는 반드시 소문자로 이루어져야함!
---

Next.js 에 ESLint, Prettier 를 설정하는 방법에 대해 알아보자.

## ESLint

> Ecma Script Lint(에러가 있는 코드에 표시를 달아놓는 것)

**11.0.0** 버전 이후로는 next에 설치가 되어있다.

```ts
// package.json:
"scripts": {
	"dev": "next dev",
	"build": "next build",
	"start": "next start",
	"lint": "next lint"
	},
```

ESLint 가 설치되면, 매 빌드시마다 작동이 된다.
Errors 가 있으면 빌드가 실패한다.
Warnings 는 실패하지는 않는다.
=> 현재 기준 가장 많이 사용되는건 Airbnb 에서 정의한 자바스크립트 규칙이다.

### ESLint 설치하기

`eslint-config-airbnb`를 설치하려면 사전에 설치해야 하는 다른 패키지들이 있다. 다음 명령어로 확인이 가능하다:

```ts
$ npm info "eslint-config-airbnb@latest" peerDependencies
{
  eslint: '^7.32.0 || ^8.2.0',
  'eslint-plugin-import': '^2.25.3',
  'eslint-plugin-jsx-a11y': '^6.5.1',
  'eslint-plugin-react': '^7.28.0',
  'eslint-plugin-react-hooks': '^4.3.0'
}
```

검색된 peer Dependencies 들을 다 같이 설치해주면 된다.

```ts
$ yarn add -D eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks
```

> `eslint-plugin-import` : ES6의 import/export syntax 체크, 파일 경로나 import 이름을 잘못 입력하는지 여부를 체크해주는 lint 플러그인 이다.
> `eslint-plugin-jsx-a11y` : 리액트 element의 접근성 이슈를 짚어 lint 해주는 플러그인. 예) interactive 하지 않은 엘리먼트에 click 핸들러가 달려있다. 같은 오류를 내뱉음.
> `eslint-plugin-react`: 리액트 규칙들을 추가해주는 플러그인
> `eslint-plugin-react-hooks`: 리액트 hooks 규칙들을 추가해 주는 플러그인

```ts
$ yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
```

> `eslint-config-prettier` : ESLint 의 formatting 관련 설정 중 Prettier 와 출동하는 부분을 비활성화 한다. Prettier 에서 문법 관련된 ESlint 규칙을 사용하지 않게 되기 때문에 ESLint 는 자바스크립트 문법을, 코드 스타일 정리는 Prettier 가 담당한다.
> `eslint-plugin-prettier` : 원하는 형식의 formatting 을 설정해준다.

```ts
$ yarn add -D babel-eslint eslint-plugin-babel
```

> `babel-eslint` : Babel 이 서포트해주는 코드에 ESLint 를 적용할 수 있도록 해준다. 즉, ES6 이상의 자바스크립트, flow type 등의 faeture 를 지원해준다. ESLint 만 설치할 경우, ES6/ JSX / 객체 rest, spread 까지의 문법만 지원해준다. 그 이상의 문법 지원이 필요할 경우 반드시 이걸 깔아줘야 한다.
> `eslint-plugin-babel` : 더 많은, 실험중인 feature 까지 지원해주는 플러그인. babel-eslint 를 보완해주는 플러그인 이다.

## Prettier

> 코드 정리 규칙
> 정해놓은 규칙에 맞게 자동으로 정렬 -> 가독성을 높임
> 코드스타일을 통일할 수 있는 플러그인

? 무엇이 다른가 ?
ESLint : 문법 오류 체크
Prettier: 문법과 상관 없이 코딩스타일만 체크해서, 파일저장할 때마다 자동으로 정리해줌

```ts
// /(root) 경로에 .prettierrc 파일을 생성한다.
{
"printWidth": 120, // 한 줄이 120칸이 넘지 않도록 한다.
"tabWidth": 2,// 들여쓰기는 2칸
"singleQuote": true,// 문자열을 사용할 때는 '(홀따옴표)' 를 사용ㄹ
"trailingComma": "all",// 객체나 배열작성 시 , 원소 혹은 key-value 맨 뒤에 있는것에도 쉼표를 붙이기
"semi": true // 코드는 세미콜론으로 끝나야 한다.
}
```

# 지금 시작하는 프로젝트는 위에까지만 설정해줘도 잘 되는 것 같다.

## ESLint 설정하기 (.eslintrc.json 파일 설정)

프로젝트 root 디렉토리에 `.eslintrc.json` 파일을 생성한다.

```ts
// .eslintrc.json

{
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "parser": "babel-eslint",
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb",
    "plugin:prettier/recommended"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "plugins": ["react", "react-hooks", "prettier"],
  "rules": {
    "react/react-in-jsx-scope": 0,
    "react/prefer-stateless-function": 0,
    "react/jsx-filename-extension": 0,
    "react/jsx-one-expression-per-line": 0,
    "no-nested-ternary": 0
  }
}
```

ESLint Config 의 경우 다음 [공식문서](https://eslint.org/docs/latest/user-guide/configuring#specifying-environments) 를 참고해서 설정하면 된다.

> `"env"`: 활성화하고 싶은 환경을 설정한다. 현재 브라우저, node, es6. 환경이 활성화 되어있다.
> `"parser"` : parser 를 설정한다. 설정하지 않을 경우 Espree 가 기본 parser 로 설정된다. 보통 **Espree, Babel-ESLint, @typescript-eslint/arser** 를 사용한다. 우리는 **Babel-ESLint** 를 써보자.
> `"extends"` : extension 파트, **Prettier** 를 꼭 추가해 주어야 사용할 수 있다. **Airbnb ** 도 추가해주자.
> `"rules"`: 필요한설정, 필요없는 설정을 관리하는 파트. 1은 사용하겠다는 뜻, 0은 사용하지 않겠다는 뜻. 원치않는 설정은 0으로 설정해 비활성화 하자. 여기 적힌 것 중 2~4번째 줄은 `eslint-config-prettier` 를 위한 설정이다. `no-nested-ternary `는 중첩 삼항연산자를 쓸 경우 에러가 뜬다. 중첩을 쓸거면 꺼놓자.

`.eslintrc.json` 파일을 만들지 않고 `package.json` 파일에 ESLint 설정을 해주는 방법도 있다.

```ts
// package.json

"eslintConfig": {
    "env": {
        "browser": true,
        "node": true
    }
}
```

`package.json` 이 너무 복잡해지는 것을 원치 않는다면 파일을 분리시켜라.

## 참고

[MayinJanuary 블로그](https://velog.io/@mayinjanuary/Next.js-%EC%84%B8%ED%8C%85%ED%95%98%EA%B8%B0-ESLint-Prettier-%EC%84%A4%EC%A0%95),
[Next.js 공식페이지](https://nextjs.org/learn/foundations/about-nextjs/what-is-nextjs)
