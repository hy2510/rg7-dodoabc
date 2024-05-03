﻿//페이지 작동 정보 변수
let isWorking = false; // 페이지가 작동하고 있는지
let isClick = false; // 무언가 클릭했는지
let isSoundPlaying = false; // 사운드가 플레이되고 있는지
let isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
//학습에 대한 변수
let quizData; // 퀴즈 정보 담아두는 변수.
let studyInfo;
let bookInfo;
let studyMode = "";
let firstStep = "";
let studyId = "";
let studentId = "";
let studentHistoryId = "";
let userType = ""; // 1: student, 2: review, 3: staff, 4: guest
let customerType = "";
let customerId = "";
let customerLanguage = "";
let classId = "";
let schoolUseYn = "N";
let privateUseYn = "N";
let isStudyCompleted = false;
let url = "";
let running_type = "";
let step = "";
let quizType = "A";
let selectedLanguage = "Kor";
let moveSeconds = 500;
let isReplay = false; // 학습에서 Movie로 넘어온 경우 true;
let statusCode = "";
let gvLanguage = "KOR" // 임시 언어설정.
let video = $("#introVideo")[0]; // 메뉴버튼 토글시 비디오 정지를 위해 필요
let isToggleMenu = false; // 메뉴버튼 토글 제어 flag
let soundDuration = 0;

const delaysec = 700;
const sndGoodJob = "https://wcfresource.a1edu.com/newsystem/sound/soundeffect/goodjob.mp3";
const sndLevelUp = "https://wcfresource.a1edu.com/newsystem/sound/soundeffect/levelup.mp3";
const sndSuccess = "https://wcfresource.a1edu.com/newsystem/sound/soundeffect/success01.mp3";
// 메뉴 토글소리. 교체예정
const sndWheekk = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/effect/wheeek.mp3";
const sndPoint = "0.5";
const gStudyId = $.session.get('stdid');
const gStudentHistoryId = $.session.get('sthid');

// 뒤로가기 방지
history.pushState(null, null, location.href);

window.onpopstate = function () {
    history.go(1);
    //this.handleGoback();
};

window.history.forward(0);
// 앞으로가기 방지
document.oncontextmenu = function () { return false; };

// sql 데이터 로딩 [
const loadQuizData = async (pStep, pQuizType, fnOnSucc) => {
    console.log(`loadQuizData(step:${step}, quizType:${quizType})`);
    let fUrl = "https://appdev.readinggate.com:8443/v7/DodoABC/Api.jsp?ver=6.3";
    fUrl = fUrl + "&cmd=LoadQuizData";
    fUrl = fUrl + "&StudyId=" + gStudyId;
    fUrl = fUrl + "&StudentHistoryId=" + gStudentHistoryId;
    fUrl = fUrl + "&Step=" + pStep;
    fUrl = fUrl + "&QuizType=" + pQuizType;
    fUrl = fUrl + "&SData=gjUXmfgoqO1SvzGDvR7B8yqhDjqXxEFhuqAgy6AAeNCIwJF8ZxXm2BujMxWDX1P1vZBWpZgfLqifc/GDQq56CwJKbCZayCGk/scfowO3UF3WiqHRX1pQY0TgS9JQbSOsaP+QZAkzczExyytZSmkuVqaYaEk7dnWeaMfZv40a6ti3CRPhZUOCCpWurafwCkkhwDLCoo5z0qWppdX92DUHToBEulJXOgVq1fhvNlwt6uEQZsE3pN+oHd3c7WNQ/1XrJttkcbWTAwoKWDy/uls9rT6tWYVx4s8ZgpHY7RoPuI4m22RxtZMDCrhqFBrM6VEpRyNz0mxscAjRMiQvKUvGQPmRScNHGlCOhqVbTOQTzP37qUvgiyhZXGBDnBKPOqwRXQE4AQATiAn66DLogRuBmOJhCtbsIWBq";
    
    await fetch(fUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.result.result_cd == 0) {
                //console.log(`data : ${JSON.stringify(data)}`);
                //fnOnSucc(data.data[0]);
                fnOnSucc(data.data);
            } else {
                swal({ text: "loadQuizData 학습 정보 오류" }).then(function () {
                    doLogout();
                });
            }
        });
};

