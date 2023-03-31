---
title: "[React] 횡단관심사 (Cross-cutting concerns)"
date: 2023-03-31 11:01:SS +/- TTTT
categories: [React]
tags: [react] # TAG는 반드시 소문자로 이루어져야함!
---

# 횡단 관심사(Cross-cutting concerns)

- 여러 서비스에 걸쳐서 동작해야 하는 코드를 의미
- 관심사란 ? 코드가 하고자 하는 목적, 동작을 의미
- 여기서 확장해서, 애플리케이션 내 여러 핵심 비즈니스 로직들에 걸쳐서 실행되어야 하는 동작들.

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fcc59df2c-0b6f-4de1-a3f4-4270541c1ad4%2FUntitled.png?id=e9ceff77-1cad-4972-aa1a-db7a8d8e8539&table=block&spaceId=336391e4-0f33-49de-869c-760be34b8535&width=1540&userId=cfdf58a5-1fd6-4e8b-8d01-bbe358d1ff09&cache=v2)

횡단 관심사의 대표적인 예시는 다음과 같다.

- 인증 & 인가
- 로깅
- 트랜잭션 처리
- 에러처리

### 왜 ? 횡단 관심사라는 단어가 생겼나?

- 횡단 관심사를 잘 처리하는 것은 애플리케이션의 유지보수에 중요하다.
- 핵심 비즈니스 로직과 횡단관심사가 혼재되어 버리면, 추후 각자를 수정하기 힘들어지는 상황 발생

# HTTP 통신에서 횡단 관심사 처리하기

프론트엔드에서 가장 흔하게 생각할 수 있는 횡단 관심사는 인증 & 인가다.

HTTP 는 stateless 라는 특징으로 매 요청을 별개의 요청으로 처리한다. 따라서 HTTP 통신을 주고 받을 때 내가 누구인지 증명하기 위해서는 프론트엔드단에서 인증 정보를 매 통신마다 함께 전송해 줘야 한다.

예를 들어, 매 요청 인증에 JWT 를 사용한다고 치자. 우리는 header authorization 에 Bearer AccessToken 을 담아서 보내줘야 한다. 이는 브라우저에 저장해 두었다가 api 요청이 발생할 때 수행되어야 하기에, 이를 곧 횡단 관심사 라고 할 수 있겠다.

## 내 프로젝트에서의 예시 혹은 내가 적용했던 HTTP 통신에서의 횡단 관심사 처리하기

### Axios 의 경우...

axios 의 경우 `intercept` 라는 메소드가 존재한다. axios 로 요청이 발생할 경우, 그 중간에 인터셉트 해서 필요한 로직을 처리한다. header에 엑세스 토큰을 담는 과정을 여기서 했었다.

### RTK Query 에서는..?

회사 프로젝트의 경우, api 는 모두 rtk query 로 관리했었다. 여기서 또한 횡단관심사를 처리했어야 하는데, API 를 만들면서 (createAPI) -> basequery 에 필요한 로직을 넣으면 된다.
