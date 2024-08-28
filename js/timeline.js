"use strict";

function outerHeight(el) {
    const style = getComputedStyle(el);

    return el.getBoundingClientRect().height + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
}

function scrollTop(el, value) {
    let win;
    if (el.window === el) {
        win = el;
    } else if (el.nodeType === 9) {
        win = el.defaultView;
    }

    if (value === undefined) {
        return win ? win.pageYOffset : el.scrollTop;
    }

    if (win) {
        win.scrollTo(win.pageXOffset, value);
    } else {
        el.scrollTop = value;
    }
}

function offset(el) {
    let box = el.getBoundingClientRect();
    let docElem = document.documentElement;
    return {
        top: box.top + window.pageYOffset - docElem.clientTop,
        left: box.left + window.pageXOffset - docElem.clientLeft,
    };
}

function setupScroll() {
    let agTimeline = document.querySelector(".js-timeline");
    let agTimelineLine = document.querySelector(".js-timeline_line");
    let agTimelineLineProgress = document.querySelector(".js-timeline_line-progress");

    let timeLineItems = document.querySelectorAll(".js-timeline_item");

    let agOuterHeight = window.offsetHeight;
    let f = -1;
    let agFlag = false;
    let agPosY = 0;

    function fnUpdateProgress() {
        let last = timeLineItems[timeLineItems.length - 1];
        let agTop = offset(last.querySelector(".js-timeline-card_point-box")).top;

        let i = agTop + agPosY - scrollTop(window);
        let a = offset(agTimelineLineProgress).top + agPosY - scrollTop(window);

        let n = agPosY - a + agOuterHeight / 2;
        let aaa = i <= agPosY + agOuterHeight / 2 && (n = i - a);

        agTimelineLineProgress.style.height = n + "px";

        timeLineItems.forEach((el, i) => {
            let agTop = offset(el.querySelector(".js-timeline-card_point-box")).top;

            if (agTop + agPosY - scrollTop(window) < agPosY + 0.5 * agOuterHeight) {
                el.classList.add("js-ag-active");
            } else {
                el.classList.remove("js-ag-active");
            }
        });
    }

    function fnUpdateWindow() {
        agFlag = false;

        let first = timeLineItems[0];
        let firstTimelinePointBox = first.querySelector(".js-timeline-card_point-box");

        let last = timeLineItems[timeLineItems.length - 1];
        let lastTimelinePointBox = last.querySelector(".js-timeline-card_point-box");

        agTimelineLine.style.top = offset(firstTimelinePointBox).top - offset(first).top;
        agTimelineLine.style.bottom = offset(agTimeline).top + outerHeight(agTimeline) - offset(lastTimelinePointBox).top;

        if (f !== agPosY) {
            f = agPosY;
            fnUpdateProgress();
        }
    }

    function fnUpdateFrame() {
        if (agFlag === false) {
            requestAnimationFrame(fnUpdateWindow);
            agFlag = true;
        }
    }

    function fnOnScroll() {
        agPosY = scrollTop(window);
        fnUpdateFrame();
    }

    function fnOnResize() {
        agPosY = scrollTop(window);
        fnUpdateFrame();
    }

    window.addEventListener("scroll", fnOnScroll);
    window.addEventListener("resize", fnOnResize);
}

function ready(fn) {
    if (document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

ready(setupScroll);
