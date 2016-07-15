(function($) {

    var app;

    app = {
        majCartDisplay: function(nbProducts){
            var cartSpan = $('.items-in-cart');
            cartSpan.attr("data-item-count", ""+nbProducts+"");
            cartSpan.data('item-count', nbProducts);
            cartSpan.text(nbProducts);
        },
        majCookieCart: function(panier){
            Cookies.remove('panier');
            Cookies.set('panier', JSON.stringify(panier));
        }
    };

    window.app = app;

})(this.jQuery);