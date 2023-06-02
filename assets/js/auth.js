//version app
let appVersion = '1.0.0' ;
console.log(appVersion)

/**
 * methode to hide html element
 * add function hide to prototype htmlelement
 */
HTMLElement.prototype.hide = function () {
    this.style.display = 'none';
    return this
}
/**
 * methode To show html element
 * add function show to prototype htmlelement
 * @param param {string}
 */
HTMLElement.prototype.show = function (param = 'block') {
    this.style.display = param;
    return this
}

/**
 * container splash screen
 * @type {Element}
 */
let $splashScreen = document.querySelector('.loader');
if ($splashScreen) {
    /**
     * list of letter
     * @type {NodeListOf<Element>}
     */
    let $logoTxtChild = $splashScreen.querySelectorAll('.logo-txt-b span');
    /**
     * index Of Letter for logo-txt-b span
     * @type {number}
     */
    let logoTxtChildNumber = -1;
    let effectInterval = setInterval(() => {
        if (logoTxtChildNumber === 5) {
            clearInterval(effectInterval);
            $splashScreen.querySelector('.logo-txt-b').remove();

            setTimeout(() => {

                //if we have token
                if (localStorage.token) {
                    //redirect to home
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 1000);

                } else if (localStorage.remember) {
                    console.log('auto log');


                    $splashScreen.querySelector('img').classList.add('animateToTop');
                    $splashScreen.querySelector('.logo-txt').classList.add('goToTop');

                    // $splashScreen.remove();
                    // document.querySelector('main').style.display = 'block';
                    $splashScreen.querySelector('.goToTop')
                        .addEventListener('transitionend', function () {
                            $splashScreen.querySelector('#section-auth').classList.remove('hide');
                            //decrype data in localstorage
                            let formStorage = JSON.parse(localStorage.remember);
                            formStorage = {
                                email: CryptoJS.AES.decrypt(formStorage.email, '(KZ.kkd%V2YBMaH').toString(CryptoJS.enc.Utf8),
                                pass: CryptoJS.AES.decrypt(formStorage.pass, '(KZ.kkd%V2YBMaH').toString(CryptoJS.enc.Utf8),
                            };
                            //bind data to input
                            document.querySelector('#form-login #form-email-signin').value = formStorage.email;
                            document.querySelector('#form-login #form-pass-signin').value = formStorage.pass;
                            document.querySelector('#form-login button').click();
                        });


                } else {
                    $splashScreen.querySelector('img').classList.add('animateToTop');
                    $splashScreen.querySelector('.logo-txt').classList.add('goToTop');

                    // $splashScreen.remove();
                    // document.querySelector('main').style.display = 'block';
                    $splashScreen.querySelector('.goToTop')
                        .addEventListener('transitionend', function () {
                            $splashScreen.querySelector('#section-auth').classList.remove('hide')
                        })
                }


            }, 3000);


        } else {
            logoTxtChildNumber++;
            $logoTxtChild[logoTxtChildNumber].style.opacity = 1;
        }


    }, 500);
}

/*metode show checkbox
*@params idform : string | null -> identifiant du formulaire
* */
showCheckBox = (idform = null) => {


    if (idform === null) return false;


    //get form
    let fields = document.querySelectorAll("#" + idform + " input ");

    //set error 0
    let err = 0;

    fields.forEach((el) => {
        let valid = el.getAttribute("data-valid");
        if (valid !== 'true' && el.type !== 'checkbox') err++;
    })


    //IF we have no error , show checkbox
    if (err === 0) {
        document.querySelector('#' + idform + " .form-check").show('flex');
        if (idform === 'form-login') {
            document.querySelector('#' + idform + " button").classList.add('active')
            document.querySelector('#' + idform + " button").disabled = false;
        }
    } else {
        if (idform === 'form-login') {
            document.querySelector('#' + idform + " button").classList.remove('active')
            document.querySelector('#' + idform + " button").disabled = true;
        }
        document.querySelector('#' + idform + " .form-check").hide();
    }


}

/**
 * get and bind event click on checkBox firl
 * @type {NodeListOf<Element>}
 */
