---
title: "[JS][Library] formik 과 yup 을 사용해보자"
date: 2022-07-22 11:45:SS +/- TTTT
categories: [JavaScript, JSLibrary]
tags: [javascript, formik, yup] # TAG는 반드시 소문자로 이루어져야함!
---

Formik 과 Yup 을 통해서 submit 과 validate 를 동시에 진행해보자.

프론트엔드를 하면 빠질 수 없는 것이 Form 이다.

대표적인 라이브러리로 Formik 이 있다.

```ts
npm i formik
npm i yup
```

### 초기값 설정하기

form 에 사용 할 상태의 초기값을 initialValues 을 통해서 설정한다.

```ts
const formik = useFormik({
  initalValues: {
    firstsName: "",
    lastName: "",
    channel: "",
  },
});
```

초기 값을 사용 할 곳에서 value 의 속성 값으로 초기 값을 연결해준다.

```ts
<form onSubmit={formik.handleSubmit}> // 폼 전송 이벤트 리스너 연결은 form 태그의 onSubmit 에 연결
<input
	type="text"
	id="lastName"
	name="lastName"
	value={formik.values.lastName} // initialState 를 연결
	onChange={formik.handleChange} // onChange함수에 formik handleChange 를 연결
/>
<input
	type="text"
	id="firstName"
	name="firstName"
	value={formik.values.firstName}
	onChange={formik.handleChange}
/>
```

### input값이 변경되는 onChange 연결하기

input 값이 변경 될 때 사용하는 onChange에 formik 의 handleChange 를 연결한다. 여기서 handleChange 를 사용하면 values[key] 값이 업데이트 된다. name 속성이 없으면 id 속성을 찾는다.

### <form onSubmit 함수 연결하기>

```ts
<form onSubmit={formik.handleSubmit}>
```

submit 에 사용하는 함수도 초기값과 함께 작성한다.

```ts
const formik = useFormik({
  initialValues: {
    firstName: "",
    lastName: "",
    channel: "",
  },
  onSubmit: (values) => {
    console.log(values);
  },
});
```

### 유효성 검사하기

입력한 값의 유효성 검사를 진행할 수 있다.
먼저 사용자 정의 유효성 검사 함수를 생성하고 validate 로 useFormik() hook 에 연결한다.
useFormik() 에 전달한 onSubmit 함수는 오류가 없는 경우에만 실행된다.
(유효성 검사 함수가 {} 빈객체를 반환하는 경우)

```ts
const validate = (values) => {
	const errors = {};

	if ( !values.firstName) {
		errors.name = "성 입력은 필수입니다.";
	) else if (values.firstName.length < 2 ) {
		errors.name = "성은 최대 2글자 입니다.";
	}
	...

	return errors;
};

const formik = useFormik({
	initialValues: {
		firstName: "",
		lastName: "",
		channel: "",
	},
	onSubmit: (values) => {
		console.log(values);
	},
	validate
});
```

### Yup 을 사용한 유효성 검사

```ts
import * as Yup from "yup";
```

Yup 의 validationSchema 를 사용해서 유효성 검사를 한다.
기존의 validate 를 대신해 validationSchema 를 사용하자.

```ts
const validationSchema = Yup.object({
  firstName: Yup.string()
    .max(2, "성은 최대 2글자 입니다.")
    .required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string()
    .email("이메일 입력 형식이 올바르지 않습니다.")
    .required("Required"),
});
```

```ts
const formik = useFormik({
  initialValues,
  validationSchema, // validate 삭제 후 입력
  onSubmit,
});
```

### Formik 라이브러리가 제공하는 컴포넌트를 사용해서 폼을 제어해 보기

```ts
import { Formik, Form, Field, ErrorMessage } from "formik";
```

기본적으로 Field는 input 을 렌더링 한다. name props 를 전달하면 암시적으로 각각의 onChange, onBlur, value props 를 연결한다.
이 외에 as, className props 들도 사용 가능하다.

```ts
<Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={onSubmit}
>
  <Form>
    <label htmlFor="firstName">이름</label>
    <Field
      type="text"
      id="firstName"
      name="firstName"
      // className
      // as
    />
    <ErrorMessage name="name" component={ErrorMessageComponent} />
  </Form>
</Formik>
```

여기서 사용한 ErrorMessage 컴포넌트를 커스텀 하기 위해 component 속성에 커스텀 컴포넌트를 연결한다.

```ts
const ErrorMessageComponent = (props) => <span role="alert" {...props} />;
```

## 참조

https://choisuhyeok.tistory.com/73
