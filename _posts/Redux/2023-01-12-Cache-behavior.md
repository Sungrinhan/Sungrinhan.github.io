---
title: "[Redux][Query] RTK Query 캐시 조작하기"
date: 2023-01-12 11:30:SS +/- TTTT
categories: [Redux, RTK]
tags: [redux, query, rtk, cachebehavior] # TAG는 반드시 소문자로 이루어져야함!
---

# next.js 에서 rtk query get 요청에서 캐시 사용안하기...

## 문제점

![라우터 사진]('../../../../assets/img/라우터-이동-예시.png')

위에처럼 navigator 가 있고, 각 쇼핑몰마다 라우터가 존재하는데
예를들어 쿠팡 -> 다른 쇼핑몰 클릭 -> 다시 쿠팡으로 오는 경우 기존에 받아왔던 res 를 토해낸다.

- rtk query 의 경우, 동일한 arg 에 대한 api 요청은 일정시간 캐시를 참조한다고 한다.
- 네트워크 요청또한 하지 않는다. 그저 저장된 res 를 가져오는것 뿐
- 원래라면 중복되는 req 를 줄여줘서 참 좋은 기능이지만, 지금같은 경우에는 또 설정을 해줘야 한다. 어휴...

즉, refetch 가 일어난다 해도 동일한 요청이라면 같은 응답을 준다는 것이다.
default 저장 시간은 60 seconds 이다. 이후로는 캐시에서 삭제를 알아서 해준다.

나는 이 캐시를 사용하지 않기위해 설정에 들어갔다.

## rtk query 가 캐시를 저장하는 방법

구독이 시작되면 (api 요청이 시작되면) 엔드포인트와 파라미터들이 serialized and stored internally as a `queryCacheKey` .

req 요청이 되고, 캐시에 데이터가 존재한다면 서버에 새로운 req 가 보내지지 않는다.
캐시에 데이터 가 없는경우, 서버에 req 를 보내면서 새로운 res 를 캐시에 저장한다.

## 캐싱 조작하기

같은 param 이더라도, 캐싱을 참조하지 않도록 하는 방법은 크게 두가지 인 것 같다.

1. 공식문서에 있는 configuration 으로 설정하는 법
2. param 에다가 고유한, 매시간마다 바뀌는 sessionid 를 추가해서, 기존 queryCacheKey 를 안사용하게 하기.
3. refetch () 메서드 사용하기

- Cache lifetime 은 default 로 '60초' 다.
- 60초 동안은 캐시에 `queryCacheKey` 와 데이터를 같이 저장하고, 시간이 지나면 자동으로 삭제한다.

### 1. redux 공식문서 참고하기

- `keepUnusedDataFor` 는 캐싱 라이프 타임을 조작할 수 있는 설정이다.
- 캐시 라이프타임은 'API definition' 이나(global 하게), 엔드포인트 단위로 조작이 가능하다.

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Post } from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  // global configuration for the api
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], number>({
      query: () => `posts`,
      // configuration for an individual endpoint, overriding the api setting
      keepUnusedDataFor: 5,
    }),
  }),
});
```

### 2. param 으로 매 시간마다 바뀌는 sessionId 를 추가해서, 기존 queryCacheKey 사용 안하기

회사 프로젝트에는 2번과 같은 방법을 썼다.

왜냐하면, 라우터가 이동되었을때 저장된 state 가 초기화 되었음에도 불구하고 내가 원하는 res 를 가져오지 못했기 때문이다.

```ts
// 예시

const [nextToken, setNextToken] = useState("1");

// 매 시간마다 바뀌는 timestampRef
const timestampRef = useRef(Date.now()).current;

const {
  data: CoupangProducts,
  isSuccess: GetProductsDone,
  isError: GetProductsError,
  isLoading: GetProductsLoading,
} = useGetCoupangProductsQuery({
  omsId: omsID,
  display: 100,
  nextToken: nextToken,
  sessionId: timestampRef,
});
```

스크롤을 맨 밑으로 내리고, 상품의 갯수가 100개가 넘으면 nextToken 값이 업데이트 되고, CoupangProducts 의 상품목록은 바뀌게 된다.

라우터 이동하고 다시 쿠팡페이지로 돌아오면, nextToken 값을 콘솔찍어보면 '1'로 잘 나오는데 바뀐 상품목록으로 나온다. 즉, 이미 검색해본 캐시를 이용해서 req를 하지 않은 것이다.

위 코드에서는 `timestampRef` 를 추가했다. 계속해서 바뀌는 값을 통해, query 가 매번 다른 key 를 생성하도록 하여 새로운 req 를 요청하게 할 수 있다. sessionId 추가후에는 버그가 발생하지 않았다.

### 3. refetch/ initiate 를 통한 재요청

1. 관련된 쿼리안에 refetch 를 가져온다.

2. 옵션으로 `forceRefetch: true` 인자를 전달하면서, 엔드포인트에 `initiate` thunk action 을 줄 수 있다.

```ts
import { useDispatch } from "react-redux";
import { useGetPostsQuery } from "./api";

const Component = () => {
  const { data, refetch } = useGetPostsQuery({ count: 5 });

  function handleRefetchOne() {
    // 데이타 리-패치하기
    refetch();
  }

  function handleRefetchTwo() {
    // 위에서 쿼리에 refetch 와 동일한 이펙트(결과)
    dispatch(
      api.endpoints.getPosts.initiate(
        { count: 5 },
        { subscribe: false, forceRefetch: true }
      )
    );
  }
};
```

## 사용후기

쿼리문은 사용하기 편한것 같으면서도 어느시점이 되면 불편하다.

항상 페이지를 시작할 때, req 가 발생해서 편할때도 있다.

쿼리문이 시작할 타이밍을 조작하려면, { skip } 을 사용할 수 도 있지만, 정확히 조작하기는 어려운거같다.

프레임 워크의 장점이자 단점이랄까..? 유연하게 사용할 수 있도록 좀더 익숙해져야겠다.

## 출처

[RTK Query Cache Behavior 공식페이지 ](https://redux-toolkit.js.org/rtk-query/usage/cache-behavior)
