const svg = document.querySelector('#svg');

let btnPlayer1 = document.querySelector('#btnPlayer1')
let btnPlayer2 = document.querySelector('#btnPlayer2')

btnPlayer1.addEventListener('click', () =>{
    window.location.href='../j1-n1.html'
    localStorage.setItem('nPlayers', JSON.stringify(1));
})

// btnPlayer2.addEventListener('click', () =>{
//     window.location.href='../j1-n1.html'
//     localStorage.setItem('nPlayers', JSON.stringify(2));
// })


const log = document.querySelectorAll("#logo path");

for (let i = 0; i < log.length; i++) {
    console.log(`Letter ${i} is ${log[i].getTotalLength()}`);
    
}

/*Letter 0 is 883.1704711914062
Letter 1 is 903.1062622070312
Letter 2 is 849.0693969726562
Letter 3 is 920.6795654296875
Letter 4 is 1004.2451782226562
Letter 5 is 849.06982421875
Letter 6 is 953.1033935546875
Letter 7 is 990.8074951171875
Letter 8 is 869.1555786132812*/
