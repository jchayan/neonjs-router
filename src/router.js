Class(window, 'Router').includes(CustomEventSupport, BubblingSupport)({
    prototype: {
        _requestView: function _requestView (hash) {
            var router = this;

            for (var state in router.states) {
                if (hash === state) {
                    router.goto(state);
                    break;
                }
            }
        },
        init: function init () {
            var router = this;

            router.states      = { };
            router.activeState = null;

            $(window).bind('hashchange', function () {
                router._requestView(window.location.hash.substr(1));
            });
        },

        state: function state (data) {
            var router = this;

            router.states[data.name] = new State(data);

            if (router.states[data.name].default === true) {
                router.defaultState = router.states[data.name];
            }

            return router;
        },

        goto: function goto (name) {
            var router = this;

            router.activeState && router.activeState.destroy();

            if (router.states[name]) {
                router.states[name].render();

                router.activeState   = router.states[name];
                window.location.hash = name;
            } else {
                router.defaultState.render();
                window.location.hash = router.defaultState.name;
            }

            return router;
        },

        bootstrap: function bootstrap () {
            var router = this;

            var currentState = window.location.hash.substr(1);
            router.goto(currentState);
        }
    }
})
