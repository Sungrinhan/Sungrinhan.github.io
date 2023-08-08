---
title: "[Next Deep Dive][Routing 기초 (3)] Intercepting Routes"
date: 2023-08-06 22:24:SS +/- TTTT
categories: [NextJs]
tags: [nextjs, interceptingroutes] # TAG는 반드시 소문자로 이루어져야함!
---

# Intercepting Routes

현재 페이지의 컨텍스트를 유지하면서 현재 레이아웃 내에서 route 를 로드할 수 있다. 이 라우팅의 패러다임은 특정 경로를 "가로채" 다른 경로를 표시하려는 경우에 유용하다.

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fintercepting-routes-soft-navigate.png&w=3840&q=75&dpl=dpl_BcpSQQ3frqqXQsrdgEjeww6HyJ7W)

예를 들어, 피드 내에서 사진을 클릭하면 피드를 오버레이하는 모달이 사진과 함께 표시되어야 한다고 하자. Next.js 는 `/feed` 경로를 가로채고 이 URL 을 "masks" 하여 다른 경로인 `/photo/123` 을 표시한다.

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fintercepting-routes-soft-navigate.png&w=3840&q=75&dpl=dpl_BcpSQQ3frqqXQsrdgEjeww6HyJ7W)

However, 공유 가능한 URL 을 클릭하거나, 페이지를 새로고침해서 사진으로 이동하면, 모달 대신 전체 사진체이지가 렌더링 되어야 한다. 경로 가로채기가 발생하지 않아야 한다.

## 1. Convention

`(..)` 로 intercepting routes 는 정의된다. 경로 컨벤션인 `../` 과 비슷하지만, 세그먼츠를 위한 것이다.

사용 예로는~:

- `(.)` 같은 레벨의 세그먼츠
- `(..)` 한단계 위의 세그먼츠
- `(..)(..)` 두단계 위의 세그먼츠
- `(...)` root `app` 디렉토리에서의 세그먼츠

예를 들어, `(..)photo` 디렉토리를 생성하여 `feed` 세그먼츠 내에서 `photo` 세그먼트를 가로챌 수 있다.

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fintercepted-routes-files.png&w=3840&q=75&dpl=dpl_BcpSQQ3frqqXQsrdgEjeww6HyJ7W)

> 출처
>
> - [Next.js 공홈 Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)
