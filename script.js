// variable declaration
let years = 0;
let months = 0;
let days = 0;
let inputDate = '';
let currentDate = '';
const dayInput = document.querySelector('#day-input');
const monthInput = document.querySelector('#month-input');
const yearInput = document.querySelector('#year-input');

// animation and display related
function animateValue(obj, start, end, animationDuration) {
    let startingTime = null;

    const step = (currentTime) => {
        if (!startingTime) startingTime = currentTime;
        const progress = Math.min((currentTime - startingTime) / animationDuration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function displayResult() {
    animateValue(document.querySelector('#no-of-years'), 0, years, 500);
    await sleep(500);
    animateValue(document.querySelector('#no-of-months'), 0, months, 500);
    await sleep(500);
    animateValue(document.querySelector('#no-of-days'), 0, days, 500);
}

// date calculation
function calcDate() {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const differenceDays = Math.floor((currentDate - inputDate) / MS_PER_DAY);

    years = Math.floor(differenceDays / 365);
    const daysAfterYears = differenceDays % 365;
    months = Math.floor(daysAfterYears / 31);
    days = daysAfterYears % 31;

    displayResult();
}

// validation 
function error(parentId, errorMessage) {
    const children = document.querySelector(`#${parentId}`).children;
    children[0].classList.add('error');
    children[1].classList.add('error');
    children[2].textContent = errorMessage;
}

function removeError(parentId) {
    const children = document.querySelector(`#${parentId}`).children;
    children[0].classList.remove('error');
    children[1].classList.remove('error');
    children[2].textContent = '';
}

function validateDate() {
    currentDate = new Date();
    inputDate = new Date(yearInput.value, monthInput.value - 1, dayInput.value);

    let dayValid = false;
    let monthValid = false;
    let yearValid = false;
    let allValid = false;

    // validating day input
    if (dayInput.value === '') {
        error('days', 'This field is required');
    } else if (dayInput.value < 1 || dayInput.value > 31 || isNaN(Number(dayInput.value))) {
        error('days', 'Must be a valid day');
    } else {
        removeError('days');
        dayValid = true;
    }

    // validating month input
    if (monthInput.value === '') {
        error('months', 'This field is required');
    } else if (monthInput.value < 1 || monthInput.value > 12 || isNaN(Number(monthInput.value))) {
        error('months', 'Must be a valid month');
    } else {
        removeError('months');
        monthValid = true;
    }

    // validating year input
    if (yearInput.value === '') {
        error('years', 'This field is required');
    } else if (yearInput.value > currentDate.getFullYear() || isNaN(Number(yearInput.value))) {
        error('years', 'Must be in the past');
    } else {
        removeError('years');
        yearValid = true;
    }

    // validating entire date after all inputs pass validation check
    if (dayValid && monthValid && yearValid) {
        if (inputDate.getMonth() != monthInput.value - 1 || inputDate > currentDate) {
            error('days', 'Must be a valid date');
            error('months', '');
            error('years', '');
        } else {
            allValid = true;
        }
    }

    // calculate date if no errors
    if (allValid) {
        calcDate();
    }
}
