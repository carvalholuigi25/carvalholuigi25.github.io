var current_page = 1;
var records_per_page = 10;

async function getData() {
  const response = await fetch("js/myskills.json", {
    method: 'GET', 
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });

  return response.json();
}

function getMyStatusBar(mydata, i) {
      var statusbar = "";
	
      if(mydata != null && mydata.length > 0) {
			if(mydata[i].value >= 0 && mydata[i].value < 50) {
				statusbar = "bg-danger";
			} else if(mydata[i].value >= 50 && mydata[i].value < 70) {
				statusbar = "bg-warning";      
			} else if(mydata[i].value >= 70 && mydata[i].value < 80) {
				statusbar = "bg-info";      
			} else {
				statusbar = "bg-success";      
			}
	  }	else {
		statusbar = "bg-info";
	  }
	
      return statusbar;
}

function getMySearchBar(enableFilter = true) {
	if(enableFilter && document.querySelectorAll("#mysearchbar")[0]) {
		document.querySelectorAll("#mysearchbar")[0].innerHTML = `
		<form class="frmsrchdata" id="frmsrchdata" name="frmsrchdata" action="" method="get">
			<div class="row">
				<div class="form-group d-block col-12 col-md-4 col-lg-8 mt-3">
					<label for="searchinp">Search</label>
					<input type="text" class="form-control searchinp" id="searchinp" name="searchinp" value="" placeholder="Search here to see my skills data" />
				</div>
				<div class="form-group d-block col-12 col-md-4 col-lg-2 mt-3">
					<label for="orderinp">Order</label>
					<select name="orderinp" id="orderinp" class="form-control orderinp">
						<option value="asc"  selected="selected">ASC</option>
						<option value="desc">DESC</option>
					</select>
				</div>
				<div class="form-group d-block col-12 col-md-4 col-lg-2 mt-3">
					<label for="filterbynameinp">Filter by</label>
					<select name="filterbynameinp" id="filterbynameinp" class="form-control filterbynameinp">
						<option value="id" selected="selected">Id</option>
						<option value="name">Name</option>
						<option value="value">Value</option>
					</select>
				</div>
			</div>
			<div class="form-group d-block col-12 mt-3">
				<button type="reset" class="btn btn-secondary searchclear" id="searchclear" name="searchclear">
					<i class="bi bi-x-circle-fill me-1"></i>
					Reset
				</button>
				<button type="button" class="btn btn-primary searchsub ms-1" id="searchsub" name="searchsub">
					<i class="bi bi-send-fill me-1"></i>
					Submit
				</button>
			</div>
		</form>`;

		if(document.querySelector('#frmsrchdata')) {
			var jspobjsrch = localStorage.getItem("searchObj") ? JSON.parse(localStorage.getItem("searchObj")) : null;
			var srchval = jspobjsrch ? jspobjsrch.search : (document.querySelector('#searchinp').value ?? "");
			var orderbyval = jspobjsrch ? jspobjsrch.orderby : (document.querySelector("#orderinp").value ?? "asc");
			var filterbyval = jspobjsrch ? jspobjsrch.filterby : (document.querySelector("#filterbynameinp").value ?? "id");

			document.querySelector('#frmsrchdata').onsubmit = function(e) {
				e.preventDefault();
			};

			if(localStorage.getItem("searchObj")) {
				document.querySelector('#orderinp option').removeAttribute('selected');
				document.querySelector('#filterbynameinp option').removeAttribute('selected');
				document.querySelector('#searchinp').value = srchval;
				
				if(document.querySelectorAll('#orderinp option[value="'+orderbyval+'"]')[0]) {
					document.querySelectorAll('#orderinp option[value="'+orderbyval+'"]')[0].setAttribute('selected', 'selected');
				}

				if(document.querySelectorAll('#filterbynameinp option[value="'+filterbyval+'"]')[0]) {
					document.querySelectorAll('#filterbynameinp option[value="'+filterbyval+'"]')[0].setAttribute('selected', 'selected');
				}
			}

			if(document.querySelector('#searchinp')) {
				document.querySelector('#searchinp').oninput = async function(e) {
					e.preventDefault();
					srchval = this.value;
					getResFilter(srchval, orderbyval, filterbyval);
					await getMySkillsData();
				};
			}

			if(document.querySelector('#orderinp')) {
				document.querySelector('#orderinp').onchange = async function(e) {
					e.preventDefault();
					
					for(var i = 0; i < document.querySelectorAll('#orderinp option').length; i++) {
						document.querySelectorAll('#orderinp option')[i].removeAttribute('selected');
					}

					document.querySelectorAll('#orderinp option[value="'+this.value+'"]')[0].setAttribute('selected', 'selected');
					orderbyval = this.value;
					getResFilter(srchval, orderbyval, filterbyval);
					await getMySkillsData();
				};
			}

			if(document.querySelector('#filterbynameinp')) {
				document.querySelector('#filterbynameinp').onchange = async function(e) {
					e.preventDefault();
					
					for(var i = 0; i < document.querySelectorAll('#filterbynameinp option').length; i++) {
						document.querySelectorAll('#filterbynameinp option')[i].removeAttribute('selected');
					}
					
					document.querySelectorAll('#filterbynameinp option[value="'+this.value+'"]')[0].setAttribute('selected', 'selected');
					filterbyval = this.value;
					getResFilter(srchval, orderbyval, filterbyval);
					await getMySkillsData();
				};
			}

			if(document.querySelector('#searchclear')) {
				document.querySelector('#searchclear').onclick = async function(e) {
					e.preventDefault();
					document.querySelector('#searchinp').value = "";

					for(var i = 0; i < document.querySelectorAll('#orderinp option').length; i++) {
						document.querySelectorAll('#orderinp option')[i].removeAttribute('selected');
					}

					for(var j = 0; j < document.querySelectorAll('#filterbynameinp option').length; j++) {
						document.querySelectorAll('#filterbynameinp option')[j].removeAttribute('selected');
					}

					document.querySelectorAll('#orderinp option[value="'+jspobjsrch.orderby+'"]')[0].setAttribute('selected', 'selected');
					document.querySelectorAll('#filterbynameinp option[value="'+jspobjsrch.filterby+'"]')[0].setAttribute('selected', 'selected');
					
					srchval = "";
					orderbyval = document.querySelectorAll('#orderinp option[selected="selected"]')[0].value;
					filterbyval = document.querySelectorAll('#filterbynameinp option[selected="selected"]')[0].value;
					getResFilter(srchval, orderbyval, filterbyval);
					await getMySkillsData();
				};
			}

			if(document.querySelector('#searchsub')) {
				document.querySelector('#searchsub').onclick = async function(e) {
					e.preventDefault();
					getResFilter(srchval, orderbyval, filterbyval);
					await getMySkillsData();
				};
			}
		}
	}
}

