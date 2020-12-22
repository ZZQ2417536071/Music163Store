function my$(id){
    return document.getElementById(id);
}

function my$byTagName(tagname){
    return document.getElementsByTagName(tagname);
}

//设置文本内容
function setInnerText(element,text){
    //判断element.textContent属性是否存在，如果不存在，说明我们的浏览器不是ie8,我们就使用innerText属性
    if(element.textContent == "undefined") {
        element.innerText = text;
    }
    //如果element.textContent存在，说明是ie8，就用textContent属性
    else{
        element.textContent = text;
    }
}

function getInnerText(element){
    //判断element.textContent属性是否存在，如果不存在，说明我们的浏览器不是ie8，我们就使用innerText属性
    if(element.textContent == "undefined") {
        return element.innerText;
    }
    //如果element.textContent存在，说明是ie8，就用textContent属性
    else{
        return element.textContent;
    }
}

//获取样式的兼容性的写法
function getStyle(obj,attr){
    //IE
    if(obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    //谷歌火狐
    else{
        return getComputedStyle(obj,false)[attr];
    }
}

//设置样式
function css(obj,attr,value){
    if(arguments.length == 2){
        return getStyle(obj,attr);
    }
    else if(arguments.length == 3){
        obj.style[attr] = value;
    }
}

//获取第一个元素节点
function getFirstElementChild(element){
    //如果是火狐谷歌
    if(element.firstElementChild){
        return element.firstElementChild;
    }
        //ie 8
    else{
        var node = element.firstChild;
        while(node && node.nodeType!=1){
            node = node.nextSibling;
        }
        return node;
    }
}

//获取最后一个元素
function getLastElementChild(element) {
    if(element.lastElementChild){//true--->支持
        return element.lastElementChild;
    }else{
        var node=element.lastChild;//第一个节点
        while (node&&node.nodeType!=1){
            node=node.previousSibling;
        }
        return node;
    }
}


//绑定事件的代码封装
function addEventListener(element,type,fn){
    //如果有addEventListener这个方法，说明是谷歌、火狐、ie11
    if(element.addEventListener){
        element.addEventListener(type,fn,false);
    }
    //IE 8
    else if(element.attachEvent){
        element.attachEvent("on"+type,fn);
    }
    //正常情况
    else {
        element["on" + type] = fn;
    }
}

function removeEventListener(element,type,fn){
    //如果是火狐、谷歌、IE11
    if(element.removeEventListener){
        element.removeEventListener(type,fn,false);
    }
    else if(element.detachEvent){
        element.detachEvent("on"+type,fn);
    }
    else{
        element["on" + type] = null;
    }
}

//得到滚动出去的位置
function getScroll(){
    var scrollTop = document.body.scrollTop||document.documentElement.scrollTop;
    var scrollLeft = document.body.scrollLeft||document.documentElement.scrollLeft;
    return {
        scrollTop:scrollTop,
        scrollLeft:scrollLeft
    }
}

//得到鼠标在页面中的位置
function getPage(e){
    var oev = e||window.event;
    //pageX = 可视区的位置 + 左边滚动出去的位置
    var pageX = oev.clientX + getScroll().scrollLeft;
    var pageY = oev.clientY + getScroll().scrollTop;
    return {
        pageX:pageX,
        pageY:pageY
    }
}

//获取到url中的参数信息
function getQuery(queryStr) {
    var query = {};
    if (queryStr.indexOf('?') > -1) {
        var index = queryStr.indexOf('?');
        queryStr = queryStr.substr(index + 1);
        var array = queryStr.split('&');
        for (var i = 0; i < array.length; i++) {
            var tmpArr = array[i].split('=');
            if (tmpArr.length === 2) {
                query[tmpArr[0]] = tmpArr[1];
            }
        }
    }
    return query;
}


//动画函数的初步封装
function animate(element,target){
    //1.先获取原来的值
    var current = element.offsetLeft;

    //2.先判断定时器有没有，如果有了就先终止定时器，再去开定时器
    if(element.timeid){
        clearInterval(element.timeid);
        element.timeid = null;
    }
    //3.开启定时器
    element.timeid = setInterval(function(){
        var step = 10;
        //目标值是 10
        //当前值是 390
        if(target - current < 0){
            step = -step;
        }

        if(Math.abs(target - current) < Math.abs(step)){
            element.style.left = target + "px";
            clearInterval(element.timeid);
            return;
        }

        current += step;
        element.style.left = current + "px";
    },10);
}

// element 哪个元素需要动画
// json 包含所有需要进行动画的属性  {"width": 400, "height": 500, "left": 500, "top": 80, "opacity": 0.2};
// fn 动画完成之后回调函数
function animate(element, json, fn) {
    clearInterval(element.timeId);//清理定时器
    //定时器,返回的是定时器的id
    element.timeId = setInterval(function () {
        var flag = true;//默认,假设,全部到达目标
        //遍历json对象中的每个属性还有属性对应的目标值
        for (var attr in json) {
            //判断这个属性attr中是不是opacity
            if (attr == "opacity") {
                //获取元素的当前的透明度,当前的透明度放大100倍
                var current = getStyle(element, attr) * 100;
                //目标的透明度放大100倍
                var target = json[attr] * 100;
                var step = (target - current) / 10;

                //8.5  ---> 9
                //-8.5 ---> -9
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                if (Math.abs(current - target)  <= Math.abs(step)){
                    // 让定时器停止
                    // 让盒子到target的位置
                    element.style[attr] = target / 100;
                }
                else{
                    current += step;//移动后的值
                    element.style[attr] = current / 100;
                }
            } else if (attr == "zIndex") { //判断这个属性attr中是不是zIndex
                //层级改变就是直接改变这个属性的值
                element.style[attr] = json[attr];
            } else {
                //普通的属性
                //获取元素这个属性的当前的值
                var current = Math.ceil(parseFloat(getStyle(element, attr)));
				//var current = parseInt(getStyle(element, attr));
                //当前的属性对应的目标值
                var target = json[attr];
                //移动的步数
                var step = (target - current) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                if (Math.abs(current - target)  <= Math.abs(step)){
                    // 让定时器停止
                    // 让盒子到target的位置
                    element.style[attr] = target + 'px';
                }
                else{
                    current += step;//移动后的值
                    element.style[attr] = current + "px";
                }
            }
            //测试代码
            //console.log("目标:" + target + ",当前:" + current + ",每次的移动步数:" + step);
            //是否到达目标
            if (current != target) {
                flag = false;
            }
        }
        if (flag) {
            //清理定时器
            clearInterval(element.timeId);
            //所有的属性到达目标才能使用这个函数,前提是用户传入了这个函数
            if (fn) {
                fn();
            }
        }
    }, 20);
}


//得到浏览器的若干信息
function getUserAgent(){
    var browser = {
        versions: function() {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {     //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        } (),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    return browser;
}

function getDates(dt) {
    var str = "";//存储时间的字符串
    //获取年
    var year = dt.getFullYear();
    //获取月
    var month = dt.getMonth() + 1;
    //获取日
    var day = dt.getDate();
    //获取小时
    var hour = dt.getHours();
    //获取分钟
    var min = dt.getMinutes();
    //获取秒
    var sec = dt.getSeconds();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    str = year + "年" + month + "月" + day + "日 " + hour + ":" + min + ":" + sec;
    return str;
}


/**
 * 获取父级元素中的第一个子元素
 * @param element 父级元素
 * @returns {*} 父级元素中的子级元素
 */
function getFirstElement(element) {
    if (element.firstElementChild) {
        return element.firstElementChild;
    } else {
        var node = element.firstChild;
        while (node && node.nodeType != 1) {
            node = node.nextSibling;
        }
        return node;
    }
}
/**
 * 获取父级元素中的最后一个子元素
 * @param element 父级元素
 * @returns {*} 最后一个子元素
 */
function getLastElement(element) {
    if (element.lastElementChild) {
        return element.lastElementChild;
    } else {
        var node = element.lastChild;
        while (node && node.nodeType != 1) {
            node = node.previousSibling;
        }
        return node;
    }
}
/**
 * 获取某个元素的前一个兄弟元素
 * @param element 某个元素
 * @returns {*} 前一个兄弟元素
 */
function getPreviousElement(element) {
    if (element.previousElementSibling) {
        return element.previousElementSibling
    } else {
        var node = element.previousSibling;
        while (node && node.nodeType != 1) {
            node = node.previousSibling;
        }
        return node;
    }
}
/**
 * 获取某个元素的后一个兄弟元素
 * @param element 某个元素
 * @returns {*} 后一个兄弟元素
 */
function getNextElement(element) {
    if (element.nextElementSibling) {
        return element.nextElementSibling
    } else {
        var node = element.nextSibling;
        while (node && node.nodeType != 1) {
            node = node.nextSibling;
        }
        return node;
    }
}

/**
 * 获取某个元素的所有兄弟元素
 * @param element 某个元素
 * @returns {Array} 兄弟元素
 */
function getSiblings(element) {
    if (!element)return;
    var elements = [];
    var ele = element.previousSibling;
    while (ele) {
        if (ele.nodeType === 1) {
            elements.push(ele);
        }
        ele = ele.previousSibling;
    }
    ele = element.nextSibling;
    while (ele) {
        if (ele.nodeType === 1) {
            elements.push(ele);

        }
        ele = ele.nextSibling;
    }
    return elements;
}