/**
 * container splash screen
 * @type {Element}
 */
let $splashScreen = document.querySelector('.loader');
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
            // $splashScreen.remove();
            $splashScreen.style.opacity = 0;
            document.querySelector('main').style.display = 'block';

            $splashScreen.addEventListener('transitionend', function () {
                $splashScreen.remove();
            })
        }, 3000);
    }else{
        logoTxtChildNumber++;
        $logoTxtChild[logoTxtChildNumber].style.opacity = 1;
    }



}, 500)