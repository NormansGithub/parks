$(document).ready(_ => {
    let isEmailOkay = true;
    let isUsernameOkay = true;
    let isPasswordOkay = true;
  
    $('#email').change(function() {
        const str = $('#email').val();
        const patt = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

        if (!str.length) {
            $(this).removeClass('is-valid').addClass('is-invalid');
        }
        else if (!patt.test(str)){
            $(this).removeClass('is-valid').addClass('is-invalid');
            $('#email-error').html('Please provide a valid email.').show();
            isEmailOkay = false;
            updateSubmitButton(isEmailOkay);
        }
        else if (email.indexOf(str) > -1){
            $(this).removeClass('is-valid').addClass('is-invalid');
            $('#email-error').html('This email is already in use.').show();
            isEmailOkay = false;
            updateSubmitButton(isEmailOkay);
        }
        else {
            $(this).removeClass('is-invalid').addClass('is-valid');
            $('#email-error').hide();
            isEmailOkay = true;
            updateSubmitButton(isEmailOkay && isUsernameOkay && isPasswordOkay);
        }
    });

    $('#username').change(function() {
        if (username.indexOf($('#username').val()) > -1) {
            $(this).removeClass('is-valid').addClass('is-invalid');
            $('#username-error').html('This username is already in use.').show();
            isUsernameOkay = false;
            updateSubmitButton(isUsernameOkay);
        }
        else if (!$('#username').val().length) {
            $(this).removeClass('is-valid').addClass('is-invalid');
            $('#username-error').html('Your username is too short.').show();
            isUsernameOkay = false;
            updateSubmitButton(isUsernameOkay);
        }
        else {
            $(this).removeClass('is-invalid').addClass('is-valid');
            $('#username-error').hide();
            isUsernameOkay = true;
            updateSubmitButton(isEmailOkay && isUsernameOkay && isPasswordOkay);
        }
    });

    $('#password').change(function() {
        if (!$('#confirmation').val()) {
            //do nothing
        }
        else if ($('#password').val() === $('#confirmation').val()) {
            $(this).removeClass('is-invalid').addClass('is-valid');
            $('#confirmation').removeClass('is-invalid').addClass('is-valid');
            $('#password-error').hide();
            isPasswordOkay = true;
            updateSubmitButton(isEmailOkay && isUsernameOkay && isPasswordOkay);
        }
        else {
            $(this).removeClass('is-valid').addClass('is-invalid');
            $('#confirmation').removeClass('is-valid').addClass('is-invalid');
            $('#password-error').show();
            isPasswordOkay = false;
            updateSubmitButton(isPasswordOkay);
        }
    });

    $('#confirmation').change(function() {
        if ($('#password').val() === $('#confirmation').val()) {
            $('#password').removeClass('is-invalid').addClass('is-valid');
            $(this).removeClass('is-invalid').addClass('is-valid');
            $('#password-error').hide();
            isPasswordOkay = true;
            updateSubmitButton(isEmailOkay && isUsernameOkay && isPasswordOkay);
        }
        else {
            $('#password').removeClass('is-valid').addClass('is-invalid');
            $(this).removeClass('is-valid').addClass('is-invalid');
            $('#password-error').show();
            isPasswordOkay = false;
            updateSubmitButton(isPasswordOkay);
        }
    });
});

const updateSubmitButton = isOkay => $("#submit-button").prop("disabled", !isOkay)