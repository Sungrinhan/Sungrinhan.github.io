---
title: "[React] Custom Hooks으로 로직 재사용하기!"
date: 2023-04-30 18:25:SS +/- TTTT
categories: [React]
tags: [react, customhooks] # TAG는 반드시 소문자로 이루어져야함!
---

# 시작하면서..

Hook 이란 개념은 사실 React 16.8v 에도 있던 기능이다. 그리고 이런 훅은 예전부터 사용해왔다. 예를 들어, 컴포넌트의 state 를 관리하는 useState 나, 콜백함수를 전달하는 useEffect 같은 훅 말이다.

하지만 최근들어 custom hook 을 사용하여 로직을 재사용하는 방법을 선호한다는 얘기를 들었다. 원티드 프리온보딩을 하면서 다른 프론트엔드 신입 개발자들과 프로젝트를 하는 중 로직을 재사용하는 커스텀 훅에 관해서 보았다. 페이지 컴포넌트를 매우 단순화 할 뿐 아니라, 재사용 할 수 있는 기능을 보고 매료되었다. 더 공부하고 싶다는 생각이 들어서 이번기회에 정리해보려 한다.

다음은 Custom Hook 에 대해 공식문서를 보고 정리한 내용이다. 앞으로 이 블로그를 쓰면서 배워야 할 목표를 정한다.

## Custom Hook 을 이용해서 다음을 배워보자:

- cutom hook 이 뭔지, 나만의 hook 을 작성하는 방법
- 컴포넌트 사이에서 로직을 재사용하는 방법
- custom hook 을 설계하는 방법과 이름 짓는 방법
- 커스텀 훅을 언제, 왜 뽑는지에 대하여

# Custom Hook: Sharing logic between components

내가 네트워크 요청에 크게 의존하는 앱을 만들려고한다. 나는 내 앱을 이용하는 유저에게 네트워크 상태에 대해서 경고하려고 한다. 컴포넌트에는 두개의 일이 필요할 것 같은데:

1. 네트워크가 온라인인지를 추적하는 상태 하나
2. 전역 online 과 offline 이벤트를 구독하는 effect, 그리고 state 를 업데이트를 해줘야 함.

이 두개는 네트워크 상태를 컴포넌트에 싱크로나이즈 할 것이다. 다음과 같은 예를 보자.

```ts
// App.js

import { useState, useEffect } from 'react';

export default function SstatusBar() {
	const [isOnline, setIsOnline] = useState(true);
	useEffect(() => {
		function handleOnline() {
			setIsOnline(true);
		}
		function handleOffline() {
			setIsOnline(false);
		}
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
		window.removeEventListener('online', handleOnline);
		window.removeEventListener('offline', handleOffline);
		}
	}, []);

	return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>
```

그리고 동일한 로직을 사용해서 다른 컴포넌트를 만들어 보자. 저장 버튼을 만들건데 online 이면 save 하고, 오프라인이면 세이브 대신 Reconnecting 하는 버튼이다.

```ts
import { useState, useEffect } from 'react';

export default function SaveButton() {
	// isOnline 이라는 state 와, online offline 을 구분하는 effect 함수는 중복된다.
	const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
}

	function handleSaveClick() {
		console.log('Progress saved');
	}

return (
	<button disabled={!isOnline} onClick={handleSaveClick}>
	{isOnline ? 'Save progress' : 'Reconnecting...'}
	</button>
	)
}
```

이 컴포넌트에서는 네트워크가 꺼지면, 버튼의 모습이 바뀔 것이다.

이 두개의 컴포넌트는 모두 잘 작동하지만 동일한 로직이 중복되어 사용되고 있다. 커스텀 훅으로 중복되게 사용되는 로직을 줄여보자.

## 컴포넌트에서 custom hook 추출하기

중복된 코드를 다음과 같이 줄여보자:

```ts
function StatusBar() {
  // 실제 필요한 state 만 커스텀 훅에서 추출한 모습.
  // 화면을 바꾸는 요소인 state 를 커스텀 훅에서 모두 처리하고 결과값만 가져온 모습이다.
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? "Online" : "Disconnected"}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log("Progress saved");
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? "Save progress" : "Reconnecting..."}
    </button>
  );
}
```

이렇게 하면, 선언형 으로 코드를 더 짤 수 있다. 실제 저 안에 로직은 중요하지 않고(보여주지 않고) 결과만 보여주는 선언형인 것이다.

이것에 대해 정리한 내 블로그가 있다.

[관심사의 분리](https://sungrinhan.github.io/posts/customhook/)

커스텀 훅으로 만든 useOnlineStatus() 를 살펴보자. 아까 위에서 적었던 중복된 로직을 포함시키고, 실제로 필요한 isOnline state 만 리턴하는 함수다.

```ts
function useOnlineStatus() {
	const [isOnline, setIsOnline]= useState(true);

	useEffect(() => {
		function handleOnline() {
			setIsOnline(true);
		}
		function handleOffline() {
			setIsOnline(false);
		}

		window.addEventListener('online', handleOnline);

		window.addEventListener('offline', handleOffline);

	return () => {

		window.removeEventListener('online', handleOnline);

		window.removeEventListener('offline', handleOffline);

};

}, []);

return isOnline;
```

이렇게 작성하는 경우

- 무엇을 하고싶은지를 더 명확히 표현이 가능(객체 지향에 가까워짐)
- jsx, tsx 컴포넌트가 매우 간단해짐

## 커스텀 훅은 상태 자체를 공유하지 않고, 상태 저장 논리를 공유한다.

두개는 같은 `useonlineStatus ()` 라는 커스텀 훅을 공유한다. 따라서 마치 이것은 같은 state 를 공유하는 것 처럼 보이지만, 명백히 다른 상태를 관리하는 것이다.

--> 상태공유가 아닌, 상태관리를 공유한다!

다음과 같은 예를 보자.

```ts
// useFormInput.js

import {useState } from 'react';

export function useFormInput(initialValue) {
	const [value, setValue] = useState(initialValue);

	function handleChange(e) {
		setValue(e.target.value);
	}

	const inputProps = {
		value,
		onChange: handleChange
	}

	return inputProps;
```

```ts
import {useFormInput} from
./useFormInput.js';

export default function Form() {
	const firstNameProps = useFormInput('Mary');
	const lastNameProps = useFormInput('Poppins');

	return(
		<>
		<label>
			First name:
			<input {...firstNameProps} />
		</label>
		<label>
			Last name:
			<input {...lastNameProps} />
		</label>
		<p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
	</>
);
```

위 예시를 보면 firstName 과 lastNameprops 는 커스텀 훅을 두번 호출한다. 즉, 두개는 별개의 state 를 사용하는 것이다.

만약, 여러 구성 요소간에 상태 자체를 공유해야하는 경우는 어쩔 수 없이 상위 컴포넌트에서 하위 컴포넌트로 전달해야 될 것이당.

## Hooks 간에 반응 값 전달(passing reactive values between hooks)

컴포넌트가 매 re-render 가 될 때마다 커스텀 훅에 있는 코드는 재호출 될 것이다. 이것이 커스텀 훅이 순수해야 하는 이유다. 커스텀 훅의 코드를 기존 컴포넌트 본문의 일부라고 생각하면 된다!

커스텀 훅은 컴포넌트와 함께 다시 렌더링 되기 때문에 항상 최신 props 및 state 를 수신한다.

## 출처

[react.dev 공식문서에서 배우기](https://react.dev/learn/reusing-logic-with-custom-hooks)