const getMovieData = async (fnOnSucc) => {
    console.log(`getMovieData()`);
    let fUrl = "https://appdev.readinggate.com:8443/v7/DodoABC/Api.jsp?ver=6.3";
    fUrl = fUrl + "&cmd=GetMovieInfo";
    fUrl = fUrl + "&StudyId=" + gStudyId;
    fUrl = fUrl + "&StudentHistoryId=" + gStudentHistoryId;
    fUrl = fUrl + "&SData=gjUXmfgoqO1SvzGDvR7B8yqhDjqXxEFhuqAgy6AAeNCIwJF8ZxXm2BujMxWDX1P1vZBWpZgfLqifc/GDQq56CwJKbCZayCGk/scfowO3UF3WiqHRX1pQY0TgS9JQbSOsaP+QZAkzczExyytZSmkuVqaYaEk7dnWeaMfZv40a6ti3CRPhZUOCCpWurafwCkkhwDLCoo5z0qWppdX92DUHToBEulJXOgVq1fhvNlwt6uEQZsE3pN+oHd3c7WNQ/1XrJttkcbWTAwoKWDy/uls9rT6tWYVx4s8ZgpHY7RoPuI4m22RxtZMDCrhqFBrM6VEpRyNz0mxscAjRMiQvKUvGQPmRScNHGlCOhqVbTOQTzP37qUvgiyhZXGBDnBKPOqwRXQE4AQATiAn66DLogRuBmOJhCtbsIWBq";
    await fetch(fUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.result.result_cd == 0) {
                fnOnSucc(data.data[0]);
            } else {
                swal({ text: "학습 정보 오류" }).then(function () {
                    doLogout();
                });
            }
        });
};

const getStudyInfo = async (fnOnSucc) => {
    let fUrl = "https://appdev.readinggate.com:8443/v7/DodoABC/Api.jsp?ver=6.3;"
    fUrl = fUrl + "&cmd=GetStudyInfo";
    fUrl = fUrl + "&StudyId=" + gStudyId;
    fUrl = fUrl + "&StudentHistoryId=" + gStudentHistoryId;
    fUrl = fUrl + "&SData=gjUXmfgoqO1SvzGDvR7B8yqhDjqXxEFhuqAgy6AAeNCIwJF8ZxXm2BujMxWDX1P1vZBWpZgfLqifc/GDQq56CwJKbCZayCGk/scfowO3UF3WiqHRX1pQY0TgS9JQbSOsaP+QZAkzczExyytZSmkuVqaYaEk7dnWeaMfZv40a6ti3CRPhZUOCCpWurafwCkkhwDLCoo5z0qWppdX92DUHToBEulJXOgVq1fhvNlwt6uEQZsE3pN+oHd3c7WNQ/1XrJttkcbWTAwoKWDy/uls9rT6tWYVx4s8ZgpHY7RoPuI4m22RxtZMDCrhqFBrM6VEpRyNz0mxscAjRMiQvKUvGQPmRScNHGlCOhqVbTOQTzP37qUvgiyhZXGBDnBKPOqwRXQE4AQATiAn66DLogRuBmOJhCtbsIWBq";
    await fetch(fUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.result.result_cd == 0) {
                fnOnSucc(data.data[0]);
            } else {
                swal({ text: "학습 정보 오류" }).then(function () {
                    doLogout();
                });
            }
        });

    //await fetch("https://appdev.readinggate.com:8443/v7/DodoABC/Api.jsp", {
    //    method: "POST",
    //    headers: {
    //        "Content-Type": "application/json",
    //    },
    //    body: JSON.stringify({
    //        ver: "6.3",
    //        cmd: "GetStudyInfo",
    //        StudyId: gStudyId,
    //        StudentHistoryId: gStudentHistoryId,
    //        SData: "gjUXmfgoqO1SvzGDvR7B8yqhDjqXxEFhuqAgy6AAeNCIwJF8ZxXm2BujMxWDX1P1vZBWpZgfLqifc/GDQq56CwJKbCZayCGk/scfowO3UF3WiqHRX1pQY0TgS9JQbSOsaP+QZAkzczExyytZSmkuVqaYaEk7dnWeaMfZv40a6ti3CRPhZUOCCpWurafwCkkhwDLCoo5z0qWppdX92DUHToBEulJXOgVq1fhvNlwt6uEQZsE3pN+oHd3c7WNQ/1XrJttkcbWTAwoKWDy/uls9rT6tWYVx4s8ZgpHY7RoPuI4m22RxtZMDCrhqFBrM6VEpRyNz0mxscAjRMiQvKUvGQPmRScNHGlCOhqVbTOQTzP37qUvgiyhZXGBDnBKPOqwRXQE4AQATiAn66DLogRuBmOJhCtbsIWBq",
    //    }),
    //}).then((response) => console.log(response));
};

