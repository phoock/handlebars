(function(){
    var GETCLASSES = "http://imoocnote.calfnote.com/inter/getClasses.php";
    var GETCLASSCHAPTER = "http://imoocnote.calfnote.com/inter/getClassChapter.php";
    var GETCLASSNOTE = "http://imoocnote.calfnote.com/inter/getClassNote.php";

    function formateData(data){
        var arr = [];
        var curPage = parseInt(data.curPage);
        var totalCount = parseInt(data.totalCount);
        //最左边
        var toLeft = {};
        toLeft.index = 1;
        toLeft.text = '&lt;&lt;';
        if(curPage != 1){
            toLeft.clickable = true;
        }
        arr.push(toLeft);
        //前一个
        var pre = {};
        pre.index = curPage - 1;
        pre.text = '&lt;';
        if(curPage != 1){
            pre.clickable = true;
        }
        arr.push(pre);
        //处理前页到curPage的情况
        if(curPage<5){
            for(var i = 1;i<curPage;i++){
                var page = {};
                page.index = i;
                page.text = i;
                page.clickable = true
                arr.push(page);
            }
        }else{
            //大于等于5的情况下最左边显示...
            var page = {};
            page.index = 1;
            page.text = 1;
            page.clickable = true;
            arr.push(page);
            var page = {};
            page.text = '...';
            arr.push(page);
            for(var i = curPage-2;i<curPage;i++){
                var page = {};
                page.index = i;
                page.text = i;
                page.clickable = true;
                arr.push(page);
            }
        }
        //处理curPage的页面
        var page = {};
        page.index = curPage;
        page.text = curPage;
        page.cur = true;
        arr.push(page);
        //处理curPage到totalCount的页面
        if(curPage<=totalCount-4){
            for(var i=curPage+1;i<=curPage+2;i++){
                var page={};
                page.index = i;
                page.text = i;
                page.clickable = true;
                arr.push(page);
            };
            var page = {};
            page.text = '...';
            arr.push(page);
            var page = {};
            page.text = totalCount;
            page.index = totalCount;
            page.clickable = true;
            arr.push(page);
        }else{
            for(var i=curPage+1;i<=totalCount;i++){
                var page = {};
                page.index = i;
                page.text = i;
                page.clickable = true;
                arr.push(page);
            }
        }

        //处理next页面
        var next = {}
        next.text = '&gt;';
        next.index = curPage+1;
        if(curPage!=totalCount){
            next.clickable = true;
        }
        arr.push(next);
        //处理toRight页面
        var toRight = {};
        toRight.text = '&gt;&gt;';
        toRight.index = totalCount;
        if(curPage!=totalCount){
            toRight.clickable = true;
        }
        arr.push(toRight);
        return arr;
    }

    function renderHtml(templateName,data,targetName){
        var t=$(templateName).html();
        var f=Handlebars.compile(t);
        var h=f(data);
        $(targetName).html(h);
    }

    function refreshHtml(curPage){
        $.getJSON(GETCLASSES,{curPage:curPage},function(data){
            renderHtml("#class-template",data.data,"#classes");
            renderHtml("#pag-template",formateData(data),"#pag");
            bindClasses();
            $("li.clickable").bind("click",function(){
                var curPage = this.getAttribute('data-id');
                refreshHtml(curPage);
            })
        })

    }

    function showNote(show){
        if(show){
            $('#overlap').css('display','block');
            $('#notedetail').css('display','block');
        }else{
            $('#overlap').css('display','none');
            $('#notedetail').css('display','none');
        }
    }

    function bindClasses(data){
        $('li.content').bind('click',function(){

            var cid = this.getAttribute('data-id');
            $.when($.getJSON(GETCLASSCHAPTER,{cid:cid}),$.getJSON(GETCLASSNOTE,{cid:cid})).done(function(v1,v2){
                renderHtml("#chapterdiv-template",v1[0],"#chapterdiv");
                renderHtml("#note-template",v2[0],"#notediv");
                showNote(true);
            })

        })

    }

    function bindClassEvent(){
        $('li.main-content').on('click',function(){
            $this = $(this);
            var cid = $this.data('id');
            $.when($.getJSON(GETCLASSCHAPTER,{cid:cid}),$.getJSON(GETCLASSNOTE,{cid:cid}))
            .done(function(cData,nData){
                renderTemplate("#chapter-template",cData[0],"#chapterdiv");
                renderTemplate("#note-template",nData[0],"#notediv");
                showNote(true);
            });

        })
    }

    $.getJSON(GETCLASSES,{curPage:1},function(data){
        renderHtml("#class-template",data.data,"#classes");
        renderHtml("#pag-template",formateData(data),"#pag");
        bindClasses(data);
        //渲染完成绑定pag-li点击事件
        $("li.clickable").bind("click",function(){
            var curPage = this.getAttribute('data-id');
            refreshHtml(curPage);
        })
    })

    $('#overlap').on('click',function(){
        showNote(false);
    })
    Handlebars.registerHelper("hasnote",function(v1,options){
        if(v1 == 1){
            return options.fn();
        }
    })
    Handlebars.registerHelper("nonote",function(v1,options){
        if(v1 != 1){
            return options.fn();
        }
    })
    Handlebars.registerHelper("longtime",function(v1){
        if(v1.match(/小时/)){
            return "long";
        }else{
            return "short";
        }
    })
    Handlebars.registerHelper("addone",function(v){
        return v+1;
    });
    Handlebars.registerHelper("formatDate",function(value){
        if(!value){return ""};
        var d = new Date(value);
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var date = d.getDate();
        var hour = d.getHours();
        var minute =d.getMinutes();
        var second = d.getSeconds();
        var str = year + "-" + month + "-" + date + " "+hour + ":" + minute + ":" + second;
        return str;
    })

})(jQuery)
