var p = document.getElementById("myPlayer");
var nowSection = -1;
var len = 0;
var jsonData = null;
var posAry = [];
var defaultPos = 0;
//init
$(function() {
    $.ajax({
        type : 'GET',
        dataType : 'json',
        url: 'document.json',
        success : function(data) {
            jsonData = data.list;
            len = jsonData.length;
            $.each(data.list, function(index, obj){
                $("#article").append('<section class="outfocus" id="section_' + index + '" onclick="setPlaySec(' + obj.startSec + ')"><h4>' + obj.content + '</h4><h6>(start from:' + obj.startSec + 'sec)</h6></section>');
                defaultPos = $("#article").position().top;
                posAry[index] = $("#section_"+index).position().top;
            });
        } 
    });
    //監聽時間軸有變動時的事件
    p.ontimeupdate = function (e) {
        getPlaySec(this.currentTime);
    };
    //監聽video播完時的事件
    p.addEventListener('ended',myHandler,false);
});
function myHandler(e) {
    funOutfocus();
}
//設定播放速度
function setPlaySpeed(i) {
    p.playbackRate = i;
}
function setPlaySec(sec) {
    p.currentTime = sec;
    if (p.paused) {
        p.pause();
    } else {
        p.play();
    }
}
function getPlaySec(sec) {
    for (var i = 0 ; i < len ; i++) {
        if (i != len-1) {
            if (i == 0 && sec < jsonData[i].startSec) {
                changeSection(-1);
            } else if (sec >= jsonData[i].startSec && sec < jsonData[i+1].startSec) {
                if (i != nowSection) {
                    changeSection(i);
                }
            }
        } else {
            if (sec >= jsonData[i].startSec) {
                if (i != nowSection) {
                    changeSection(i);
                }
            }
        }
    }
}
function changeSection(index) {
    nowSection = index;
    funOutfocus();
    funOnfocus(index);
}
function funOutfocus() {
    $("section").removeClass("onfocus").addClass("outfocus");
}
function funOnfocus(index) {
    if (index != -1) {
        $("#section_"+index).removeClass("outfocus").addClass("onfocus");
        $("#article").animate({
            scrollTop: posAry[index]-defaultPos //$("#section_"+index).offset().top
        },600);
    } else {
        $("#article").animate({
            scrollTop: 0
        },600);
    }
}