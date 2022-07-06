---
title: "[Debug][Blog] 포스트 하면서 발생한 Errors"
date: 2022-06-15 12:24:SS +/- TTTT
categories: [Jekyll, Errors]
tags: [debug, jekyll, blog] # TAG는 반드시 소문자로 이루어져야함!
---

Jekyll Chirpy 테마를 새로 등록하고, 3번째 글을 작성하는데 빌드가 안되는 경우가 생겼다.

다음과 같은 에러가 생겼는데 확인해보자.

```js
ERROR : did not find expected key while parsing a block mapping at line 2 column 1

ERROR : Input contains prohibited control code point U+0008
```

### 1) did not find expected key while parsing a block mapping at~

나의 경우 제목에 맞지 않는 특수기호를 사용해서 였다.

기본적으로 Double Quotation (쌍따옴표) 를 안쓰고도 제목이 된다.
특수문자를 사용해야 하는경우는 , 더블 쿼테이션을 쓰도록 하자.

```js
title: [Debug][Blog] 포스트 하면서 발생한 에러 // square bracket 때문에 위의 오류가 발생
title: "[Debug][Blog] 포스트 하면서 발생한 에러" // double quotation 을 사용하면 이러한 오류를 방지할 수 있다.
```

### 2) Forbidden code point U+0008

문제발생 포인트는 다음과 같다.

```js
// 문제 발생 포인트 ... 왜 생겼을까?
[{
	target: /* post object */,
	property: "title",
	value: "Hello"
	constraints: {
		length: "$property must be longer than or equal to 10 characters"
	}
},
```

- 언뜻 봐서는 전혀 모르겠다. ruby 혹은 html 에서 지원하지 않는 코드 포인트라고 한다.
- 해결방법 : https://stackedit.io/app# 마크다운 편집기에서 작성해 복사 붙여넣기 하니 오류가 발생한듯 하다. 문제가 발생한 부분을 지우고, 하드코딩 해주었더니 문제없이 빌드가 되었다.
