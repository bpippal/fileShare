// // const redis = require('redis');

// // const client = redis.createClient();

// // async function myFunc(){
// //     client.on('error', (err) => console.log('Redis Client Error', err));

// //     await client.connect();
    
// //     await client.set('key', 'value');
// //     const value = await client.get('key');
// // }

// // myFunc();

// // ********************************

// const Promise = require('bluebird');

// const promiseA = Promise.resolve(4);


// function funcThatReturnsSomething(){

//     return promiseA
//     .then((valOfA) => {
//         return valOfA;
//     })
//     .tap(() => {
//         console.log('SOmething random')
//     })
//     .then((val) => {
//         return val*10;
//     })
// }

// const returnedVal = funcThatReturnsSomething();

// returnedVal
// .then((val) => console.log('THEN', val))
// .catch((rejVal) => console.log('CATCH', rejVal));

let myText = "some text \\n some more text"
console.log(myText);