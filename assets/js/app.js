/**
 * save original methode fetch
 */
const {fetch: originalFetch} = window;

/**
 * Methode Interceptor to append Custom header
 * @param args
 * @return {Promise<Response>}
 */
window.fetch = async (...args) => {
    //extract arguments
    let [resource, options] = args;
    //check option
    options = options || {};
    //check headers in options
    options.headers = options.headers || new Headers();

    options.headers.append('Accept', "application/json");
    options.headers.append('Content-Type', "application/json");
    options.headers.append('Authorization', 'Bearer ' + localStorage.token);


    //execute original fetch
    let response = await originalFetch(resource, options);
    //return response
    return response;
};

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
 * methode To set opacity with params
 * add function show to prototype htmlelement
 * @param param {number}
 */
HTMLElement.prototype.setOpacity = function (param = 1) {
    if (param < 0 || param > 1) param = 1;
    this.style.opacity = param;
    return this
}


/**
 * //methode to show img after load
 * @param event
 */
let callBackImg = function (event) {
    this.parentNode.querySelector('img').style.opacity = 1;
    this.parentNode.querySelector('.imgOnLoad').remove()

}

//check if user had token if nor redirect to index
if (!localStorage.token) {
    //redirect to home
    window.location.href = 'index.html';
}

//get loaderMain
let $loaderMain = document.querySelector('body > .form-loader');
//show loader
$loaderMain.show();


// List methode to load data
let loadingData = {

    /**
     * idx pagination page last played
     */
    nPageLasts: 1,

    /**
     * methode to load last music played
     */
    loadLasts: function () {
        let url = 'https://music.freefakeapi.io/api/tracks?';
        let params = {
            page: this.nPageLasts,
            order: 'played',
            limit: 5
        }

        //encode  params for url
        params = Object.keys(params)
            .map(value => `${value}=${encodeURIComponent(params[value])}`).join('&');

        //load last music
        this.startLoad(url, params).then(data => {
            let pathApi = 'https://music.freefakeapi.io';
            $loaderMain.style.display = 'none';
            Object.entries(data).forEach(([key, value]) => {
                //get model $element html
                let $elModel = document.querySelector('#home-slider ul li').cloneNode(true);
                $elModel.classList.remove('model');
                let imgSrc = pathApi + value.cover;
                $elModel.querySelector('.title').textContent = value.title;
                $elModel.querySelector('img').setAttribute('src', imgSrc);
                $elModel.querySelector('img').onload = callBackImg;
                $elModel.querySelector('a').setAttribute('href', 'player.html?idm=' + value.id);
                $elModel.querySelector('.name').textContent = 'name artiste';
                document.querySelector('#home-slider ul').append($elModel);
                if (document.querySelector('#home-slider ul li.model')) {
                    document.querySelector('#home-slider ul li.model').remove();
                }
            })
            document.querySelector('header').style.display = 'flex';
            document.querySelector('main').style.display = 'block';

            //load favs
            loadingData.loadFavs();
        }).catch(error => {
            console.log(error)
        });

    },

    /**
     * methode to load favorite music
     */
    loadFavs: function () {
        // let url = 'https://music.freefakeapi.io/api/favorites?';
        let url = 'https://music.freefakeapi.io/api/tracks?';

        this.startLoad(url).then(data => {
            let pathApi = 'https://music.freefakeapi.io';
            if (data.length && data.length > 1) {
                Object.entries(data).forEach(([key, value]) => {
                    //get model $element html
                    let $elModel = document.querySelector('#home-items ul li').cloneNode(true);
                    $elModel.classList.remove('model');

                    let imgSrc = pathApi + value.cover;
                    $elModel.querySelector('.title').textContent = value.title;
                    $elModel.querySelector('img').setAttribute('src', imgSrc);
                    $elModel.querySelector('img').onload = callBackImg;
                    $elModel.querySelector('a').setAttribute('href', 'player.html?idm=' + value.id);
                    $elModel.querySelector('.name').textContent = 'name artiste';
                    document.querySelector('#home-items ul').append($elModel);
                    if (document.querySelector('#home-items ul li.model')) {
                        document.querySelector('#home-items ul li.model').remove();
                    }

                })
                document.querySelector('#home-items .loading').style.display = 'none';

                document.querySelector('#home-items ul').style.display = 'block';
                console.log(data);
            } else {
                let $pEl = document.createElement('p');
                $pEl.classList.add('text-effect-a');
                $pEl.textContent = 'List vide';
                document.querySelector('#home-items h2').append($pEl);
                document.querySelector('#home-items .loading').style.display = 'none';
                // document.querySelector('#home-items').style.display = 'none' ;

            }

        }).catch(error => {
            console.log(error)
        });
    },

    /**
     * Methode to load track
     * @param idm {number}
     * @return {Promise}
     */
    loadTrack: function (idm) {
        let url = 'https://music.freefakeapi.io/api/tracks/' + idm;
        //cal api
        return new Promise((resolve, reject) => {
            this.startLoad(url).then(data => {
                if (data.artist) {
                    resolve(data)
                } else {
                    reject('Ooups !!! Une erreur est survenue.');
                }
            }).catch(error => {
                reject(error)
            });
        })

    },

    /**
     *
     * @param url {string}
     * @param params {null || string}
     * @return {Promise}
     */
    startLoad: function (url, params = null) {
        return new Promise((resolve, reject) => {

            //if no data
            if (!url) {
                reject('try to load url empty')
            }

            //if params empty set params ''
            if (!params) params = '';

            //fetch and try to get api data
            fetch(url + params, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    //if  response has code error
                    if (data.code === '403') {
                        alert('votre session à expiré');
                        localStorage.clear();
                        window.location.href = 'index.html'
                        reject(data.message);
                    }
                    //return data ;
                    resolve(data);
                }).catch(error => {
                console.log(error)
                reject('Une erreur de chargement est survenue. Merci de réessayer.');
            })
        })
    }

}

