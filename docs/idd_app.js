(function() {
	beginapp();
})();

function beginapp() {
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}
	this_session.page_history.push( { "PageID": mydocument.InitialPage, "PageName":"", "Content":"" } );
	load_page( get_page_object(mydocument.InitialPage) );
}

function instruction_html( insobj ) {

	var this_return = "";
	/*
	this_return += "<div class='w3-panel w3-border'>";
	this_return += insobj.Content;
	this_return += "</div>";
	*/

	this_return += "<div class='w3-card-4 w3-round-xlarge w3-margin w3-theme-l4'>";
	this_return += "<div class='w3-container'>" + insobj.Content + "</div>";
	this_return += "</div>";

	return this_return;
	
}

function question_html( qobj ) {

	var this_return = "";
	/*
	this_return += "<div class='w3-panel w3-border'>";
	this_return += "<div class='w3-panel w3-theme-l2'>";
	this_return += "<h3>" + qobj.Prompt + "</h3>";	
	this_return += "</div>";

	for( r=0;r<=qobj.ResponseOptions.length-1; r++ ) {
		this_return += "<p style='font-weight:bold;'><input type='radio' name='" + qobj.Content_Id + "' value='" + qobj.ResponseOptions[r].ResponseOptionId + "'>" + qobj.ResponseOptions[r].Text + "</input></p>";
	}

	this_return += "</div>";
	*/

	this_return += "<div class='w3-card-4 w3-round-xlarge w3-margin w3-theme-l4'>";
	this_return += "<div class='w3-container'>";
	this_return += "<div class='w3-panel w3-theme-d1'>";
	this_return += "<h4 class='w3-text-shadow'>" + qobj.Prompt + "</h4>";
	this_return += "</div>"
	this_return += "<div class='w3-container' style='margin-top:-8px; margin-bottom:8px'>";

	if( qobj.ResponseOptions ) {
		if( qobj.ResponseOptions.length > 0 ) {
			for( var r=0; r<qobj.ResponseOptions.length; r++ ) {
				this_return += "<table>";
				this_return += "<tbody>";
				this_return += "<tr>";
				this_return += "<td>";
				this_return += "<input type='radio' name='" + qobj.Content_Id + "' id='" + qobj.ResponseOptions[r].ResponseOptionId + "' value='" + qobj.ResponseOptions[r].ResponseOptionId + "'>";
				this_return += "<td>";
				this_return += "<label style='font-weight:bold;margin-top:0px;margin-bottom:0px;' for='" + qobj.ResponseOptions[r].ResponseOptionId + "'>" + qobj.ResponseOptions[r].Text + "</label>";
				this_return += "<td>";
				this_return += "</td>";
				this_return += "</tr>";
				this_return += "</tbody>";
				this_return += "</table>";
			}
		}
	}

	this_return += "</div>"
	this_return += "</div>"
	this_return += "</div>"

	return this_return;
	
}

function page_content_html( pobj ) {

	var this_return = "";

	if( pobj.Contents ) {
		if( pobj.Contents.length>0 ) {
			for( c=0; c<=pobj.Contents.length-1; c++ ) {
				switch( pobj.Contents[c].Content_Type ) {
					case "Instruction":
						this_return = this_return + instruction_html( pobj.Contents[c] )
						break;
					case "Question":
						this_return = this_return + question_html( pobj.Contents[c] )
						break;
				}
			}

		}
	}



	return this_return;

}

function load_page( pobj ) {	
	
	this_session.page_history[this_session.page_history.length-1].PageName = pobj.Page_Name;

	make_bread_crumbs();

	document.getElementById("current_page_id").value = pobj.Page_ID;
	document.getElementById("current_page_name").innerText = pobj.Page_Name;
	document.getElementById("page_content").innerHTML = page_content_html( pobj );

	// If I am the initial page, then disable the 'previous' button
	if( pobj.Page_ID == mydocument.InitialPage ) {
		document.getElementById("btn_previous").style.display = "none";
	} else {
		//Otherwise enable the previous button
		document.getElementById("btn_previous").style.display = "";
	}

	if( !pobj.Conditions ) {
		pobj.Conditions = [];
	}

	// If I have conditions then show the next button and disable the finish button
	if( pobj.Conditions.length > 0 ) {
		document.getElementById("btn_finish").style.display = "none";
		document.getElementById("btn_next").style.display = "";
	} else {
		//Otherwise enable the finish button and disbale the next button
		document.getElementById("btn_finish").style.display = "";
		document.getElementById("btn_next").style.display = "none";
	}

	//Make the radio button advance on next if there is only one question to respond to
	var qs = 0;

	if( pobj.Contents ) {
		if( pobj.Contents.length > 0 ) {
			for( i=0; i<=pobj.Contents.length-1; i++) {
				if( pobj.Contents[i].Content_Type == "Question" ) {
					qs = qs+1;
				}
			}
		}
	}

	if( qs == 1 ) {
		inputs = document.getElementsByTagName( "input" );
		for( i=0; i<=inputs.length-1;i++ ) {
			if( inputs[i].type == "radio" ) {					
				inputs[i].addEventListener( "click", next );
			}
		}
	}

}

function make_bread_crumbs() {
	breadcrumbs = document.getElementById( "breadcrumbs" );
	breadcrumbs.innerHTML = "";

	for( p=0;p<=this_session.page_history.length-1;p++ ) {
		breadcrumbs.innerHTML += "<p>" + this_session.page_history[p].PageName + "<p>";
	}
}

function get_page_object( page_id ) {
	var this_return;
	for( p=0; p<=mydocument.Pages.length-1; p++ ) {
		if( mydocument.Pages[p].Page_ID == page_id ) {
			this_return = mydocument.Pages[p];
			break;
		}
	}

	return this_return;
}

