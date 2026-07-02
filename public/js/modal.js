var trigger = document.querySelectorAll(".trigger");


trigger.forEach(function(btn) {

    btn.onclick = function() {
        var modal = btn.getAttribute("data-modal");
        document.getElementById(modal).style.display = "block";
        $("body").css("overflow", "hidden");
                
    };

});

window.onclick = function(e) {

    if (e.target.className === "modal-hidden") {
        e.target.style.display = "none"        
        $("body").css("overflow", "visible");
    }

  };

