Class(window, 'PageController')({
    prototype: {
        init: function init () {
            var pageController = this;

            pageController.router = new Router();

            pageController.router.state({
                name: 'home',
                url: '/home',
                default: true,
                views: {
                    main: {
                        templateUrl : 'home.html',
                        widgetClass : UI.MyWidget
                    }
                }
            }).state({
                name: 'contact',
                url: '/contact',
                default: false,
                views: {
                    main: {
                        template    : '<div> Contact </div>',
                        widgetClass : UI.MyWidget
                    }
                }
            }).bootstrap();
        }
    }
});

$(document).ready(function () {
    window.page = new PageController();
});
