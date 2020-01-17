
class SinglePageBeta {
    constructor(id: string, options: any) {
        let pageElement: any;
        let _scrollings: any[] = [];
        let _lastScrollCount = 0;
        let _options: any = {
            autoScrolling: true,
            scrollbar: false
        };
        if (options) {
            _options = { ..._options, ...options };
        }
        let _sectionIds: string[] = [];
        let _sectionPageIndex: number;
        let pageIndex: number = 0;
        let canScroll = false;
        let scrollerTime: any;
        if (!id) {
            throw "Page element not found";
        }
        let $ = document;
        pageElement = $.getElementById(id);

        if (!pageElement) {
            throw "Page element not found";
        }

        let $e = pageElement;
        $e.style.transform = `translate3d(0px, ${pageIndex}px, 0px)`;
        $e.style.transition = "all 1000ms ease 0s";
        $e.classList.add("single-page-wrapper");

        //#region private methods

        //#region Observer
        const observerCallback = (entries: any, observer: any) => {
            entries.forEach((entry: { intersectionRatio: number; target: any; }) => {
                if (entry.intersectionRatio === 1.0) {
                    let element = entry.target;
                    let attrId = element.getAttribute("id");
                    _sectionPageIndex = _sectionIds.indexOf(attrId);
                    console.log(`${_sectionPageIndex} and scroll ${canScroll}`)
                    canScroll = true;
                }
            });
        }

        const setObserver = (element: any) => {
            const options = {
                root: pageElement,
                rootMargin: '0px',
                threshold: 1.0
            }
            let observer = new IntersectionObserver(observerCallback, options);
            observer.observe(element);
        }
        //#endregion

        const getCellElement = (): any => {
            var cellDiv = $.createElement("div");
            cellDiv.setAttribute("class", "sp-cell");
            setSectionHeight(cellDiv);
            return cellDiv;
        }

        const setSectionHeight = (element: any) => {
            element.style = "height:" + window.innerHeight + "px;";
        }

        const initSections = () => {
            $e.querySelectorAll(".section").forEach((element: any) => {
                setSectionHeight(element);
                const attr_id = element.getAttribute("id");
                if (!attr_id) {
                    throw "Section id is missing";
                }
                _sectionIds.push(attr_id);
                const cellEle = getCellElement();
                cellEle.innerHTML = element.innerHTML;
                element.innerHTML = "";
                element.appendChild(cellEle);
                setObserver(element);
            });
        }

        const getAverage = (eleList: any, num: any) => {
            let sum = 0;

            let lastEles = eleList.slice(Math.max(eleList.length - num, 1));

            for (var i = 0; i < lastEles.length; i++) {
                sum = sum + lastEles[i];
            }

            return Math.ceil(sum / num);
        }

        const scrollPageUp = () => {
            let sec_id: string = "";
            if (_sectionPageIndex > 0) {
                sec_id = _sectionIds[--_sectionPageIndex];
            }
            if (sec_id === "") {
                canScroll = true;
                return;
            }
            scrollToSection(sec_id);
        }

        const scrollPageDown = () => {
            let sec_id: string = "";
            if (_sectionPageIndex < _sectionIds.length - 1) {
                sec_id = _sectionIds[++_sectionPageIndex]
            }
            if (sec_id === "") {
                canScroll = true;
                return;
            }
            scrollToSection(sec_id);
        }

        const scrollToSection = (sectionId: string) => {
            const section = document.getElementById(sectionId);
            if (section) {
                if (_options["sameurl"]) {
                    section.scrollIntoView();
                } else {
                    location.hash = sectionId;
                }
            }
        }

        const listners = {
            keyDown: (key: { which: any; }) => {
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
            mouseWheel: (e: any) => {

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
                    scrollerTime = setTimeout(() => {
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
                                } else {
                                    scrollPageUp();
                                }
                            }
                        }
                    }, 100);
                    _lastScrollCount = _scrollings.length;
                    return false;
                }
            }
        }

        const addEventListeners = () => {
            document.removeEventListener("keydown", listners.keyDown);
            document.addEventListener("keydown", listners.keyDown);
            document.removeEventListener("wheel", listners.mouseWheel);
            document.addEventListener("wheel", listners.mouseWheel);
        }

        //#endregion

        initSections();
        //  addEventListeners();

    }
}
