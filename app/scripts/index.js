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



const gitCV = function(userName) {

    let loading = false;
    let interval;
    let apiUrl = "https://getgistresumejson.azurewebsites.net/api/gitcv/" + userName;

    const loader = function() {
        interval = setInterval(function() {
            if (loading) {
                $(".preloader-animation").css("opacity", 0.5);
            } else {
                $(".preloader-animation").css("opacity", 0.1);
            }
            loading = !loading;
        }, 200);
    };

    const hideAll = function() {
        $(".navbar").hide();
        $("#gitcv").hide();
        $(".copyrights").hide();
        $(".preloader").css("display", "none");
        clearInterval(interval);
    };

    const initSitePage= function(sections, id = "pixelbyaj") {
        new SitePage(id, {
            pageIndicator:false,
            //brandname
            backgroundColor: "#444",
            //sections
            sections: sections,
            //navigation
            anchors: false, //true|false
            navigation: 'vertical', //horizontal|vertical
            sameurl: true, //true|false
            hamburger: false, //{
            //lineColor: "#fff",
            //closeOnNavigation: false,
            //backgroundColor: ""
            //},
            //transition
            easing: "ease", //ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n)
            transitionSpeed: 1000, //speed in ms
            //scrolling
            autoScrolling: true, //true|false
            keyboardNavigation: true, //true|false
        });
    }
    if (!userName) {
        $(".preloader").css("display", "none");
        $(".navbar").hide();
        return {
            init: initSitePage
        }
    }
    const ready = function() {
        $("#gitcv").show();
        $(".copyrights").show();
        $(".preloader").css("display", "none");
        clearInterval(interval);
    };

    const show404 = function() {
        var notFoundTemplate = `<div id="notfound">
            <div class="notfound">
                <div class="notfound-404">
                    <h1>404</h1>
                </div>
                <h2>Oops, The Page you are looking for can't be found!</h2>
                <form class="notfound-search" action="/" method="get">
                    <input type="text" placeholder="Search..." name="q" id="q">
                    <button type="button" id="search">Search</button>
                </form>
            </div>
        </div>`;
        $("#404").html(notFoundTemplate);
    }

    const handleErrors = function(response) {
        hideAll();
        show404();
    };



    function invoke(jsonResume) {

        let sections = [{
            anchor: "About Me",
            templateId: "aboutme",
            backgroundColor: "transparent",
            sectionClass: "text-left",
            verticalAlignMiddle: true
        }];

        jsonResume.skills = jsonResume.skills || [];
        if (jsonResume.skills.length > 0) {
            sections.push({
                anchor: "Skills",
                templateId: "skills",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            });
        }

        jsonResume.work = jsonResume.work || [];
        if (jsonResume.work.length > 0) {
            sections.push({
                anchor: "Experience",
                templateId: "experience",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: false,
            });
        }

        jsonResume.education = jsonResume.education || [];
        if (jsonResume.education.length > 0) {
            sections.push({
                anchor: "Education",
                templateId: "education",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            });
        }

        jsonResume.volunteer = jsonResume.volunteer || [];
        jsonResume.publications = jsonResume.publications || [];
        if (jsonResume.volunteer.length > 0 || jsonResume.publications.length > 0) {
            sections.push({
                anchor: "Misc",
                templateId: "misc",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            });
        }

        jsonResume.awards = jsonResume.awards || [];
        if (jsonResume.awards.length > 0) {
            sections.push({
                anchor: "Awards",
                templateId: "awards",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            });
        }

        initSitePage(sections);

        function GitResumeModel() {

            var self = this;
            self.isVol = ko.observable(false);
            self.isPub = ko.observable(false);
            self.isAwards = ko.observable(false);
            jsonResume.basics.picture = jsonResume.basics.picture || "https://s.gravatar.com/avatar/7e6be1e623fb85adde3462fa8587caf2?s=100&r=pg&d=mm";
            self.resume = ko.observable(jsonResume);
            jsonResume.basics.profiles = jsonResume.basics.profiles || [];
            jsonResume.skills = jsonResume.skills || [];
            self.profiles = ko.observableArray(jsonResume.basics.profiles);
            self.skills = ko.observableArray(jsonResume.skills);

            //#region  Contacts
            var getLocation = function() {
                var location = jsonResume.basics.location;
                var address = [];
                if (location.address) {
                    address.push(location.address);
                }
                if (location.city) {
                    address.push(location.city);
                }
                if (location.region) {
                    address.push(location.region);
                }
                if (location.postalCode) {
                    address.push(location.postalCode);
                }
                if (location.countryCode) {
                    address.push(location.countryCode);
                }
                return address.join(", ");
            }
            self.contacts = [];
            if (jsonResume.basics.location) {
                self.contacts.push({
                    "icon": "fa fa-map-marker title",
                    "text": getLocation()
                });
            }
            if (jsonResume.basics.phone) {
                self.contacts.push({
                    "icon": "fa fa-phone title",
                    "text": jsonResume.basics.phone
                });
            }
            if (jsonResume.basics.email) {
                self.contacts.push({
                    "icon": "fa fa-envelope title",
                    "text": jsonResume.basics.email
                });
            }
            if (jsonResume.basics.website) {
                self.contacts.push({
                    "icon": "fa fa-link title",
                    "text": jsonResume.basics.website
                });
            }

            jsonResume.languages = jsonResume.languages || [];
            if (jsonResume.languages.length > 0) {
                var languages = jsonResume.languages.map(function(item) {
                    return item.language;
                });
                self.contacts.push({
                    "icon": "fa fa-language title",
                    "text": languages.join(", ")
                });
            }


            //#endregion

            //#region Education
            self.education = ko.observableArray(jsonResume.education);
            //#endregion

            //#region Work
            jsonResume.work.forEach(function(work) {
                work.companyDate = `${work.startDate || ''} - ${work.endDate || ''}`;
                work.highlights = work.highlights || [];
            });
            self.work = ko.observableArray(jsonResume.work);
            //#endregion

            //#region Volunteer
            if (jsonResume.volunteer.length > 0) {
                self.volunteers = ko.observable(jsonResume.volunteer);
                self.isVol = ko.observable(true);
            }
            //#endregion

            //#region Publication
            if (jsonResume.publications.length > 0) {
                self.publications = ko.observable(jsonResume.publications);
                self.isPub = ko.observable(true);
            }
            //#endregion

            //#region Awards
            if (jsonResume.awards.length > 0) {
                self.isAwards = ko.observable(true);
                self.awards = ko.observable(jsonResume.awards);
            }
            //#endregion

            //#region  Interests
            self.interests = ko.observable(jsonResume.interests);
            //#endregion
            self.getData = function(item, key) {
                return item[key] || "NA";
            }

            self.ifExist = function(item, key, val) {
                if (item[key] === undefined) {
                    item[key] = val;
                    return false;
                }
                return true;
            }

        }

        ko.applyBindings(new GitResumeModel());
    }

    const fetchJsonResume = function() {
        
        $.get(apiUrl)
            .done(function(response) {
                ready();
                invoke(response);
            })
            .fail(handleErrors);
    };

    return {
        init: function() {
            loader();
            fetchJsonResume();
        },
        initSitePage: initSitePage
    }
}


let sections = [{
    anchor: "Help",
    templateId: "help",
    backgroundColor: "#fc6c7c",
    verticalAlignMiddle: true
}];
document.ready(function() {
    const userName = 'pixelbyaj';
    new gitCV(userName).init();    
});
