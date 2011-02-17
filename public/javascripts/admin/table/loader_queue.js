
      /*==========================================================================================================================*/
      /*  																																																												*/
      /*				loaderQueue => Control loader of the table    .																																		*/
      /*  																																																												*/
      /*==========================================================================================================================*/

      	function loaderQueue () {
      		this.count = 0;
      		this.pendingOperations = [];
      		this.checking = false;
      		
      		//Create the loader element
          $('section.subheader').append('<div class="performing_op"><p class="loading">Loading...</p></div>');
          
          this.loader = $('section.subheader div.performing_op');
      		
      		
      	}

      	/*========================================================================================================================*/
      	/*  Add new request to the loader queue  */
      	/*========================================================================================================================*/
      	loaderQueue.prototype.newRequest = function(requestId,type) {
      	  this.count++;
      	  this.pendingOperations[requestId] = new Object();
      	  this.pendingOperations[requestId].status = "pending";
      	  this.pendingOperations[requestId].type = type;
      	  if (!this.checking) {
      	    if (this.loader.html()=="") {
      	      this.loader.append('<p class="loading">Loading...</p>');
      	    }
      	    this.loader.css('width','100px');
            this.loader.css('backgroundColor','#FFEAA4');
            this.loader.css('margin','0 0 0 -50px');
            this.loader.animate({height:30,opacity:1},200,function(){
       	      $(this).css('borderBottom','1px solid #D0C090');
       	    });
      	    this.loader.animate({height:30,opacity:1},200,function(){
      	      $(this).css('borderBottom','1px solid #D0C090');
      	    });
      	    this.checking = true;
      	    this.loopPendingOperations();
      	  }
      	}
      	
      	
      	/*========================================================================================================================*/
      	/*  Change the request to "arrive" and change the status  */
      	/*========================================================================================================================*/
      	loaderQueue.prototype.responseRequest = function(requestId, status, error) {
      	  this.pendingOperations[requestId].status = status;
      	  this.pendingOperations[requestId].error = error;
      	}
      	
      	
      	/*========================================================================================================================*/
      	/*  Loop for get pending operations  */
      	/*========================================================================================================================*/
      	loaderQueue.prototype.loopPendingOperations = function() {
      	  var me = this;
      	  
      	  for (var request in this.pendingOperations) {
      	    if (this.pendingOperations[request].status!="pending") {
      	      this.count--;
      	      this.showResult(this.pendingOperations[request]);
      	      delete this.pendingOperations[request];
        	    setTimeout(function(){me.loopPendingOperations()},2000);
      	      return false;
      	    }
      	  }
      	  if (this.count == 0) {
            this.loader.animate({height:0},300,function(){
              $(this).css('borderBottom','none');
              $(this).children('p:eq(0)').remove();
              if (me.count>0) {
                me.loader.append('<p class="loading">Loading...</p>');
                me.loader.css('width','100px');
                me.loader.css('margin','0 0 0 -50px');
                me.loader.css('backgroundColor','#FFEAA4');
                me.loader.animate({height:30,opacity:1},200,function(){
          	      $(this).css('borderBottom','1px solid #D0C090');
          	    });
                me.checking = true;
                me.loopPendingOperations();
              } else {
                me.checking = false;
              }
            });
      	  } else {
            if (!me.loader.children('p').hasClass('loading')) {
              
              var element = $('<p class="loading">Loading, <strong>left '+me.count+'</strong>...</p>');
          	  element.css('top','30px');
          	  element.css('opacity','0');
          	  this.loader.append(element);

          	  var element_width = element.width();

          	  this.loader.animate({
          	    backgroundColor:'#FFEAA4',
          	    borderBottomColor:'#D0C090',
          	    width: element_width+44+'px',
          	    marginLeft: '-'+(element_width/2)+'px',
          	  },200);

          	  this.loader.children('p:eq(0)').animate({top:'-20px',opacity:0},600,function(){$(this).remove()});
          	  this.loader.children('p:eq(1)').css("marginLeft",'-'+((element_width+44)/2)+'px');
          	  this.loader.children('p:eq(1)').animate({top:'0',opacity:1},700);
            }
      	    setTimeout(function(){me.loopPendingOperations()},50);
      	  }
      	}
      	
      	
      	/*========================================================================================================================*/
      	/*  Show the result of the request  */
      	/*========================================================================================================================*/
      	loaderQueue.prototype.showResult = function(data) {
      	  var element = $('<p>'+ ((data.status=="ok")? loadingMessages[data.type] :data.error) +'</p>');
      	  element.css('top','30px');
      	  element.css('opacity','0');
      	  this.loader.append(element);
      	  
      	  var new_element_width = element.width();
      	  var old_element_width = this.loader.children('p:eq(0)').width();

      	  this.loader.animate({
      	    backgroundColor:((data.status!="ok")?'#D0878E':'#99CC66'),
      	    borderBottomColor:((data.status!="ok")?'#FFA3A9':'#A5BB93'),
      	    width: new_element_width+24+'px',
      	    marginLeft: '-'+(new_element_width/2)+'px',
      	  },200);
      	  
      	  if (this.loader.children('p:eq(0)').hasClass('loading')) {
        	  this.loader.children('p:eq(0)').css("marginLeft",'-'+((old_element_width+44)/2)+'px');
      	  } else {
        	  this.loader.children('p:eq(0)').css("marginLeft",'-'+((old_element_width+24)/2)+'px');
      	  }
      	  
      	  this.loader.children('p:eq(0)').animate({top:'-20px',opacity:0},600,function(){$(this).remove()});
      	  this.loader.children('p:eq(1)').css("marginLeft",'-'+((new_element_width+24)/2)+'px');
      	  this.loader.children('p:eq(1)').animate({top:'0',opacity:1},700);
      	}



      	
      	
        function test1() {
          requests_queue.newRequest("a", "tags");
          requests_queue.newRequest("b", "name");
          requests_queue.newRequest("c", "privacy");
          requests_queue.newRequest("d", "update_cell");
        }
        
        function test2() {
          requests_queue.responseRequest('b','ok');
          setTimeout(function(){requests_queue.responseRequest('a','error');},10000)
          requests_queue.responseRequest('d','ok');
          requests_queue.responseRequest('c','error');
        }
        