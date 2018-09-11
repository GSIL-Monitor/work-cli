### pipeline
语法是 |>，类似其他语言，比如 Elm、LiveScript、OCaml 等，还有 UNIX 管道。

```
// Before
let result = exclaim(capitalize(doubleSay("hello")));

// After
let result = "hello"
  |> doubleSay
  |> capitalize
  |> exclaim;

```

# 还可以和 await 混用，以及传递额外参数，详见提案的例子。

### nullish coalescing
语法是 ??。和 || 操作符类似，但只判断左边的值是否为 null 和 undefined，不判断 ""、0、NaN、false 等，详见提案。

适用于配默认值。
```
var foo = object.foo ?? "default";

```
### optional chaining  用于防御性地检测对象、函数等，详见提案。

比如：获取对象属性。
```
// before
var street = user && user.address && user.address.street;

// after
var street = user?.address?.street;
获取函数执行结果的子属性。

// before
var fooInput = myForm.querySelector('input[name=foo]');
var fooValue = fooInput ? fooInput.value : undefined;

// after
var fooValue = myForm.querySelector('input[name=foo]')?.value;
判断函数存在再执行。

a?.()
optional catch binding
catch 没有用到 error 对象时可以不用写。

// before
try {
} catch(e) {}

// after
try {
} catch {}
function bind
Function bind 的新语法，可以 bind，也可以直接 call。

obj::func
// is equivalent to
func.bind(obj)

::obj.func
// is equivalent to
obj.func.bind(obj)

obj::func(val)
// is equivalent to
func.call(obj, val)

::obj.func(val)
// is equivalent to
obj.func.call(obj, val)

```
有个挺好的用法是可以直接用于类数组，比如：
```
var urls = document.querySelectorAll('a')
  ::map(node => node.href)

```
### do expression
简单的判断场景可以用三元操作符，复杂场景用 do expression 会比较合适。
```
let x = 100;
let y = 20;

let a = do {
  if(x > 10) {
    if(y > 20) {
      'big x, big y';
    } else {
      'big x, small y';
    }
  } else {
    if(y > 10) {
      'small x, big y';
    } else {
      'small x, small y';
    }
  }
};
```
另一个场景是可以用于 JSX：
```
var Component = props =>
  <div className='myComponent'>
    {do {
      if(color === 'blue') { <BlueComponent/>; }
      else if(color === 'red') { <RedComponent/>; }
      else if(color === 'green') { <GreenComponent/>; }
    }}
  </div>
;
```