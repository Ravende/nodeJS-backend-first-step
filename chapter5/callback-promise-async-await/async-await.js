// async function myName() {
//     return "Andy";
// }

// async function showName() {
//     const name = await myName();
//     console.log(name);
// }

//console.log(showName());

async function a() { return "OK" }
async function b() {
    const result = await a();
    console.log(result);
}
b();