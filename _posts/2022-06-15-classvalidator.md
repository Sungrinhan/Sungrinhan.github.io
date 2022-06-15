---
title: "[TS] class-validator의 검증"
date: 2022-06-15 09:25:SS +/- TTTT
categories: [TypeScript, Library]
tags: [validator, typescript] # TAG는 반드시 소문자로 이루어져야함!
---

# class-validator 란?

- 데코레이터를 이용해서 편리하게 오브젝트의 프로퍼티를 검증할 수 있는 라이브러리다.
- 웹 서버에서 들어오는 HTTP 요청의 JSON body 검증할 때 유용함.

# 기본 사용법

```js
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from "class-validator";

export class Post {
  // 조건은 @(annotation) 을 붙여서 쓰면 된다.
  @Length(10, 20)
  title: string;

  @Contains("hello")
  text: string;

  //조건이 여러개일 경우 override 처럼 여러개를 나열하여 쓰면 됨.
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @IsEmail()
  email: string;

  @IsFQDN()
  site: string;

  @IsDate()
  createDate: Date;
}

let post = new Post();
post.title = "Hello"; // should not pass
post.text = "this is a great post about hell world"; // should not pass
post.rating = 11; // should not pass
post.email = "google.com"; // should not pass
post.site = "googlecom"; // should not pass
```

- class 스키마를 정의하고, 프로퍼티의 유효성을 검증할 적절한 데코레이터를 달아주는 방식
- (@)annotation 으로 조건을 추가

# 에러 검증하기

```js
import {validate, validateOrReject} from 'class-validator'

validate(post).then(errors => {
	// errors 는 validation errors 의 '배열'로 나타남
	if(errors.length > 0 ) {
		console.log('validation failed.errors:', errors)}
})

validateOrReject(post).catch(errors => {
	console.log('Promise rejected (validation failed). Errors:', errors);
})
// or
async function validateOrRejectExample(input) {
	try {
		await validateOrReject(input);
	} catch (errors) {
		console.log('Caught promise rejection (validation failed).Errors: ', errors);
	}
}

```

- `validate().` 는 에러를 뱉을 때 `errors` 배열을 뱉는다.

## Validation errors

- `validate` 함수는 `ValidationError` 객체들의 배열을 리턴한다. 각각의 `ValidationError` 는:

```js
{
	target: Object; // 검증한 객체.
	property: string; // 검증을 통과하지 못한 객체의 프로퍼티.
	value: any; // 검증을 통과하지 못한 값(밸류).
	constraints?: { // 검증을 통과하지 못한 [조건(제약)]: '조건의 내용'
		[type:string]: string;
	};
	children?: ValidationError[]; // 속성의 모든 중첩 유효성 검사 오류를 포함.
```

- 위 `post`의 경우를 보면, 다음과 같은 객체들의 배열을 받는다 :

```js
[{
	target: /* post object */,
	property: "title",
	value: "Hello"
	constraints: {
		length: "$property must be longer than or equal to 10 characters"
	}
}, {
	target: /* post object */,
	property: "text",
	value: "this is a great post about hell world"
	constraints: {
		contains: "test must contain a hello string"
	}
},
// and other errors
]
```

- `target`에는 검증하는 객체가 모두 표기 되는데, 이는 너무 길고, 시각적으로 복잡해 질 수 있다. 이를 제거하기 위해서:

```js
validator.validate(post, { validationError: { target: flase } });
```

## Validation messages

- 데코레이터 옵션(decorator options) 에서 검증 메시지를 구체화 할 수 있다. 검증 메시지는 `ValidationError`에서 출력된다. (fail할 경우에만) :

```js
import { Minlength, MaxLength } from "class-validator";

export class Post {
  @MinLength(10, {
    message: "Title is too short",
  })
  @MaxLength(50, {
    message: "Title is too long",
  })
  title: string;
}
```

- 메시지에서 이용할 수 있는 토큰이 있다.

  - `$value` - 검증되는 값
  - `$property` - 검증되는 키(값의 이름)
  - `$target`- 검증되는 객체
  - `$constraint1`, `$constraint2`, ... `$constraint3`

- 또한 함수로 작성도 가능하다. 더 세분화된 메시지를 작성하는데 도움을 준다.

```js
import { MinLength, MaxLength, ValidationArguments } from "class-validator";

export class Post {
  @MinLength(10, {
    message: (args: ValidationArguments) => {
      if (args.value.length === 1) {
        return "Too short, minimum length is 1 character";
      } else {
        return (
          "Too short, minimum length is" + args.constraints[0] + "characters"
        );
      }
    },
  })
  title: string;
}
```

- 메시지 함수는 `ValidationArguments` 정보를 수용한다.
  - `value` - 검증되는 값
  - `constraints` - 데코레이터에서 사용한 조건문들(MinLength, MaxLength 등)
  - `targetName` - 검증되는 객체의 이름
  - `object` - 검증되는 객체
  - `property` - 검증되는 객체의 키 값

## Validating arrays

- 필드 값이 배열이고, 각각의 item에 decorator option을 걸고 싶을 때 `each: true` :

```js
import { MinLength, MaxLength } from "class-validator";

export class Post {
  @MaxLength(20, {
    each: true,
  })
  tags: string[];
}
```

- `post.tags` 배열을 각각 검증할 것임!

---

참조

- [github 공식문서](https://github.com/typestack/class-validator#validating-arrays)
