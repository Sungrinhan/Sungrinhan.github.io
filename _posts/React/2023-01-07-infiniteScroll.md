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

내 프로젝트 기준은(element) window 가 아니므로, 코드를 수정할 필요가 있다고 느꼈다.

```ts
// 다음 코드는 예시다.
const contentDiv = document.querySelector('.real-content-div')

contentDiv.scrollTop + contentDiv.clientHeight >= contentDiv.scrollHeight

// 실제 예제
useEffect(() => {
	const  layoutContent  =  document.querySelector('.ant-spin-container');

	const  handleScroll  =  _.throttle(() => {
		if (layoutContent.scrollTop  + windowHeight >=  layoutContent.scrollHeight) {
			console.log('스크롤이 하단에 닿아서 이벤트가 발생함')
		} else {

		return;
		}
	}
});

// layoutContent 에 'scroll' 이벤트를 추가한다. 이벤트 함수명은 handleScroll~
layoutContent.addEventListener('scroll', handleScroll);

return () =>  layoutContent.removeEventListener('scroll', handleScroll);
}, [pageStoreList]);
```

- 실제 컨텐츠가 들어있는 dom 을 가져와서, `scrollTop`, `clientHeight`, `scrollHeight `를 쓰면되겠다.
- 하지만 여기서는 `clientHeight` 와 `scrollheight` 가 상품목록이 늘어날수록 커지는 것을 확인했지만, 역시나 `scrollTop` 이 계속 0을가리키며 변하지 않았다.

### Solution

당연하지만 , 위의 코드는 작동하지 않을 것이다. 왜냐?? css 를 적용하지 않았기 때문이지롱~

실제 layout 컨텐츠에서 부모태그에는 다음과 같은 css 가 적용되어야 한다. mdn 에 나와있는 내용이니까 잘 숙지하자!

- 컨텐츠를 감싸고 있는 부모요소는 스크롤이 생길 수 있게 높이가 고정되어야 한다.
  - ex) 100vh, px, 등등.
  - but % 비율은 안됨. 컨텐츠 내용이 늘어남에 따라 height 도 늘어나서 스크롤이 생기지 않는다.
- `overflow: scroll` 이 부모속성에 있어야한다.

### 추가적으로 알아야 할 것 ( lodash 의 throttle 기능)

위에 코드에서 layoutContent 에 이벤트 리스너를 추가했다. 따라서 스크롤이하단에 닿을때 마다(if 문이 충족될 때 마다) handlescroll 함수를 실행시키게 된다.

물론 또다른 조건문으로 실행되지 않게 할 수도 있지만, documentElement.scrollTop과 documentElement.offsetHeight는 리플로우(Reflow)가 발생하는 참조이기 때문에 수정해야 할 필요가 있다.

> throttle 이란...?
> 일정시간 내에 이벤트가 여러번 발생하면, 이벤트를 저장했다가 한번만 실행시키게 해주는 함수다.
> 즉 일정 주기마다 이벤트발생을 보장하기 때문에, 여기서는 throttle 을 사용하는게 좋았다.

```ts
const handleScroll = _.throttle(() => {
  if (layoutContent.scrollTop + windowHeight >= layoutContent.scrollHeight) {
    console.log("스크롤이 하단에 닿아서 이벤트가 발생함");
  } else {
    return;
  }
}, 1000);
```

## 출처

[실전 Infinite Scroll with React](https://tech.kakaoenterprise.com/149)
