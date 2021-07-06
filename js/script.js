//window.addEventListener('DOMContentLoaded', function() { //comented for test
    
    'use strict';
    
    //tabs
    let info = document.querySelector('.info-header'),
        tabBtn = document.querySelectorAll('.info-header-tab'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabs(a) {
        for(let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }
    hideTabs(1);

    function showTabs(b) {
        if(tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', function(event) {
        let target = event.target;
        if(target && target.classList.contains('info-header-tab')) {
            for(let i = 0; i < tabBtn.length; i++) {
                if(target == tabBtn[i]) {
                    hideTabs(0);
                    showTabs(i);
                    break;
                }
            }
        }
    });

    //timer
    let deadline = '2020-11-19';

    function getTimeRemaining(endtime) {
        let time = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((time/1000) % 60),
            minutes = Math.floor((time/1000/60) % 60),
            //hours = Math.floor((time/(1000*60*60)));
            hours = Math.floor((time/1000/60/60) % 24),
            days = Math.floor((time/(1000*60*60*24)));

        return {
            'total': time,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            days = timer.querySelector('.days'),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let time = getTimeRemaining(endtime);

            function addZero(num){
                if(num <= 9){
                    return '0' + num;
                } else 
                {
                    return num;
                }
            }

            days.textContent = addZero(time.days);
            hours.textContent = addZero(time.hours);
            minutes.textContent = addZero(time.minutes);
            seconds.textContent = addZero(time.seconds);

            if(time.total <= 0) {
                clearInterval(timeInterval);
                days.textContent = '00';
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
                }
        }
    }
    setClock('timer', deadline);

    //modal
    let showBtn = document.querySelector('.more'),
        modal = document.querySelector('.overlay'),
        closeBtn = document.querySelector('.popup-close'),
        tabInfo = document.querySelector('.info'),
        valueBtn = '';

    showBtn.addEventListener('click', function(){
        showTab(this);
        valueBtn = this;
    });

    tabInfo.addEventListener('click', function(event) {
        let target = event.target;

        if(target && target.classList.contains('description-btn')){
            showTab(target);
            valueBtn = target;
        }
    });

    function showTab(value) {
        modal.style.display = 'block';
        value.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    }

    closeBtn.addEventListener('click', function(){
        modal.style.display = 'none';
        valueBtn.classList.remove('more-splash');
        document.body.style.overflow = '';
    });

    //form data send
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'),
        contactForm = document.getElementById('form'),
        contactInput = contactForm.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

    statusMessage.classList.add('status');

    function sendData(formInput, inputValue) {
        
        return new Promise((resolve, reject) => {
            formInput.appendChild(statusMessage);
    
            let request = new XMLHttpRequest();
            request.open('POST', 'server.php');
           /*  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send(data); */
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
            let formData = new FormData(formInput);
            let obj = {};
            
            formData.forEach(function(value, key) {
                obj[key] = value;
            });

            let json = JSON.stringify(obj);
            request.send(json);
        
            request.addEventListener('readystatechange', function() {
                if(request.readyState < 4) {
                    statusMessage.innerHTML = message.loading;
                } else if(request.readyState === 4 && request.status == 200) {
                    resolve(message.success);
                } else {
                    reject(message.failure);
                }
            });
            for(let i = 0; i < inputValue.length; i++) {
                inputValue[i].value = '';
            }
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        sendData(form, input)
            .then(status => statusMessage.innerHTML = status)
            .catch(status => statusMessage.innerHTML = status);
    });

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        sendData(contactForm, contactInput)
            .then(status => statusMessage.innerHTML = status)
            .catch(status => statusMessage.innerHTML = status);
    });

    //Slider
    let sliderIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        dotWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot'),
        next = document.querySelector('.next'),
        prev = document.querySelector('.prev');

    moveSlides(sliderIndex);

    function moveSlides(n) {
        if (n > slides.length) {
            sliderIndex = 1;
        } 
        if (n < 1) {
            sliderIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');
        dots.forEach((item) => item.classList.remove('dot-active'));

        slides[sliderIndex - 1].style.display = 'block';
        dots[sliderIndex - 1].classList.add('dot-active');
    }

    function sliderPlus(n) {
        moveSlides(sliderIndex += n);
    }

    function currentSlider(n) {
        moveSlides(sliderIndex = n);
    }

    next.addEventListener('click', () => {
        sliderPlus(1);
    });

    prev.addEventListener('click', () => {
        sliderPlus(-1);
    });

    dotWrap.addEventListener('click', (event) => {
        for (let i = 0; i < dots.length + 1; i++) {
            if (event.target.classList.contains('dot') && event.target == dots[i-1]) {
                console.log(i);
                currentSlider(i);
            }
        }
    });

    //Calculator
    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = 0,
        daysSum = 0,
        total = 0,
        price = 1;

    totalValue.innerHTML = 0;

    function calc() {
        if(persons.value == '' || restDays.value == '') {
            totalValue.innerHTML = 0;
        } else {
             total = (personsSum + daysSum)*4000*price;
             totalValue.innerHTML = total;
        }
    }

    persons.addEventListener('change', function(){
        personsSum = +this.value;
        calc();
    });

    restDays.addEventListener('change', function() {
        daysSum = +this.value;
        calc();
    });

    place.addEventListener('change', function() {
        price = this.options[this.selectedIndex].value;
        calc();
    });
//});

