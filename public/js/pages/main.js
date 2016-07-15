$(document).ready(function()
{
    if($('div.main-page').length > 0){
        onIndexLoad();
    }

    function onIndexLoad(){
        var panier = Cookies.getJSON('panier');

        var products = panier.products;
        var nbProducts = 0;

        products.forEach(function(product){
            nbProducts += parseInt(product.quantite);
        });

        app.majCartDisplay(nbProducts);

        $('.apps').each(function(index){
            var book = $(this);
            var isbn = book.data('isbn');

            book.find('.btn').addClass('add-in-cart');
            book.find('.btn').text('Ajouter du panier');

            if(products.length > 0){
                products.every(function(product){
                    if(product.isbn == isbn){
                        book.find('.btn').removeClass('add-in-cart').addClass('remove-in-cart');
                        book.find('.btn').text('Retirer du panier');
                        return false;
                    }
                    return true;
                });
            }
        });
    }

    /* Evenement lors de l'ajout d'un livre au panier */
    $(document).on('click', '.add-in-cart', function() {

        var panier = Cookies.getJSON('panier');
        var products = panier.products;
        var addCartBtn = $(this);

        /* mise à jour du livre html/css */
        addCartBtn.removeClass('add-in-cart').addClass('remove-in-cart');
        addCartBtn.text('Retirer du panier');

        /* mise à jour du panier session */
        var book = addCartBtn.parents(".apps");
        products.push({
            isbn : book.data('isbn'),
            title: book.data('title'),
            price: book.data('price'),
            quantite: 1
        });
        app.majCookieCart(panier);

        /* mise à jour du panier (ajout) */
        var nbProducts = 0;
        products.forEach(function(product){
            nbProducts += parseInt(product.quantite);
        });

        app.majCartDisplay(nbProducts);
    });

    /* Evenement lors du retrait d'un livre au panier */
    $(document).on('click', '.remove-in-cart', function() {

        var panier = Cookies.getJSON('panier');
        var products = panier.products;
        var removeCartBtn = $(this);

        /* mise à jour du livre */
        removeCartBtn.removeClass('remove-in-cart').addClass('add-in-cart');
        removeCartBtn.text('Ajouter du panier');

        /* mise à jour du panier session */
        var book = removeCartBtn.parents(".apps");
        var productsTmp = products;
        productsTmp.every(function(product, index){
            if(product.isbn == book.data('isbn')){
                products.splice(index,1);
                return false;
            }
            return true;
        });
        app.majCookieCart(panier);

        /* mise à jour du panier (retrait) */
        var nbProducts = 0;
        products.forEach(function(product){
            nbProducts += parseInt(product.quantite);
        });

        app.majCartDisplay(nbProducts);
    });
});
