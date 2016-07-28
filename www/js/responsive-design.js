setTimeout(function(){
  $(function () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
          var screenWidth = ($(window).width() < window.screen.width) ? $(window).width() : window.screen.width; //get proper width
          var screenHeight = ($(window).height() < window.screen.height) ? $(window).height() : window.screen.height; //get proper height

          //@TODO get the screenWidth and Heigh without jQuery so we can get rid of it
            //DOESN'T WORK PROPERLY
  //        var screenWidth = window.innerWidth
  //          || document.documentElement.clientWidth
  //          || document.body.clientWidth;
  //
  //        var screenHeight = window.innerHeight
  //          || document.documentElement.clientHeight
  //          || document.body.clientHeight;
  //      
        
            //DOESN'T WORK PROPERLY
  //        var w = window,
  //        d = document,
  //        e = d.documentElement,
  //        g = d.getElementsByTagName('body')[0],
  //        screenWidth = w.innerWidth || e.clientWidth || g.clientWidth,
  //        screenHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;

          var pageWidth = 320; // min width of site
          var pageHeight = 645; // min width of site
          var widthRatio = screenWidth / pageWidth; //calculate ratio
          var heightRatio = screenHeight / pageHeight; //calculate ratio
          var minRatio = Math.min(widthRatio,heightRatio);
          var maxRatio = Math.max(widthRatio,heightRatio);
          if (screenWidth < pageWidth || screenHeight < pageHeight) { //smaller than minimum size
              $('#Viewport').attr('content', 'initial-scale=' + minRatio + ', user-scalable=no');
          } else { //regular size
              $('#Viewport').attr('content', 'initial-scale=' + (minRatio/*avoid some small scrolling*/) + ', maximum-scale=2, minimum-scale=1.0, user-scalable=no');
          }
      }
      var customScaleThisScreen = function () {
      var contentWidth = document.body.scrollWidth, 
          windowWidth = window.innerWidth, 
          newScaleWidth = windowWidth / contentWidth;
      var contentHeight = document.body.scrollHeight, 
          windowHeight = window.innerHeight, 
          newScaleHeight = windowHeight / contentHeight;
      var newZoom = Math.min(newScaleWidth, newScaleHeight)*.95;
      //@zone:zoom si el segundo digito de los decimales del zoom termina en un numero impar los bloques de tetris se muestran raros
      newZoom = /\d.*\.\d\d/.exec(newZoom)[0]
      if(newZoom[newZoom.length-1]%2){
        newZoom -= .01;
      }
      //\@zone:zoom
      document.body.style.zoom = newZoom;
      var el = $('#app-loading-modal');
      setTimeout(function(){
        el.fadeOut('slow', function(){
          el.hide();        
        });
      },1000);
    }
    customScaleThisScreen();
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
      //WE ARE ON A PHONE
      //document.addEventListener("deviceready", onDeviceReady, false);
    } else {
      //WE ARE ON THE BROWSER
    }
  });
},1000);