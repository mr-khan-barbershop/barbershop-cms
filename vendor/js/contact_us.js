// Formspree contact form handler
$(".contact_btn").on('click', function (e) {
    e.preventDefault(); // Prevent default form submission
    
    // Show loading spinner
    $(".contact_btn i").removeClass('d-none');
    $(".contact_btn").prop('disabled', true);
    
    // Simple validation
    var proceed = true;
    $('#contact-form-data input[required], #contact-form-data textarea[required]').each(function() {
        if(!$(this).val().trim()){
            proceed = false;
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    
    if (proceed) {
        // Submit form to Formspree
        $.ajax({
            type: 'POST',
            url: $('#contact-form-data').attr('action'),
            data: $('#contact-form-data').serialize(),
            dataType: 'json',
            success: function (response) {
                $('#result').html('<div class="alert alert-success" style="padding:10px 15px; margin-bottom:30px;">Wiadomość została wysłana pomyślnie! Odpowiemy wkrótce.</div>');
                $('#contact-form-data')[0].reset();
            },
            error: function (xhr, status, error) {
                $('#result').html('<div class="alert alert-danger" style="padding:10px 15px; margin-bottom:30px;">Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.</div>');
            },
            complete: function() {
                // Hide loading spinner
                $(".contact_btn i").addClass('d-none');
                $(".contact_btn").prop('disabled', false);
            }
        });
    } else {
        // Hide loading spinner
        $(".contact_btn i").addClass('d-none');
        $(".contact_btn").prop('disabled', false);
        $('#result').html('<div class="alert alert-warning" style="padding:10px 15px; margin-bottom:30px;">Proszę wypełnić wszystkie wymagane pola.</div>');
    }
});

// Remove validation styling on input focus
$('#contact-form-data input, #contact-form-data textarea').on('focus', function() {
    $(this).removeClass('is-invalid');
});