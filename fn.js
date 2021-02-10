const forEach = (arr, fn) => {
	for (const v of arr) fn(v);
};

// 모든게 true인 경우에만 true
const every = (arr, fn) => {
	let result = true;

	/*
		논리곱 연산자는 왼쪽 피연산자가 참이면 오른쪽 피연산자 실행
		왼쪽 피연산자 거짓이면 false 반환
	*/
	for (const v of arr) result = result && fn(v);
	return result;
};

// 하나라도 true이면 true
const some = (arr, fn) => {
	let result = false;
	/*
		논리합 연산자는 왼쪽 피연산자가 참이면 true 반환
		왼쪽 피연산자 거짓이면 오른쪽 피연산자 실행
	*/
	for (const v of arr) result = result || fn(v);
	return result;
};

const sortBy = (property) => (a, b) => (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;

const tap = (value) => (fn) => (typeof(fn) === 'function' && fn(value));

// fn의 length는 함수의 매개변수 갯수를 의미
const unary = (fn) => fn.length === 1 ? fn : (arg) => fn(arg);

const once = (fn) => {
	let done = false;

	return function () {
		return done ? undefined : ((done = true), fn.apply(this, arguments))
	};
};

const memoized = fn => {
	const lookupTable = {};
	// arg키가 있으면 해당 키를 반환하고 없으면 함수 호출 후 키에 값 저장
	return (arg) => lookupTable[arg] || (lookupTable[arg] = fn(arg));
};

const objectAssign = (...args) => {
	const to = {};
	for (let i = 0; i < args.length; i++) {
		const from = args[i];
		const keys = Object.keys(from);
		for (let j = 0; j < keys.length; j++) to[keys[j]] = from[keys[j]];
	}
	return to;
};

const map = (arr, fn) => {
	let results = [];
	for (const v of arr) 
		results.push(fn(v));
	return results;
};

const filter = (arr, fn) => {
	let results = [];
	for (const v of arr) {
		(fn(v)) ? results.push(v) : undefined;
	}
	return results;
};

const concatAll = (arr) => {
	let results = [];
	for (const v of arr) {
		results.push.apply(results, v); // apply의 두번째 인자는 매개변수를 받는데 배열로 받는다.
	}
	return results;
};

// const reduce = (arr, fn) => {
// 	let acc = 0;
// 	for (const v of arr) {
// 		acc = fn(acc, v);
// 	}
// 	return [acc];
// };

const reduce = (arr, fn, initialValue) => {
	let acc = 0;
	if (initialValue != undefined) acc = initialValue;
	else acc = arr[0];

	if (initialValue === undefined) {
		for (let i = 1; i < arr.length; i++) acc = fn(acc, arr[i]);
	} else {
		for (const v of arr) acc = fn(acc, v);
	}
	return [acc];
};

/* 
	책에서 제시하는 방법은 내 기준에서 비효율적이라 느꼈다.
	내가 생각한 방법은 아래와 같다.
*/
const reduce1 = (arr, fn, acc) => {
	let iter = arr[Symbol.iterator]();
	if (!acc) acc = iter.next().value;
	for (const v of iter) acc = fn(acc, v);
	return [acc];
};

/*
	주어진 두 배열을 합치는 것
 */
const zip = (leftArr, rightArr, fn) => {
	let index = 0, results = [];
	// 최소 거리로 순회한다. 최대 거리로 순회하면 array index가 오류가 난다.
	for (index = 0; index < Math.min(leftArr.length, rightArr.length); index++) {
		results.push(fn(leftArr[index], rightArr[index]));
	}
	return results;
};

const curry = binaryFn => {
	return function (firstArg) {
		return function (secondArg) {
			return binaryFn(firstArg, secondArg);
		};
	};
};

const curry1 = fn => {
	if (typeof fn !== 'function') throw Error('No function provided');

	return function curriedFn(...args) {
		return fn.apply(null, args);
	};
};

/*
	base case에 수렴할때까지 계속 배열을 더하다가 수렴하면 모은 배열을 적용한다.
	멋지네?	
 */
const curry2 = fn => {
	if (typeof fn !== 'function') throw Error('No function provided');

	return function curriedFn(...args) {
		// fn.length는 전달받은 함수의 매개변수 갯수를 의미
		if (args.length < fn.length) {
			return function () {
				return curriedFn.apply(null, args.concat([].slice.call(arguments)));
			};
		};
		return fn.apply(null, args);
	};
};

/*
	신기하긴 한데.. 이게 무슨 의미가 있지? 그리고 undefined을 적어주는 것도 별론데..	
 */
const partial = function (fn, ...partialArgs) {
	let args = partialArgs;
	return function (...fullArguments) {
		let arg = 0;
		for (let i = 0; i < args.length && arg < fullArguments.length; i++) {
			if (args[i] === undefined) {
				args[i] = fullArguments[arg++];
			}
		}
		return fn.apply(null, args);
	};
};

// 버전1 compose
// const compose = (a, b) => (c) => a(b(c));

// 여러 함수 합성
