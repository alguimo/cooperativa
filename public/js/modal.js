var trigger = document.querySelectorAll(".trigger");


trigger.forEach(function(btn) {

    btn.onclick = function(e) {
        if (e) e.preventDefault();
        var modal = btn.getAttribute("data-modal");
        document.getElementById(modal).style.display = "block";
        $("body").css("overflow", "hidden");
                
    };

});

window.onclick = function(e) {

    if (e.target.className === "modal-hidden") {
        e.target.style.display = "none";
        $("body").css("overflow", "visible");
    }

};

// Boton de cerrar modal (X)
var closeButtons = document.querySelectorAll(".modal-close");

closeButtons.forEach(function(closeBtn) {
    closeBtn.addEventListener("click", function() {
        var modal = closeBtn.closest(".modal-hidden");
        if (modal) {
            modal.style.display = "none";
            $("body").css("overflow", "visible");
        }
    });
});

// Selector de pestañas Frontal / Etiqueta en movil
var tabButtons = document.querySelectorAll(".modal-tab-btn");

tabButtons.forEach(function(tabBtn) {
    tabBtn.addEventListener("click", function() {
        var modalContent = tabBtn.closest(".modal-producto");
        if (!modalContent) return;

        var tabs = modalContent.querySelectorAll(".modal-tab-btn");
        tabs.forEach(function(t) {
            t.classList.remove("active");
        });
        tabBtn.classList.add("active");

        var colFrontal = modalContent.querySelector(".modal-col-frontal");
        var colEtiqueta = modalContent.querySelector(".modal-col-etiqueta");
        var target = tabBtn.getAttribute("data-tab");

        if (target === "etiqueta") {
            if (colFrontal) colFrontal.classList.add("d-none", "d-md-block");
            if (colEtiqueta) colEtiqueta.classList.remove("d-none");
        } else {
            if (colFrontal) colFrontal.classList.remove("d-none");
            if (colEtiqueta) colEtiqueta.classList.add("d-none", "d-md-block");
        }
    });
});

// Efecto lupa interactiva en imagenes de productos (Desktop)
var zoomContainers = document.querySelectorAll(".zoom-container");

zoomContainers.forEach(function(container) {
    var img = container.querySelector("img");
    if (!img) return;

    container.addEventListener("mousemove", function(e) {
        if (window.innerWidth < 768) return;
        var rect = container.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = x + "% " + y + "%";
    });

    container.addEventListener("click", function() {
        if (window.innerWidth < 768) return;
        container.classList.toggle("zoom-extra");
    });

    container.addEventListener("mouseleave", function() {
        container.classList.remove("zoom-extra");
        if (window.innerWidth >= 768) {
            img.style.transformOrigin = "center center";
        }
    });
});
