$(function () {
    $("main").css({"height":document.documentElement.clientHeight});
    $("#alphatets").css({"height":document.documentElement.clientHeight - 100});
    for (let i = 65; i < 91; i++) {
        $("#alphatets").append(`<div class="draggable drag" style="background-color:${getRandomColor()}"><span class="letter">${String.fromCharCode(i)}</span></div>`);
    }

    function deleteLetter($item) {
        if (!$item.hasClass("new_drag")) {
            $item.find(".draggable").remove();
        }
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function addDragabble($item) {
        $($item).draggable({
            scroll: false,
            containment: ".droppable",
            cursor: "move",
        });
    }

    $(".drag").draggable({
        scroll: false,
        containment: "document",
        helper: "clone",
        cursor: "move",
        stop: function (event, ui) {
            //$(this).css({ "position": "relative" });
            deleteLetter(ui.helper);
        }
    });

    $(".droppable").droppable({
        accept: ".drag",
        drop: function (event, ui) {
            if (!ui.draggable.hasClass("new_drag")) {
                ui.draggable.addClass("new_drag");
                ui.draggable.removeClass("drag");
                $(ui.draggable).draggable("destroy");
                $(".droppable").append(ui.draggable);
                speak($(ui.draggable).text());
                setTimeout(() => {
                    addDragabble(ui.draggable);
                });
            }
        }
    });

    $("#reset").on('click', () => {
        window.location.reload(true);
    });

    $("#play").on('click', () => {
        let _this='';
        $(".new_drag").each(function () {
             _this += $(this).text();
        });
        speak(_this);
    });

    $("#sort").on('click', () => {
        $(".new_drag").css({ "top": "0", "left": "0" });
    });

    $("#case").on('click', function () {
        if ($(this).text() === "L") {
            $(".alphatets").css({ "text-transform": "lowercase" });
            $(this).text('U');
        } else {
            $(".alphatets").css({ "text-transform": "uppercase" });
            $(this).text('L');
        }
    });

});