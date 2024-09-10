"use strict";

function setupScroll() {
    function scrollTop(el, value) {
        let win = undefined;
        if (el.window === el) {
            win = el;
        } else if (el.nodeType === Node.DOCUMENT_NODE) {
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

    const timeline = document.querySelector(".js-timeline");
    const timelineLine = document.querySelector(".js-timeline_line");
    const timelineLineProgress = document.querySelector(".js-timeline_line-progress");

    const timeLineItems = Array.from(document.querySelectorAll(".js-timeline-items-container > *"));
    const bookmarks = Array.from(document.querySelectorAll(".js-timeline-bookmark-container > *"));

    const bookmarksWithItems = bookmarks.map(
        (bookmark, i) => ({
            bookmark: bookmark,
            item: timeLineItems[i]
        }));

    console.log(bookmarksWithItems);

    
    let oldWindowScrollTop = -1;
    let agFlag = false;
    let windowScrollTop = 0;

    function refreshBookmarksPositions() {
        const timelineBox = timeline.getBoundingClientRect();
        const offsetTimelineTopRelativeToDocument = windowScrollTop + timelineBox.top;

        bookmarksWithItems.forEach(itemWithBookmark => {
            if (itemWithBookmark.bookmark && itemWithBookmark.item) {
                const itemBox = itemWithBookmark.item.getBoundingClientRect();
                const bookmarkTop = itemBox.top - offsetTimelineTopRelativeToDocument + windowScrollTop;
                itemWithBookmark.bookmark.style.top = bookmarkTop + "px";
            }
        });

    }

    function fnUpdateProgress() {
        const timelineBox = timeline.getBoundingClientRect();

        // header / navbar height
        const offsetTimelineTopRelativeToDocument = windowScrollTop + timelineBox.top;

        // if you want to increase of decrease the progress part of the timeline adjust this ratio
        const viewportHeightProgressLineRatio = 0.4;
        const baseLinePositionRelativeToViewport = viewportHeightProgressLineRatio * window.innerHeight;
        const progressBarHeightRelativeToTimeLine = baseLinePositionRelativeToViewport - offsetTimelineTopRelativeToDocument + windowScrollTop;

        timelineLine.style.height = timeline.scrollHeight + "px";
        timelineLineProgress.style.height = progressBarHeightRelativeToTimeLine + "px";

        // if you want to make elements appear sooner or later adjust this ratio
        const viewportHeightRatioForActiveTrigger = 0.4;
        
        bookmarksWithItems.forEach((el, i) => {
            const minPositionToBeActive = window.innerHeight * viewportHeightRatioForActiveTrigger; 
            const elementTop = el.item.getBoundingClientRect().top;

            if (elementTop <= minPositionToBeActive) {
                el.item.classList.add("active");
                el.bookmark.classList.add("active");
            } else {
                el.item.classList.remove("active");
                el.bookmark.classList.remove("active");
            }
        });
    }

    function fnUpdateWindow() {
        agFlag = false;

        if (oldWindowScrollTop !== windowScrollTop) {
            oldWindowScrollTop = windowScrollTop;
            fnUpdateProgress();
            refreshBookmarksPositions();
        }
    }
    function refresh() {
        windowScrollTop = scrollTop(window);
        if (agFlag === false) {
            requestAnimationFrame(fnUpdateWindow);
            agFlag = true;
        }
    }

    window.addEventListener("scroll", refresh);
    window.addEventListener("resize", refresh);

    refresh();

}

function ready(fn) {
    if (document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

ready(setupScroll);
