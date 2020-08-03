//stage emails to be summarized
function read_emails() {
	// alert("sending request to cloud fn");

	// var gmail_id = document.querySelector('[data-message-id]').getAttribute('data-legacy-message-id');
	// var user_id = 'me';

	// function getMessage(userId, messageId, callback) {
	//   var request = gapi.client.gmail.users.messages.get({
	//     'userId': userId,
	//     'id': messageId
	//   });
	//   request.execute(callback);
	// }
	// var email_text = getMessage(user_id, gmail_id)
	// console.log(email_text)

	return document.getElementById("myTextArea").value
}

function add_one_item_to_todo(result, id_counter) {
	if (result == "No Task Sentence Found.") {
		alert("No task sentence found.");
		return;
	}
	//ALL OF THIS IS JUST SETTING UP THE ENVIRONMENT
	var col_div = document.createElement("div");
	var card_div = document.createElement("div");
	var tab_head_div = document.createElement("div");
	var tab_div = document.createElement("div");
	var card_body_div = document.createElement("div");

	col_div.appendChild(card_div);
	card_div.appendChild(tab_head_div);
	card_div.appendChild(tab_div);
	tab_div.append(card_body_div);

	col_div.className += "col-12";
	card_div.className += "card card-checklist";
	tab_head_div.setAttribute("role", "tab");
	tab_head_div.className += "tab-checklist";
	tab_div.className += "collapse";


	tab_div.setAttribute("id", "item".concat(id_counter));
	tab_div.setAttribute("data-parent", "#checklist");
	card_body_div.className += "card-body extraction-dropdown-top-margin";

	//TEXT GOES HERE
	var inputText = document.createTextNode(result);
	var header3 = document.createElement("h3");
	var itemText = document.createElement("span");
	var tabButton = document.createElement("a");
	
	tab_head_div.appendChild(header3);
	tab_head_div.appendChild(tabButton);
	header3.appendChild(itemText);

	header3.className += "mb-0";

	itemText.className += "text-action a";
	itemText.setAttribute("contenteditable", "true");
	itemText.setAttribute("name", "task");
	itemText.appendChild(inputText);

	tabButton.className += "fa fa-caret-down d-flex align-items-center extraction-dropdown-button";
	tabButton.setAttribute("data-toggle", "collapse");
	tabButton.setAttribute("data-target", "#item".concat(id_counter))

	//DROPDOWN LINKS
	var option0 = document.createElement("span");
	option0.appendChild(document.createTextNode("Sender: "));

	var option0_child = document.createElement("span");
	option0_child.setAttribute("contenteditable", "true");
	option0_child.appendChild(document.createTextNode("Extraction"));

	option0.appendChild(option0_child);

	card_body_div.appendChild(option0);

	// var option1 = document.createElement("a");
	// option1.appendChild(document.createTextNode("Go to Original E-mail"));
	// card_body_div.appendChild(option1);

	var option2 = document.createElement("a");
	option2.appendChild(document.createTextNode("Remove"));
	card_body_div.appendChild(option2);

	option2.onclick = function() {
		col_div.style.display = "none"; 
	}

	var option3 = document.createElement("a");
	option3.className += "extraction-dropdown-top-margin";
	option3.appendChild(document.createTextNode("Move to Top"));
	card_body_div.appendChild(option3);

	option3.onclick = function() {
		var list = document.getElementById("checklist");
		list.insertBefore(col_div, list.childNodes[0]);
	}

	var element = document.getElementById("checklist");
	element.appendChild(col_div);
}

var id_counter = 0;
//should take in list of strings
function add_to_todo(results) {
	if (results.length == 0) {
	  		alert('No tasks identified!')
	  	}
	// console.log(results.length)
	for (i in results) {
		id_counter += 1;
		add_one_item_to_todo(results[i], id_counter);
	}
}

function start () {
	var extractButton = document.getElementById("extractButton");
	extractButton.innerHTML = "";
	extractButton.className += " inactiveLink";
	
	var load_div = document.createElement("div");
	load_div.className = "loader";
	load_div.id = "loader";
	
	extractButton.appendChild(load_div);


	var email_text = read_emails();
	summarize(email_text);

	// changes back after cloud function is called.. look in summarize


}