//logic for home page
if (/home.html/.test(window.location.href)) {
    //load lasts played
    loadingData.loadLasts();
    //add style snapped to li
    document.querySelector('#home-slider ul').addEventListener('scroll', function() {
        let childs =  this.querySelectorAll('li');
        for (let i = 0; i < childs.length; i++) {
            const item = childs[i];
            const itemLeft = item.getBoundingClientRect().x;
            const containerLeft = this.getBoundingClientRect().x;
            if ( Math.abs(containerLeft  - itemLeft) <= 80) {
                // Ajouter la classe 'snapped' à l'élément visible
                item.classList.add('snapped');
            } else {
                // Supprimer la classe 'snapped' des autres éléments
                item.classList.remove('snapped');
            }
        }
    });

}

//logic for player page
if (/player.html/.test(window.location.href)) {
    //show header
    document.querySelector('header').show('flex');

    //get variable get in url path
    let _get = [];
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        _get[key] = value;
    });

    //if no idm variable in url show message error ;
    if (_get['idm'].length === 0 || isNaN(_get['idm'])) {
        let $containerMsgError = document.querySelector('.msg-error');
        $containerMsgError.querySelector('p').textContent = 'aucune musique sélectionnée';
        $containerMsgError.show();
        $loaderMain.hide()
    }

    /**
     * Player Object
     * @type {{_init: playerContainer._init, lastCurrentTime: number, like: Function, $cover: {prototype: HTMLElement, new(): HTMLElement}, formatTime: (function(Number): string), setPlayer: playerContainer.setPlayer, $playerCmd: HTMLElement, isDragging: boolean, offsetX: NumberConstructor, random: Function, offsetY: NumberConstructor, $trackerTime: null, stop: Function, srcAudio: string, playPause: Function, touchX: NumberConstructor, $tracker: null, touchY: NumberConstructor, player: null}}
     */
    let playerContainer = {

        /**
         * Container Cover && info
         * @htmlElement
         */
        $cover: HTMLElement,

        /**
         * Commandes player
         * @type HTMLElement
         */
        $playerCmd: null,

        lastCurrentTime: 0,

        $tracker: null,

        $trackerTime: null,

        offsetX: Number,

        offsetY: Number,

        touchX: Number,

        touchY: Number,

        isDragging: false,

        /**
         * player audio
         */
        player: null,

        /**
         * source audio { string | null } url
         */
        srcAudio: null,

        /**
         * init player
         * @private
         */
        _init: function () {

            //bind $cover
            this.$cover = document.querySelector('.player figure img');

            this.$cover.onload = callBackImg;

            //bind $cmd
            this.$playerCmd = document.querySelector('footer.player-cmd');

            //add event  click on play btn
            this.$playerCmd.querySelector('.btn-play').addEventListener('click', () => {
                this.playPause();
            })

            //add event  click on stop btn
            this.$playerCmd.querySelector('.btn-stop').addEventListener('click', () => {
                this.stop();
            })

            //add event  click on random btn
            this.$playerCmd.querySelector('.btn-random').addEventListener('click', () => {
                this.random();
            })

            //add event click liked
            this.$playerCmd.querySelector('.btn-like').addEventListener('click', () => {
                this.like();
            })

            this.$tracker = this.$playerCmd.querySelector('.line');

            this.$trackerTime = this.$tracker.querySelector('.time');

            this.$trackerTime.addEventListener('touchstart', (e) => {

                //stop player
                if (this.player) {
                    this.player.pause();
                    this.$playerCmd.querySelector('.btn-play').classList.remove('pause');
                }

                let touch = e.touches[0];
                this.isDragging = true;
                this.offsetX = touch.clientX - this.$trackerTime.getBoundingClientRect().left;
                this.offsetY = touch.clientY - this.$trackerTime.getBoundingClientRect().top;
            });

            document.addEventListener('touchmove', (e) => {
                if (this.isDragging) {
                    let touch = e.touches[0];
                    this.touchX = touch.clientX;
                    this.touchY = touch.clientY;
                    let maxX = this.$tracker.getBoundingClientRect().width - this.$trackerTime.offsetWidth;
                    let posX = this.touchX - this.$tracker.getBoundingClientRect().left - this.offsetX;
                    posX = Math.max(0, Math.min(posX, maxX));
                    this.$trackerTime.style.left = posX + 'px';

                    let newTimePosition = (posX / maxX) * this.player.duration;

                    this.player.currentTime = newTimePosition;

                    this.$trackerTime.querySelector('span.visible').textContent = this.formatTime(newTimePosition);


                }
            });

            this.$trackerTime.addEventListener('touchend', () => {
                this.isDragging = false;

                //update and play music
                if (this.player) {
                    this.lastCurrentTime = this.player.currentTime;

                    this.player.play();
                    this.$playerCmd.querySelector('.btn-play').classList.add('pause');
                }
            });

            //load tracks
            loadingData.loadTrack(_get['idm']).then((data) => {
                let pathApi = 'https://music.freefakeapi.io';
                this.srcAudio = pathApi + data.file;
                this.$cover.src = pathApi + data.cover;
                document.querySelector('.player .title').textContent = data.title;
                document.querySelector('.player .licence a').setAttribute('href', data.license);
                document.querySelector('.player .name ').textContent = 'en attente';
                $loaderMain.hide();
                document.querySelector('.player article img').hide();
                document.querySelector('.player article .name').hide();
                document.querySelector('.main-player').show();
                //run player
                this.setPlayer();

                //get  info artiste

                fetch(pathApi + data.artist)
                    .then(response => response.json())
                    .then(data => {
                        document.querySelector('.player article img').setAttribute('src', pathApi + data.picture)
                        document.querySelector('.player article .name').textContent = data.name;
                        document.querySelector('.player article img').show().setOpacity(1);
                        document.querySelector('.player article .name').show().setOpacity(1);

                    }).catch(error => {
                    console.log('cannot get info artiste');
                    document.querySelector('.player article img').remove()
                    document.querySelector('.player .name ').remove();

                })

            })
                .catch(error => {
                    let $containerMsgError = document.querySelector('.msg-error');
                    $containerMsgError.querySelector('p').textContent = error;
                    $containerMsgError.show();
                    $loaderMain.hide()
                });

        },


        setPlayer: function () {
            if (this.srcAudio) {
                this.player = new Audio(this.srcAudio);
                this.player.load();

                //update duration
                this.player.addEventListener('loadedmetadata', () => {
                    // let minutes = Math.floor(this.player.duration / 60);
                    // let seconds = Math.floor(this.player.duration % 60);
                    // let formattedDuration = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                    document.querySelector('footer .duration').textContent = this.formatTime(this.player.duration);
                    this.$trackerTime.querySelector('span.visible').textContent = '0:00';
                    this.playPause();
                })

                this.player.addEventListener('timeupdate', () => {
                    if (this.isDragging) return false;
                    let currentTime = this.player.currentTime;
                    let newPosition = (currentTime / this.player.duration) * (this.$tracker.getBoundingClientRect().width - this.$trackerTime.offsetWidth);
                    this.$trackerTime.style.left = newPosition + 'px';
                    if (currentTime - this.lastCurrentTime > 1) {
                        this.lastCurrentTime = currentTime;

                        if (this.$trackerTime.querySelectorAll('span.prev:nth-of-type(1)').length > 0) {
                            // debugger;
                            this.$trackerTime.querySelector('span.prev:nth-of-type(1)').remove();
                        }

                        let $spanVisible = this.$trackerTime.querySelector('span.visible');

                        let $spanNext = this.$trackerTime.querySelector('span.next');

                        $spanVisible.classList.add('prev');
                        $spanVisible.classList.remove('visible');

                        $spanNext.classList.add('visible');
                        $spanNext.textContent = this.formatTime(this.player.currentTime);
                        $spanNext.classList.remove('next');

                        let spanNext = document.createElement('span');
                        spanNext.classList.add('next');

                        let NextTimeFormat = this.formatTime(this.player.currentTime + 0.001);

                        spanNext.textContent = NextTimeFormat;
                        this.$trackerTime.querySelector('.content').append(spanNext);

                    }


                });

                this.player.onplaying = () => {
                    this.$playerCmd.querySelector('.btn-play').classList.add('pause');
                }

                this.player.onpause = () => {
                    this.$playerCmd.querySelector('.btn-play').classList.remove('pause');
                }


            } else {
                console.log("can't play , srcAudio not valid : ", this.srcAudio);
            }
        },

        /**
         * Methode toggle Play && pause
         * @type {Function}
         */
        playPause: function () {

            if (this.player.paused) {
                document.querySelector('.player article').classList.add('playAnimation');
                this.player.play();
            } else {
                console.log('play header');
                this.player.pause();
                document.querySelector('.player article').classList.remove('playAnimation');

            }

            //when play or pause reset stop btn
            this.$playerCmd.querySelector('.btn-stop').classList.remove('stop');

        },

        /**
         * Methode stop Music
         * @type {Function}
         */
        stop: function () {

            this.player.pause();

            this.player.currentTime = 0.00;

            //wait updatecurrentTime
            setTimeout(() => {
                this.lastCurrentTime = 0;
            }, 1000)

            this.$trackerTime.querySelector('span.visible').textContent = '0:00';
            document.querySelector('.player article').classList.remove('playAnimation');


            //toggle stop btn
            this.$playerCmd.querySelector('.btn-stop').classList.toggle('stop');
            //when stop music reset btn play
            this.$playerCmd.querySelector('.btn-play').classList.remove('pause');


        }
        ,

        /**
         * Methode play random Music
         * @type {Function}
         */
        random: function () {
            this.$playerCmd.querySelector('.btn-random').classList.toggle('random');
        }
        ,

        /**
         * Methode like music
         * @type {Function}
         */
        like: function () {
            this.$playerCmd.querySelector('.btn-like').classList.toggle('liked');
        },

        /**
         *
         * @param time {Number}
         * @return {string}
         */
        formatTime: (time) => {
            let minutes = Math.floor(time / 60);
            let seconds = Math.floor(time % 60);
            return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }

    }

    //call player
    playerContainer._init();


}

