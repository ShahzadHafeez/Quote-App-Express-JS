$(function () {
    $.validator.setDefaults({
        errorClass: 'help-block',
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
            //$(element).closest('.form-group').find('input').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        }
    });

    $.validator.addMethod("noSpace", function (value, element) {
        return value == "" || value.trim().length != 0;
    }, 'Spaces are not allowed.');

    $("#signupForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            firstName: {
                required: true,
                minlength: 3,
                noSpace: true
            },
            lastName: {
                required: true,
                minlength: 3,
                noSpace: true
            },
            password: {
                required: true,
                minlength: 8,
                noSpace: true
            },
            confirmPwd: {
                required: true,
                minlength: 8,
                noSpace: true,
                equalTo: '#password'
            }
        },
        messages: {
            email: {
                required: 'Email is required.',
                email: 'Enter a valid Email address.'
            },
            firstName: {
                required: 'First Name is required.',
                minlength: 'First Name should contain at least 3 characters.'
            },
            lastName: {
                required: 'Last Name is required.',
                minlength: 'Last Name should contain at least 3 characters.'
            },
            password: {
                required: 'Password is required.',
                minlength: 'Password should contain at least 8 characters.'
            },
            confirmPwd: {
                required: 'Password is required.',
                minlength: 'Password should contain at least 8 characters.',
                equalTo: 'Confirm Password should be same as above password.'
            }
        }
    });
});

function setError(field, msg) {
    $(field).closest('.form-group').addClass('has-error');
    $('#form_signup_alert').addClass('alert-danger').html(msg).show();
}

/*server response error handling*/
function handleError(responseObj) {
    try {
        if (!responseObj || responseObj.length <= 0) {
            $('#form_signup_alert').addClass('alert-danger').html('Server Error!').show();
            return true;
        }

        if (!responseObj[0] && !responseObj[0].context && !responseObj[0].context.key && !responseObj[0].message) {
            $('#form_signup_alert').addClass('alert-danger').html('Something went Wronge! Please Try Again Later.').show();
            return true;
        }

        var element = responseObj[0].context.key;
        var msg = responseObj[0].message;

        switch (element) {
            case 'firstName':
                setError($('#firstName'), msg);
                break;
            case 'lastName':
                setError($('#lastName'), msg);
                break;
            case 'email':
                setError($('#email'), msg);
                break;
            case 'password':
                setError($('#password'), msg);
                break;
            case 'confirmPwd':
                setError($('confirmPwd'), msg);
                break;
            default:
                if (msg)
                    $('#form_signup_alert').addClass('alert-danger').html(msg).show();
                else
                    $('#form_signup_alert').addClass('alert-danger').html('Something went Wronge! Please Try Again Later.').show();
                break;
        }
    } catch (err) {
        $('#form_signup_alert').addClass('alert-danger').html('Something went Wronge! Please Try Again Later.').show();
    }
}

$(document).ready(function () {
    $('#btn_signup').on('click', function (evt) {
        evt.preventDefault();
        $('#form_signup_alert').removeClass('alert-success').html('').hide();
        if (!$('#signupForm').valid()) {
            return true;
        } else {
            const firstName = $('#firstName').val();
            const lastName = $('#lastName').val();
            const email = $('#email').val();
            const password = $('#password').val();
            const confirmPwd = $('#confirmPwd').val();

            const data = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                confirmPwd: confirmPwd
            }
            $('#spinner').show();
            $.ajax({
                type: "POST",
                url: $('#signupForm').attr('action'),
                data: JSON.stringify(data),
                crossDomain: true,
                dataType: "json",
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                success: function (data, status) {
                    $('#form_signup_alert').addClass('alert-success').html('Signup Successfully!').show();
                    $('#spinner').hide();
                    $(location).attr('href', '/user/login');
                },
                error: function (xhr, status) {
                    handleError(xhr.responseJSON);
                    $('#spinner').hide();
                }
            });
        }
    });

});