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

document.ready(function () {
    setTimeout(() => {
        new SitePage("pixelbyaj", {
            verticalAlignMiddle: true,
            backgroundColor: "#0a192f",
            sections: [{
                anchor: "About",
                templateUrl: "views/about.html"
            },
            {
                anchor: "Where I've Worked",
                templateUrl: "views/experience.html"
            },
            {
                anchor: "Something I've Built",
                templateUrl: "views/projects.html"
            },
            {
                anchor: "Get In Touch",
                templateUrl: "views/contact.html"
            }
            ],
            anchors: false,
            easing: "ease",
            transitionSpeed: 1000
        });
    }, 500);
    $(document).on("click", ".sp-tab li", (el) => {
        var parentHide= $(".sp-tab .active").removeClass("active");
        var ele = $(el.target);
        ele.addClass("active");
        $(".sp-tab-details .active").removeClass("active").removeClass("show").addClass("hide");
        var relEle = ele.data("extend");
        $("#"+relEle).addClass("show active").removeClass("hide");
        
    });
});

function clickTab() {

}