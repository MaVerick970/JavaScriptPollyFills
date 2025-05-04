let x = new Promise((resolve, reject) => {
  reject(3);
});

x.catch((x) => {
  console.log(x);
}).then((x) => {
  console.log(x);
});

// x.catch((x) => {
//   console.log(x);
// }).catch((x) => {
//   console.log(x);
// });