// Dodo ABC: 다음 과제 부여(게임에서 사용)
const getNextRoundDodoABC = async (fnOnSucc, fnOnFail) => {
    let fUrl = "https://appdev.readinggate.com:8443/v7/DodoABC/Api.jsp?ver=6.3";
    fUrl = fUrl + "&cmd=GetNextRoundDodoABC";
    fUrl = fUrl + "&StudyId=" + gStudyId;
    fUrl = fUrl + "&StudentHistoryId=" + gStudentHistoryId;
    fUrl = fUrl + "&SData=gjUXmfgoqO1SvzGDvR7B8yqhDjqXxEFhuqAgy6AAeNCIwJF8ZxXm2BujMxWDX1P1vZBWpZgfLqifc/GDQq56CwJKbCZayCGk/scfowO3UF3WiqHRX1pQY0TgS9JQbSOsaP+QZAkzczExyytZSmkuVqaYaEk7dnWeaMfZv40a6ti3CRPhZUOCCpWurafwCkkhwDLCoo5z0qWppdX92DUHToBEulJXOgVq1fhvNlwt6uEQZsE3pN+oHd3c7WNQ/1XrJttkcbWTAwoKWDy/uls9rT6tWYVx4s8ZgpHY7RoPuI4m22RxtZMDCrhqFBrM6VEpRyNz0mxscAjRMiQvKUvGQPmRScNHGlCOhqVbTOQTzP37qUvgiyhZXGBDnBKPOqwRXQE4AQATiAn66DLogRuBmOJhCtbsIWBq";

    await fetch(fUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.result.result_cd == 0) {
                fnOnSucc(data.data[0]);
            } else {
                fnOnFail();
                //swal({ text: "학습 정보 오류" }).then(function () {
                //    doLogout();
                //});
            }
        });
}

// Dodo ABC: 게임 문제 조회
const getDoDoAbcGameExample = async (fnOnSucc) => {
    console.log(`getDoDoAbcGameExample()`);
    let fUrl = "https://appdev.readinggate.com:8443/v7/DodoABC/Api.jsp?ver=6.3";
    fUrl = fUrl + "&cmd=GetDoDoAbcGameExample";
    fUrl = fUrl + "&StudyId=" + gStudyId;
    fUrl = fUrl + "&StudentHistoryId=" + gStudentHistoryId;
    fUrl = fUrl + "&SData=gjUXmfgoqO1SvzGDvR7B8yqhDjqXxEFhuqAgy6AAeNCIwJF8ZxXm2BujMxWDX1P1vZBWpZgfLqifc/GDQq56CwJKbCZayCGk/scfowO3UF3WiqHRX1pQY0TgS9JQbSOsaP+QZAkzczExyytZSmkuVqaYaEk7dnWeaMfZv40a6ti3CRPhZUOCCpWurafwCkkhwDLCoo5z0qWppdX92DUHToBEulJXOgVq1fhvNlwt6uEQZsE3pN+oHd3c7WNQ/1XrJttkcbWTAwoKWDy/uls9rT6tWYVx4s8ZgpHY7RoPuI4m22RxtZMDCrhqFBrM6VEpRyNz0mxscAjRMiQvKUvGQPmRScNHGlCOhqVbTOQTzP37qUvgiyhZXGBDnBKPOqwRXQE4AQATiAn66DLogRuBmOJhCtbsIWBq";
    //console.log(fUrl);
    await fetch(fUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.result.result_cd == 0) {
                fnOnSucc(data.data);
            } else {
                swal({ text: "학습 정보 오류" }).then(function () {
                    doLogout();
                });
            }
        });
};

