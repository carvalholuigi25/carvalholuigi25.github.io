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
	
      if(mydata[i].value >= 0 && mydata[i].value < 50) {
	statusbar = "bg-danger";
      } else if(mydata[i].value >= 50 && mydata[i].value < 70) {
	statusbar = "bg-warning";      
      } else if(mydata[i].value >= 70 && mydata[i].value < 80) {
	statusbar = "bg-info";      
      } else {
	statusbar = "bg-success";      
      }	
	
      return statusbar;
}

async function getMySkillsData() {
   if(document.querySelectorAll("#myskills")[0]) {
       var content = ""; var datacnt = ""; var statusbar = ""; var mydata = "";
       var isTable = true;
	   
       await getData().then((data) => {
	  mydata = data.myskills ?? data;
	  
	  if(mydata != null && mydata.length > 0) {
	   for(var i = 0; i < mydata.length; i++) {
	      statusbar = getMyStatusBar(mydata, i);

	      if(isTable) {
	        datacnt += `
		<tr>
		  <td>${mydata[i].name}</td>
		  <td>
		   <div class="progress">
		      <div class="progress-bar progress-bar-striped progress-bar-animated ${statusbar}" role="progressbar" 
			aria-label="${mydata[i].name}" aria-valuenow="${mydata[i].value}" aria-valuemin="0" aria-valuemax="100" 
			style="width: ${mydata[i].value}%">
			${mydata[i].value}%
		      </div>
		   </div>
		  </td>
	       </tr>`;
	      } else {
		datacnt += `
	        <div class="pbar pbar${i+1}" id="pbar${i+1}">
		 <div class="subpbar">
		   <label class="title">${mydata[i].name}</label>
		   <div class="progress">
		      <div class="progress-bar progress-bar-striped progress-bar-animated ${statusbar}" role="progressbar" 
			aria-label="${mydata[i].name}" aria-valuenow="${mydata[i].value}" aria-valuemin="0" aria-valuemax="100" 
			style="width: ${mydata[i].value}%">
			${mydata[i].value}%
		      </div>
		   </div>
		 </div>
	        </div>`;      
	      }
	   }
	  } else {
	    datacnt = "<h4>No all my skills data has been found!</h4>";	  
	  }
	       
	  if(isTable) {
	     content = `
	     <div class="table-responsive mpbartbl" id="mpbartbl">
		  <table class="table table-bordered pbartbl" id="pbartbl">
		    <thead class="pbartblthead" id="pbartblthead">
		     <tr>
			<th>Name</th>
			<th>Progress Value</th>
		     </tr>
		   </thead>
		   <tbody class="pbartbltbody" id="pbartbltbody">
		    ${datacnt}
		   </tbody>
		 </table>
	     </div>`;  
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

    pbartbltbody.innerHTML = "";

    for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < len; i++) {
	statusbar = getMyStatusBar(ary, i);
	pbartbltbody.innerHTML += `
	<tr>
	  <td>${ary[i].name}</td>
	  <td>
	   <div class="progress">
	      <div class="progress-bar progress-bar-striped progress-bar-animated ${statusbar}" role="progressbar" 
		aria-label="${ary[i].name}" aria-valuenow="${ary[i].value}" aria-valuemin="0" aria-valuemax="100" 
		style="width: ${ary[i].value}%">
		${ary[i].value}%
	      </div>
	   </div>
	  </td>
        </tr>`;
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
    await getMySkillsData();

    window.addEventListener('scroll', () => {
        scrollWhileDelTransp();
        scrollWhileChangeHash();
    });

    window.addEventListener('hashchange', () => {
        changeMyHash(location.hash);
    });
});