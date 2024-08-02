Document.prototype.ready = function (fn) {
    var readyFunc = function (resolve, reject) {
        // The ready event handler and self cleanup method
        function completed() {
            document.removeEventListener("DOMContentLoaded", completed);
            window.removeEventListener("load", completed);
            resolve();
        }

        // Catch cases where $(document).ready() is called
        // after the browser event has already occurred.
        if (document.readyState !== "loading") {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            window.setTimeout(completed);

        } else {
            // Use the handy event callback
            document.addEventListener("DOMContentLoaded", completed);
            // A fallback to window.onload, that will always work
            window.addEventListener("load", completed);
        }
    }
    var promise = new Promise(readyFunc);
    promise
        .then(fn)
        .catch(function (error) {
            throw error;
        });
    return promise;
};
let expCarousel;
let projCarousel;
document.ready(function () {
    setTimeout(() => {
        new SitePage("iso20022", {
            verticalAlignMiddle: true,
            backgroundColor: "#0a192f",
            sameurl: false,
            sections: [{
                anchor: "About",
                templateUrl: "views/about.html",
                sectionClass: "sp-bg,fadeIn"
            },
            {
                anchor: "Schema",
                templateUrl: "views/schema.html",
                sectionClass: "sp-bg,fadeIn"
            },
            {
                anchor: "Render",
                templateUrl: "views/render.html",
                sectionClass: "sp-bg,fadeIn"
            },
            {
                anchor: "Download/Upload",
                templateUrl: "views/download.html",
                sectionClass: "sp-bg,fadeIn"
            },
            {
                anchor: "Extract",
                templateUrl: "views/parsing.html",
                sectionClass: "sp-bg,fadeIn"
            },
            {
                anchor: "Upload",
                templateUrl: "views/upload.html",
                sectionClass: "sp-bg,fadeIn"
            },
            {
                anchor: "Contact",
                templateUrl: "views/contact.html",
                sectionClass: "sp-bg,fadeIn"
            }
            ],
            anchors: false,
            easing: "ease",
            transitionSpeed: 1500,
            pageTransitionStart: (prevPage, currentPage) => {
                if (prevPage) {
                    $(prevPage).find(".sp-bg").removeClass('fadeIn').addClass('fadeOut')
                }
                $(currentPage).find(".sp-bg").removeClass('fadeOut').addClass('fadeIn')
            },
            pageTransitionEnd: (currentPage) => {

            }
        });
    }, 500);

});