function getResFilter(searchval, orderbyval, filterbyval) {
	var valsrchinp = searchval ?? document.querySelector('#searchinp').value;
	var valorderbyinp = orderbyval ?? document.querySelector('#orderinp option[selected="selected"]').value;
	var valfnameinp = filterbyval ?? document.querySelector('#filterbynameinp option[selected="selected"]').value;

	var objsrch = {
		search: valsrchinp,
		orderby: valorderbyinp,
		filterby: valfnameinp
	};

	localStorage.setItem("searchObj",  JSON.stringify(objsrch));
}

function doFilterSearch(objsrch, mydata) {
	if(objsrch != null) {
		if(objsrch.search != "") {
			if(objsrch.filterby == "id") 
			{
				mydata = mydata.filter(x => x.id == objsrch.search);
			}
			else if(objsrch.filterby == "value") 
			{
			    mydata = mydata.filter(x => x.value == parseInt(objsrch.search));
			}
			else if(objsrch.filterby == "name") 
			{
				mydata = mydata.filter(x => x.name.toLowerCase().includes(objsrch.search.toLowerCase()));
			}
			else 
			{
				mydata = mydata.filter(x => x.name.toLowerCase().includes(objsrch.search.toLowerCase()));
			}
		}

		if(objsrch.orderby != "") {
			mydata = mydata.sort((x, y) => {
				var valx = "";  var valy = "";
				
				if(objsrch.filterby == "name") {
					valx = x.name.toLowerCase();
					valy = y.name.toLowerCase();
				} else if(objsrch.filterby == "value") {
					valx = x.value;
					valy = y.value;
				} else if(objsrch.filterby == "id") {
					valx = x.id;
					valy = y.id;
				} else {
					valx = x.id;
					valy = y.id;
				}

				if(objsrch.orderby == "asc") {
					if(valx < valy) {
						return -1;
					}
	
					if(valx > valy) {
						return 1;
					}
				} else {
					if(valx > valy) {
						return -1;
					}
	
					if(valx < valy) {
						return 1;
					}
				}

				return 0;
			});
		}
	}

	return mydata;
}