let $elsCheckBox = document.querySelectorAll('input.form-checkbox');
$elsCheckBox.forEach(($el) => {
    $el.addEventListener('change', (event) => {


        if (event.target.closest('form#form-login')) return false;

        let $btnSubmit = event.target.closest('form').querySelector('.form-submit');
        if (event.currentTarget.checked) {
            $btnSubmit.classList.add('active')
            $btnSubmit.disabled = false;
        } else {
            $btnSubmit.classList.remove('active')
            $btnSubmit.disabled = true;
        }
    })
})

/*Methode pour vérifier les champs input
*@params key:string | null  => le nom qui servira de cle pour le tableau de pattern | null par defaut
* @return boolean
* */
let checkInput = (key = null) => {

    //if key null
    if (key === null) {
        return false;
    }


    //liste de validateur pour chaque champ
    let patterns = {
        "form-name-signup": /^[a-zA-ZÀ-ÖØ-öø-ÿ -]{5,50}$/,
        "form-email-signup": /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "form-pass-signup": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{16,}$/,
        "form-email-signin": /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "form-pass-signin": /^.{5,}$/,
    }

    let el = document.querySelector("#" + key);

    let strValue = el.value;

    let regex = new RegExp(patterns[key]);

    let idForm = el.closest('form').getAttribute('id');

    if (!regex.test(strValue)) {
        if (key === 'form-pass-signup') {
            let $container = document.querySelector('.msg-error-signup');

            $container.querySelectorAll('.success').forEach(($el) => {
                $el.classList.remove('success');
            })

            let errors = 0;

            if (strValue.length >= 16) $container.querySelector('.len').classList.add('success'); else errors++;

            if (/(?=.*[a-z])/.test(strValue)) $container.querySelector('.min').classList.add('success'); else errors++;

            if (/(?=.*[A-Z])/.test(strValue)) $container.querySelector('.maj').classList.add('success'); else errors++;

            if (/(?=.*\d)/.test(strValue)) $container.querySelector('.num').classList.add('success'); else errors++;

            if (/(?=.*[!@#$%^&*])/.test(strValue)) $container.querySelector('.spec').classList.add('success'); else errors++;

            if (errors > 0) {
                $container.classList.remove('hide')
            } else {
                $container.classList.add('hide')
            }
        }
        el.style = "box-shadow: 0px 0px 10px 5px red;";
        el.setAttribute('data-valid', 'false')
        //show checkbox
        showCheckBox(idForm);
        return false
    } else {
        el.style = "box-shadow: 0px 0px 10px 5px green;";
        el.setAttribute('data-valid', 'true');

        //hide mdp filter
        document.querySelector('.msg-error-signup').classList.add("hide");

        //show checkbox
        showCheckBox(idForm);
        return true;
    }

}

//get form recall
let form = document.querySelector("form");

//if we have form bind event to check input
if (form !== null) {
    let input = document.querySelectorAll('input');
    //bind  listener to element
    input.forEach(($el) => {
        let key = $el.getAttribute('name');
        $el.setAttribute('data-valid', "false")
        $el.addEventListener('keyup', () => checkInput(key), false);
        // Créez un nouvel événement de clic
        let newEvent = new Event('keyup', {
            bubbles: true,
            cancelable: true
        });

        // trigger event keyup on input
        $el.dispatchEvent(newEvent);
    });
}

/**
 * bind btn show password
 */
document.querySelectorAll('.toggle-password')
    .forEach(($el) => {
        $el.addEventListener('click', (e) => {
            let input = e.target.closest('.inputGroup').querySelector('input');
            if (input.getAttribute('type') === 'password') {
                input.setAttribute('type', 'text')
            } else {
                input.setAttribute('type', 'password')
            }
        })
    })

document.querySelectorAll('.toggle-form')
    .forEach(($el) => {
        $el.addEventListener('click', (e) => {
            let $form = e.target.closest('form');
            document.querySelector('form.hide').classList.remove('hide')
            // debugger
            $form.classList.add('hide');

        })
    })


//get button form signup
let $formSignup = document.querySelector("#form-signup ");

//add event to btn submit for form signup
$formSignup.querySelector('button.form-submit').addEventListener("click", function (event) {

    event.preventDefault();

    $formSignup.hide();

    document.querySelector('.form-loader').style.display = 'block';

    let $form = {};
    //get data form
    $formSignup.querySelectorAll('input').forEach(($input, key) => {
        //bind pseudo
        if (key === 0) {
            $form.pseudo = $input.value;
        }
        //bind email
        if (key === 1) {
            $form.email = $input.value;
        }
        //bind pass
        if (key === 2) {
            $form.password = $input.value;
        }

    })

    let pathRegister = 'https://music.freefakeapi.io/api/register';
    let pathLogin = 'https://music.freefakeapi.io/api/login';

    /**
     * headre for fetch
     * @type {{headers: {"Content-Type": string}, method: string, Body: string}}
     */
    let header = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify($form),
    }

    fetch(pathRegister, header)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            //si  message d'erreur
            if (data.code === '403') {
                //parse message error
                Object.keys(data.message).forEach((name) => {

                    //edit input pseudo
                    if (name === 'pseudo') {
                        $formSignup.querySelector('#form-name-signup').style = "box-shadow: 0px 0px 10px 5px red;";
                    }
                    //edit input email
                    if (name === 'email') {
                        $formSignup.querySelector('#form-email-signup').style = "box-shadow: 0px 0px 10px 5px red;";
                    }
                    //edit input pass
                    if (name === 'password') {
                        $formSignup.querySelector('#form-pass-signup').style = "box-shadow: 0px 0px 10px 5px red;";
                    }

                    //show form
                    $formSignup.style.display = 'block';

                    //hide loader
                    document.querySelector('.form-loader').hide();

                });
            }

            //if all is ok
            //edit form data to delete pseudo
            delete $form.pseudo;
            //set new data header
            header.body = JSON.stringify($form);

            //send request
            fetch(pathLogin, header).then(response => response.json())
                .then(data => {

                    //si  message d'erreur
                    if (!data.token) {
                        alert(data.message)
                    }
                    //save token in localstprage
                    localStorage.token = data.token;

                    //redirect to index.html
                    window.location.href = 'home.html';
                }).catch(error => {
                console.log(error)
            })


        })
        .catch(error => {
            alert('Une erreur est survenue. Merci de réessayer.');
            console.error('Erreur :', error);
        });

});


