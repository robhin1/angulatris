setTimeout(function () {
  //@TODO on resize rerun this
  $(function () {
    debugger;
    var screenWidth = ($(window).width() < window.screen.width) ? $(window).width() : window.screen.width; //get proper width
    var screenHeight = ($(window).height() < window.screen.height) ? $(window).height() : window.screen.height; //get proper height
    var pageWidth = $('#app-left-column').width() + $('#app-right-column').width(); // min width of site
    var pageHeight = $('#app-all').height(); // min height of site
    var widthRatio = screenWidth / pageWidth; //calculate ratio
    var heightRatio = screenHeight / pageHeight; //calculate ratio
    var minRatio = Math.min(widthRatio, heightRatio);
    var maxRatio = Math.max(widthRatio, heightRatio);
    $('#Viewport').attr('content', 'initial-scale=' + minRatio + ', user-scalable=no');

    var customScaleThisScreen = function () {
      var contentWidth = document.body.scrollWidth,
        windowWidth = window.innerWidth,
        newScaleWidth = windowWidth / contentWidth;
      var contentHeight = document.body.scrollHeight, //document.body.scrollHeight (for some reason this value used to give a value similar to pageHeight but now the value is way bigger (at least in my old phone))
        windowHeight = window.innerHeight,
        newScaleHeight = windowHeight / contentHeight;
      var minZoom = Math.min(newScaleWidth, newScaleHeight);
      var maxZoom = Math.max(newScaleWidth, newScaleHeight);
      var newZoom = (minZoom < 1 || maxZoom < 1) ? minZoom : maxZoom;
      newZoom *= .95;
      //@zone:zoom si el segundo digito de los decimales del zoom termina en un numero impar los bloques de tetris se muestran raros
      newZoom = /\d.*\.\d\d/.exec(newZoom)[0];
      if (newZoom[newZoom.length - 1] % 2) {
        newZoom -= .01;
      }
      //\@zone:zoom
      document.body.style.zoom = newZoom;
      var el = $('#app-loading-modal');
      setTimeout(function () {
        el.fadeOut('slow', function () {
          el.hide();
        });
      }, 1000);
    }
    customScaleThisScreen();
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
      //WE ARE ON A PHONE
      //document.addEventListener("deviceready", onDeviceReady, false);
    } else {
      //WE ARE ON THE BROWSER
    }
  });
}, 3000);