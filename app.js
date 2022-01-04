const errorMsgElm = document.querySelector('.msg');
const formElm = document.querySelector('form');
const tweetInputElm = document.querySelector('.tweet-tweet');
const filterElm = document.querySelector('#filter');
const ulGroupElm = document.querySelector('.list-group');
const errorMsg = document.querySelector('.error')
const tweetUpdateButton = document.querySelector('.add-product');


//tracking tweet
let tweets = [];


function init() {

    let updateedTweetId;

    formElm.addEventListener('submit', function (e) {
        e.preventDefault();
        const inputTweet = createInput();

        const id = tweets.length;

        const getTime = callTime();

        const tweetItems = ({
            id: id,
            tweet: inputTweet,
            time: getTime
        })

        tweets.push(tweetItems);



        const isError = validationAndTextCount(inputTweet, getTime);
        if (!isError) {
            //add item to the UI
            addItemToUI(id, inputTweet, getTime);
            addItemLocalStroage(tweetItems);

        }
        resetTweetInput();
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

        } else if (e.target.classList.contains('edit-item')) {

            updateedTweetId = getTweetId(e.target);
            console.log(updateedTweetId);
            const foundTweet = tweets.find((tweet) => tweet.id === updateedTweetId);

            console.log('foundTweet from find', foundTweet);

            populateUIInEditState(foundTweet);

            if (!document.querySelector('.update-tweet')) {
                showUpdateButton()
            }


            //pick the tweet iD i want to edit...
            //find the tweet in the
            //populate the tweet data to UI
            //add the updating Button...


        }
    })


    document.addEventListener('DOMContentLoaded', (e) => {
        if (localStorage.getItem('tweetSaveInLocalstorage')) {
            tweets = JSON.parse(localStorage.getItem('tweetSaveInLocalstorage'));
            showAllTweetToUI(tweets);

            //change to gloabal tweetsArray




        }
    })

    formElm.addEventListener('click', (e) => {
        if (e.target.classList.contains('update-tweet')) {
            //Pick the data from the field

            const inputTweet = createInput();
            validationAndTextCount(inputTweet);
            resetTweetInput();
            //updating data (from user)
            const lastupdateTime = callTime();
            tweets = tweets.map(tweet => {


                if (tweet.id === updateedTweetId) {
                    //tweet should be updated

                    return {
                        id: tweet.id,
                        tweet: inputTweet,
                        time: lastupdateTime
                    }
                } else {
                    return tweet;
                }
            })


            tweetUpdateButton.style.display = 'block';
            // new array from map
            //updating data should be updated to data Array store
            //update data should be update to UI
            //tweets = updatedtweetsArray;
            showAllTweetToUI(tweets);


            // updating data from localStroage 
            //show submit button
            //hide update button... 

            document.querySelector('.update-tweet').remove();
            const tweetFormate = {
                id: updateedTweetId,
                tweet: inputTweet,
                time: lastupdateTime
            }
            updateEditTweetsToLocalStroage(tweetFormate);
            console.log(tweetFormate);
        }
    })
}


//////////////////////////////////////////////////////////
//UpdatedTweet add localStorage
//////////////////////////////////////////////////////////

function updateEditTweetsToLocalStroage(updatedTweet) {
    //////////////////////////////////////////////////////////////////////////////
    // if (localStorage.getItem('tweetSaveInLocalstorage')) {
    //     localStorage.setItem('tweetSaveInLocalstorage', JSON.stringify(tweets))
    // }
    ///////////////////or//////////////////////////////////////////////////////////////////////////////////////

    console.log(updatedTweet); // i can received ... {id: 0, tweet: 'helloZaman', time: ' 4:49 3/1/2022'}
    if (localStorage.getItem('tweetSaveInLocalstorage')) {
        const tweets = JSON.parse(localStorage.getItem('tweetSaveInLocalstorage'))

        const newTweetArray = tweets.map(tweet => {
            if (tweet.id === updatedTweet.id) {
                //tweet should be updated
                return {
                    id: updatedTweet.id,
                    tweet: updatedTweet.tweet,
                    time: updatedTweet.time
                }

            } else {
                return tweet;
            }
        })

        localStorage.setItem('tweetSaveInLocalstorage', JSON.stringify(newTweetArray))
    }



}

function showUpdateButton() {
    const elm = `<button type="button" class="btn mt-3 btn-small btn-secondary update-tweet">Update</button>`
    //hide the submit button
    tweetUpdateButton.style.display = 'none';
    formElm.insertAdjacentHTML('beforeend', elm);
}

function populateUIInEditState(fromfoundTweet) {
    console.log('populateUIInEditState', fromfoundTweet);
    tweetInputElm.value = fromfoundTweet.tweet;


}


function callTime() {
    let today = new Date();
    let date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    let time = `${today.getHours()}:${today.getMinutes()}`;
    return dateTime = ` ${time} ${date}`;
}

//////////////////////////////////////////////////////////
//Localstroage
//////////////////////////////////////////////////////////


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
    // tweetCount = inputTweet.length;
    return inputTweet;
}

//////////////////////////////////////////////////////////
//filter
//////////////////////////////////////////////////////////

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
    console.log(liElm);
    return Number(liElm.classList[1].split('-')[1]);

}



function addItemToUI(id, tweet, time) {
    //const tweetNumber = id + 1; ${tweetNumber}.
    const liElm = `<li class="list-group-item item-${id} collection-item">
     ${tweet} <small class="time"><emx>${time}</em></small> <i class="fa fa-trash delete-item float-right"></i>
    <i class="fa fa-pencil-alt edit-item  float-right"></i>
  </li> `
    ulGroupElm.insertAdjacentHTML('afterbegin', liElm)
}

function showMessage(msg) {
    const msgElmErrorOne = document.querySelector('.err-msg')
    const inputError = ` <div class="alert  alert-danger err-msg">${msg}</div>`
    if (!msgElmErrorOne) {
        errorMsg.insertAdjacentHTML('afterbegin', inputError)
    }


}

function resetTweetInput() {
    tweetInputElm.value = '';
}


//////////////////////////////////////////////////////////
//input Validation 
//////////////////////////////////////////////////////////

function validationAndTextCount(textMsg) {

    let isError = false;
    let inpuLength = textMsg.length;
    let totalTweet = 14;
    yourTweet = totalTweet - inpuLength;

    if (textMsg === '' || textMsg.length < 5) {
        isError = true;
        showMessage('Please tweet your post, atleast five words... ');
        setTimeout(function () {
            errorMsg.textContent = "";
        }, 3000);

    }

    if (textMsg.length > totalTweet) {
        isError = true;
        const msgElmErrorTwo = document.querySelector('.err-msgtwo')
        const inputError = ` <div class="alert  alert-danger err-msgtwo">Your limit is ${Math.abs(totalTweet)} words, You tweet ${inpuLength} words...</div>`
        if (!msgElmErrorTwo) {
            errorMsg.insertAdjacentHTML('afterbegin', inputError)
        }
        setTimeout(function () {
            errorMsg.textContent = "";
        }, 3000);
    }
    return isError;
}


init();

setInterval(callTime, 1000);