async function getMySkillsData() {
   if(document.querySelectorAll("#myskills")[0]) {
       var content = ""; var datacnt = ""; var statusbar = ""; var mydata = "";
       var isTable = true;
	   var objsrch = localStorage.getItem("searchObj") != null ? JSON.parse(localStorage.getItem("searchObj")) : null;
	   
       await getData().then((data) => {
	  mydata = data.myskills ?? data;

	  if(objsrch != null) {
		  mydata = doFilterSearch(objsrch, mydata);
	  }
	  
	  if(mydata != null && mydata.length > 0) {
	   for(var i = 0; i < mydata.length; i++) {
	      statusbar = getMyStatusBar(mydata, i);

	      if(isTable) {
	        datacnt += `
		  <tr>
			<td>${mydata[i].id}</td>
			<td>${mydata[i].name}</td>
			<td>
			<div class="progress">
				<div class="progress-bar progress-bar-striped progress-bar-animated ${statusbar}" role="progressbar" 
				aria-label="${mydata[i].name}" aria-valuenow="${mydata[i].value}" aria-valuemin="0" aria-valuemax="100" 
				style="width: ${mydata[i].value}%"></div>
				<span class="legend-progress">${mydata[i].value}%</span>
			</div>
			</td>
	       </tr>`;
	      } else {
		datacnt += `
	        <div class="pbar pbar${i+1}" id="pbar${i+1}">
		 <div class="subpbar">
		   <label class="title">${mydata[i].name} (Id: ${mydata[i].id})</label>
		   <div class="progress">
				<div class="progress-bar progress-bar-striped progress-bar-animated ${statusbar}" role="progressbar" 
				aria-label="${mydata[i].name}" aria-valuenow="${mydata[i].value}" aria-valuemin="0" aria-valuemax="100" 
				style="width: ${mydata[i].value}%"></div>
				<span class="legend-progress">${mydata[i].value}%</span>
		   </div>
		 </div>
	        </div>`;      
	      }
	   }
	  } else {
	    datacnt = "<h4>No all my skills data has been found!</h4>";	  
	  }
	       
	  if(isTable) {
		if(mydata.length > 0) {
			content = `
			<div class="table-responsive mpbartbl" id="mpbartbl">
			 <table class="table table-bordered pbartbl" id="pbartbl">
			   <thead class="pbartblthead" id="pbartblthead">
				<tr>
			   <th>Id</th>
			   <th>Name</th>
			   <th>Progress Value</th>
				</tr>
			  </thead>
			  <tbody class="pbartbltbody" id="pbartbltbody">
			   ${datacnt}
			  </tbody>
			</table>
			</div>`;  
		}
		else 
		{
			content = datacnt;
		}
	  } else {
	    content = datacnt;	  
	  }
	       
          document.querySelectorAll("#myskills")[0].innerHTML = content;
	  
	  if(document.querySelectorAll("#myskills")[0] && isTable) {  
             getMyPagination(mydata, mydata.length, current_page);
	  }
       }).catch((error) => console.log(error));
   }
}

function setActivePage(i = 1) {
 if(document.querySelectorAll('#mypagination .btnitem').length > 0) {
   for(var l = 0; l < document.querySelectorAll('#mypagination .btnitem').length; l++) {
     if(document.querySelectorAll('#mypagination .btnitem')[l].classList.contains("active")) {
       document.querySelectorAll('#mypagination .btnitem')[l].classList.remove("active"); 
     }
   }

   var ix = i > 0 ? i - 1 : i;
   if(document.querySelectorAll('#mypagination .btnitem'+ix)[0]) {
      document.querySelectorAll('#mypagination .btnitem'+ix)[0].classList.add("active");
   }
 }	
}