// 넥스트 버튼 누른 경우 Step저장
const saveStatus = async (fnOnSucc) => {
    if (step >= 1 && step <= 5 && $.session.get('user') == 'STUDENT') {
        const jsonStr = {
            step: step,
            study_end_yn: 'N',
            isMobile: isMobile ? 'Y' : 'N',
        }

        statusCode = "02500" + (step);

        if (currentLand == 'game' || currentLand == 'songandchant' || statusCode == '025005') {
            jsonStr.study_end_yn = 'Y'
            statusCode = "025008";
        } else {
            statusCode = "02500" + (step + 1);
        }

        let fUrl = "https://appdev.readinggate.com:8443/v7/DodoABC/Api.jsp?ver=6.3";
        fUrl = fUrl + "&cmd=SaveTestResultNew";
        fUrl = fUrl + "&StudyId=" + gStudyId;
        fUrl = fUrl + "&StudentHistoryId=" + gStudentHistoryId;
        fUrl = fUrl + "&Step=" + step;
        fUrl = fUrl + "&StudyEndYn=" + jsonStr.study_end_yn;
        fUrl = fUrl + "&Dvc=" + getAgentSystem();
        fUrl = fUrl + "&SData=gjUXmfgoqO1SvzGDvR7B8yqhDjqXxEFhuqAgy6AAeNCIwJF8ZxXm2BujMxWDX1P1vZBWpZgfLqifc/GDQq56CwJKbCZayCGk/scfowO3UF3WiqHRX1pQY0TgS9JQbSOsaP+QZAkzczExyytZSmkuVqaYaEk7dnWeaMfZv40a6ti3CRPhZUOCCpWurafwCkkhwDLCoo5z0qWppdX92DUHToBEulJXOgVq1fhvNlwt6uEQZsE3pN+oHd3c7WNQ/1XrJttkcbWTAwoKWDy/uls9rT6tWYVx4s8ZgpHY7RoPuI4m22RxtZMDCrhqFBrM6VEpRyNz0mxscAjRMiQvKUvGQPmRScNHGlCOhqVbTOQTzP37qUvgiyhZXGBDnBKPOqwRXQE4AQATiAn66DLogRuBmOJhCtbsIWBq";
        await fetch(fUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data.result.result_cd == 0) {
                    if (saveStatus == null) {
                        stepSaveEbDoDoAbcOnSucc(data.data[0].ErrorNo, data.data[0].ErrorMessage);
                    } else {
                        fnOnSucc(data.data[0].ErrorMessage);
                    }
                } else {
                    swal({ text: "학습 정보 오류" }).then(function () {
                        doLogout();
                    });
                }
            });
    } else {
        if (currentActivity == "Movie") {
            nextActivity("025001");
        } else {
            if (step != 5) {
                nextActivity("02500" + (step + 1));
            } else {
                nextActivity("025008");
            }
        }
    }
};

const stepSaveEbDoDoAbcOnSucc = async (pErrNo, pErrMsg) => {
    if (parseInt(pErrNo) == 0 && pErrMsg != "") {
        popReward(pErrNo, pErrMsg);
    } else {
        nextActivity(statusCode);
    }
};

