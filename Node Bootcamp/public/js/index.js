import { login, logout } from './login';
import '@babel/polyfill';
import { displayMap } from './mapbox';

const mapBox = document.getElementById('map');
const form = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);

    displayMap(locations);
}

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        login(email, password);
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}