function getMyPagination(ary, len, page = 1) {
    if(document.querySelector('#mypagination')) {
	var content = ""; var pagnavlinks = ""; var active = "";
	    
	for(var i = 0; i < numPages(len); i++) {
	  active = i == (current_page-1) ? "active" : "";
	  pagnavlinks += `<li class="page-item"><button type="button" class="page-link btnitem btnitem${i} ${active}" id="btnitem${i}">${i+1}</button></li>`;
	}
	    
	if(numPages(len) > 0) {
		content = `
		<nav class="spagination">
		  <ul class="pagination">
			<li class="page-item">
			 <button type="button" class="page-link btnfirst" id="btnfirst" aria-label="First">
			  <i class="bi bi-chevron-double-left"></i>
			 </button>
			</li>
			<li class="page-item">
			 <button type="button" class="page-link btnprev" id="btnprev" aria-label="Previous">
			  <i class="bi bi-chevron-left"></i>
			 </button>
			</li>
			${pagnavlinks}
			<li class="page-item">
			  <button type="button" class="page-link btnnext" id="btnnext" aria-label="Next">
				  <i class="bi bi-chevron-right"></i>
			  </button>
			</li>
			<li class="page-item">
			  <button type="button" class="page-link btnlast" id="btnlast" aria-label="Last">
				  <i class="bi bi-chevron-double-right"></i>
			  </button>
			</li>
		  </ul>
		</nav>
		<span class="d-block mt-3 mb-3 page" id="page"></span>`;
	}

	document.querySelector('#mypagination').innerHTML = content;
	    
	if(document.querySelector('#mypagination')) {
	    doPagination(ary, len, page);
		
	    if(document.querySelector('#mypagination #btnfirst')) {
	       document.querySelector('#mypagination #btnfirst').onclick = function(e) {
		 e.preventDefault();
		 firstPage(ary, len);
	       };
	    }
		
	    if(document.querySelector('#mypagination #btnprev')) {
	       document.querySelector('#mypagination #btnprev').onclick = function(e) {
		 e.preventDefault();
		 prevPage(ary, len);
	       };
	    }
		
            if(document.querySelectorAll('#mypagination .btnitem').length > 0) {
	      for(var k = 0; k < numPages(len); k++) {
		 if(document.querySelectorAll('#mypagination .btnitem')[k]) {
		   document.querySelectorAll('#mypagination .btnitem')[k].onclick = function(e) {
		      e.preventDefault();
		      current_page = parseInt(this.textContent);
		      setActivePage(current_page);
		      doPagination(ary, len, current_page);
		   };
		 }
	      }
	    }
		
	    if(document.querySelector('#mypagination #btnnext')) {
	       document.querySelector('#mypagination #btnnext').onclick = function(e) {
		 e.preventDefault();
		 nextPage(ary, len);
	       };
	    }
		
	    if(document.querySelector('#mypagination #btnlast')) {
	       document.querySelector('#mypagination #btnlast').onclick = function(e) {
		 e.preventDefault();
		 lastPage(ary, len);
	       };
	    }
	}
    }
}

function doPagination(ary, len, page = 1) {
    var btn_first = document.getElementById("btnfirst");
    var btn_last = document.getElementById("btnlast");
    var btn_next = document.getElementById("btnnext");
    var btn_prev = document.getElementById("btnprev");
    var pbartbltbody = document.getElementById("pbartbltbody");
    var page_span = document.getElementById("page");
    var statusbar = "";
	
    if (page < 1) page = 1;
    if (page > numPages(len)) page = numPages(len);

	if(pbartbltbody) {
		pbartbltbody.innerHTML = "";
	}

    if(ary.length > 0) {
		for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < len; i++) {
			statusbar = getMyStatusBar(ary, i);
			pbartbltbody.innerHTML += `
			<tr>
			  <td>${ary[i].id}</td>
			  <td>${ary[i].name}</td>
			  <td>
				<div class="progress">
					<div class="progress-bar progress-bar-striped progress-bar-animated ${statusbar}" role="progressbar" 
					aria-label="${ary[i].name}" aria-valuenow="${ary[i].value}" aria-valuemin="0" aria-valuemax="100" 
					style="width: ${ary[i].value}%"></div>
					<span class="legend-progress">${ary[i].value}%</span>
			    </div>
			  </td>
			</tr>`;
		}
	}
	
    if(page_span) {
    	page_span.innerHTML = page + "/" + numPages(len);
    }
	
    if(btn_first && btn_prev) {
      if (page == 1) {
	btn_first.style.visibility = "hidden";
	btn_prev.style.visibility = "hidden";
      } else {
	btn_first.style.visibility = "visible";
	btn_prev.style.visibility = "visible";
      }
    }

    if(btn_next && btn_last) {
      if (page == numPages(len)) {
	btn_next.style.visibility = "hidden";
	btn_last.style.visibility = "hidden";
      } else {
	btn_next.style.visibility = "visible";
	btn_last.style.visibility = "visible";
      }    
    }
}

