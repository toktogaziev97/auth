import './scss/style.scss'

const loginContent = document.querySelector('#login-content')
const loginEmail = loginContent.querySelector('#email')
const loginPassword = loginContent.querySelector('#password')
const loginBtn = loginContent.querySelector('#login')
const loginModal = document.querySelector('#login-modal')
const openLogin = document.querySelector('#openLogin')
const blackout = document.querySelector('.blackout')
const list = document.querySelector('.list')
const createBtn = document.querySelector('#create')
const contentInput = document.querySelector('#add-content')
const contentInputTitle = document.querySelector('#add-content-title')

const authBtnStatus = () => {  //статус Войти или Выйти
    if(localStorage.getItem('idToken')) {
        openLogin.innerText = 'Выйти'
    }else {
        openLogin.innerText = 'Войти'
    }
}

authBtnStatus()

let closeModal = () => { //для закрытия модалки
    loginModal.classList.remove('active')
    loginEmail.value = ''
    loginPassword.value = ''
}

blackout.addEventListener('click', closeModal)

const getData = async () => { // тут получаем
    let htmlInner = ''
    list.innerHTML = ''
    const idToken = localStorage.getItem('idToken') || ''
    if(idToken.length) {
        const url = 'https://auth-79770-default-rtdb.asia-southeast1.firebasedatabase.app/'
        const response = await fetch(`${url}news.json?auth=${idToken}`)
        const data = await response.json()
        for (let key in data) {
            htmlInner += `<p><span>${data[key].title}</span>- <span>${data[key].des}</span></p>`
        }
    }else {
        htmlInner = `<p>Токена нет</p>`
    }
    list.innerHTML = htmlInner

}
getData()

openLogin.addEventListener('click', () => {
    if(localStorage.getItem('idToken')) {
        localStorage.removeItem('idToken')
        getData()
        authBtnStatus()
    }else {
        loginModal.classList.add('active')
    }
})

let addError = (error) => {
    if(error === 'INVALID_EMAIL') {
        console.log('input')
        loginEmail.classList.add('error')
        loginPassword.classList.add('error')
    } else {
        loginPassword.classList.add('error')
    }
}

const login = async () => {
    loginEmail.classList.remove('error')
    loginPassword.classList.remove('error')
    loginBtn.disabled = true
    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
    const apiKey = 'AIzaSyApfCUv4E2TnywKfzA7D9CKz669WIYLW8c'
    const response = await fetch(`${url}${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value,
            returnSecureToken: true
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    console.log(data)
    if(data?.error?.code >= 400) {
        addError(data.error.message)
        console.log(data.error.message)
    }else {
        closeModal()
        localStorage.setItem('idToken', data.idToken)
        await getData() //передаем в метод getData токен полученный после логина
    }
    loginBtn.disabled = false
    authBtnStatus()
}

loginBtn.addEventListener('click', login)


const create = async () => {
    const url = 'https://auth-79770-default-rtdb.asia-southeast1.firebasedatabase.app/'
    const response = await fetch(`${url}news.json`, {
        method: 'POST',
        body: JSON.stringify({
            title: contentInputTitle.value,
            des: contentInput.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    getData()
    console.log('успешно добавлен контент')
}

createBtn.addEventListener('click', create)


// {
//     "rules": {
//     ".read": "auth != null",  // 2022-12-30
//         ".write": "now < 1672336800000",  // 2022-12-30
// }
// }