//get button form signin
let $formSignin = document.querySelector("#form-login");

//add event to btn submit for form signin
$formSignin.querySelector('button.form-submit').addEventListener("click", function (event) {

    event.preventDefault();

    //set and hide block msg-error
    let $pMsg = $formSignin.querySelector('.msg-error');
    $pMsg.textContent = '';
    $pMsg.hide();

    console.log('send data')

    //clear storage
    localStorage.removeItem('token');

    $formSignin.hide()

    document.querySelector('.form-loader').show();

    let $form = {};
    //get data form
    $formSignin.querySelectorAll('input').forEach(($input, key) => {
        //bind email
        if (key === 0) {
            $form.email = $input.value;
        }
        //bind pass
        if (key === 1) {
            $form.password = $input.value;
        }

    })


    let pathLogin = 'https://music.freefakeapi.io/api/login';

    /**
     * headre for fetch
     * @type {{headers: {"Content-Type": string}, method: string, Body: string}}
     */
    let header = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify($form),
    }

    fetch(pathLogin, header)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            //si  message d'erreur
            if (data.code === '403') {
                //parse message error
                Object.keys(data.message).forEach((name) => {
                    //show wrong style
                    $formSignin.querySelectorAll('input').forEach(($input) => {
                        $input.style = "box-shadow: 0px 0px 10px 5px red;"
                    })
                });
                $pMsg.textContent = 'Mot de passe ou email incorrecte';
                $pMsg.style.display = 'block';
                $formSignin.style.display = 'block';
                document.querySelector('.form-loader').hide();
            } else {
                //if all is ok
                //save token in localstprage
                localStorage.token = data.token;

                //chiffre data to storage
                if (document.querySelector('#form-login .form-checkbox').checked) {
                    let remember = {
                        email: CryptoJS.AES.encrypt($form.email, '(KZ.kkd%V2YBMaH').toString(),
                        pass: CryptoJS.AES.encrypt($form.password, '(KZ.kkd%V2YBMaH').toString(),
                    }
                    localStorage.remember = JSON.stringify(remember);
                }

                //redirect to index.html
                window.location.href = 'home.html';
            }
        })
        .catch(error => {
            alert('Une erreur est survenue. Merci de réessayer.');
            console.error('Erreur :', error);
        });

});