function firstPage(ary, len) 
{
     current_page = (numPages(len) - numPages(len)) + 1 ?? 1;
     setActivePage(current_page);
     doPagination(ary, len, current_page);
}

function prevPage(ary, len)
{
    if (current_page > 1) {
        current_page--;
	setActivePage(current_page);
        doPagination(ary, len, current_page);
    }
}

function nextPage(ary, len)
{
    if (current_page < numPages(len)) {
        current_page++;
	setActivePage(current_page);    
        doPagination(ary, len, current_page);
    }
}

function lastPage(ary, len) 
{
     current_page = numPages(len);
     setActivePage(current_page);
     doPagination(ary, len, current_page);
}

function numPages(len)
{
    return Math.ceil(len / records_per_page);
}

function getYear() {
    if(document.querySelector('#curyear')) {
        document.querySelector('#curyear').innerHTML = "&copy; " + new Date().getFullYear();
    }
}

function scrollWhileDelTransp() {
    var mysc = document.body.scrollTop || document.documentElement.scrollTop;

    if(mysc >= 0 && mysc <= document.querySelectorAll('.section')[1].clientHeight) {
        if(!document.querySelector('.navbar').classList.contains("navbart")) {
            document.querySelector('.navbar').classList.add("navbart");
        }
    } else {
        if(document.querySelector('.navbar').classList.contains("navbart")) {
            document.querySelector('.navbar').classList.remove("navbart");
        }
    }
}

function clearAllActiveLinksNavbar() {
    if(document.querySelectorAll('.navbar-nav .nav-item .nav-link').length > 0) {
        for(var i = 0; i < document.querySelectorAll('.navbar-nav .nav-item .nav-link').length; i++) {
            if(document.querySelectorAll('.navbar-nav .nav-item .nav-link')[i].classList.contains('active')) {
                document.querySelectorAll('.navbar-nav .nav-item .nav-link')[i].classList.remove('active');
            }
        }   
    }
}

function setActiveLinkNavbar(value) {
    if(document.querySelector('.navbar-nav .nav-item .nav-link[href="'+value+'"]')) {
        document.querySelector('.navbar-nav .nav-item .nav-link[href="'+value+'"]').classList.add('active');
    }
}

function changeMyHash(value) {
    value = value.indexOf("#") == -1 ? '#' + value : value;

    clearAllActiveLinksNavbar();

    if(history) {
        history.replaceState(null, null, "index.html" + value);
    } else {
        location.href = value;
    }
}

function navClickLink() {
    var hrefval = "";

    if(document.querySelectorAll('.navbar-nav .nav-item .nav-link').length > 0) {
        for(var i = 0; i < document.querySelectorAll('.navbar-nav .nav-item .nav-link').length; i++) {
            document.querySelectorAll('.navbar-nav .nav-item .nav-link')[i].onclick = function(e) {
                e.preventDefault();
                hrefval = this.href.indexOf('#') !== -1 ? this.href.split('#')[1] : this.href;
                changeMyHash(hrefval);
            };
        }
    }
}

function scrollWhileChangeHash() {
    if(document.querySelector('.navbar-nav .nav-item .nav-link.active')) {
        if(history) {
            history.replaceState(null, null, "index.html#" + document.querySelector('.navbar-nav .nav-item .nav-link.active').href.split('#')[1]);
        } else {
            location.href = "index.html#" + document.querySelector('.navbar-nav .nav-item .nav-link.active').href.split('#')[1];
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('scripts loaded!');
    getYear();
    scrollWhileDelTransp();
    
    if(location.hash !== "") {
        changeMyHash(location.hash);
    }

    navClickLink();
	getMySearchBar(true);
    await getMySkillsData();

    window.addEventListener('scroll', () => {
        scrollWhileDelTransp();
        scrollWhileChangeHash();
    });

    window.addEventListener('hashchange', () => {
        changeMyHash(location.hash);
    });
});
