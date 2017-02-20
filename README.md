# angulatris
A cool tetris game developed in AngularJS and Cordova. It works both as a Mobile App and in the Web browser.

Demo: http://angularguy.net/angulatris


## To make it work in the web browser
After cloning the repo cd to the project folder and do this commands:

$> npm install

$> gulp es6

$> gulp sass

$> cd www

$> bower install


After this you can run gulp to run a web server in port 8080 with livereload for html, scss and js (es6) files.
Be sure to install the chrome plugin so livereload works: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei

The app should work now by opening www/index.html



## To make it work in a mobile device
After cloning the repo cd to the project folder and do this commands:

$> cordova install android|ios

$> cordova prepare

$> cordova run|emulate android|ios


The app should run or emulate in you android|ios device, app still not tested in other mobile environments.
Now you can do changes to the code and after that rerun the run|emulate command.
