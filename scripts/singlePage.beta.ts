
class SinglePageBeta {
    constructor(id: string, options: any) {

        if (!id) {
            throw "Page element not found";
        }
        let $ = document;
        let $e: any = $.getElementById(id);
        if (!$e) {
            throw "Page element not found";
        }

        const enum Scroll {
            Horizontal = 1,
            Vertical = 2
        }

        let _options: any = {
            sections: [],
            navigation: "vertical",
            autoScrolling: true,
            scrollbar: false,
            scrollingSpeed: 1000,
            easing: "ease",
            sameurl: true,
            keyboardNavigation: true,
            pageTransitionStart: (prevPage: HTMLElement, currentPage: HTMLElement) => { },
            pageTransitionEnd: (currentPage: HTMLElement) => { },
        };

        if (options) {
            _options = { ..._options, ...options };
        }

        //#region Private Variables
        let scrollWay = Scroll.Vertical;
        let _scrollings: any[] = [];
        let _lastScrollCount = 0;
        let _sectionIds: string[] = [];
        let _activePageIndex: number;
        let _activeSection: HTMLElement;
        let pageIndex: number = 0;
        let canScroll = true;
        let scrollerTime: any;
        //#endregion

        //#region private methods

        //#region Html Utility Methods
        const htmlUtility = {
            setInitialStyle: () => {
                $e.style.transform = `translate3d(0px, 0px, 0px)`;
                $e.classList.add("sp-wrapper");
            },
            setSectionClass: (element: any) => {
                element.classList.add("sp-section");
            },
            setSectionHeight: (element: any) => {
                element.style.height = window.innerHeight + "px";
            },
            setSectionHorizontal: (element: any) => {
                element.style.width = (_sectionIds.length * 100) + "%";
                element.classList.add("sp-floatLeft");
                element.querySelectorAll(".section").forEach((e: any) => {
                    e.classList.add("sp-floatLeft");
                    e.style.width = (100 / _sectionIds.length) + "%";

                });
            },
            getCellElement: (): any => {
                var cellDiv = $.createElement("div");
                cellDiv.setAttribute("class", "sp-cell");
                htmlUtility.setSectionHeight(cellDiv);
                return cellDiv;
            },
            setBackgroundColor: (element: any, color: any) => {
                element.style.backgroundColor = color;
            },
            setBackgroundCssClass: (element: any, cssClass: any) => {
                element.classList.add(cssClass);
            },
            setBackgroundImageUrl: (element: any, imageUrl: any) => {
                element.style.imageUrl(imageUrl);
            },
            getBrandName: (classList: string[], brandName: string): HTMLElement => {
                

                let navSpan = $.createElement("span");
                navSpan.classList.add(...classList);

                let textNode = $.createTextNode(brandName);
                navSpan.appendChild(textNode);

                return navSpan;
            },
            getNavigationLink: (classList: string[], anchor: string, anchorId: string): HTMLElement => {
                let navLi = $.createElement("li");
                navLi.classList.add("nav-item");

                let navA = $.createElement("a");
                navA.classList.add(...classList);
                navA.setAttribute("href", "#" + anchorId);

                let textNode = $.createTextNode(anchor);
                navA.appendChild(textNode);

                navLi.appendChild(navA);
                return navLi;
            },
            setNavBarToggler: (): HTMLElement => {
                let btn = $.createElement("button");
                btn.setAttribute("type", "button");
                btn.classList.add("navbar-toggler");
                btn.setAttribute("data-toggle", "collapse");
                btn.setAttribute("data-target", "#navbarNav");
                btn.setAttribute("aria-controls", "navbarNav");
                btn.setAttribute("aria-expanded", "false");
                btn.setAttribute("aria-label", "Toggle navigation");
                let span = $.createElement("span");
                span.classList.add("navbar-toggler-icon");
                btn.appendChild(span);
                return btn;
            },
            setNavigationMenu: () => {

                let nav = $.createElement("nav");
                const navClass = ["navbar", "fixed-top", "navbar-expand", "navbar-dark", "flex-column", "flex-md-row", "bd-navbar"];
                nav.classList.add(...navClass);
               
                //navbrand name
                let navBrand = htmlUtility.getBrandName(["navbar-brand", "mb-0", "h1"], _options.brandName);
                nav.appendChild(navBrand);

                //navbrand toggler
                let navBarToggler=htmlUtility.setNavBarToggler();
                nav.appendChild(navBarToggler);

                let navDiv = $.createElement("div");
                navDiv.setAttribute("id", "navbarNav");
                navDiv.classList.add("collapse");
                navDiv.classList.add("navbar-collapse");

                let navUl = $.createElement("ul");
                navUl.classList.add("nav");
                navDiv.appendChild(navUl);
                nav.appendChild(navDiv);
                $.querySelector("body")?.insertBefore(nav, $.querySelector("#" + id));
                return navUl;
            },
            setSection: (section: any, index: number) => {
                let sectionDiv = $.createElement("div");
                sectionDiv.setAttribute("id", "section-" + index);
                sectionDiv.classList.add("section");
                if (section.active) {
                    sectionDiv.classList.add("active");
                }
                if (section.templateUrl) {
                    const response = `<sp-include url="${section.templateUrl}"/>`;
                    sectionDiv.innerHTML = response;
                } else if (section.template) {
                    sectionDiv.innerHTML = section.template;
                }
                htmlUtility.setSectionClass(sectionDiv);
                htmlUtility.setSectionHeight(sectionDiv);
                return sectionDiv;
            }
        }
        //#endregion

        //#region Scroll Events
        const scrollEvents = {
            scrollPageUp: () => {
                let sec_id: string = "";
                if (_activePageIndex > 0) {
                    sec_id = _sectionIds[--_activePageIndex];
                } else {
                    if (_options.autoScrolling) {
                        _activePageIndex = _sectionIds.length - 1;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, Scroll.Vertical);
            },
            scrollPageRight: () => {
                let sec_id: string = "";
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
                scrollEvents.scrollToSection(sec_id, Scroll.Horizontal);
            },
            scrollPageDown: () => {
                let sec_id: string = "";
                if (_activePageIndex < _sectionIds.length - 1) {
                    sec_id = _sectionIds[++_activePageIndex]
                } else {
                    if (_options.autoScrolling) {
                        _activePageIndex = 0;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, Scroll.Vertical);
            },
            scrollPageLeft: () => {
                let sec_id: string = "";
                if (_activePageIndex < _sectionIds.length - 1) {
                    sec_id = _sectionIds[++_activePageIndex]
                } else {
                    if (_options.autoScrolling) {
                        _activePageIndex = 0;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, Scroll.Horizontal);
            },
            scrollToSection: (sectionId: any, ScrollWay: Scroll) => {
                _activeSection = $.querySelector(`[data-anchor='${sectionId}']`) as HTMLElement;
                _activePageIndex = _sectionIds.indexOf(sectionId);
                let spInclude = _activeSection.querySelector("sp-include");
                if (spInclude) {
                    let url: any = spInclude.getAttribute("url");
                    fetch(url)
                        .then((response) => {
                            return response.text();
                        })
                        .then((text) => {
                            let spCell: any = _activeSection.querySelector(".sp-cell");
                            spCell.innerHTML = text;
                        });
                }
                if (_activeSection) {
                    $e.style.transition = `all ${_options.scrollingSpeed}ms ${_options.easing} 0s`;

                    switch (ScrollWay) {
                        case Scroll.Horizontal:
                            pageIndex = _activePageIndex * window.innerWidth;
                            $e.style.transform = `translate3d(-${pageIndex}px, 0px, 0px)`;
                            break;
                        case Scroll.Vertical:
                            pageIndex = _activePageIndex * window.innerHeight;
                            if (_activeSection.offsetTop > 0) {
                                pageIndex = pageIndex > _activeSection.offsetTop ? pageIndex : _activeSection.offsetTop;
                            }
                            $e.style.transform = `translate3d(0px, -${pageIndex}px, 0px)`;
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
        }
        //#endregion

        //#region Event Listners Methods
        const eventListners = {
            keyDown: (key: { which: any; }) => {
                switch (key.which) {
                    case 37://ArrowLeft
                        if (canScroll && _options.navigation === "horizontal") {
                            canScroll = false;
                            scrollEvents.scrollPageRight();
                        }
                        break;
                    case 38://ArrowUp
                        if (canScroll && _options.navigation === "vertical") {
                            canScroll = false;
                            scrollEvents.scrollPageUp();
                        }
                        break;
                    case 39://ArrowRight
                        if (canScroll && _options.navigation === "horizontal") {
                            canScroll = false;
                            scrollEvents.scrollPageLeft();
                        }
                        break;
                    case 40://ArrowDown
                        if (canScroll && _options.navigation === "vertical") {
                            canScroll = false;
                            scrollEvents.scrollPageDown();
                        }
                        break;
                }
            },
            mouseWheel: (e: any) => {
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
                scrollerTime = setTimeout(() => {
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
                            } else {
                                _options.navigation === "vertical" ? scrollEvents.scrollPageUp() : scrollEvents.scrollPageRight();
                            }
                        }
                    }
                }, 100);
                _lastScrollCount = _scrollings.length;
                return false;
            },
            windowSize: () => {
                var activeId;
                document.querySelectorAll(".section").forEach((element: any) => {
                    htmlUtility.setSectionHeight(element);
                    htmlUtility.setSectionHeight(element.querySelector(".sp-cell"));
                    if (element.classList.contains("active")) {
                        activeId = element.getAttribute("data-anchor")
                    }
                });
                scrollEvents.scrollToSection(activeId, scrollWay);

            },
            hashChange: () => {
                if (!_options.sameurl) {
                    let hash = location.hash?.replace("#", "");
                    scrollEvents.scrollToSection(hash, scrollWay);
                }
            },
            transitionStart: (e: any) => {
                const section = $.querySelector(".section.active");
                section?.classList.remove("active");
                if (_options.pageTransitionStart instanceof Function) {
                    _options.pageTransitionStart(section, _activeSection);
                }
            },
            transitionEnd: (e: any) => {
                _activeSection.classList.add("active");
                canScroll = true;
                if (_options.pageTransitionEnd instanceof Function) {
                    _options.pageTransitionEnd(_activeSection);
                }
            }
        }
        //#endregion

        //#region Utility Method
        const utilityMethod = {
            initSections: () => {
                htmlUtility.setInitialStyle();
                let navUl: any = htmlUtility.setNavigationMenu();
                
                _options.sections.forEach((section: any, index: number) => {
                    let sectionEle = htmlUtility.setSection(section, index + 1);
                    let anchorId = "page" + (index + 1);
                    sectionEle.setAttribute("data-anchor", anchorId);
                    const cellEle = htmlUtility.getCellElement();
                    cellEle.innerHTML = sectionEle.innerHTML;
                    sectionEle.innerHTML = "";
                    sectionEle.appendChild(cellEle);
                    $e.appendChild(sectionEle);

                    //navigation
                    let navLi = htmlUtility.getNavigationLink(["nav-link"], section.anchor, anchorId);
                    navUl.appendChild(navLi);
                    // _options.anchors.forEach((anchor: string, index: number) => {
                    //     
                    // });
                    _sectionIds.push(anchorId);
                    const _index = _sectionIds.length - 1;
                    if (section.backgroundColor) {
                        htmlUtility.setBackgroundColor(sectionEle, section.backgroundColor);
                    } else if (section.backgroundCssClass) {
                        htmlUtility.setBackgroundCssClass(sectionEle, _options.backgroundCssClass);
                    } else if (section.backgroundImageUrl) {
                        htmlUtility.setBackgroundImageUrl(sectionEle, _options.backgroundImageUrl);
                    }
                });


                if (_options.navigation.toLowerCase() === "horizontal") {
                    htmlUtility.setSectionHorizontal($e);
                    scrollWay = Scroll.Horizontal;
                }
                let activeId: string | null = _sectionIds[0];
                if (!_options.sameurl) {
                    let hash = location.hash?.replace("#", "");
                    if (hash) {
                        activeId = hash;
                    }
                } else {
                    let active = document.querySelector(".section.active");
                    if (active !== null) {
                        activeId = active.getAttribute("data-anchor");
                    }
                }
                scrollEvents.scrollToSection(activeId, scrollWay);
                utilityMethod.addEventListeners($e);
            },
            addEventListeners: ($element: HTMLElement) => {
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
            getAverage: (eleList: any, num: any) => {
                let sum = 0;

                let lastEles = eleList.slice(Math.max(eleList.length - num, 1));

                for (var i = 0; i < lastEles.length; i++) {
                    sum = sum + lastEles[i];
                }

                return Math.ceil(sum / num);
            }
        }
        //#endregion

        //#endregion
        utilityMethod.initSections();
    }

}
