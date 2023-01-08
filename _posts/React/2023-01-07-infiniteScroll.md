---
title: "[React] React-infinite-scroll 구현하기"
date: 2023-01-08 17:09:SS +/- TTTT
categories: [React]
tags: [react, infinite scroll] # TAG는 반드시 소문자로 이루어져야함!
---

## 무한스크롤이란..?

유저가 스크롤을 맨 밑으로 내렸을때, 종점에 다다랐을 때, 다음 목록을 보여주는 것이다.

흔히 사용자 경험을 좋게 하기 위해서, 첫페이지 렌더링을 빠르게 하는 것이 중요하다.

모든 항목을 보여주기 위해 렌더가 늦어지는 것 보다, 화면에 보여질 것만 서버에서 받아와서 보여주고,

필요에 따라서 다음 목록을 보여주는게 더 좋은 사용자 경험이 될 것이다. (UX 적인 측면으로)

## 나는 왜 찾아봤나?

쿠팡 상품목록을 보여주기 위해서다. api 요청으로는 100개까지 밖에 불러오지 못하고 쿼리로는 startIndex 나 Page 가 존재하지 않기 때문에 pagination 으로 구현할 수 없다고 판단했다.

따라서 유저가 스크롤을 맨 밑으로 내리면, 새로운 데이터를 받아와서 상품목록을 렌더링 해주는게 나의 목표였다.

## 무한스크롤 원리

간단한 예제 코드를 보면서 알아보자.

```ts
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    function handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // the user has scrolled to the end of the page
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    // component JSX goes here
  );
}

```

- 사용자의 스크롤위치 + 윈도우의 innerHeight >= body 의 offsetHeight 이면, 사용자 스크롤이 맨 밑으로 내려갔음을 감지한다.
- useEffect 를 사용해서 윈도우에 `addEventListener` 스크롤 항목에 위에서 만든 `handleScroll` 함수를 추가한다.
- ComponentWillUnmout 될때 , 윈도우에 추가된 이벤트를 삭제한다.

## 내가 직면한 문제점 & what i've tried

### 문제점

위에처럼, body 태그 바로안에 contents 가 있다면 전혀 문제가 없을 것이다. 하지만 대부분의 웹사이트의 경우 라우터 이동을 해도 사이더 메뉴나 네비게이터는 고정으로 있을 것이고, 그 안에 컨텐츠가 있을 것이다.

- 프로젝트 내에서 내 스크롤의 위치를 알 수 있는 `window.scrollY` 가 0으로 나왔다.
- `window.innerHeight` 와 `document.body.offsetHeight` 는 값이 동일하게 나왔다. 분명히 상품목록은 그것보다 훨씬 긴데 말이다.
- 당연한 얘기지만, content 안에서의 위치를 지정해주어야 할 것이다.

### 내가 시도한 것

스크롤이 하단에 갔다는 것을 감지하는 로직은 다음과 같다.

```ts
window.innerHeight + window.scrollY >= document.body.offsetHeight;
```

내 프로젝트 기준은 window 가 아니므로, 코드를 수정할 필요가 있다고 느꼈다.

```ts
// 다음 코드는 예시다.
const contentDiv = document.querySelector(".real-content-div");

contentDiv.scrollTop + contentDiv.clientHeight >= contentDiv.scrollHeight;
```

- 실제 컨텐츠가 들어있는 dom 을 가져와서, `scrollTop`, `clientHeight`, `scrollHeight `를 쓰면되겠다.
- 하지만 여기서는 `clientHeight` 와 `scrollheight` 가 상품목록이 늘어날수록 커지는 것을 확인했지만, 역시나 `scrollTop` 이 계속 0을가리키며 변하지 않았다.

  2023.01.08 업데이트 중...
