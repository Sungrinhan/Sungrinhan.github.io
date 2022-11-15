---
title: "[Express] Middleware에 관해서(morgan)"
date: 2022-11-05 10:14:SS +/- TTTT
categories: [Express]
tags: [express, middleware, morgan] # TAG는 반드시 소문자로 이루어져야함!
---

미들웨어(Middleware)

## 개념

middleware 는 request 와 response 사이에 있다.

All middlewares are handlers. All controllers are middlewares. (they should have `next` param and function in handler)
They have three arguments including next argument. (req, res, next).
`Next` argument calls `[next()]` the next handler function if it exists.

For example:

```ts
// though it starts with middleware "one" it will eventually end up with a controller "three" because next() was called.

// You can put codes inside a body of middlewares "one" and "two" to check something before they get to the controller "three"

const one = (req, res, next) => {
  next();
};

const two = (req, res, next) => {
  next();
};
const three = (req, res, next) => {
  console.log("Now three is handling");
};

// app.get will handle users who visit "/" URL with "one" handler
app.get("/", one, two, three);
```

All handle function what we used to know are also controllers.
Such as :

```ts
const handleHome = (req, res) => res.end()
app.get("/", handleHome);

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`
```

미들웨어는 작업을 다음 함수에 넘기는 함수이다. 응답하지 않는다.
middleware 는 필요한 만큼 만들 수 있다.

## app.use()

`app.use()`는 global middleware 를 만들 수 있게 해준다.

- 어느 URL 에도 작동하는 middleware.

```ts
// gossipMiddleware 는 현재 "/" url 에만 미들웨어로 작동한다.

const gossipMiddleware = (req, res, next) => {
  console.log(`Someone is going to ${req.url}`);
  next();
};
const handleHome = (req, res) => {
  return res.send("this is handlehome");
};

app.get("/", gossipMiddleware, handleHome);
```

```ts
// 모든 url 에 동작하는 gossipMiddleware

const gossipMiddleware = (req, res, next) => {
  console.log(`Someone is going to ${req.url}`);
  next();
};
const handleHome = (req, res) => {
  return res.send("this is handlehome");
};
// 모든 라우트에서  gossipMiddleware 가 쓰인다.
// 항상 get 요청보다 위에 있어야 미들웨어로 쓸 수 있다.
app.use(gossipMiddleware);
app.get("/", handleHome);
```

## morgan logger

npm 에는 morgan 이라는 logger 미들웨어가 있다.

```ts
npm i morgan
```

사용법은 일반 미들웨어와 같다.

```ts
import morgan from "morgan";

const logger = morgan("dev");

app.use(logger);
```

`morgan()` function 인자로는 여러가지가 올 수 있다.
You can check on [npmjs morgan](https://www.npmjs.com/package/morgan).
