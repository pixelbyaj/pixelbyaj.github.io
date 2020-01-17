"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var SinglePage = /** @class */ (function () {
    function SinglePage(id, options) {
        var pageElement;
        var _scrollings = [];
        var _lastScrollCount = 0;
        var _options = {
            autoScrolling: true,
            scrollbar: false
        };
        if (options) {
            _options = __assign(__assign({}, _options), options);
        }
        var _sectionIds = [];
        var _sectionPageIndex;
        var canScroll = false;
        var scrollerTime;
        if (!id) {
            throw "Page element not found";
        }
        var $ = document;
        pageElement = $.getElementById(id);
        if (!pageElement) {
            throw "Page element not found";
        }
        var $e = pageElement;
        $e.classList.add("sp-wrapper");
        //#region private methods
        //#region Observer
        var observerCallback = function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.intersectionRatio === 1.0) {
                    var element = entry.target;
                    var attrId = element.getAttribute("id");
                    _sectionPageIndex = _sectionIds.indexOf(attrId);
                    console.log(_sectionPageIndex + " and scroll " + canScroll);
                    canScroll = true;
                }
            });
        };
        var setObserver = function (element) {
            var options = {
                root: pageElement,
                rootMargin: '0px',
                threshold: 1.0
            };
            var observer = new IntersectionObserver(observerCallback, options);
            observer.observe(element);
        };
        //#endregion
        var getCellElement = function () {
            var cellDiv = $.createElement("div");
            cellDiv.setAttribute("class", "sp-cell");
            return cellDiv;
        };
        var setSectionHeight = function (element) {
            element.style = "height:" + window.innerHeight + "px;";
        };
        var initSections = function () {
            $e.querySelectorAll(".section").forEach(function (element) {
                setSectionHeight(element);
                var attr_id = element.getAttribute("id");
                if (!attr_id) {
                    throw "Section id is missing";
                }
                _sectionIds.push(attr_id);
                var cellEle = getCellElement();
                cellEle.innerHTML = element.innerHTML;
                element.innerHTML = "";
                element.appendChild(cellEle);
                setObserver(element);
            });
        };
        var getAverage = function (eleList, num) {
            var sum = 0;
            var lastEles = eleList.slice(Math.max(eleList.length - num, 1));
            for (var i = 0; i < lastEles.length; i++) {
                sum = sum + lastEles[i];
            }
            return Math.ceil(sum / num);
        };
        var scrollPageUp = function () {
            var sec_id = "";
            if (_sectionPageIndex > 0) {
                sec_id = _sectionIds[--_sectionPageIndex];
            }
            if (sec_id === "") {
                canScroll = true;
                return;
            }
            scrollToSection(sec_id);
        };
        var scrollPageDown = function () {
            var sec_id = "";
            if (_sectionPageIndex < _sectionIds.length - 1) {
                sec_id = _sectionIds[++_sectionPageIndex];
            }
            if (sec_id === "") {
                canScroll = true;
                return;
            }
            scrollToSection(sec_id);
        };
        var scrollToSection = function (sectionId) {
            var section = document.getElementById(sectionId);
            if (section) {
                if (_options["sameurl"]) {
                    section.scrollIntoView();
                }
                else {
                    location.hash = sectionId;
                }
            }
        };
        var listners = {
            keyDown: function (key) {
                switch (key.which) {
                    case 38:
                        if (canScroll) {
                            canScroll = false;
                            scrollPageUp();
                        }
                        break;
                    case 40:
                        if (canScroll) {
                            canScroll = false;
                            scrollPageDown();
                        }
                        break;
                }
            },
            mouseWheel: function (e) {
                _scrollings.push(_lastScrollCount);
                //autoscrolling and not zooming?
                if (_options.autoScrolling) {
                    // cross-browser wheel delta
                    e = e || window.event;
                    var value = e.wheelDelta || -e.deltaY || -e.detail;
                    var delta = Math.max(-1, Math.min(1, value));
                    var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
                    var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX) < Math.abs(e.deltaY) || !horizontalDetection);
                    //preventing to scroll the site on mouse wheel when scrollbar is present
                    if (_options.scrollbar) {
                        e.preventDefault();
                    }
                    clearTimeout(scrollerTime);
                    scrollerTime = setTimeout(function () {
                        if (canScroll && (_lastScrollCount === _scrollings.length)) {
                            canScroll = false;
                            _scrollings = [];
                            _lastScrollCount = 0;
                            clearInterval(scrollerTime);
                            var averageEnd = getAverage(_scrollings, 10);
                            var averageMiddle = getAverage(_scrollings, 70);
                            var isAccelerating = averageEnd >= averageMiddle;
                            //to avoid double swipes...
                            if (isAccelerating && isScrollingVertically) {
                                //scrolling down?
                                if (delta < 0) {
                                    scrollPageDown();
                                }
                                else {
                                    scrollPageUp();
                                }
                            }
                        }
                    }, 100);
                    _lastScrollCount = _scrollings.length;
                    return false;
                }
            }
        };
        var addEventListeners = function () {
            document.removeEventListener("keydown", listners.keyDown);
            document.addEventListener("keydown", listners.keyDown);
            document.removeEventListener("wheel", listners.mouseWheel);
            document.addEventListener("wheel", listners.mouseWheel);
        };
        //#endregion
        initSections();
        addEventListeners();
    }
    return SinglePage;
}());
