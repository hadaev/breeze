//preload
var containerModal = $('#myfond');
containerModal.show().addClass('preload');
$('body').css('overflow', 'hidden');

$(document).ready(function() {
    //preload
    var containerModal = $('#myfond');
    containerModal.show().addClass('preload');
    $('body').css('overflow', 'hidden');

    //init slider
    $('.fade').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear'
    });

    //focus form search

    var inputFocus = $('.js-focus input');
    function eventFocus(self){$(self).parent().toggleClass('focus')}
    inputFocus.on('focus', function () {
        var self = this;
        eventFocus(self);
    });
    inputFocus.on('blur', function () {
        var self = this;
        eventFocus(self);
    });

    //show mobile menu
    $('.js-click-menu').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().toggleClass('active');
    });
    function removeMobileMenu() {
        if($(window).innerWidth() > 768){
            $('.js-menu').removeAttr('style');
        }
    }

    removeMobileMenu();
    $(window).resize(function () {
        removeMobileMenu();
    });


    // parse json
    var getData = function () {
        return $.ajax({
            dataType: 'json',
            url: 'https://shop.bremont.com/products.json'
        });
    };

    getData()
        .then(
            parseData,
            function (error) {
                ToastrNotifications.error(error);
            }
        );
    var count = 0;
    // load items to slider
    function parseData(data) {
        function prepareItem(item){
            var imageDefault = 'images/no-images.svg';
            var isImage = item.hasOwnProperty('images');
            var container = $(document.createElement('div'));
            container.addClass("item");
            container.data("item", item);
            container.data("id", item.id);
            container.data("count", count);
            container.append('<div class="block-image"/>');
            container.find('.block-image').append('<img src="' + (isImage && (item.images[0].src !== '')? item.images[0].src : imageDefault) + '">');
            container.find('.block-image').append('<span class="caption">'+ item.title +'</span>');
            container.append('<div class="block-variables display-flex flex-align-items-center"/>');
            container.find('.block-variables').append('<div class="price"/>');
            container.find('.price').append('<div class="price-new">$'+ item.variants[0].price +'</div>');
            container.find('.block-variables').append('<div class="compare"><a href=""></a></div>');
            container.find('.block-variables').append('<div class="heart"><a href=""></a></div>');
            container.find('.block-variables').
            append('<div class="cart-plus" data-toggle="tooltip" data-placement="top" title="0"><a href=""></a></div>');

            return container;
        }
        $.each(data.products, function (i, item) {
            $('#bestItems').append(prepareItem(item));
            $('#featuredItems').prepend(prepareItem(item));
        });
        initSliders()
    }
    // init plugins
    function initSliders() {
        $('.autoplay').slick({
            slidesToShow: 4,
            slidesToScroll: 2,
            autoplay: false,
            autoplaySpeed: 2000,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 540,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 425,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
        //tooltip
        $('[data-toggle="tooltip"]').tooltip();
        //preload
        $('#myfond').hide().removeClass('preload');
        $('body').removeAttr('style');
    }


    var containerItems = $('#bestItems, #featuredItems');
    var containerCart = $('#cart');

    //delete item from cart
    containerCart.on('click', '.js-close', function (e) {
        e.preventDefault();
        var containerItem = $(this).closest('.block-item');
        var itemId = containerItem.data('id');
        containerItem.remove();
        count = 0;
        resetCount(itemId, count);
        totalItem(count)
    });

    function resetCount(id, count) {
        var items = containerItems.find('.item');
        $.each(items, function (i, el) {
            if($(el).data('id') === id){
                $(el).data('count', count);
                $(el).find('.cart-plus').attr('data-original-title', count);
            }
        })
    }

    //event add item to cart
    containerItems.on('click', '.cart-plus', function (e) {
        e.preventDefault();
        var itemData = $(this).closest('.item').data('item');
        var itemId = $(this).closest('.item').data('id');
        count = $(this).closest('.item').data('count');
        count++;
        $(this).closest('.item').data('count', count);
        $(this).attr('data-original-title', count);
        if(!itemData)return false;
        countItem(itemId, count, itemData);
        totalItem(count)
        if(count > 1) coverBox(count);
    })
//total item
    function totalItem() {
        var total = 0;
        var cartItem = containerCart.find('.block-item');

        $.each(cartItem, function (i, el) {
            var count = $(el).data('count');
            var price = $(el).data('price');
            var totalPrice = parseFloat(price) * count;

            total = total + totalPrice;
        })
        containerCart.find('.total').text('Total: $' + total.toFixed(2));
        $('#cartTotal').text('$' + total.toFixed(2));

    }
//count item
    function countItem(id, count, itemData) {
        var cartItem = containerCart.find('.block-item');
        if( cartItem.length === 0){
            $('#cart').find('.total').before(addToCart(itemData, count));
        }else{
            $.each(cartItem, function (i, el) {
                if($(el).data('id') === id){
                    $(el).data('count', count);
                    $(el).find('.count').text(count);
                }else if(count < 2 ){
                    $('#cart').find('.total').before(addToCart(itemData, count));
                    return false;
                }
            })
        }
    }
//add item to cart
    function addToCart(item, count) {

        var container = $(document.createElement('div'));
        container.addClass("block-item display-flex flex-justify-content-between");
        container.data("count", count);
        container.data("id", item.id);
        container.data("price", item.variants[0].price);
        container.append('<div class="wrap-img"/>');
        container.find('.wrap-img').append('<img src="' + item.images[0].src + '">');
        container.append('<div class="block-item__text"/>');
        container.find('.block-item__text').append('<p class="description">'+ item.body_html +'</p>');
        container.find('.block-item__text').append('<p class="quantity"><span class="count">'+ count +'</span> x <span class="price"> $'+ item.variants[0].price +' </span></p>');
        container.append('<div class="close"><a href="" class="js-close"></a></div>');

        return container;
    }

    //add plus compare

    containerItems.on('click', '.heart, .compare', function (e) {
        e.preventDefault();
        $(this).toggleClass('plus');
    })

    //popup

    function coverBox(count){
        containerModal.fadeIn(300);
        var iddiv = 'box';
        var textTotal = $('#cartTotal').text();
        $('#'+iddiv).fadeIn(300);
        containerModal.attr('opendiv',iddiv);
        $('#box').find('.modal-total span').text(textTotal);
        $('#box').find('.modal-count span').text(count);
    }

    $('.button-box').click(function() {
        var iddiv = containerModal.attr('opendiv');
        containerModal.fadeOut(300);
        $('#'+iddiv).fadeOut(300);
    });


});
//preload
$(window).on('load', function () {
    // $('#myfond').hide().removeClass('preload');
    // $('body').removeAttr('style');
})