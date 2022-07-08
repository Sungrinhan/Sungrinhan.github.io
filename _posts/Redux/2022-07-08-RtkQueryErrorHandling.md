---
title: "[Redux][Query]ErrorHandling RTK Query"
date: 2022-07-08 01:30:SS +/- TTTT
categories: [Redux, RTK]
tags: [redux, query, rtk, error] # TAG는 반드시 소문자로 이루어져야함!
---

# RTK query Error Handling

## 개요

fetchBaseQuery 를 사용할 때, 너의 쿼리나 뮤테이션이 error를 throw 할 때.
`error`프로퍼티를 리턴할 것이다.
컴포넌트는 쿼리가 에러를 던질 때 마다 re-render 가 될것이며, 원한다면 에러에 적절한 UI를 보여줄 수 있을 것이다.

### Error Display Examples

```ts
// Query Error
function PostsList() {
  const { data, error } = useGetPostsQuery();

  return (
    <div>
      {error.status} {JSON.stringify(error.data)}
    </div>
  );
}
```

```ts
// Mutation Error
function AddPost() {
  const [addPost, { error }] = useAddPostMutation();

  return (
    <div>
      {error.status} {JSON.stringify(error.data)}
    </div>
  );
}
```

```ts
// Manually selecting an error
function PostList() {
	const { error } = useSelector(api.endpoints.getPosts.select())

	return (
		<div>
			 {error.status} {JSON.stringify(error.data)}
		<div>
	)
}
```

## 내가 겪었던 문제점

```ts
postProductImage(formData).then((res) => {
  message.success("사진 업로드가 성공적으로 되었습니다.");
  console.log("res", res);
  const data = res["data"];
  setImgUrls({ ...imgUrls, ...data });
});
```

- 위 코드는 상품사진을 올리는 뮤테이션 이후 프로미스 체이닝 이다.
- mutation 응답을 받아오는 then의 res 에서, 응답 형식이 `{ data: ...res}` 이런식으로 되어있어서, 내가 정의했던 response 의 타입과 맞지 않아 자꾸 에러가 발생했다.

### 해결방법

내가 만약 바로 err 나 success 의 payload 에 바로 접근을 원한다면, then chainging 전에 `.unwrap()` 을 사용하면 된다.

```ts
postProductImage(formData)
  .unwrap() // 이 unwrap 을 통해, 바로 success data 의 payload 에 접근할 수 있어서 에러도 안나고 코드도 간단해 졌다!
  .then((res) => {
    message.success("사진 업로드가 성공적으로 되었습니다.");
    console.log("res", res);
    const data = res["data"];
    setImgUrls({ ...imgUrls, ...data });
  });
```

하루종일 해당문제에 대해서 고민을 했었는데, 이사님과 이거에 대해 얘기를 나누니까 무슨 키워드로 검색해야 되는지 바로 알게되어 찾았다.
이사님이랑 같이 찾기 시작했는데 먼저 찾아서 기뻤다. ㅋㅋㅋ
검색할 때 키워드를 잘 선정하자!!!!

## 참조

[Redux Toolkit 공홈](https://redux-toolkit.js.org/rtk-query/usage/error-handling)