function next() {	
	rbs = document.getElementsByTagName("input");
	for( i=0; i<=rbs.length-1; i++ ) {
		if( rbs[i].checked == true ) {
			var this_index = -1;
			for( s=0; s<=this_session.most_recent_selections.length-1;s++ ) {
				if( this_session.most_recent_selections[s].QuestionID == rbs[i].name ) {
					this_index = s;
					this_session.most_recent_selections[s].Selection = rbs[i].value;
					break;
				}
			}
			if( this_index == -1 ) {
				this_session.most_recent_selections.push( { "QuestionID" : rbs[i].name, "Selection": rbs[i].value } );
			}
		}
	}

	var this_page = get_page_object( document.getElementById("current_page_id").value );	

	var these_conditions = this_page.Conditions;

	for( c=0; c<=these_conditions.length-1;c++ ) {
		if( evaluate_condition( these_conditions[c] ) == true ) {
			this_page_session_content = "";

			for( i=0;i<=this_page.Contents.length-1;i++ ) {
				switch( this_page.Contents[i].Content_Type ) {
					case "Instruction":
						this_page_session_content += this_page.Contents[i].Content;
						break;
					case "Question":
						var this_question_html = "";
						this_question_html += "<p><b>" + this_page.Contents[i].Prompt + "</b><br/>";

						for( s=0; s<= this_session.most_recent_selections.length-1; s++ ) {
							if( this_session.most_recent_selections[s].QuestionID == this_page.Contents[i].Content_Id ) {
								for( r=0; r<=this_page.Contents[i].ResponseOptions.length-1;r++ ) {
									if( this_page.Contents[i].ResponseOptions[r].ResponseOptionId == this_session.most_recent_selections[s].Selection ) {
										this_question_html += this_page.Contents[i].ResponseOptions[r].Text + "</p>";
										break;
									}
								}
							}
						}

						this_page_session_content += this_question_html;

						break;
				}
			}

			this_session.page_history[this_session.page_history.length-1].Content = this_page_session_content;
			this_session.page_history.push( { "PageID" : these_conditions[c].GoToPageID, "PageName":"", "Content":"" } );
			load_page( get_page_object( these_conditions[c].GoToPageID ) );
			break;
		}
	}	
	
}

function evaluate_condition( condition ) {
	this_return = false;
	these_responseOptions = condition.SelectedOptions || [];
	needed = these_responseOptions.length;
	obtained = 0;
	for( s=0;s<=these_responseOptions.length-1;s++ ) {
		for( so=0;so<=this_session.most_recent_selections.length-1;so++ ) {
			if( this_session.most_recent_selections[so].Selection == these_responseOptions[s].ResponseOptionId ) {
				obtained++;
			}
		}
	}

	if( needed == obtained ) {
		this_return = true;
	}

	return this_return;
}

function previous() {
	//Remove the page from history
	this_session.page_history.pop();

	//Load the previous page	
	load_page( get_page_object( this_session.page_history[this_session.page_history.length-1].PageID ) );

	//Remove any selected options from the session if applicable
	rbs = document.getElementsByTagName("input");
	for( i=0; i<rbs.length-1; i++ ) {
		if( rbs[i].type == "radio" ) {
			for( s=0; s<=this_session.most_recent_selections.length-1;s++ ) {
				if( this_session.most_recent_selections[s].QuestionID == rbs[i].name ) {
					this_session.most_recent_selections.splice( s, 1 );
					break;
				}
			}
		}
	}	
	
}

function reset() {
	this_session.most_recent_selections = [];	
	this_session.page_history = [];
	
	this_session.page_history.push( { "PageID": mydocument.InitialPage, "PageName":"", "Content":"" } );

	load_page( get_page_object(mydocument.InitialPage) );
}

function finish() {

	var this_page = get_page_object( document.getElementById("current_page_id").value );

	this_session.page_history[this_session.page_history.length-1].PageName = this_page.Page_Name;

			this_page_session_content = "";

			if( !this_page.Contents ) {
				this_page.Contents = [ {"Content_Id":"1", "Content_Type":"Instruction", "Content":"<p>&nbsp;</p>"} ];
			}

			for( i=0;i<=this_page.Contents.length-1;i++ ) {
				switch( this_page.Contents[i].Content_Type ) {
					case "Instruction":
						this_page_session_content += this_page.Contents[i].Content;
						break;
					case "Question":
						var this_question_html = "";
						this_question_html += "<p><b>" + this_page.Contents[i].Content + "</b><br/>";

						for( s=0; s<= this_session.most_recent_selections.length-1; s++ ) {
							if( this_session.most_recent_selections[s].QuestionID == this_page.Contents[i].ContentID ) {
								for( r=0; r<=this_page.Contents[i].ResponseOptions.length-1;r++ ) {
									if( this_page.Contents[i].ResponseOptions[r].ResponseOptionID == this_session.most_recent_selections[s].Selection ) {
										this_question_html += this_page.Contents[i].ResponseOptions[r].Text + "</p>";
										break;
									}
								}
							}
						}

						this_page_session_content += this_question_html;
				}
			}


	this_session.page_history[this_session.page_history.length-1].Content = this_page_session_content;

	this_session_history_html = "";

	for( p=0;p<=this_session.page_history.length-1;p++ ) {
		this_session_history_html += this_session.page_history[p].Content;
	}

	this_session.page_history.push( {"PageID":"Session Summary", "PageName":"Session Summary", "Content":""} );

	make_bread_crumbs();

	document.getElementById( "btn_finish" ).style.display = "none";	
	document.getElementById( "current_page_name" ).innerText = "Session Summary";
	document.getElementById( "page_content" ).innerHTML = this_session_history_html;
}