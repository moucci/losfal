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
                    }, 1000)

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

    console.log(err)

    //IF we have no error , show checkbox
    if (err === 0) {
        document.querySelector('#' + idform + " .form-check").style.display = 'flex';
    } else {
        document.querySelector('#' + idform + " .form-check").style.display = 'none';
    }


}
/**
 * get and bind event click on checkBox firl
 * @type {NodeListOf<Element>}
 */
let $elsCheckBox = document.querySelectorAll('input.form-checkbox');
$elsCheckBox.forEach(($el) => {
    $el.addEventListener('change', (event) => {
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
        console.log('le champ est null , ID du champ : ', key);
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
    input.forEach((el) => {
        let key = el.getAttribute('name');
        el.setAttribute('data-valid', "false")
        el.addEventListener('keyup', () => checkInput(key), false)
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

//add
$formSignup.querySelector('button.form-submit').addEventListener("click", function (event) {

    event.preventDefault();

    $formSignup.style.display = 'none';

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
                    document.querySelector('.form-loader').style.display = 'none';

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

//add
$formSignin.querySelector('button.form-submit').addEventListener("click", function (event) {

    event.preventDefault();

    //set and hide block msg-error
    let $pMsg = $formSignin.querySelector('.msg-error');
    $pMsg.textContent = '';
    $pMsg.style.display = 'none';


    //clear storage
    localStorage.clear();

    $formSignin.style.display = 'none';

    document.querySelector('.form-loader').style.display = 'block';

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
                document.querySelector('.form-loader').style.display = 'none';
            } else {
                //if all is ok
                //save token in localstprage
                localStorage.token = data.token;
                //redirect to index.html
                window.location.href = 'home.html';
            }
        })
        .catch(error => {
            alert('Une erreur est survenue. Merci de réessayer.');
            console.error('Erreur :', error);
        });

});



