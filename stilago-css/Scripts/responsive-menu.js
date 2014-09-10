_showpop = function(){
                document.getElementsByClassName('all-category-submenu')[0].style.display = "none";
                 if(document.getElementsByClassName('all-category-menu')[0].style.display == "block"){
                    document.getElementsByClassName('all-category-menu')[0].style.display = "none";
                    document.getElementsByClassName('categories')[0].style.display = "block";
                    document.getElementsByClassName('all-cat')[0].style.display = "none";
                    document.getElementsByClassName('arrow-up')[0].innerHTML = "<img src='./Content/Stilago/Images/default/arrows/arrow.png' class='open-menu-list-down'/>";
                 }
                else{
                    document.getElementsByClassName('all-category-menu')[0].style.display = "block";
                    document.getElementsByClassName('categories')[0].style.display = "none";
                    document.getElementsByClassName('all-cat')[0].style.display = "block";
                    document.getElementsByClassName('all-cat')[0].innerHTML = "ALL CATEGORIES";
                    document.getElementsByClassName('arrow-up')[0].innerHTML = "<img src='./Content/Stilago/Images/default/arrows/arrow-up.png' class='open-menu-list-down'/>";
                }
            }
            _showmenu = function(id){
                if(document.getElementsByClassName(id)[0].style.display == "block"){
                    document.getElementsByClassName(id)[0].style.display = "none";
                    document.getElementsByClassName('arrow-left-down')[0].innerHTML = "<img src='./Content/Stilago/Images/default/arrows/arrow.png' class='menu-left-arrow-pic' />";
                 }
                else{
                    document.getElementsByClassName(id)[0].style.display = "block";
                    document.getElementsByClassName('arrow-left-down')[0].innerHTML = "<img src='./Content/Stilago/Images/default/arrows/arrow-left.png' class='menu-left-arrow-pic-down' />";
                }
            }

            _showallmenu = function(id){
                if(document.getElementsByClassName('footer-expandable-menu')[id].style.display == "block"){
                    document.getElementsByClassName('footer-expandable-menu')[id].style.display = "none";
                    document.getElementsByClassName('footer-expandable-arrow')[id].innerHTML = "<img src='./Content/Stilago/Images/default/arrows/arrow.png' class='footer-click-arrow' />";
                 }
                else{
                    document.getElementsByClassName('footer-expandable-menu')[id].style.display = "block";
                    document.getElementsByClassName('footer-expandable-arrow')[id].innerHTML = "<img src='./Content/Stilago/Images/default/arrows/arrow-up.png' class='footer-click-arrow' />";
                }
            }