const goRoot = () => {
    console.log('todo : goRoot');
    // todo
}

// 로그아웃
const doLogout = () => {
    console.log('todo : doLogout');
    // todo
};

// 데이터 로드를 잘 했는지 체크 [
const checkGetDataSuccess = () => {
    if (
        quizData.QuizType == undefined ||
        quizData.QuizType == null ||
        quizData.QuizType == ""
    ) {
        throw "Failed to get data";
    }
};
// ] 데이터 로드를 잘 했는지 체크 end

// 학습 타입 체크 [
const checkStudyType = () => {
    if (
        quizData.QuizType.indexOf("AP") < 0 &&
        quizData.QuizType.indexOf("PH") < 0 &&
        quizData.QuizType.indexOf("SW") < 0
    ) {
        throw "Type mismatched";
    }
};
// ] 학습 타입 체크 end

const shuffle = (arr) => {
    let j, x, i;

    for (i = arr.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
    }

    return arr;
};

$(document).ready(() => {
    $("img").on("draggstart", () => {
        return false;
    });

    checkIE();
});

// Sound 관련 [
var _snd;

var Sound = function (pObj, pFunStartPlay, pFunEndPlay) {
    this.isplay = false;
    this.infinity = false;

    try {
        if (pObj != undefined) {
            this.audAtt = pObj;
            this.StartFun = pFunStartPlay;
            this.EndFun = pFunStartPlay;
            this.repeat = audAtt.repeat;

            this.audio = new Audio(audAtt.src);

            if (repeat < 0) {
                alert("repeat must be bigger than 0");

                return undefined;
            }
            else if (this.repeat == 0) {
                this.infinity = true;
            }

            this.Play = function () {
                audio.addEventListener("ended", function () {
                    repeat -= 1;

                    if (repeat > 0 || infinity) {
                        audio.play();
                    } else {
                        // Stop Sound
                        isplay = false;
                        if (pFunEndPlay != undefined) {
                            pFunEndPlay();
                        }
                    }
                });

                audio.addEventListener("timeupdate", function () {
                    soundDuration = Math.ceil(audio.duration * 1000);

                    if (isplay == false) {
                        // Play Sound
                        isplay = true;

                        if (pFunStartPlay != undefined) {
                            pFunStartPlay();
                        }
                    }
                });

                audio.volume = 1;
                audio.load();
                audio.play();
            };

            this.Stop = function () {
                audio.setAttribute("src", "");
                audio.addEventListener("timeupdate", null);
                audio.pause();
                if (audio.duration) {
                    audio.currentTime = 0;
                }

                isplay = false;
            };

            this.Pause = function () {
                alert("Pause");
            };
        }
    } catch (e) {
        alert(e);
    }

    return this;
};

const playSound = (pSrc, pEndFun) => {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound(
        {
            src: pSrc,
            repeat: 1,
        },
        undefined,
        pEndFun
    );

    _snd.Play();
};

const showSpeaker = () => {
    $(".js-speaker").removeClass("d-none");
}

const playEffect1 = (pSrc) => {
    let audio = $("#effect1");
    audio.attr("src", pSrc);
    //audio[0].pause();
    //audio[0].load();
    audio[0].play();
};

const playEffect2 = (pSrc2) => {
    let audio2 = $("#effect2");
    audio2.attr("src", pSrc2);
    audio2[0].play();
};

const stopEffect = () => {
    let audio = $("#effect1");
    audio[0].pause();
};

const playBGM = (pSrc) => {
    let audio = $("#bgm");
    audio.attr("src", pSrc);
    audio[0].pause();
    audio[0].volume = 1;
    audio[0].play();

    if (currentLand == "sightwords") {
        audio[0].volume = 0.7;
    }
};

const bgmVolume = (pVol) => {
    let audio = $("#bgm");
    audio[0].volume = pVol;
};

const stopBGM = (pSrc) => {
    let audio = $("#bgm");
    audio[0].pause();
};

