window.UI = { };

Class(UI, 'MyWidget').inherits(Widget)({
    prototype: {
        ELEMENT_CLASS: 'widget',

        init: function init (config) {
            Widget.prototype.init.call(this, config);
        }
    }
})
