'use strict';
/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/**
 *@description main function
 */
$(document).ready(function () {
     var cards = [
    "fa-diamond","fa-diamond",
    "fa-paper-plane-o","fa-paper-plane-o",
    "fa-anchor","fa-anchor",
    "fa-bolt","fa-bolt",
    "fa-cube","fa-cube",
    "fa-leaf","fa-leaf",
    "fa-bicycle","fa-bicycle",
    "fa-bomb","fa-bomb"
];
cards=shuffle(cards);
var card=$('.card');
addCard(card,cards);
play(card);
restart('.restart');
});

/*重载游戏
*@param classname
*/
function restart(classname){
    $(classname).bind("click",function(){
        window.location.reload();
    })
}
/*给在HTML定义的每张牌名字
 *@param card
 *@param cards
 */
function addCard(card,cards){
    card.each(function(i){
        $(this).find('.fa').addClass(cards[i]);
    });
}

/*呈现点击的牌
*@param card
*@param index
*/
function displaySymbol(card,index){
    card[index].className+=' open show';
}

/*如果两张牌匹配，改变牌的状态并且取消click事件
*@param card
*@param openCard
*/
function lockCard(card,openCard){
    var matchCard=[];
    $.each(openCard,function(i,data){
        card[data].className='card match animated bounce';
        matchCard.push(data);
    })
    $.each(card,function (index){
        for(var j=0;j<matchCard.length;j++){
            if (index===matchCard[j]) {
                var cancle=card[index];
                $(cancle).unbind("click");
            }
        }
    })
}

/*当两张牌不匹配时，呈现错误的动画状态并且更新牌的状态
*@param card
*@param openCard
*/
function removeCard(card,openCard){
    $.each(openCard,function(i,data){
        card[data].className='card notm animated wobble';
        (function(n){
            function f() {
                n.className='card';
            }
            setTimeout(f,1500);
    })(card[data])
   })
}

/*检查翻开的牌是否匹配
*@param card
*@param openCard
*@param matchLength
*@param clearId
*/
function checkCardMatch(card,openCard,matchLength,counter,starNum,clearId,myDate){
    var card1=card[openCard[0]].children[0].className;
    var card2=card[openCard[1]].children[0].className;
    var second;
    if(card1===card2){
        lockCard(card,openCard);
        matchLength.push(openCard[0]);
        matchLength.push(openCard[1]);
    }else{
            removeCard(card,openCard);
        }
    if (matchLength.length===16) {
        second=seconds(myDate);
        displayMessage(counter,starNum,second);
        clearTimeout(clearId);
    }

}
/**
 *当玩家赢了的时候出现的信息
 *@param counter
 *@param startnum
 *@param second
 */
function displayMessage(counter,starNum,second){
    $('.container').remove();
    var html=$('<div class="result"></div>');
    var info1=$('<p class="result-won">Congratulations! You won!</p>');
    var info2=$('<p class="re-moves">With&nbsp;'+counter+'&nbsp;Moves&nbsp;&nbsp;,&nbsp;&nbsp;'+second+'&nbsp;seconds&nbsp;&nbsp;and&nbsp;&nbsp;'+starNum+'&nbsp;Stars. </p>');
    var button=$('<p class="result-button">Play again</p>');
    html.append(info1,info2,button);
    $(document.body).append(html);
    restart('.result-button');
}

/**
 *显示玩家点击牌的次数
 *@param counter
 */
function displayNum(counter){
    $('.moves').text("").append(counter);
}

/**
 *显示玩家获得星星的数量
 *@param counter
 *@returns {jQuery}
 */
function displayStar(counter){
    if (counter>12&&counter<=16) {
        $('.stars>li:eq(2)').remove();
    }else if(counter>16){
        $('.Stars>li:eq(1)').remove();
    }
    var startnum=$('.stars>li').length;
    return startnum;
}

/**
 *@description play function
 *@param card
 */
function play(card){
    //opened card, the length is 2
    var openCard=[];
    //all the matched card, length will increase
    var matchLength=[];
    //counter the pace
    var counter=0;
    var starNum,clearId,myDate;
    var time=true;
    card.bind("click",function(){
        if(time){
            var newDate= new Date();
            myDate=newDate.getTime();
            clearId=timer(0);
            time=false;
        }
        var n=card.index(this);
        openCard.push(n);
        if (openCard[0]!=openCard[1]) {
            displaySymbol(card,n);
        }else {
            openCard.pop();
        }
        if (openCard.length===2) {
            counter +=1;
            displayNum(counter);
            starNum=displayStar(counter);
            checkCardMatch(card,openCard,matchLength,counter,starNum,clearId,myDate);
            openCard.splice(0,openCard.length);
        }
    })
}

/**
 *计算时间
 *@param bsDate
 *@returns {number}
 */
function seconds(bsDate){
    var data=new Date();
    var second=Math.floor((data.getTime()-bsDate)/1000);
    return second;
}

/**
 *@description setInterval function
 *@param func
 *@param wait
 *@returns {number|*}
 */
function interval(func,wait){
    var id;
    var interv=function(){
        func.call(null);
        id=setTimeout(interv,wait);
    };
    id=setTimeout(interv,wait);
    return id;
}

/**
 *@description timer
 *@param i
 *@returns {number|*}
 */
function timer(i){
    var id=interval(function(){
        i++;
        $('.time span').text("").append(i);
    },1000);
    return id;
}


