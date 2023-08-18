$(function () {

    'use strict';

    // Form
    function submitForm() {
        let $submit = $('.submitting'),
            waitText = 'Submitting...';
        const formData = {
            "email": $("#email").val(),
            "organization": $("#organization").val(),
            "country": $("#country").val()
        }
        $.ajax({
            type: "POST",
            url: "https://www.rudsta.in/api/inquire",
            data: JSON.stringify(formData),
            beforeSend: function () {
                $submit.css('display', 'block').text(waitText);
            },
            success: function (uri) {
                const ele = `<div class="row download">
                                        <div class="col-md-12">
                                            <input type="button" value="Download"
                                            class="btn btn-primary rounded-0 py-2 px-4">
                                                <span class="Download"></span>
                                        </div>
                                    </div>`
                $(".submit").remove();
                $("form").append(ele);
                $(".download").off();
                $(".download").on("click", function () {
                    window.open(uri, "_blank");
                });
            },
            error: function () {
                $('#form-message-warning').html("Something went wrong. Please try again.");
                $('#form-message-warning').fadeIn();
                $submit.css('display', 'none');
            }
        });
    }
    var inquiryForm = function () {

        if ($('#inquiryForm').length > 0) {
            $("#inquiryForm").validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    organization: {
                        required: true,
                    },
                    country: "required",
                },
                messages: {
                    email: "Please enter a valid email address",
                    organization: "Please enter a organization name",
                    country: "Please enter your country name",
                },
                /* submit via ajax */
                submitHandler: function (form) {
                    grecaptcha.ready(function () {
                        grecaptcha.execute('6LeIRzknAAAAAEvd1DagT36qqGbplxCJUs2z8fjj', { action: 'submit' }).then(function (token) {
                            submitForm();
                        });
                    });
                }

            });
        }
    };
    inquiryForm();

});

