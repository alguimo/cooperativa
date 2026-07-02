$("#sendmail").submit(function(e) {
    e.preventDefault();
    $('#send').hide();
    $('#loading').show()

    var form = $(this);
    var url = form.attr('action');

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        success: function(data) {
            setTimeout(() => {
                $('#loading').hide()
                $('#send').show();
                $('#sendmail').trigger("reset");
                $('#alerta').slideDown()
            }, 1500)
            setTimeout(() => {
                $('#alerta').slideUp()
            }, 4000)
        }
    });


});