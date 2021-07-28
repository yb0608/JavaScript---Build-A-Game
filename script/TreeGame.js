/*I have implemented the following requirements:
    1.DOM element creation, deletion or modification
    2.Capturing and handling events (beyond just a “Do it!” button
    3.Creating and handling a data structure (JSON, custom objects, etc)
    4.Form validation*/


window.onload = function () {

    /*----------------------------Guessing Game----------------------------*/
    var identify = document.getElementById("identify");
    var game = {
        tree: {
            answers: ["ginkgo", "maidenhair"],
            maxcount: 3,
            counts: 0,
            correct: false
        },
        leaf: {
            answer: "leaf4",
            correct: false
        }
    };

    var okBttn = document.getElementById("okBttn");

    okBttn.addEventListener("click", function (event) {
        var counts_left = document.getElementById("counts_left");
        var answer = document.getElementById("answer");

        if (game.tree.counts < 3) {
            game.tree.counts++;
            counts_left.innerHTML = game.tree.maxcount - game.tree.counts + " ";
        }


        game.tree.correct = game.tree.answers.includes(answer.value);

        if (game.tree.correct) {
            show_leaf_game();
            document.getElementById("right").style.display = "block";

        } else {
            show_tree_hint(game.tree.counts);
        }
    });

    function show_tree_hint(counts) {
        if (counts == 1) {
            document.getElementById("fruitHint").style.display = "block";
            document.getElementById("fruitPic").style.display = "inline";
        } else if (counts == 2) {
            document.getElementById("fruitHint").style.display = "none";
            document.getElementById("leafHint").style.display = "block";
            document.getElementById("leafPic").style.display = "inline";
        } else if (counts == 3) {
            document.getElementById("wrong").style.display = "block";
            show_leaf_game();
        }
    }

    function show_leaf_game() {
        identify.style.display = "block";
    }


    /*----------------------------------Identify-----------------------------*/
    
    var drawing_ref = document.getElementById("drawingRef");
    var img_list = document.getElementsByClassName("id_img");
    var canvas_div = document.getElementById("canvas");

    $(".id_img").click(function (evt) {
        if (evt.target.id == game.leaf.answer) {
            alert("Well Done!")
            show_drawing_game()
        } else {
            alert("Sorry, Please try again.")
        }
    });


    function show_drawing_game() {
        drawing_ref.style.display = "block";
        canvas_div.style.display = "block";
    }




    /*----------------------------Drawing Section----------------------------*/

    var canvas = document.getElementById("c1");
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    var isDrawing;

    $('canvas').mousedown(function (evt) {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(evt.offsetX, evt.offsetY);
    });

    $('canvas').mousemove(function (evt) {
        if (isDrawing) {
            ctx.lineTo(evt.offsetX, evt.offsetY);
            ctx.stroke();
        }
    });

    $('canvas').mouseup(function () {
        isDrawing = false;
    });

    $('.color').click(function () {
        ctx.strokeStyle = this.id;
    });

    $('#clear').click(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });


    $('#capture').click(function () {
        $('#drawingRef').append("<IMG src=" + canvas.toDataURL("image/png") + ">");
        window.location.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        $('.facts').show();
    });




    /*---------------------------Learning Section---------------------*/

    const selectMenuObject = {
        Flower: [" male flowers (sometimes called pollen cones) are 2.5 cm long, catkin-like, with numerous stamens loosely arranged; female flowers are long stalked, 4-5 cm, solitary, with two opposing ovules at the end of the stalk."],
        Fruits: ["The first use as a medicine is recorded in the late 15th century in China; among western countries, its first registered medicinal use was in Germany in 1965. It has been used in traditional treatment of Alzheimer's disease."],
        Leaves: ["The leaves are unique among seed plants, being fan-shaped with veins radiating out into the leaf blade, sometimes bifurcating (splitting), but never anastomosing to form a network.", "Ginkgo tree leaves will turn to bright yellow in fall seasons."]
    };

    var firstSelect = document.getElementById("firstSelect");
    var message = document.getElementById("messageShow");

    for (var catagory in selectMenuObject) {
        createMenuOptions(firstSelect, catagory);
    }

    function createMenuOptions(selectElement, menuText) {
        var optionElement = document.createElement("OPTION");
        var textNode = document.createTextNode(menuText);
        optionElement.appendChild(textNode);
        selectElement.appendChild(optionElement);
    };

    firstSelect.addEventListener("change", function () {

        message.innerHTML = " "
        var a = this.value
        for (var i = 0; i < selectMenuObject[a].length; i++) {
            createMenuOptions(message, selectMenuObject[a][i]);
        }

    })



    /*---------------------------Card Making---------------------*/
    
    firstSelect.addEventListener("blur", function () {
        $('div.Card').show();
    });
                                 
    /*------------------------ID(phone) Format-------------------*/
    var phoneNum = document.getElementById('phone');
    var phoneSpan = document.getElementById('phoneSpan');
    phoneSpan.style.display = "none";
    function format(el) {
        
        var phNbr = el.value.trim(); 
        var cleanNbr = phNbr.replace(/[^\d]/g, '');
        var formattedNbr = cleanNbr.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        el.value = formattedNbr;
    }

    phoneNum.addEventListener('blur', function () {
        var val = this.value;

        if (val.replace(/[^0-9]/g, '').length == 10) {
            if (!val.match(/\d{3}-\d{3}-\d{4}/)) {
                format(this);
                phoneSpan.style.display = "none";
            }
        }else if(val.replace(/[^0-9]/g, '').length !== 10){
            phoneSpan.style.display = "block";
        }
    });
    
    
    /*------------------------------Card Display---------------------------*/
    var otptArea = document.getElementById("output");

    $('#cardbttn').click(function () {
        var entries = [];
        var name = document.getElementById("name").value;
        var phone = document.getElementById("phone").value;
        var counts = game.tree.counts;
        $('div.Card #idImg').append("<IMG src=" + canvas.toDataURL("image/png") + ">");

        function cardEntry(name, phone, counts) {
            this.name = name;
            this.phone = phone;
            this.counts=counts;
        }

        var entry = new cardEntry(name, phone, counts);
        writeRowToPage(entry, otptArea);

        entries.push(entry);

        var entry_json = JSON.stringify(entries);
        window.localStorage.setItem("allEntries", entry_json);

    });

    function writeRowToPage(dataObject, element) {
        var s = "<div class=\"info\">";

        s += '<div class="nameDiv">';
        if (dataObject.name !== 'undefined') {
            s += dataObject.name;
        }
        s += '</div><div class="phoneDiv">';
        if (dataObject.phone !== 'undefined') {
            s += dataObject.phone;
        }
        s += '</div><div class="countsDiv">';
        if (dataObject.counts !== 'undefined') {
            s += dataObject.counts;
        }

        s += '</div></div>';

        element.innerHTML += s;
    }

    var getBack = JSON.parse(window.localStorage.getItem("allEntries"));
    for (var i = 0; i < getBack.length; i++) {
        var entry_obj = getBack[i];
        writeRowToPage(entry_obj, otptArea);
    }


};
