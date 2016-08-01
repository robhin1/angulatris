setTimeout(function () {
  //@TODO on resize rerun this
  $(function () {

    var pageWidth = 312; //$('#app-left-column').width() + $('#app-right-column').width(); // old phones don't seem to calculate the width correctly using this commented code, so we can run this on the desktop browser and hardcode it for now... same thing for the line under (pageHeight)
    var pageHeight = 700; //$('#app-all').height(); // min height of site
    var browserAdjustment = .90;
    var mobileAdjustment = .95;

    var roundDecimalsTo2AndMakeSureItEndsInAEvenNumber = function (oldZoom) {
      var newZoom;
      try {
        newZoom = /\d.*\.\d\d/.exec(oldZoom)[0]
        if (newZoom[newZoom.length - 1] % 2) {
          newZoom -= .01;
        }
      } catch (e) {
        newZoom = oldZoom;
      }
      return newZoom;
    }
    var resizeBrowser = function () {
      var screenWidth = ($(window).width() < window.screen.width) ? $(window).width() : window.screen.width;
      var screenHeight = ($(window).height() < window.screen.height) ? $(window).height() : window.screen.height;
      var widthRatio = screenWidth / pageWidth;
      var heightRatio = screenHeight / pageHeight;
      var minRatio = Math.min(widthRatio, heightRatio);
      var maxRatio = Math.max(widthRatio, heightRatio);
      var newZoom = .01;
      while (true) {
        if (screenWidth < (newZoom * pageWidth) || screenHeight < (newZoom * pageHeight)) {
          break;
        }
        newZoom += .01;
      }
      document.body.style.zoom = roundDecimalsTo2AndMakeSureItEndsInAEvenNumber(newZoom * browserAdjustment); //console.log('screenWidth',screenWidth,'screenHeight',screenHeight,'pageWidth',pageWidth,'pageHeight',pageHeight,'widthRatio',widthRatio,'heightRatio',heightRatio,'minRatio',minRatio,'maxRatio',maxRatio);
    }
    var resizeMobile = function () {
      var windowWidth = window.innerWidth,
        newScaleWidth = windowWidth / pageWidth;
      var windowHeight = window.innerHeight,
        newScaleHeight = windowHeight / pageHeight;
      var newZoom = Math.min(newScaleWidth, newScaleHeight) * mobileAdjustment;
      document.body.style.zoom = roundDecimalsTo2AndMakeSureItEndsInAEvenNumber(newZoom);
      var el = $('#app-loading-modal');
      setTimeout(function () {
        el.fadeOut('slow', function () {
          el.remove();
        });
      }, 1000);
    }

    var resizeFinal = function () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        resizeMobile();
      } else {
        resizeBrowser();
      }
    }
    resizeFinal();
    let resizeTimeout;
    $(window).resize(function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        resizeFinal();
        console.log('resized');
      }, 1000);
    });
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