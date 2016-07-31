setTimeout(function () {
  //@TODO on resize rerun this
  $(function () {
    var screenWidth = ($(window).width() < window.screen.width) ? $(window).width() : window.screen.width; //get proper width
    var screenHeight = ($(window).height() < window.screen.height) ? $(window).height() : window.screen.height; //get proper height
    var pageWidth = 310;//$('#app-left-column').width() + $('#app-right-column').width(); // old phones don't seem to calculate the width correctly using this commented code, so we can run this on the desktop browser and hardcode it for now... same thing for the line under (pageHeight)
    var pageHeight = 701;//$('#app-all').height(); // min height of site
    var widthRatio = screenWidth / pageWidth; //calculate ratio
    var heightRatio = screenHeight / pageHeight; //calculate ratio
    var minRatio = Math.min(widthRatio, heightRatio);
    var maxRatio = Math.max(widthRatio, heightRatio);
    $('#Viewport').attr('content', 'user-scalable=no');
    var newZoom = (minRatio < 1 || maxRatio < 1) ? minRatio * .90 : maxRatio * .85;
    //@zone:zoom si el segundo digito de los decimales del zoom termina en un numero impar los bloques de tetris se muestran raros
    newZoom = /\d.*\.\d\d/.exec(newZoom)[0];
    if (newZoom[newZoom.length - 1] % 2) {
      newZoom -= .01;
    }
    //\@zone:zoom
    document.body.style.zoom = newZoom;

    var hideLoadingModal = function () {
      var el = $('#app-loading-modal');
      setTimeout(function () {
        el.fadeOut('slow', function () {
          el.hide();
        });
      }, 1000);
    }
    hideLoadingModal();
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
      //WE ARE ON A PHONE
      //document.addEventListener("deviceready", onDeviceReady, false);
    } else {
      //WE ARE ON THE BROWSER
    }
  });
}, 3000);