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
var SinglePageBeta = /** @class */ (function () {
    function SinglePageBeta(id, options) {
        if (!id) {
            throw "Page element not found";
        }
        var $ = document;
        var $e = $.getElementById(id);
        if (!$e) {
            throw "Page element not found";
        }
        var _options = {
            sections: [],
            navigation: "vertical",
            autoScrolling: true,
            scrollbar: false,
            scrollingSpeed: 1000,
            easing: "ease",
            sameurl: true,
            keyboardNavigation: true,
            pageTransitionStart: function (prevPage, currentPage) { },
            pageTransitionEnd: function (currentPage) { },
        };
        if (options) {
            _options = __assign(__assign({}, _options), options);
        }
        //#region Private Variables
        var scrollWay = 2 /* Vertical */;
        var _scrollings = [];
        var _lastScrollCount = 0;
        var _sectionIds = [];
        var _activePageIndex;
        var _activeSection;
        var pageIndex = 0;
        var canScroll = true;
        var scrollerTime;
        //#endregion
        //#region private methods
        //#region Html Utility Methods
        var htmlUtility = {
            setInitialStyle: function () {
                $e.style.transform = "translate3d(0px, 0px, 0px)";
                $e.classList.add("sp-wrapper");
            },
            setSectionClass: function (element) {
                element.classList.add("sp-section");
            },
            setSectionHeight: function (element) {
                element.style.height = window.innerHeight + "px";
            },
            setSectionHorizontal: function (element) {
                element.style.width = (_sectionIds.length * 100) + "%";
                element.classList.add("sp-floatLeft");
                element.querySelectorAll(".section").forEach(function (e) {
                    e.classList.add("sp-floatLeft");
                    e.style.width = (100 / _sectionIds.length) + "%";
                });
            },
            getCellElement: function () {
                var cellDiv = $.createElement("div");
                cellDiv.setAttribute("class", "sp-cell");
                htmlUtility.setSectionHeight(cellDiv);
                return cellDiv;
            },
            setBackgroundColor: function (element, color) {
                element.style.backgroundColor = color;
            },
            setBackgroundCssClass: function (element, cssClass) {
                element.classList.add(cssClass);
            },
            setBackgroundImageUrl: function (element, imageUrl) {
                element.style.imageUrl(imageUrl);
            },
            getBrandName: function (classList, brandName) {
                var _a;
                var navSpan = $.createElement("span");
                (_a = navSpan.classList).add.apply(_a, classList);
                var textNode = $.createTextNode(brandName);
                navSpan.appendChild(textNode);
                return navSpan;
            },
            getNavigationLink: function (classList, anchor, anchorId) {
                var _a;
                var navLi = $.createElement("li");
                navLi.classList.add("nav-item");
                var navA = $.createElement("a");
                (_a = navA.classList).add.apply(_a, classList);
                navA.setAttribute("href", "#" + anchorId);
                var textNode = $.createTextNode(anchor);
                navA.appendChild(textNode);
                navLi.appendChild(navA);
                return navLi;
            },
            setNavBarToggler: function () {
                var btn = $.createElement("button");
                btn.setAttribute("type", "button");
                btn.setAttribute("data-toggle", "collapse");
                btn.setAttribute("data-target", "#navbarNav");
                btn.setAttribute("aria-controls", "navbarNav");
                btn.setAttribute("aria-expanded", "false");
                btn.setAttribute("aria-label", "Toggle navigation");
                var span = $.createElement("span");
                span.classList.add("navbar-toggler-icon");
                btn.appendChild(span);
                return btn;
            },
            setNavigationMenu: function () {
                var _a;
                var _b;
                var nav = $.createElement("nav");
                var navClass = ["navbar", "fixed-top", "navbar-expand", "navbar-dark", "flex-column", "flex-md-row", "bd-navbar"];
                (_a = nav.classList).add.apply(_a, navClass);
                //navbrand name
                var navBrand = htmlUtility.getBrandName(["navbar-brand", "mb-0", "h1"], _options.brandName);
                nav.appendChild(navBrand);
                //navbrand toggler
                var navBarToggler = htmlUtility.setNavBarToggler();
                nav.appendChild(navBarToggler);
                var navDiv = $.createElement("div");
                navDiv.setAttribute("id", "navbarNav");
                navDiv.classList.add("collapse");
                navDiv.classList.add("navbar-collapse");
                var navUl = $.createElement("ul");
                navUl.classList.add("nav");
                navDiv.appendChild(navUl);
                nav.appendChild(navDiv);
                (_b = $.querySelector("body")) === null || _b === void 0 ? void 0 : _b.insertBefore(nav, $.querySelector("#" + id));
                return navUl;
            },
            setSection: function (section, index) {
                var sectionDiv = $.createElement("div");
                sectionDiv.setAttribute("id", "section-" + index);
                sectionDiv.classList.add("section");
                if (section.active) {
                    sectionDiv.classList.add("active");
                }
                if (section.templateUrl) {
                    var response = "<sp-include url=\"" + section.templateUrl + "\"/>";
                    sectionDiv.innerHTML = response;
                }
                else if (section.template) {
                    sectionDiv.innerHTML = section.template;
                }
                htmlUtility.setSectionClass(sectionDiv);
                htmlUtility.setSectionHeight(sectionDiv);
                return sectionDiv;
            }
        };
        //#endregion
        //#region Scroll Events
        var scrollEvents = {
            scrollPageUp: function () {
                var sec_id = "";
                if (_activePageIndex > 0) {
                    sec_id = _sectionIds[--_activePageIndex];
                }
                else {
                    if (_options.autoScrolling) {
                        _activePageIndex = _sectionIds.length - 1;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, 2 /* Vertical */);
            },
            scrollPageRight: function () {
                var sec_id = "";
                if (_activePageIndex > 0) {
                    sec_id = _sectionIds[--_activePageIndex];
                }
                else {
                    if (_options.autoScrolling) {
                        _activePageIndex = _sectionIds.length - 1;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, 1 /* Horizontal */);
            },
            scrollPageDown: function () {
                var sec_id = "";
                if (_activePageIndex < _sectionIds.length - 1) {
                    sec_id = _sectionIds[++_activePageIndex];
                }
                else {
                    if (_options.autoScrolling) {
                        _activePageIndex = 0;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, 2 /* Vertical */);
            },
            scrollPageLeft: function () {
                var sec_id = "";
                if (_activePageIndex < _sectionIds.length - 1) {
                    sec_id = _sectionIds[++_activePageIndex];
                }
                else {
                    if (_options.autoScrolling) {
                        _activePageIndex = 0;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, 1 /* Horizontal */);
            },
            scrollToSection: function (sectionId, ScrollWay) {
                _activeSection = $.querySelector("[data-anchor='" + sectionId + "']");
                _activePageIndex = _sectionIds.indexOf(sectionId);
                var spInclude = _activeSection.querySelector("sp-include");
                if (spInclude) {
                    var url = spInclude.getAttribute("url");
                    fetch(url)
                        .then(function (response) {
                        return response.text();
                    })
                        .then(function (text) {
                        var spCell = _activeSection.querySelector(".sp-cell");
                        spCell.innerHTML = text;
                    });
                }
                if (_activeSection) {
                    $e.style.transition = "all " + _options.scrollingSpeed + "ms " + _options.easing + " 0s";
                    switch (ScrollWay) {
                        case 1 /* Horizontal */:
                            pageIndex = _activePageIndex * window.innerWidth;
                            $e.style.transform = "translate3d(-" + pageIndex + "px, 0px, 0px)";
                            break;
                        case 2 /* Vertical */:
                            pageIndex = _activePageIndex * window.innerHeight;
                            if (_activeSection.offsetTop > 0) {
                                pageIndex = pageIndex > _activeSection.offsetTop ? pageIndex : _activeSection.offsetTop;
                            }
                            $e.style.transform = "translate3d(0px, -" + pageIndex + "px, 0px)";
                            break;
                    }
                    if (!_options.sameurl) {
                        location.hash = sectionId;
                    }
                    // let timeout = setTimeout(() => {
                    //     canScroll = true;
                    //     clearTimeout(timeout);
                    //     $.querySelectorAll(".section.active").forEach((e: any) => {
                    //         e.classList.remove("active");
                    //     });
                    //     _activeSection.classList.add("active");
                    // }, _options.scrollingSpeed);
                }
            }
        };
        //#endregion
        //#region Event Listners Methods
        var eventListners = {
            keyDown: function (key) {
                switch (key.which) {
                    case 37: //ArrowLeft
                        if (canScroll && _options.navigation === "horizontal") {
                            canScroll = false;
                            scrollEvents.scrollPageRight();
                        }
                        break;
                    case 38: //ArrowUp
                        if (canScroll && _options.navigation === "vertical") {
                            canScroll = false;
                            scrollEvents.scrollPageUp();
                        }
                        break;
                    case 39: //ArrowRight
                        if (canScroll && _options.navigation === "horizontal") {
                            canScroll = false;
                            scrollEvents.scrollPageLeft();
                        }
                        break;
                    case 40: //ArrowDown
                        if (canScroll && _options.navigation === "vertical") {
                            canScroll = false;
                            scrollEvents.scrollPageDown();
                        }
                        break;
                }
            },
            mouseWheel: function (e) {
                _scrollings.push(_lastScrollCount);
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
                        var averageEnd = utilityMethod.getAverage(_scrollings, 10);
                        var averageMiddle = utilityMethod.getAverage(_scrollings, 70);
                        var isAccelerating = averageEnd >= averageMiddle;
                        //to avoid double swipes...
                        if (isAccelerating && isScrollingVertically) {
                            //scrolling down?
                            if (delta < 0) {
                                _options.navigation === "vertical" ? scrollEvents.scrollPageDown() : scrollEvents.scrollPageLeft();
                            }
                            else {
                                _options.navigation === "vertical" ? scrollEvents.scrollPageUp() : scrollEvents.scrollPageRight();
                            }
                        }
                    }
                }, 100);
                _lastScrollCount = _scrollings.length;
                return false;
            },
            windowSize: function () {
                var activeId;
                document.querySelectorAll(".section").forEach(function (element) {
                    htmlUtility.setSectionHeight(element);
                    htmlUtility.setSectionHeight(element.querySelector(".sp-cell"));
                    if (element.classList.contains("active")) {
                        activeId = element.getAttribute("data-anchor");
                    }
                });
                scrollEvents.scrollToSection(activeId, scrollWay);
            },
            hashChange: function () {
                var _a;
                if (!_options.sameurl) {
                    var hash = (_a = location.hash) === null || _a === void 0 ? void 0 : _a.replace("#", "");
                    scrollEvents.scrollToSection(hash, scrollWay);
                }
            },
            transitionStart: function (e) {
                var _a;
                var section = $.querySelector(".section.active");
                (_a = section) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
                if (_options.pageTransitionStart instanceof Function) {
                    _options.pageTransitionStart(section, _activeSection);
                }
            },
            transitionEnd: function (e) {
                _activeSection.classList.add("active");
                canScroll = true;
                if (_options.pageTransitionEnd instanceof Function) {
                    _options.pageTransitionEnd(_activeSection);
                }
            }
        };
        //#endregion
        //#region Utility Method
        var utilityMethod = {
            initSections: function () {
                var _a;
                htmlUtility.setInitialStyle();
                var navUl = htmlUtility.setNavigationMenu();
                _options.sections.forEach(function (section, index) {
                    var sectionEle = htmlUtility.setSection(section, index + 1);
                    var anchorId = "page" + (index + 1);
                    sectionEle.setAttribute("data-anchor", anchorId);
                    var cellEle = htmlUtility.getCellElement();
                    cellEle.innerHTML = sectionEle.innerHTML;
                    sectionEle.innerHTML = "";
                    sectionEle.appendChild(cellEle);
                    $e.appendChild(sectionEle);
                    //navigation
                    var navLi = htmlUtility.getNavigationLink(["nav-link"], section.anchor, anchorId);
                    navUl.appendChild(navLi);
                    // _options.anchors.forEach((anchor: string, index: number) => {
                    //     
                    // });
                    _sectionIds.push(anchorId);
                    var _index = _sectionIds.length - 1;
                    if (section.backgroundColor) {
                        htmlUtility.setBackgroundColor(sectionEle, section.backgroundColor);
                    }
                    else if (section.backgroundCssClass) {
                        htmlUtility.setBackgroundCssClass(sectionEle, _options.backgroundCssClass);
                    }
                    else if (section.backgroundImageUrl) {
                        htmlUtility.setBackgroundImageUrl(sectionEle, _options.backgroundImageUrl);
                    }
                });
                if (_options.navigation.toLowerCase() === "horizontal") {
                    htmlUtility.setSectionHorizontal($e);
                    scrollWay = 1 /* Horizontal */;
                }
                var activeId = _sectionIds[0];
                if (!_options.sameurl) {
                    var hash = (_a = location.hash) === null || _a === void 0 ? void 0 : _a.replace("#", "");
                    if (hash) {
                        activeId = hash;
                    }
                }
                else {
                    var active = document.querySelector(".section.active");
                    if (active !== null) {
                        activeId = active.getAttribute("data-anchor");
                    }
                }
                scrollEvents.scrollToSection(activeId, scrollWay);
                utilityMethod.addEventListeners($e);
            },
            addEventListeners: function ($element) {
                //keyboard navigation event
                if (_options.keyboardNavigation) {
                    document.removeEventListener("keydown", eventListners.keyDown);
                    document.addEventListener("keydown", eventListners.keyDown);
                }
                //scroll event
                document.removeEventListener("wheel", eventListners.mouseWheel);
                document.addEventListener("wheel", eventListners.mouseWheel);
                //window resize event
                window.removeEventListener('resize', eventListners.windowSize);
                window.addEventListener('resize', eventListners.windowSize);
                //transition start event
                $element.removeEventListener('transitionstart', eventListners.transitionStart);
                $element.addEventListener('transitionstart', eventListners.transitionStart);
                //transition end even
                $element.removeEventListener('transitionend', eventListners.transitionEnd);
                $element.addEventListener('transitionend', eventListners.transitionEnd);
                if (!_options.sameurl) {
                    window.addEventListener('hashchange', eventListners.hashChange);
                }
            },
            getAverage: function (eleList, num) {
                var sum = 0;
                var lastEles = eleList.slice(Math.max(eleList.length - num, 1));
                for (var i = 0; i < lastEles.length; i++) {
                    sum = sum + lastEles[i];
                }
                return Math.ceil(sum / num);
            }
        };
        //#endregion
        //#endregion
        utilityMethod.initSections();
    }
    return SinglePageBeta;
}());
