Document.prototype.ready = function(fn) {
    var readyFunc = function(resolve, reject) {
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
        .catch(function(error) {
            throw error;
        });
    return promise;
};

document.ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const navigation = urlParams.get('navigation') ? urlParams.get('navigation') : 'vertical';
    const sameurl = urlParams.get('sameurl') ? urlParams.get('sameurl') : false;
    const autoscrolling = urlParams.get('autoscrolling') ? urlParams.get('autoscrolling') : false;
    new SitePage("sitePage", {
        brandName: "",
        sections: [{
                anchor: "Home",
                templateUrl: "./views/home.html",
                backgroundColor: "#45b4f5"
            },
            {
                anchor: "Features",
                templateUrl: "./views/features.html",
                backgroundColor: "#fc6c7c"
            },
            {
                anchor: "Examples",
                templateUrl: "./views/examples.html",
                backgroundColor: "#1bbc9b"
            }
        ],
        navigation: navigation,
        easing: "ease",
        sameurl: sameurl,
        transitionSpeed: 1000,
        autoScrolling: autoscrolling,
        keyboardNavigation: true,
        pageTransitionStart: (prevPage, currentPage) => {
            console.log(`prevPage: ${prevPage ? prevPage.id : ""} currentPage :${currentPage.id}`);
        },
        pageTransitionEnd: (currentPage) => {
            console.log(`currentPage :${currentPage.id}`);
        }
    });
});