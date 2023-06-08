---
title: "[React] React Query vs RTK Query"
date: 2023-04-23 19:01:SS +/- TTTT
categories: [React]
tags: [react, reactquery, rtkquery] # TAG는 반드시 소문자로 이루어져야함!
---

## 시작하기에 앞서서.. 왜 공부했나?

나는 회사 프로젝트에서 data fetching 라이브러리로 RTK - query 를 사용하였었다. 그런데 최근 React-query(tanStack Query c4) 라는 강력한 asynchronous state management 를 사용하는 곳이 많다고 느꼈다.
rtk-query 자체로도 매우 편리하고 성능이 좋다고 느꼈기 때문에, react-query 와 비교하는 글을 작성해 보고자 한다.

# React Query

내가 처음 접했을 때는 리액트 쿼리 라는 이름으로 있었는데, 지금은 공식홈페이지를 가보니 이름이 TanStack Query v4 로 나와있었다. [TanStack Query v4](https://tanstack.com/query/latest/docs/react/overview)

공식 문서에서 react-query 의 장점을 보자면 다음과 같다.

- **구성없이 즉시 사용 가능한 방식**
- 캐싱
- 동일한 데이터에 대한 여러 요청을 단일 요청으로 중복 제거
- 백그라운드에서 오래된 데이터 업데이트
- 데이터가 "오래된" 시점 알기
- 데이터 업데이트를 최대한 신속하게 반영
- 페이지 매김 및 지연 로딩 데이터와 같은 성능 최적화
- 서버 상태의 메모리 및 가비지 수집관리
- 구조적 공유로 쿼리 결과 메모하기

많기도 하다. 근데 내가 생각했을 때 rtk-query 와 가장 큰 차이점을 뽑자면 **"구성없이 즉시 사용 가능한 방식"** 인 것 같다.

실제로도 rtk-query 의 단점 아닌 단점은, 기존 redux 로 이루어진 프로젝트가 아니거나 redux 를 잘 모르는 사람은 rtk-query 를 사용하기까지 오래 걸린다. learning-curve 가 높아서 그런 것이기 때문이다.

## React Query 와 RTK Query의 유사점

둘 다 React 애플리케이션에서 비동기 상태관리를 제어하기 위한 라이브러리 인것은 맞다.

### 성능 최적화

두 라이브러리 모두 최적의 성능을 강조한다.

- 네트워크 요청 수를 줄이고, 데이터 검색 효율성을 향상시키는 자동캐싱
- 동일한 데이터에 대한 여러 요청이 동시에 전송되는 것을 방지

### 사용의 용이성

둘 다 간단하고 직관적이다.

### 다양한 옵션

- 포괄적인 데이터 관리 솔루션을 제공
- 데이터 가져오기, 로컬저장, refetch 같은 재처리 요청

## React Query 와 RTK Query의 차이점

### 아키텍쳐

- React Query 는 독립형, 특정 상태관리 솔루션에 의존 X
- RTK Query 는 Redux 라이브러리 기반.

### 접근성

- React Query 는 간단하고 선언적인 API를 사용, 데이터를 제어하기 위해 React의 렌더링 주기에 의존
- RTK Query는 Reducer 및 actions 에 의존
- RTK 는 UI에 구애받지 않기 때문에 모든 UI 레이어에서 사용가능!

## React Query vs. RTK Query 정리 (장, 단점)

### React Query 의 장점

- **가볍고 사용하기 쉬움** : 매우 선언적인 API, 배우고 사용하기 쉬움. 추가 종속성 없이 독립형 라이브러리로 작동하기 때문에 프로젝트에 쉽게 추가.
- **고성능** : 자동캐싱, 중복 네트워크요청 제거
- **유연성** : 다양한 환경 활용 가능, 라이브러리나 아키텍처에 의해 제한되지 않음

### React Query 의 단점

- **별도의 상태 관리 솔루션 필요** : 서버 상태만 처리하도록 설계. 클라이언트 관리 솔루션이 따로 필요. Context API 같은 가벼운 상태 관리 라이브러리를 사용하여 처리해야함.
- **복잡한 데이터 관리 시나리오에 대한 제한된 지원** : 기본 데이터 관리 작업을 유능하게 처리하지만 보다 강력한 기능을 찾고 있다면 다른 라이브러리를 찾아보는게 좋음

### RTK Query 의 장점

- **다른 Redux toolkit 기능과 원활하게 통합**
- **이미 Redux를 사용하고 있다면 매우 편리**하다.
- **데이터 관리 이외의 추가 기능을 제공**

### RTK Query 의 단점

- Redux 와 함께만 사용가능... 즉 종속성이 있음.
- 러닝커브가 높다.

## 마무리

경량의 독립형 데이터 관리 솔루션 || 간단한 데이터 관리 시나리오 || redux 가 없는 프로젝트
=> React Query

redux를 사용중인 프로젝트 || redux toolkit 기능통합이 필요한 프로젝트 || 복잡한 데이터 관리 시나리오
=> RTK Query

> ## 출처
>
> - [Tanstack 공식문서](https://tanstack.com/query/latest/docs/react/overview)
> - [RTK Query 공식문서](https://redux-toolkit.js.org/rtk-query/overview)
> - [Frontend Magazine React Query vs RTK Query](https://www.frontendmag.com/insights/react-query-vs-rtk-query/)
