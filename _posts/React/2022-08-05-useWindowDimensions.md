---
title: "[React][CSS] useWindowDimensions 실시간 윈도우크기 Hook"
date: 2022-08-05 09:01:SS +/- TTTT
categories: [React]
tags: [react, usewindowdimensions, hook] # TAG는 반드시 소문자로 이루어져야함!
---

useWindowDimensions 를 알아보자.

react-native 에서는 윈도우크기가 매우 다양하다.
그렇기 때문에 변화하는 윈도우 크기를 감지해야하는데 , 이를 도와주는게 useWindowDimensions hook 이다.

하지만 리액트에서는 어떨까? 커스텀 훅을 만들어서 사용해야 할 것이다.

current size, 즉 현재 윈도우 사이즈를 알 수 있게 해주는 hook 이다.

```ts
import { useState, useEffect } from  "react";
// Define general type for useWindowSize hook, which includes width and height
interface Size {
	width: number | undefined;
	height: number | undefined;
	}

// Usage
function App() {
	const size: Size = useWindowSize();

	return (
		<div>
			{size.width}px / {size.height}px
		</div>
	);
}

// Hook
function useWindowSize() : Size {
	// Initialize state with undefined width/height so server and client renders match
	const [windowSize, setWindowSize] = useState<Size>({
		width: undefined,
		height: undefined,
	});

	useEffect(() => {
		// Handler to call on window resize
		function handleResize() {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Call handler right away so state gets updated with initial window size
		handleResize()

		// Remove event listener on cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []); // empty array ensures that effect is only run on mount

	return windowSize
```

## 참조

https://usehooks.com/useWindowSize/
