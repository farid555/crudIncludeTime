const errorMsgElm = document.querySelector('.msg');
const formElm = document.querySelector('form');
const tweetInputElm = document.querySelector('.tweet-tweet');
const filterElm = document.querySelector('#filter');
const ulGroupElm = document.querySelector('.list-group');
const errorMsg = document.querySelector('.error')

//tracking item
let tweets = [];

function init() {


    formElm.addEventListener('submit', function (e) {
        e.preventDefault();
        const { inputTweet, dateTime } = createInput();

        const id = tweets.length;

        const tweetItems = ({
            id: id,
            tweet: inputTweet,
            time: dateTime
        })

        tweets.push(tweetItems);

        validationAndTextCount(inputTweet);
        resetTweetInput();
        addItemToUI(id, inputTweet, dateTime);
        console.log(tweets);
        addItemLocalStroage(tweetItems);

    })





    filterElm.addEventListener('keyup', (e) => {

        const inputValueFiltet = e.target.value;
        //filter depend on the value
        const finalfilter = tweets.filter(eachTweet =>
            eachTweet.tweet.includes(inputValueFiltet)
        )

        showAllTweetToUI(finalfilter)

    })

    ulGroupElm.addEventListener('click', function (e) {

        if (e.target.classList.contains('delete-item')) {
            const id = getTweetId(e.target);

            //Delete Item from Ui & Araay tweets && localStorage...
            removeTweetFromUI(id);
            removeItemFromStore(id);
            removeTweetsFromLocalStorage(id);



        }
    })
    document.addEventListener('DOMContentLoaded', (e) => {
        if (localStorage.getItem('tweetSaveInLocalstorage')) {
            const tweets = JSON.parse(localStorage.getItem('tweetSaveInLocalstorage'));
            showAllTweetToUI(tweets);

        }
    })

}





function callTime() {
    let today = new Date();
    let date = `${today.getDate()}- ${today.getMonth() + 1}- ${today.getFullYear()}`;
    let time = `${today.getHours()} : ${today.getMinutes()}`;
    return dateTime = ` -${time} || ${date}`;
}
callTime();

function addItemLocalStroage(loacdata) {
    let tweetsArray
    if (localStorage.getItem('tweetSaveInLocalstorage')) {
        tweetsArray = JSON.parse(localStorage.getItem('tweetSaveInLocalstorage'));
        tweetsArray.push(loacdata);
        localStorage.setItem('tweetSaveInLocalstorage', JSON.stringify(tweetsArray))
    } else {
        tweetsArray = [];
        tweetsArray.push(loacdata)
        localStorage.setItem('tweetSaveInLocalstorage', JSON.stringify(tweetsArray))
    }


}



function createInput() {
    const inputTweet = tweetInputElm.value;
    tweetCount = inputTweet.length;
    return { inputTweet, dateTime };
}
console.log(dateTime);

function showAllTweetToUI(filteredTweet) {
    ulGroupElm.innerHTML = " ";

    filteredTweet.forEach((item) => {
        const liElm = `<li class="list-group-item item-${item.id} collection-item">
        ${item.tweet} <small class="time">${item.time}</small> <i class="fa fa-trash delete-item float-right"></i>
        <i class="fa fa-pencil-alt edit-item  float-right"></i>
      </li> `
        ulGroupElm.insertAdjacentHTML('afterbegin', liElm)
    })
}

// if id doesn't exist then it will create new array with existing tweet'
function updatAfterRemove(tweets, id) {
    return tweets.filter(tweet => tweet.id !== id);
}

function removeTweetsFromLocalStorage(id) {


    //const upadtedtweets = updatAfterRemove(id);
    //pick from lacalstroage
    const tweets = JSON.parse(localStorage.getItem('tweetSaveInLocalstorage'));
    //filter from
    const tweetsAfterRemove = updatAfterRemove(tweets, id);
    //save data to localstroage
    localStorage.setItem('tweetSaveInLocalstorage', JSON.stringify(tweetsAfterRemove))

}


function removeTweetFromUI(id) {
    document.querySelector(`.item-${id}`).remove();
}

function removeItemFromStore(id) {
    const productAfterDelete = updatAfterRemove(tweets, id)
    tweets = productAfterDelete;
}


function getTweetId(elm) {

    const liElm = elm.parentElement;
    return Number(liElm.classList[1].split('-')[1]);
}

function addItemToUI(id, tweet, time) {
    const liElm = `<li class="list-group-item item-${id} collection-item">
    ${tweet} <small class="time"><emx>${time}</em></small> <i class="fa fa-trash delete-item float-right"></i>
    <i class="fa fa-pencil-alt edit-item  float-right"></i>
  </li> `
    ulGroupElm.insertAdjacentHTML('afterbegin', liElm)
}



function resetTweetInput() {
    tweetInputElm.value = '';
}

function validationAndTextCount(textMsg) {

    let inpuLength = textMsg.length;
    let totalTweet = 14;
    yourTweet = totalTweet - inpuLength;

    if (textMsg === '' || textMsg.length < 5) {
        const inputError = ` <p class="errorMsg">Please write the post and it must be more then five words... </p>`
        errorMsg.insertAdjacentHTML('afterbegin', inputError)

        setTimeout(function () {
            errorMsg.textContent = "";
        }, 4000);

    }

    if (textMsg.length > totalTweet) {

        const inputError = ` <p class="errorMsg">Your limit is ${totalTweet} but you crosse the limit which is ${Math.abs(inpuLength)} </p>`
        errorMsg.insertAdjacentHTML('afterbegin', inputError)

        setTimeout(function () {
            errorMsg.textContent = "";
        }, 4000);
    }
}


init();

setInterval(callTime, 1000);

