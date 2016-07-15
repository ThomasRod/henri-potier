$(document).ready(function() {

    if($('div.panier-page').length > 0){
        onPanierLoad();
    }

    /* Evenement lors du changement de quantité d'un produitr */
    $(document).on('change', '.quantity', function(){
        var select = $(this);
        var panier = Cookies.getJSON('panier');
        var products = panier.products;

        products.every(function(product, index){
            if(product.isbn == select.data('isbn')){
                product.quantite = select.val();
                return false;
            }
            return true;
        });

        /* mise à jour du panier */
        app.majCookieCart(panier);

        /* mise à jour de la page */
        onPanierLoad();
    });

    /* au chargement de la page panier */
    function onPanierLoad(){
        var panier = Cookies.getJSON('panier');
        var products = panier.products;

        if(products.length) {
            /* nombre de produits selectionné */
            var cartSpan = $('.items-in-cart');
            var nbProducts = 0;
            var isbns = [], totalPrice = 0, reduction = 0, prixFinal;
            products.forEach(function (product) {
                for (var i = 0; i < product.quantite; i++) {
                    isbns.push(product.isbn);
                    totalPrice += product.price;
                }
                $("select[data-isbn='" + product.isbn + "'] option[value='" + product.quantite + "'").prop('selected', true);
                nbProducts += parseInt(product.quantite);
            });

            app.majCartDisplay(nbProducts);

            /* calcul de la meilleure offre */
            $('.price').text(totalPrice.toFixed(2) + " €");
            var isbnsURL = isbns.join();

            /* appel du service des offres*/
            $.getJSON("http://henri-potier.xebia.fr/books/" + isbnsURL + "/commercialOffers", function (result) {
                result.offers.forEach(function (offer) {
                    var reductionTmp = reductionOffer(offer, totalPrice);
                    if (reduction < reductionTmp) {
                        reduction = reductionTmp;
                    }
                });

                $('.reduction').text(reduction.toFixed(2) + " €");
                prixFinal = totalPrice - reduction;
                $('.final-price').text(prixFinal.toFixed(2) + " €");
            });
        }
    }

    /* Evenement lors du retrait d'un livre au panier */
    $(document).on('click', '.delete', function() {

        var imgDel = $(this);
        var panier = Cookies.getJSON('panier');
        var products = panier.products;

        /* mise à jour du panier session */
        var productsTmp = products;
        productsTmp.every(function(product, index){
            if(product.isbn == imgDel.data('isbn')){
                products.splice(index,1);
                return false;
            }
            return true;
        });
        app.majCookieCart(panier);
        location.reload();
    });

    function reductionOffer(offer, totalPrice){
        if(offer.type == "percentage"){
            return totalPrice * (offer.value / 100);
        } else if (offer.type == "minus") {
            return offer.value;
        } else if (offer.type == "slice") {
            return Math.floor(totalPrice/offer.sliceValue) * offer.value;
        } else {
            return 0;
        }
    }
});
