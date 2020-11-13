const svg = document.querySelector('#svg');

let btnPlayer1 = document.querySelector('#btnPlayer1')
let btnPlayer2 = document.querySelector('#btnPlayer2')

btnPlayer1.addEventListener('click', () =>{
    window.location.href='../j1-n1.html'
    localStorage.setItem('nPlayers', JSON.stringify(1));
})

btnPlayer2.addEventListener('click', () =>{
    window.location.href='../j1-n1.html'
    localStorage.setItem('nPlayers', JSON.stringify(2));
})