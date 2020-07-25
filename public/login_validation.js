$(function () {
    $.validator.setDefaults({
        errorClass: 'help-block',
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        }
    });

    $.validator.addMethod("noSpace", function (value, element) {
        return value == "" || value.trim().length != 0;
    }, 'Spaces are not allowed.');

    $("#form_login").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 8,
                noSpace: true
            }
        },
        messages: {
            email: {
                required: 'Email is required.',
                email: 'Enter a valid Email address.'
            },
            password: {
                required: 'Password is required.',
                minlength: 'Password should contain at least 8 characters.'
            }
        }
    });
});

function setError(field, msg) {
    $(field).closest('.form-group').addClass('has-error');
    $('#form_login_alert').addClass('alert-danger').html(msg).show();
}

/*server response error handling*/
function handleError(responseObj) {
    try {
        if (!responseObj || responseObj.length <= 0) {
            $('#form_login_alert').addClass('alert-danger').html('Server Error!').show();
            return true;
        }

        if (!responseObj[0] && !responseObj[0].context && !responseObj[0].context.key && !responseObj[0].message) {
            $('#form_login_alert').addClass('alert-danger').html('Something went Wronge! Please Try Again Later.').show();
            return true;
        }

        var element = responseObj[0].context.key;
        var msg = responseObj[0].message;

        switch (element) {
            case 'email':
                setError($('#email'), msg);
                break;
            case 'password':
                setError($('#password'), msg);
                break;
            default:
                if (msg)
                    $('#form_login_alert').addClass('alert-danger').html(msg).show();
                else
                    $('#form_login_alert').addClass('alert-danger').html('Something went Wronge! Please Try Again Later.').show();
                break;
        }
    } catch (err) {
        $('#form_login_alert').addClass('alert-danger').html('Something went Wronge! Please Try Again Later.').show();
    }
}

$(document).ready(function () {
    $('#btn_login').on('click', function (evt) {
        evt.preventDefault();
        $('#form_login_alert').removeClass('alert-success').html('').hide();
        if (!$('#form_login').valid()) {
            return true;
        } else {
            const email = $('#email').val();
            const password = $('#password').val();
            const data = {
                email: email,
                password: password
            }
            $('#spinner').show();
            $.ajax({
                type: "POST",
                url: $('#form_login').attr('action'),
                data: JSON.stringify(data),
                crossDomain: true,
                dataType: "json",
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                success: function (data, status) {
                    $('#form_login_alert').addClass('alert-success').html('Login Successfully!').show();
                    $('#spinner').hide();
                    $(location).attr('href', '/quote/index');
                },
                error: function (xhr, status) {
                    handleError(xhr.responseJSON);
                    $('#spinner').hide();
                }
            });
        }
    });

});