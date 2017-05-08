Class(window, 'View').includes(CustomEventSupport, BubblingSupport)({
    prototype: {
        name           : null,
        viewData       : null,
        _templateReady : false,
        _waitingRender : false,

        init: function init (name, data) {
            var view = this;

            view.name     = name;
            view.viewData = data;

            view.bind('template.ready', function () {
                view._templateReady = true;

                if (view._waitingRender) {
                    view.render();
                    view._waitingRender = false;
                }
            });

            if (!(view.viewData.templateUrl) && !(view.viewData.template)) {
                throw new Error('No template provided to view ' + view.name);
            } else if (view.viewData.templateUrl) {
                view._getTemplate().done(function (response) {
                    view.viewData.template = response;
                    view.dispatch('template.ready');
                }).fail(function (response) {
                    view.dispatch('template.fail');
                });
            } else {
                view.dispatch('template.ready'); 
            }

            return view;
        },

        _getTemplate: function _getTemplate () { 
            var view = this;

            return $.get(view.viewData.templateUrl);
        },

        render: function render () {
            var view = this;

            if (view._templateReady) {
                var domViews, target, widget;

                domViews = $('div[n-view]');

                domViews.each(function (index, nview) {
                    var element = $(nview);

                    if (element.attr('n-view') === view.name) {
                        target = element;
                    }
                });

                view.viewData.element = $(view.viewData.template);

                view.widget = new view.viewData.widgetClass(view.viewData);

                view.widget.bind('beforeRender', function (event) {
                    view.dispatch('view.beforeRender');
                });

                var onBeforeWidgetRender = function onBeforeWidgetRender (event) {
                    view.dispatch('view.beforeRender');
                    view.widget.unbind('beforeRender', onBeforeWidgetRender);
                };

                var onWidgetRender = function onWidgetRender (event) {
                    view.dispatch('view.render');
                    view.widget.unbind('render', onWidgetRender);
                };

                view.widget.bind('render', onWidgetRender);
                view.widget.bind('beforeRender', onBeforeWidgetRender);

                view.widget.render(target);
            } else {
                view._waitingRender = true;
            }

            return view;
        },

        destroy: function destroy () {
            var view = this;

            var onBeforeDestroy = function onBeforeDestroy () {
                view.dispatch('view.beforeDestroy');
                view.unbind('onBeforeDestroy');
            };

            var onDestroy = function onDestroy () {
                view.dispatch('view.destroy');
            };

            view.widget.bind('beforeDestroy', onBeforeDestroy);
            view.widget.bind('destroy', onDestroy);

            view.widget.destroy();
        }
    }
});