_initAll = function(){
                $(".loggedin-icon").click(function(){
                    _showmenu('loggedin');
                });
                $(".single-sub-menu").click(function(){
                    _showpop();
                });
                $(".nested-sub-menu").click(function(){
                    _showpop('all-category-submenu');
                    _showmenu('all-category-submenu');
                });
                $(".home-menu").click(function(){
                    _showpop('all-category-menu');
                });
                $(".anchor-list-menu").click(function(){
                    _showmenu('all-category-submenu');
                });
                
                $(".footer-menu").click(function(){
                    if(document.body.offsetWidth < 600){
                        if($(this).next().css("display") == "none"){
                            $(this).next().css({"display":"block"});
                            $(this).children().children('span.footer-expandable-arrow').html("<img src='./Content/Stilago/Images/default/arrows/arrow-up.png' class='footer-click-arrow' />");
                        }
                        else {
                            $(this).next().css({"display":"none"});
                            $(this).children().children('span.footer-expandable-arrow').html("<img src='./Content/Stilago/Images/default/arrows/arrow.png' class='footer-click-arrow' />");
                        }
                    }
                });
                
                var imgBan = document.getElementById('resize-banner-image');
                var imgHt = imgBan.offsetHeight;
                if (document.body.offsetWidth < 998 && document.body.offsetWidth >= 905) {
                    $(".caroufredsel-wrapper").height(imgHt + 5);
                    $(".carousel").height(imgHt + 5);
                    $(".carousel-wrapper").height(imgHt + 5);
                }
                else if (document.body.offsetWidth < 905  && document.body.offsetWidth >= 805) {
                    $(".caroufredsel-wrapper").height(imgHt - 4);
                    $(".carousel").height(imgHt - 4);
                    $(".carousel-wrapper").height(imgHt - 4);
                }
                else if (document.body.offsetWidth < 805  && document.body.offsetWidth >= 769) {
                    $(".caroufredsel-wrapper").height(imgHt - 8);
                    $(".carousel").height(imgHt - 8);
                    $(".carousel-wrapper").height(imgHt - 8);
                }
                else if (document.body.offsetWidth < 769) {
                    $(".caroufredsel-wrapper").height(imgHt);
                    $(".carousel").height(imgHt);
                    $(".carousel-wrapper").height(imgHt);
                } else {
                    $(".caroufredsel-wrapper").height(260);
                    $(".carousel").height(260);
                    $(".carousel-wrapper").height(260);
                }
                if (document.body.offsetWidth > 400 && document.body.offsetWidth < 600) {
                                $(".pagination").css("top", "-12%");
                    } else if (document.body.offsetWidth >= 600 && document.body.offsetWidth < 769) {
                                $(".pagination").css("top", "-7%");
                    } else if (document.body.offsetWidth >= 769 && document.body.offsetWidth < 1000) {
                                $(".pagination").css("top", "-6%");
                    } else if (document.body.offsetWidth >= 1000) {
                                $(".pagination").css("top", "");
                                $(".pagination").css("bottom", "10px");
                    }
                
                $(window).resize(function() {
                    var bodyheight = $(document).height();
                    var imgBan = document.getElementById('resize-banner-image');
                    var imgHt = imgBan.offsetHeight;
                    if (document.body.offsetWidth < 998 && document.body.offsetWidth >= 905) {
                        $(".caroufredsel-wrapper").height(imgHt + 5);
                        $(".carousel").height(imgHt + 5);
                        $(".carousel-wrapper").height(imgHt + 5);
                        //$(".pagination").css("top", "-9%");
                    }
                    else if (document.body.offsetWidth < 905  && document.body.offsetWidth >= 805) {
                        $(".caroufredsel-wrapper").height(imgHt - 4);
                        $(".carousel").height(imgHt - 4);
                        $(".carousel-wrapper").height(imgHt - 4);
                        //$(".pagination").css("top", "-6%");
                    }
                    else if (document.body.offsetWidth < 805  && document.body.offsetWidth >= 769) {
                        $(".caroufredsel-wrapper").height(imgHt - 8);
                        $(".carousel").height(imgHt - 8);
                        $(".carousel-wrapper").height(imgHt - 8);
                    }
                    else if (document.body.offsetWidth < 769) {
                        $(".caroufredsel-wrapper").height(imgHt);
                        $(".carousel").height(imgHt);
                        $(".carousel-wrapper").height(imgHt);
                        //$(".pagination").css("top", "-8%");
                    } else {
                        $(".caroufredsel-wrapper").height(260);
                        $(".carousel").height(260);
                        $(".carousel-wrapper").height(260);
                    }
                    if (document.body.offsetWidth > 400 && document.body.offsetWidth < 600) {
                                $(".pagination").css("top", "-12%");
                    } else if (document.body.offsetWidth >= 600 && document.body.offsetWidth < 769) {
                                $(".pagination").css("top", "-7%");
                    } else if (document.body.offsetWidth >= 769 && document.body.offsetWidth < 1000) {
                                $(".pagination").css("top", "-6%");
                    } else if (document.body.offsetWidth >= 1000) {
                                $(".pagination").css("top", "");
                                $(".pagination").css("bottom", "10px");
                    }
                });
            }
            
            if(window.addEventListener)
                window.addEventListener("load", _initAll, false);
            else if(window.attachEvent)
                window.attachEvent("onload", _initAll);            