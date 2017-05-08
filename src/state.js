Class(window, 'State').includes(CustomEventSupport, BubblingSupport)({
    prototype: {
        _renderQueue : null,
        parent       : null,
        default      : false,
        name         : null,
        url          : null,
        views        : { },

        init: function init (data) {
            var state = this;

            state.name    = data.name;
            state.url     = data.url;
            state.default = data.default || false;
            state.views   = [ ];

            var views, length, includesMain;

            views = data.views || [];
            length = views.length;
            includesMain = false;

            var renderCount = 0;

            // FIXME: Have a more solid way to determine when all views have rendered
            state.bind('view.render', function (event) {
               renderCount++;

                if (renderCount === length) {
                    state.dispatch('state.render');
                }
            });

            for (var key in views) {
                var view = new View(key, data.views[key]);
                state.views.push(view);

                includesMain = includesMain || key === 'main';
            }

            if (!includesMain) {
                console.warn('Missing main view in state: %s', state.name);
            }
        },

        render: function render () {
            var state = this;

            state.views.forEach(function (view) {
                view.render();
            });

            return state;
        },

        destroy: function destroy () {
            var state = this;

            state.views.forEach(function (view) {
                view.destroy();
            });
        }
    }
});