//Summarize also adds tasks to the to_do_list
function summarize(email_text) {

	function status(response) {
	  if (response.status >= 200 && response.status < 300) {
	  	alert('good response')
	    return Promise.resolve(response)
	  } else {
	  	alert('bad response')
	    return Promise.reject(new Error(response.statusText))
	  }
	}

	var cloud_fn_url = 'https://us-central1-sigma-smile-251401.cloudfunctions.net/classify_summarize'

	console.log(cloud_fn_url);
	
	return fetch(cloud_fn_url, {
	    method: 'post',
	    headers: {
	      'Accept': 'application/json',
        'Content-Type': 'application/json'
	    },
	    body: JSON.stringify({"message": email_text})
	  })
	  .then(response => response.json())
	  .then(function (data) {
	  	var results = [];
	  	console.log("Checkpoint")
	    for (i in data) {
	    	results.push(data[i])
	    }
	 //    reqs = data["requests"]
	 //    certs = data["certainty"]

		// for (var i=0; i < reqs.length; i++) {
		// 	var sentence = reqs[i]
		// 	var certainty = certs[i]
		// 	document.getElementById("answer").value += sentence + '\r\n' + '\r\n';

		// 	results.push(sentence);
		// }
	    return results;
	  })
	  .then(function(data) {
	  	add_to_todo(data);

	  	// Changing loading spinner back to normal
	  	extractButton = document.getElementById("extractButton");
	  	extractButton.innerHTML = "Extract from Text Box";
		extractButton.className = "extractButton";
	  })
	  .catch(function (error) {
	    alert(error);
	  });
	}

document.getElementById('extractButton').addEventListener('click', start);

document.getElementById('add-item').addEventListener('click', function() {
	add_to_todo(['Text here']);
})

document.getElementById('copy-clipboard').addEventListener('click', function() {
	var tasks = document.getElementsByName("task");
	var vals = [];

	var checklist_items = document.getElementById("checklist").children;

	for (var i=0; i<checklist_items.length; i++) {
		if (checklist_items[i].style.display == "none") {
			console.log("continue");
			continue;
		}
		else {
			vals.push(tasks[i].childNodes[0].data);
		}
	var copyText = vals.join("\n");
	}	


	var dummy = document.createElement('textarea');
	document.body.appendChild(dummy);
	dummy.value = copyText;
	dummy.select();

	document.execCommand("copy");
	document.body.removeChild(dummy);
})

document.getElementById('clear-textbox').addEventListener('click', function() {
	var textBox = document.getElementById("myTextArea");
	textBox.value = "";
})

$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip('enable');
  $('input[type=checkbox]').click(function() {
    if($(this).prop("checked") == true){
      $('[data-toggle="tooltip"]').tooltip('enable');
    }
    if($(this).prop("checked") == false){
      $('[data-toggle="tooltip"]').tooltip('disable');
    }
  })
})

document.getElementById('helpButton').addEventListener('click', function () {
	window.open("img/ExtrAction_Help_Guide.png")
  }
)

// document.getElementById('clickMe').addEventListener('click', summarize);


// ******** WORK IN PROGRESS ON GMAIL API ********

// gapi.load('client:auth2', () => {
//     gapi.client.load('gmail', 'v1', () => {
//       console.log('Loaded Gmail');
//     });
// })

// var request = gapi.client.gmail.users

// var gmail_id = document.querySelector('[data-message-id]').getAttribute('data-legacy-message-id');
// var user_id = 'me';

// function getMessage(userId, messageId, callback) {
//   var request = gapi.client.gmail.users.messages.get({
//     'userId': userId,
//     'id': messageId
//   });
//   request.execute(callback);
// }

// var email_text = getMessage(user_id,gmail_id);
// console.log(email_text);


// function getMessage() {
// 	var request = gapi.client.gmail.users.messages.get({
// 		'userId': 'me',
// 		'id': 'percivalchen@berkeley.edu'
// 	});

// 	request.execute(function(response) {
// 		$.each(response.m$.each(response.messages, function() {
//       var messageRequest = gapi.client.gmail.users.messages.get({
//         'userId': 'me',
//         'id': this.id
//     })
//       }));
// }
// );
// };
