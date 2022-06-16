// // // const name = 'Ario';
// // // let age = 24;
// // // let hasHobbies = true;


// // // age = 26;

// // // const summarizeUser = (userName, userAge, userHasHobbies) =>{
// // //     return 'name is ' + userName + ' age is ' + userAge
// // // }


// // // const add = (a, b) =>  a+b;

// // // const addOne = a => a+1;

// // // const addRandom =() => 1+3;


// // // console.log(summarizeUser(name, age))

// // // console.log(add(2,6))



// const person = {
//     name: 'Ario',
//     age: 29,
//     greet () {
//         console.log('Hi, I am ' + this.name)
//     }
// };

// const printName = ({ name }) => {
//     console.log(name)
// }

// printName(person)

// const { name, age } = person

// console.log(name, age)

// // const copiedPerson = {...person}
// // // console.log(person.greet());

// const hobbies = ['sports', 'cooking', 'programming']

// const [h1, ...h2] = hobbies

// console.log(h1, h2)
// // // for (let h of hobbies){
// // //     console.log(h)
// // // }

// // // console.log(hobbies.map(h => {
// // //     return 'element: ' + h
// // // }))

// // const copy = [...hobbies];

// // console.log(copy)



// // const toArray = (...args) => {
// //     return args
// // }

// // console.log(toArray(1,2,3))

const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done')
        }, 1500)
    });
    return promise
}


setTimeout(()=> {
    console.log('timer is done')
    fetchData().then(text => {
        console.log(text)
        
    })
}, 2000);

console.log('hello')
console.log('hi')