const stopAllSound = () => {
    let audio1 = $("#effect1");
    audio1[0].pause();
    let audio2 = $("#effect2");
    audio2[0].pause();
    var audio3 = $("#bgm");
    audio3[0].pause();
};

// ]

// Example 추출 [
const extractExample = (letter, answerCnt) => {
    let alphabetArr = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I",
        "J", "K", "L", "M", "N", "O", "P", "Q", "R",
        "S", "T", "U", "V", "W", "X", "Y", "Z"
    ];

    alphabetArr = alphabetArr.filter(alphabet => alphabet != letter);
    alphabetArr = shuffle(alphabetArr).splice(0, answerCnt - 1);
    alphabetArr.push(letter);

    alphabetArr = shuffle(alphabetArr);

    return alphabetArr;
};
// ]

const checkIE = () => {
    const ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    const msie = ua.indexOf("MSIE "); // IE 10 or older
    const trident = ua.indexOf("Trident/"); //IE 11

    if (msie > 0 || trident > 0) {
        alert("Chrome 브라우저를 사용하세요");
    }
};

$(document).on("contextmenu dragstart selectstart", function (e) {
    return false;
});

const lockScreen = (pLock) => {
    if (pLock == true) {
        $(".js-screen-lock").removeClass("d-none");
    } else {
        $(".js-screen-lock").addClass("d-none");
    }
};

const hideSpeaker = () => {
    $(".js-speaker").addClass("d-none");
};

const popNext = () => {
    $(".js-screen-lock").removeClass("d-none");
    $(".next-popup").removeClass("d-none");
    setTimeout(() => {
        stopAllSound();
        $(".js-screen-lock").addClass("d-none");
        $(".js-wrapper-reward").addClass("d-none");
        $(".js-wrapper-next").removeClass("d-none");
    }, 2000);
};

// 학습(게임 제외) 저장후 결과(포인트, 일일목표, 캐릭터획득, 이벤트수상) 보는 페이지로 이동
const popReward = (p1, p2) => {
    alert('todo : popReward');
    // todo : 공통 피니시 화면(React)으로 이동
};

const showTodayGoal = (object, scene) => {

    $('.arrow').addClass("d-none");

    if (object == undefined || scene != undefined && scene.isPass == 'fail') {
        return goDodo();
    }

    try {
        //오늘 목표를 달성했을 경우,
        if (object.dailygoal == 'Y') {
            $('.js-wrapper-record2').addClass("d-none");
            $('.pop_point').addClass("d-none");
            $('.js-wrapper-reward0').addClass("d-none");
            $('.js-wrapper-reward2').addClass("d-none");
            $('.js-wrapper-reward4').addClass("d-none");
            $('.js-wrapper-reward6').addClass("d-none");

            if (currentLand != "songandchant") {
                //$('.wrapper-content').addClass("d-none");
            }

            $('#vtVideo').addClass("d-none");

            $('.js-todayGoal').removeClass("d-none");

            timerId = setTimeout(() => {
                $(".js-todayGoal").click();
            }, 12_000)

            $("#todayGoalAudio")[0].play();

            $("#todayGoalAudio").on("ended", function () {
                //
                $(".js-todayGoal").on("click", function () {
                    $(".js-todayGoal").off("click");
                    $("#todayGoalAudio")[0].pause();
                    $("#stopBtn").trigger("click");
                    clearTimeout(timerId);

                    showEventAward(object);
                    //goDodo();
                });
            });

        }
        //오늘 목표를 달성하지 않았을 경우
        else {
            //goDodo();
            showEventAward(object);
        }
    } catch (er) {
        alert("showTodayGoal error " + er);
    }
}

const hideNext = () => {
    $(".js-wrapper-next").addClass("d-none");
    $(".next-popup").addClass("d-none");
};

const shakeObj = (pObj, pCnt, pMsec) => {
    $(pObj).effect("shake", { times: pCnt }, pMsec);
};

const focusCurrent = (pAct) => {
    $(".js-activity-" + pAct.toLowerCase()).addClass("current-focus");
};