/**
 * get btn submenu
 * @type {Element}
 */
let $subMenuBtn = document.querySelector('.dot');

/**
 * event on dot in navBar
 * @type {EventListener}
 */
$subMenuBtn.addEventListener('click', function (event) {

    let $el = event.currentTarget;

    //show modal content
    $el.querySelector('.submenu_modal').style.display = 'block';

    //click out to close modale
    $el.querySelector('.submenu_modal')
        .addEventListener('click', function (e) {
            if (!e.target.closest('.submenu , .list , .btn-prev')) {
                e.stopPropagation();
                e.preventDefault();
                $el.querySelector('.submenu_modal').style.display = 'none';
            }
        }, {once: true, capture: true});
})

/**
 * add event click to open categories modal or artist modal
 * @type {EventListener}
 */
$subMenuBtn.querySelectorAll('ul span')
    .forEach(($el) => {

        $el.addEventListener('click', function () {
            $subMenuBtn.querySelector('.submenu').style.display = 'none';
            $subMenuBtn.querySelector('.' + $el.dataset.role).style.display = 'block';
            $subMenuBtn.querySelector('.btn-prev').style.display = 'block';
        });
    });

/**
 * add event to btn-prev in model to go prev modal
 * @type {EventListener}
 */
$subMenuBtn.querySelector('.btn-prev')
    .addEventListener('click', function (e) {
        $subMenuBtn.querySelectorAll('.list').forEach(function ($el) {
            $el.style.display = "none";
        })
        $subMenuBtn.querySelector('.submenu').style.display = 'flex';
        e.currentTarget.style.display = 'none';
    })








