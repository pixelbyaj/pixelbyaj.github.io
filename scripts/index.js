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
    new SinglePageBeta("singlePage", {
        navigation: "horizontal",
        easing: "ease",
        sameurl: false,
        transitionSpeed: 1000,
        keyboardNavigation: true,
        backgroundColor: ["#ff5f45", "#fec401", "#fc6c7c"],
        pageTransitionStart: (prevPage, currentPage) => {
            console.log(`prevPage: ${prevPage.id} currentPage :${currentPage.id}`);
        },
        pageTransitionEnd: (currentPage) => {
            console.log(`currentPage :${currentPage.id}`);

        }
    });
});