// Home 으로 이동 추가 시작 - 16-08-05 박현기
const goToHome = () => {
    console.log('todo : goToHome');
    // todo
};

//const onFail = () => { };

// DodoABC 페이지로 이동. goToHome를 goDodo로 대체
const goDodo = () => {
    console.log('todo : goDodo');
    // todo
};

// 메뉴버튼
const toggleMenu = () => {
    // menu open
    if (!isToggleMenu) {
        // menu가 접혀있는 상태에서 클릭시.
        isToggleMenu = true;

        $(".arrow").removeClass("arrow_bar02");
        $(".m_box").removeClass("d-none");

        $(".js-wrapper-next").removeClass("d-none");

        document.body.style.overflow = "hidden";
        // Movie, Sound stop
        if (currentActivity == "Movie") {
            // Movie 상태
            video.pause();
        } else {
            // Activity 상태
            stopBGM();
            stopAllSound();
        }
        playEffect1(sndWheekk);

        if ($.session.get('user') == "GUEST" || $.session.get('user') == "STAFF") {
            //관리자모드나 리뷰 모드일 경우
            $(".arrow").addClass("arrow_bar01");
            $(".staffMenu").removeClass("d-none");
        }
        else {
            // 학생모드일 경우
            $(".studentMenu").removeClass("d-none");
            $(".arrow").addClass("arrow_bar03");

            let boxHeight = $(".arrow").css("height");

            $(".m_box").css("border-radius", "0");
            $(".m_box").css("width", "94");
            $(".m_box").css("height", boxHeight);
        }
    }

    // menu close // menu가 펼쳐진 상태에서 클릭시.
    else {
        isToggleMenu = false;

        // 화살표 위치 변경
        $(".arrow").removeClass("arrow_bar01");
        $(".arrow").removeClass("arrow_bar03");
        $(".arrow").addClass("arrow_bar02");

        // 메뉴박스 접기
        $(".m_box").addClass("d-none");
        $(".staffMenu").addClass("d-none");
        $(".studentMenu").addClass("d-none");

        // Activity종료후 next-popup창이 뜬 경우, 조건문 내부가 실행되지 않음.
        if ($(".next-popup").hasClass("d-none")) {
            $(".js-wrapper-next").addClass("d-none");
            // Movie, Sound play
            if (currentActivity == "Movie") {
                // Movie 상태
                video.play();
            } else {
                // Activity 상태
                playBGM();
            }
        }
    }
}; //toggleMenu

const goMovie = () => {
    movieSrc = "https://moviebook.a1edu.com/newsystem/moviebook/dodoabc/EBPK" + $.session.get('book') + ".mp4";

    $(".movieVideo").attr("src", movieSrc);
    $(".movieVideo").popVideo({
        // options here
        playOnOpen: true,
        closeOnEnd: true,
        pauseOnClose: true,
        closeKey: "esc",
        size: "fullscreen",
    }).open();
};

const doPreloadImages = (images, callback) => {
    let preloaded = 0;

    if (images.length > 0) {
        const progress = () => {
            preloaded++;

            if (preloaded == images.length) {
                $(".wrapper-curtains").addClass("open");

                callback();
            }
        }

        images.forEach(el => {
            const img = new Image();
            img.src = el;
            img.onload = () => {
                progress();
            }
        })
    }
    else {
        $(".wrapper-curtains").addClass("open");
        callback();
    }
}

const getAgentSystem = () => {
    var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
    var ret = "";
    if (varUA.indexOf('android') > -1) {
        ret = "A";
    } else if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
        ret = "I";
    } else {
        ret = "B";
    }

    return ret;
}

// F5 키 막기
function noEvent() {
    if (event.keyCode == 116) {
        event.keyCode = 2;
        return false;
    }
    else if (event.ctrlKey && (event.keyCode == 78 || event.keyCode == 82)) {
        return false;
    }
}

document.onkeydown = noEvent;