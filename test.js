document.getElementById("extractFromEmail").addEventListener('click', () => {
    // alert("Popup DOM fully loaded and parsed");

    // if (isdocument.getElementById("myTextArea").value.length == 0) {
    //         return;
    //     }

    function modifyDOM() {
        var full_email_text = ""
        for (var i = 1; i<document.body.getElementsByTagName("P").length; i++) {
            full_email_text = full_email_text + " " + document.body.getElementsByTagName("P")[i].textContent
        }
        var sender = document.body.getElementsByClassName("go")[0].innerText
        var sender_name = document.body.getElementsByClassName("gD")[0].innerText
        console.log(sender)
        console.log(sender_name)
        alert("sender_name: " + sender_name + " email: " + sender)
        console.log("p elements text joined together")
        console.log(full_email_text)
        if (full_email_text == "") {
            console.log("need to look inside divs bc no text in p elements")
            var date_regex = /[A-Z][a-z]{0,2} [0-9]{1,2}, [0-9]*,* [0-9]{1,2}:[0-9]{1,2} [A-Z]{2}/;
            var time_regex = /[0-9]{1,2}:[0-9]{1,2} [A-Z]{2}/;
            var no = document.body.getElementsByClassName("no")[1].innerText

            var first_date = no.search(date_regex)
            var second_date = no.substring(first_date+1).search(date_regex)
            if (first_date == -1) {
                first_date = no.search(time_regex);
            }
            if (second_date == -1) {
                second_date = no.lastIndexOf("Reply");
            }

            var full_email_text = no.substring(
                first_date,
                Math.min(first_date+second_date, no.lastIndexOf("Reply"))
            );

            console.log("div text string")
            console.log(full_email_text)
        };

        return full_email_text.trim();
    }

    
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        // add extracted message to myTextArea
        document.getElementById("myTextArea").value = results
    });
});