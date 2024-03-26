/** @param {...*} undefined */
(function(undefined){

    // mute closure and help with minification
    var window = this;
    var parent = window.parent;
    var top = window.top;
    var location = window.location;
    var document = window.document;
    var navigator = window.navigator;
    var screen = window.screen;
    var NULL = null;

    /** @const */
    var version = "-dirty";
    var script_name = "tfav_adl_160";
    var cname = "sap";
    var tab_nom = "sap";

    // IE is really awful...
    var HEAD = document.head || document.getElementsByTagName('head')[0];

    // return our own script element
    var myelement = (function(){
        if (document.currentScript)
            return document.currentScript
        var re = new RegExp('/(?:tmp_)?'+script_name+'\\.js[#?]?');
        var sc = document.scripts;
        var i = sc.length;
        while (i-->0) {	// *reverse* as if multiple Adloox tracked ads on page, *this* script will be the last one
            if (!sc[i] || !sc[i].src)
                continue;
            var res = sc[i].src.match(re);
            if (!res)
                continue;
            return sc[i];
        }

        return NULL;
    })();

    var visite_id = Math.floor((Math.random() * 100000000000) + 1);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
// http://tokenposts.blogspot.co.uk/2012/04/javascript-objectkeys-browser.html
if (!Object.keys) {
    Object.keys = function(obj) {
        var keys = [];

        for (var i in obj)
            if (Object.prototype.hasOwnProperty.call(obj, i))
                keys.push(i);

        return keys;
    };
}

    /**
 * @param {...*} va
 */
var noop = function(va){};
/** @const */
var NDEBUG = true;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Polyfill
var now = function(){ return new Date().getTime() };
var boottime = now();
var runtime = function(){ return now() - boottime };

var to_array = function(list) {
    var a = [];
    var n = list.length;
    while (n-->0) a.unshift(list[n]);
    return a;
};

/**
 * @param {...*} va
 */
var LOG = NDEBUG ? noop : function(va){
    if (typeof console == 'undefined') return;

    var args = to_array(arguments);
    args.unshift('com.adloox.JS [' + visite_id + ']:');

    var argss = [];
    for (var i = 0; i < args.length; i++) {
        var a = args[i];
        try { a = a.toString(); } catch(_) {};
        argss.push(a);
    }
    var msg = argss.join(' ');

    if (console.groupCollapsed) {
        console.groupCollapsed(msg);
        for (var i = 1; i < args.length; i++)
            console.log(args[i]);
        console.groupEnd();
    } else
        console.log(msg);
};

var SETTIMEOUTFN = window.setTimeout;
var SETTIMEOUT = function(f, t){
    return SETTIMEOUTFN(f, t);
};
var YIELD = function(f){
    return SETTIMEOUT(f, 0);
};

/**
 * @param {Function} f
 * @param {...*} va
 */
// this also makes our external facing APIs .toString() proof
var BINDER = function(f, va){
    var args = Array.prototype.slice.call(arguments, 1);

    if (Function.prototype.bind) {
        args.unshift(NULL);
        return Function.prototype.bind.apply(f, args);
    } else {	// IE8 :(
        return function(){
            var argsn = to_array(arguments);
            return f.apply(this, args.concat(argsn));
        };
    }
};

// do not use these calls for APIs that only exist on recent versions of IE
var evA = function(target, event, callback) {
    if (target.addEventListener) {
        try {
            target.addEventListener(event, callback, { 'passive': true });
        } catch(_) {
            target.addEventListener(event, callback, false);
        }
    } else
        target.attachEvent('on' + event, callback);
};
var evR = function(target, event, callback) {
    if (target.removeEventListener) {
        try {
            target.removeEventListener(event, callback, { 'passive': true });
        } catch(_) {
            target.removeEventListener(event, callback, false);
        }
    } else
        target.detachEvent('on' + event, callback);
};

var ev = document.createElement('a');
var evcb = function(d){
    var cb = fire.cb[d['name']];
    if (!cb) return;
    var n = cb.length;
    while (n-->0) {
        try {
            cb[n][0].call(cb[n][1], d['detail']);
        } catch(_) {
            LOG('fire oops', cb[n], d, _.stack || _.message);
            oops('fire ' + d['name'] + ': ' + (_.stack || _.message));
        }
    }
};

var unloading = false;

var onloadtime = 0;
evA(window, 'load', function(){ onloadtime = now() });

/**
 * @param {string} name
 * @param {Object=} detail
 */
// N.B. we do not dispatch inline as this could mask bugs
// N.B. we dispatch events where possible as newer browsers throttle setTimeout
// N.B. we do not use fireEvent on IE as it has to be attached to the DOM (spoofing!)
var fire = function(name, detail){
    if (name != 'viewability') LOG("fire", name, detail);
    detail = detail || {};
    if (unloading) {						// immediate so it executes
        evcb({ 'name': name, 'detail': detail });
    } else if (typeof window.CustomEvent == 'function')
        ev.dispatchEvent(new CustomEvent('e', { 'detail': { 'name': name, 'detail': detail } }))
    else if (typeof document.createEvent == 'function') {	// old webkit and newer IE
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('e', false, true, { 'name': name, 'detail': detail });
        ev.dispatchEvent(e);
    } else
        YIELD(BINDER(evcb, { 'name': name, 'detail': detail }));
};
fire.cb = {};
if (typeof window.CustomEvent == 'function' || typeof document.createEvent == 'function')
    ev.addEventListener('e', function(e){ evcb(e['detail']) });
/**
 * @param {string} name
 * @param {Function=} cb
 * @param {?=} ctx
 */
var subscribe = function(name, cb, ctx){
    ctx = ctx || this;
    if (fire.cb[name])
        fire.cb[name].push([ cb, ctx ])
    else
        fire.cb[name] = [ [ cb, ctx ] ];
};
var unsubscribe = function(name, cb){
    if (!fire.cb[name]) return;
    var n = fire.cb[name].length;
    while (n-->0)
        if (fire.cb[name][n][0] == cb)
            fire.cb[name].splice(n, 1);
};
var haslistener = function(name){
    if (!fire.cb[name]) return false;
    return !!fire.cb[name].length;
};

var unloader;
var unload = function(){
    if (unloading) return;
    // mopub use 'onload = function(){ window.location = "mopub://mopubFinishLoad" }'
    if (WEBVIEW && onloadtime && now() - onloadtime < 100) {
      LOG("QUIRK WEBVIEW unload too soon after onload");
      return;
    }
    if (unloader) window.clearTimeout(unloader);
    LOG("unloading");
    unloading = true;
    fire('unload');
};
subscribe('impression', function(){
    // workflow supports max of 10 minutes
    unloader = window.setTimeout(function(){
        LOG('unloading due to max session time');
        unload();
    }, 570 * 1000);
});

var parseUri = function(u){
    var a = document.createElement('a');
    a.href = u;
    return a;
};

var fixedEncodeURIComponent = function(s){
    return encodeURIComponent(s).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
};

var o2qs = function(o){
    var a = [];
    var k = Object.keys(o);
    for (var i = 0; i < k.length; i++)
        a.push(fixedEncodeURIComponent(k[i])+'='+fixedEncodeURIComponent(o[k[i]]));
    return a.join('&');
};

var qs2o = function(qs){
    var o = {};

    if (!qs.length)
        return o;

    var p = qs.split('&');
    for (var i = 0; i < p.length; i++) {
        var m = p[i].split('=', 2);
        // not-wrapped as the keys come from us and exploding is best if wrong
        var k = decodeURIComponent(m[0]);
        // wrapped in try/catch to handle unpopulated macros (ie. '%epid!')
        var v = m[1]; try { v = decodeURIComponent(v) } catch(_) {};
        if (o[k] === undefined)
            o[k] = [ v ]
        else
            o[k].push(v);
    }

    return o;
};

/**
 * @param {Object} a
 * @param {string=} k
 */
var last = function(a, k){
    if (k)
       a[k] = last(a[k])
    else
       return a[a.length - 1];
};

/**
 * @param {string} u
 * @param {Object=} o
 */
var sendPixel = function(u, o){
    if (!u) return;
    if (o) u = u + o2qs(o);

    (new Image()).src = u;
    LOG('sendPixel', u);
};

/**
 * @param {string} u
 * @param {Object=} o
 */
var sendBeacon = function(u, o){
    if (!u) return;
    if (o) u = u + o2qs(o);

    if (typeof navigator.sendBeacon == 'function' && navigator.sendBeacon(u, '')) {
        LOG('sendBeacon', u);
    } else if (unloading) {
        try {
            var oReq = new XMLHttpRequest();
            oReq.open('GET', u, false);
            oReq.send();
            LOG('sendBeacon', u, 'sync XMLHttpRequest');
        } catch(_) {
            sendPixel(u);
        }
    } else {
        sendPixel(u);
    }
};

var sendtracking = function(u){
    if (!u) return;
    sendPixel(macros(u));
};

var sendScript = function(u, o){
    if (!u) return;
    if (o) u = u + o2qs(o);

    var s = document.createElement('script');

    s.src = u;
    s.setAttribute('data-adloox-sid', visite_id);

    insertAfter(s, myelement)
};

var insertAfter = function(n, e){
    if (e)
        e.parentNode.insertBefore(n, e.nextSibling)
    else
        (HEAD || document.body).appendChild(n);
};

/**
  * @param {Object} el
  *
  * @suppress {missingProperties}
  */
var getRect = function(el){
    var rect = el.getBoundingClientRect();
    rect = {
        'left': castInt(rect['left']),
        'right': castInt(rect['right']),
        'top': castInt(rect['top']),
        'bottom': castInt(rect['bottom'])
    };

    rect['width'] = rect['right'] - rect['left'];
    rect['height'] = rect['bottom'] - rect['top'];

    return rect;
};

var hasClass = function(el, c){
    return (' ' + el.className + ' ').indexOf(' ' + c + ' ') > -1;
};

/**
 * @param {Object} el
 * @param {string|null=} pEl
 *
 * @suppress {missingProperties}
 */
var getStyle = function(el, pEl){
    pEl = pEl || NULL;

    var s = {};	// we copy into an object so modifications are possible

    var s0;
    if (el.currentStyle) {
        s0 = el.currentStyle;
        var n = s0.length;
        while (n-->0) s[s0[n]] = s0[s0[n]];
    } else {
        var w = windowView(el);
        s0 = w.getComputedStyle(el, pEl);
        var n = s0.length;
        while (n-->0) s[s0[n]] = s0.getPropertyValue(s0[n]);
    }

    delete s.cssText;

    return s;
};

// FIXME add 'ASSETURI' and 'CONTENTPLAYHEAD'
/**
 * @param {string} u
 * @param {number=} e
 */
var macros = function(u, e){
    e = e || 901;
    return u
        .split('[ERRORCODE]').join(e)
        .split(/(?:\[|$\{|%%)CACHEBUST[A-Z]*(?:\]|\}|%%)/i).join(Math.floor(Math.random() * (99999999 - 1000000 + 1) + 1000000))
        .split(/\[TIMESTAMP\]/i).join(fixedEncodeURIComponent((new Date()).toISOString()));
};

// http://stackoverflow.com/questions/649614/xml-parsing-of-a-variable-string-in-javascript/8412989#8412989
var parseXml = (function(){
    if (typeof DOMParser != 'undefined') {
        return function(xmlStr){
            return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
        };
    } else if (typeof ActiveXObject != 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
        return function(xmlStr) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        }
    } else {
        LOG("No XML paser found");
        return noop;
    }
})();

var castInt = function(s){
    return parseInt(s, 10);
};

// do not hunt horizontally!
var winHunt = function(k, f){
    var win = window;

    var d = function(k, f, win){
        var v = win[k];
        if (f(v, win)) return v;

        var F = win.frames;
        var n = F.length;
        while (n-->0) {
            try {
                var r = d(k, f, F[n]);
                if (r) return r;
            } catch(_) {};
        }
    };
    var r = d(k, f, win);
    if (r) return r;

    do {
        try {
            var v = win[k];
            if (f(v, win)) return v;
        } catch(_) {}
    } while (win != top && (win = win.parent));

    return NULL;
};

// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX#Notes
var getScroll = function(w) {
    var d = w.document;
    var dd = d.documentElement || d.body.parentNode || d.body;
    var pageoffset = w.pageXOffset !== undefined;

    var x = pageoffset ? w.pageXOffset : dd.scrollLeft;
    var y = pageoffset ? w.pageYOffset : dd.scrollTop;

    return { x: castInt(x), y: castInt(y) };
}

var windowView = function(el) {
    var d = el.ownerDocument;
    return d.defaultView || d.parentWindow;
};

var frameElement = function(v) {
    if (v.ownerDocument) v = windowView(v);

    // frameElement seems to throw on android and not simply return null :(
    try {
        return v.frameElement;
    } catch(_) {
        return NULL;
    }
};

var setStyle = function(el, style) {
    if (document.body.currentStyle)
        el.style.cssText = style
    else
        el.setAttribute('style', style);
};

    if (myelement) {
        if ( (!HEAD || !HEAD.contains(myelement)) && (!document.body || !document.body.contains(myelement)) ) {
            LOG("not contained in head/body, aborting");
            return;
        }
    }

    var FLAGS = [];

    var isOpera = !!window['opera'];
    var isFirefox = !!window['InstallTrigger'];
    var isSafari = Object.prototype.toString.call(window['HTMLElement']).indexOf("Constructor") > 0;
    var isChrome = !!window['chrome'] && !isOpera;
    var isIE = new Function("return /*@cc_on!@*/!1")() || !!document.documentMode;
    var isEdge = navigator.userAgent.match(/Edge\/[1-9]/);

    var roll_state = false;
    var SAFEFRAME, MRAID, VPAID, VAST;
    // https://developer.chrome.com/multidevice/user-agent#webview_user_agent
    // https://stackoverflow.com/a/22851632
    var WEBVIEW = !!navigator.userAgent.match(/Version\/[0-9.]+ Chrome\/[0-9.]+ Mobile|iP(?:hone|od|ad).*AppleWebKit(?!.*Version\/[0-9.]+)/) || !!navigator.userAgent.match(/; wv/);
    var SANDBOX = location.protocol.match(/^https?:/) && window['origin'] === 'null';

    var IFRAME = window != top;
    var windowhighest = window;
    try {
        while (windowhighest != top) {
            if (windowhighest.parent.document)
                windowhighest = windowhighest.parent;
            else
                break;	// we need the else clause as Safari 9.1 and below infinite loops (GT-252)
        }
    } catch(_) {}
    var SAMEORIGIN = windowhighest == top;

    // https://youtu.be/bb11Tz3xVKY
var wabbit_hunter = function(el){
    var blacklist = function(el){
        if (el.getAttribute('data-adloox-type') == 'proxy') return true;
        if (el.getAttribute('data-adloox-cname') == cname) return true;
        if (el.getAttribute('class') == 'x-adloox') return true;	// LEGACY

        return false;
    };

    // cater for vendors who bump up the adunit by a few pixels
    var normalize = function(n){
        return ((n / 10) | 0) * 10;
    };
    var getRectNormalize = function(el){
        var r = getRect(el);
        r.width = normalize(r.width);
        r.height = normalize(r.height);
        return r;
    };

    var iabsize = function(r){
        // N.B. rounded down to nearest 10
        var c = {
            // page take over top video unit
            '390x220': 1,
            // various places
            '320x240': 1,
            '320x250': 1,
            '320x300': 1,
            '600x400': 1,
            // https://support.google.com/adsense/answer/6002621?hl=en-GB
            '330x280': 1,	// 336x280
            '320x100': 1,
            // http://www.iab.com/wp-content/uploads/2015/11/IAB_Display_Mobile_Creative_Guidelines_HTML5_2015.pdf
            '970x250': 1,
            '320x50': 1,
            '120x20': 1,
            '160x20': 1,
            '210x30': 1,
            '300x600': 1,
            '300x1050': 1,
            '970x90': 1,
            '300x250': 1,
            '180x150': 1,
            '160x600': 1,
            '720x90': 1,	// 728x90
            '970x60': 1,
            '120x60': 1,
            '80x30': 1,
            '600x250': 1,
            '600x150': 1,
            '600x600': 1,
            '720x310': 1,
            '550x480': 1
        };

        return !!c[r.width+'x'+r.height];
    };

    /**
     * @param {Object} el
     * @param {Object=} r
     */
    var goodsize = function(el, r){
        // some ads are off by 1px on screen, so permit some fuzziness
        var o = 5;					// some units are off by one pixel

        // does the element fit in its parent
        // https://stackoverflow.com/questions/7738117/html-text-overflow-ellipsis-detection
        if (el.clientWidth + o < el.scrollWidth) return false;
        r = r || getRect(el);

        // larger than the minimun acceptable size (largeur/hauteur)
        if (r.width < largeur || r.height < hauteur) return false;

        // cannot check bottom/right as element might be floating
        return r.top + o >= 0 && r.left + o >= 0;

        // cannot check viewport size, as the ad might be in a body->iframe[0x0]->iframe[320x240] with float
    };

    /**
     * @param {Object} el
     * @param {Object=} r
     */
    var check = function(el, r){
        switch(el.tagName){
        case 'DIV':
            var s = el.style['background-image'];
            if (s && !s.match(/^url\("?([^")]+)"?\)$/))
                return false;
            // FALLTHROUGH
        case 'SPAN':
            if (el.innerText && el.innerText.trim())
                return false;
            // FALLTHROUGH
        case 'ARTICLE':    // some native environments use this
        case 'VIDEO':
        case 'IMG':
        case 'CANVAS':
        case 'OBJECT':
        case 'EMBED':
        case 'SVG':
        case 'IFRAME':
        case 'INS':
            //LOG('check', !blacklist(el), goodsize(el, r), el);
            return !blacklist(el) && goodsize(el, r);
        }

        return false;
    };

    // strategy:
    // - prefer to target elements earlier in the DOM than our script tag in the DOM
    // - *not* use recursion as RAM might explode!
    // - 'cycles' makes sure we do not go into an infinite loop and puts an upper bound on 'distance'
    // - hunt_cycles starts small to localise a race in selection when multiple JS's exist on the page
    // - even after finding a suitable unit, we continue looking for larger ones, but weighting against distance
    // - test the size of each element
    // - if a 'good' size, then return it
    // - if a bad size, iterate to the next sibling (skipping non-elements that do not have a .tagName)
    // - if next sibling has children (*ignore* same origin IFRAME), descend into it
    // - 'next'/'prev' can only proceed when at the same depth
    // - we do *not* check BODY as it is a fallback to not finding an element (plus rarely iabsize'd)
    var hunt = function(el){
        var selected = NULL;
        var selected_rect = NULL;
        var selected_c = NULL;
        var cycles = wabbit_hunter.hunt_cycles;
        var hunt_cycles_max = 250;
        var weight = function(r){
            var c = Math.log(wabbit_hunter.hunt_cycles - cycles + 2); c = c * c;	// +2 to avoid inf
            if (!selected) return c;

            // juice scoring if IAB sized
            var iab_sel = iabsize(selected_rect);
            var iab_cur = iabsize(r);
            if (!iab_sel && iab_cur) {
                c *= 0.2;
            } else if (iab_sel && !iab_cur) {
                c *= 5;
            }

            return c;
        };
        var filter = function(r, c){
            if (!selected) return false;
            return r.width * r.height / c < selected_rect.width * selected_rect.height / selected_c;
        };

        var el0 = el;

        // IE makes document.head not safe
        if (el.ownerDocument.getElementsByTagName('head')[0].contains(el))
            el = el.ownerDocument.body.lastChild;

        var prev = NULL, next = NULL;
        var lastprev = NULL, lastnext = NULL;
        var depthprev = 0, depthnext = 0;

        do {
            if (!prev && !next && el && el.tagName != 'BODY') {
                prev = next = lastprev = lastnext = el;
                el = el.parentNode;
                if (el && el.tagName == 'BODY')
                    el = NULL;
                do { next = next.nextSibling } while (next && next.nodeType !== 1);
            }

            if (prev && depthprev >= depthnext) {
                //LOG('prev', depthprev, prev);

                var r = getRectNormalize(prev);
                var c = weight(r);
                if (!filter(r, c) && check(prev, r)) {
                    selected = prev;
                    selected_c = c;
                    selected_rect = r;
                }
                lastprev = prev;
                do { prev = prev.previousSibling } while (prev && prev.nodeType !== 1);
                while (prev && prev.children && prev.children.length) {
                    prev = prev.children[prev.children.length - 1];
                    depthprev++;
                }
            }
            if (next && depthnext >= depthprev) {
                //LOG('next', depthnext, next);

                var r = getRectNormalize(next);
                var c = weight(r);
                if (!filter(r, c) && check(next, r)) {
                    selected = next;
                    selected_c = c;
                    selected_rect = r;
                }
                lastnext = next;
                do { next = next.nextSibling } while (next && next.nodeType !== 1);
                while (next && next.children && next.children.length) {
                    next = next.children[0];
                    depthnext++;
                }
            }

            if (!prev && lastprev && depthprev >= depthnext) {
                prev = lastprev.parentNode;
                if (prev && prev.tagName == 'BODY')
                    prev = NULL, lastprev = NULL;
                depthprev--;
            }
            if (!next && lastnext && depthnext >= depthprev) {
                next = lastnext.parentNode;
                if (next && next.tagName == 'BODY')
                    next = NULL, lastnext = NULL;
                depthnext--;
            }
        } while ((prev || next || el) && cycles-->0);

        // if we cannot find anything after max cycles and the document is loaded, abort
        if (!selected && wabbit_hunter.hunt_cycles == hunt_cycles_max && el0.ownerDocument.readyState === 'complete') {
            LOG('wabbit_hunter aborting as max cycles and page loaded');
            selected = undefined;
        }

        wabbit_hunter.hunt_cycles = Math.min(hunt_cycles_max, wabbit_hunter.hunt_cycles * 2);

        return selected;
    };

    var target = function() {
        var s = Array.prototype.slice;
        var b = [ document ];
        try {
            var win = window;
            while (win != top && typeof win.parent.document == 'object'){
                win = win.parent;
                b = b.concat([win.document]);
            }
        } catch(_) {}

        for (var i = 0; i < targetted_ids.length; i++) {
            var target = targetted_ids[i];
            if (!target) continue;	// rather than fixing in the backend, we dumpster dump in the front

            for (var j = 0; j < b.length; j++) {
                var t = [];
                var base = b[j];

                var tt;
                try { tt = base.getElementById(target) } catch(_) { tt = NULL }
                if (tt != NULL)
                    t = t.concat([tt]);

                try { tt = base.getElementsByClassName(target) } catch(_) { tt = NULL }
                t = t.concat(s.call(tt));

                try { tt = base.querySelector(target) } catch(_) { tt = NULL }
                if (tt != NULL)
                    t = t.concat([tt]);

                for (var k = 0; k < t.length; k++)
                    if (goodsize(t[k]))
                        return t[k];
                if (t.length)
                    return t[0];
            }
        }

        return NULL;
    };

    if (!el) el = document.body;

    try {
        if (targetted_ids.length)
            return target();

        var tel = el;
        try {
            while (!goodsize(tel) && windowView(tel) != top) {
                tel = frameElement(tel);
                if (!tel) break;
                el = tel;
            }
        } catch(_) {}

        var fel = frameElement(el);

        var ad = NULL;
        if (!ad)
            ad = hunt(el);
        if (!ad && fel)
            ad = hunt(fel);
        if (!ad) {
            var b = el.ownerDocument.body;
            if (goodsize(b))
                ad = b;
        }
        if (!ad && fel) {
            var b = fel.ownerDocument.body;
            if (goodsize(b))
                ad = b;
        }

        // try to use the highest suitable parent with the same size
        if (ad) {
            var r = getRectNormalize(ad);
            do {
                var p = ad.parentNode;
                if (!p || !check(p)) break;
                var rr = getRectNormalize(p);
                if (r.width != rr.width || r.height != rr.height)
                    break;
                ad = p;
            } while (true);
        }

        return ad;
    } catch(_) {
        oops(_.stack || _.message);
        return;	// undefined to indictate explosion
    }
};
wabbit_hunter.hunt_cycles = 10;

        var client_id = "160";
    var tabname = false;
        var transaction_id = window['tab_adloox_transaction_id_'+cname] instanceof Array
        ? window['tab_adloox_transaction_id_'+cname][0] : NULL;

    var macro_ids = tabname ? tabname : [];
    var url_params = {};
    var tx_visi = 0, sec_visi = 0, tx_visi2 = 0, sec_visi2 = 0;	// zero on non-custom means automatic
    var targetted_ids = [];
        var tab_adloox_tag = {};
    var platform, has_fw = 0, tagid = 0, type_crea, fw_version = 1;
    
    // replaced by callbacks (eg. bridge_pixels, infectious, ...)
    /**
     * @param {...*} rest
     */
    var onUnloadPage = function(aduration, pduration, rest){
        var s = sec_visi2 | sec_visi;
        if (aduration >= s) return;
        var n = onUnloadPage.px.length;
        while (n-->0)
            sendtracking(onUnloadPage.px[n]);
    };
    onUnloadPage.px = [];

    if (myelement) {
        var a = parseUri(myelement.src);
        var p = (a.hash || '').split('#').slice(1);		// multiple segments!
        if (!p.length) p = [ (a.search || '').substr(1) ];	// look in query string instead
        if (!tabname && p.length) {
                    url_params = qs2o(p[0]);
          for (var k in url_params) {
              if (k.match(/^id[0-9]+$/)) {
                  last(url_params, k);
                  macro_ids[castInt(k.substr(2)) - 1] = url_params[k];
                  tab_adloox_tag[k] = url_params[k];
                  continue;
              }
              switch (k) {
              case 'platform':
                  platform = last(url_params[k]);
                  break;
              case 'fwtype':
                  // 2 = log only
                  // 4 = non-blocking
                  has_fw = castInt(last(url_params[k]));
        	  if(has_fw){
                      fw_version = has_fw == 2 ? 'log' : has_fw;
        	  }
                  if (!has_fw || has_fw < 3)
                      has_fw = 1
                  else if (has_fw == 3)
                      has_fw = 'wl';
                  break;
              case 'tagid':
                  tagid = castInt(last(url_params[k]));
                  break;
              case 'creatype':
                  // ONLY VALUE 1 (takeover/homepage) HAS MEANING IN THE JS, OTHERS ARE IGNORED
                  // 1 takeover
                  // 3 preroll
                  // 4 expand
                  // 5 interstitiel
                  // 6 video (video)
                  // 7 flash banned (video)
                  // 8 fixed
                  // 9 Sublim Skin
                  // 10 large video (video)
                  // 11 large banner
                  // 23 vast (video)
                  type_crea = castInt(last(url_params[k]));
                  break;
              case 'targetelt':
                  var n = url_params[k].length;
                  while (n-->0)
                      if (url_params[k][n].length)
                          targetted_ids.unshift(url_params[k][n]);
                  break;
              case 'custom1area':				// GUARD IN adunit_found
                  var x = castInt(last(url_params[k]));
                  if (x >= 0 && x <= 100) tx_visi = x / 100;
                  break;
              case 'custom2area':
                  var x = castInt(last(url_params[k]));
                  if (x >= 0 && x <= 100) tx_visi2 = x / 100;
                  break;
              case 'custom1sec':				// GUARD IN adunit_found
                  sec_visi = parseFloat(last(url_params[k])) || sec_visi;
                  break;
              case 'custom2sec':
                  sec_visi2 = parseFloat(last(url_params[k])) || sec_visi2;
                  break;
              case 'px_imp':
                  var n = url_params[k].length;
                  while (n-->0)
                      subscribe('impression', BINDER(sendtracking, url_params[k][n]));
                  break;
              case 'px_view':
                  var n = url_params[k].length;
                  while (n-->0)
                      subscribe('visi', BINDER(sendtracking, url_params[k][n]));
                  break;
              case 'px_viewc':
                  var n = url_params[k].length;
                  while (n-->0)
                      subscribe('visi_custom', BINDER(sendtracking, url_params[k][n]));
                  break;
              case 'px_viewn':
                  var n = url_params[k].length;
                  while (n-->0)
                      onUnloadPage.px.push(url_params[k][n]);
                  break;
              case 'id':
                  visite_id = last(url_params[k]);
                  break;
              case 'vast':
                  VAST = last(url_params[k]);
                  break;
              }
          }

    	  
          if (tab_adloox_tag['id12'] === 'russia') fw_version = 'log';		// so much for server side...
          for (var i = macro_ids.length; i < 20; i++) macro_ids.push('');	// words escape me...
                  }

        myelement.setAttribute('data-adloox-sid', visite_id);
    }

    
    if (typeof window['adloox_pc_viewed'] == 'number') tx_visi2 = window['adloox_pc_viewed'];
    if (typeof window['adloox_time_viewed'] == 'number') sec_visi2 = window['adloox_time_viewed'];
    if (typeof window['adloox_target'] == 'string') targetted_ids.push(window['adloox_target']);

    var loadbalancing_inv = ['data30.adlooxtracking.com','data23.adlooxtracking.com','data36.adlooxtracking.com','data27.adlooxtracking.com','data15.adlooxtracking.com','data29.adlooxtracking.com','data58.adlooxtracking.com','data19.adlooxtracking.com','data08.adlooxtracking.com','data02.adlooxtracking.com','data33.adlooxtracking.com','data56.adlooxtracking.com','data55.adlooxtracking.com','data134.adlooxtracking.com','data61.adlooxtracking.com','data07.adlooxtracking.com','data20.adlooxtracking.com','data05.adlooxtracking.com','data01.adlooxtracking.com','data38.adlooxtracking.com','data63.adlooxtracking.com','data13.adlooxtracking.com','data37.adlooxtracking.com','data35.adlooxtracking.com','data65.adlooxtracking.com','data39.adlooxtracking.com','data06.adlooxtracking.com','data64.adlooxtracking.com','data66.adlooxtracking.com','data03.adlooxtracking.com','data34.adlooxtracking.com','data60.adlooxtracking.com','data21.adlooxtracking.com','data28.adlooxtracking.com','data04.adlooxtracking.com','data25.adlooxtracking.com','data62.adlooxtracking.com','data17.adlooxtracking.com','data10.adlooxtracking.com','data18.adlooxtracking.com','data22.adlooxtracking.com','data24.adlooxtracking.com','data53.adlooxtracking.com','data09.adlooxtracking.com','data12.adlooxtracking.com','data31.adlooxtracking.com','data68.adlooxtracking.com','data26.adlooxtracking.com','data11.adlooxtracking.com','data67.adlooxtracking.com','data57.adlooxtracking.com','data14.adlooxtracking.com','data16.adlooxtracking.com'];
    var HOMEPAGE = type_crea == 1;
    var cmp_id = "160";
    var ban_id = "0";
    var cmp_id_date = cmp_id+'_ADLOOX_DATE';
    var loadbalancing = ['datam02.adlooxtracking.com','datam17.adlooxtracking.com','datam26.adlooxtracking.com','datam20.adlooxtracking.com','datam18.adlooxtracking.com','datam16.adlooxtracking.com','datam01.adlooxtracking.com','datam25.adlooxtracking.com','datam05.adlooxtracking.com','datam23.adlooxtracking.com','datam21.adlooxtracking.com','datam12.adlooxtracking.com','datam03.adlooxtracking.com','datam13.adlooxtracking.com','datam22.adlooxtracking.com','datam14.adlooxtracking.com','datam04.adlooxtracking.com','datam15.adlooxtracking.com','datam24.adlooxtracking.com','datam19.adlooxtracking.com','datam11.adlooxtracking.com'];
    var date_regen = "2019-03-20 11:04:30";
    var has_visi = true;
    var v_ic = "ic.php";
    var methode = "";
    var video = "0";
    var hash_adnxs  = "";
    var adnxs       = "";
    var saute_title = false;
    var title       = document.title || "";
    var url_ref2    = "";
    var js_obj      = {};
    var alerte_desc = "";
    var alerte_finale = "";
    var resolution = screen.width + 'x' + screen.height;
    var nb_cpu = '';
    try {	// firefox gives 'permission denied'
        nb_cpu = navigator['hardwareConcurrency'] || "";
    } catch (_) {}
    var nav_lang = navigator.language || '';
    var fwed          = false;
    var servername = loadbalancing[Math.floor(Math.random() * loadbalancing.length)] || 'data01.adlooxtracking.com';
    var appnexus_us = ['magneticmediaonline_adnxs'];
    var hauteur = 0 || 20;
    var largeur = 0 || 20;

    var oops = function(err) {
        if (oops.dedupe[err]) return;
        oops.dedupe[err] = 1;
        SETTIMEOUT(function(){ delete oops.dedupe[err]; }, 5000);

        (new Image()).src = 'https://'+servername+'/ads/err.php?client='+fixedEncodeURIComponent(cname)+'&js='+fixedEncodeURIComponent(script_name)+'&visite_id='+fixedEncodeURIComponent(visite_id)+'&err='+fixedEncodeURIComponent(err);
        LOG(err);
    };
    oops.dedupe = {};

try {

    
    var scroll_debounce = false;
    subscribe('rect', function(){
        scroll_debounce = false;
    });
    var geometry = function(){
        if (scroll_debounce) return;
        if (unloading || killAd.state) return;		// here so things get unplugged

        LOG("geometry");

        scroll_debounce = SETTIMEOUT(BINDER(fire, 'geometry'), 100);
    };

    var adunit = {};
    var adunit_found = function(el){
        LOG("adunit: ", el);

        adunit.el = el;
        adunit.win = windowView(el);
        adunit.doc = el.ownerDocument;

        el.setAttribute('data-adloox-type', 'el');
        el.setAttribute('data-adloox-sid', visite_id);
        el.setAttribute('data-adloox-cname', cname);

        window['adloox_getAd'] = el;	// LEGACY

        // guard to prevent custom1{area,sec} dropping below IAB minimun requirements
        if (VAST) {
            if (sec_visi < 2) sec_visi = 2;
            if (tx_visi < 0.5) tx_visi = 0.5;
        } else {
            // https://www.iabuk.com/sites/default/files/Viewable%20Ad%20Impression%20Guidelines.pdf
            var r = getRect(adunit.el);
            var m = r.width * r.height >= 242500 ? 0.3 : 0.5;

            if (sec_visi < 1) sec_visi = 1;
            if (tx_visi < m) tx_visi = m;
        }

        fire('adunit');
    };
    subscribe('adunit', function(){
        // we call geometry to get a short wait for any possible expanding to complete
        // FIXME listen for events on everything up to winmax
        evA(adunit.win, 'resize', geometry);	// catches address bar on mobile
        evA(adunit.win, 'scroll', geometry);
        evA(adunit.el, 'mouseenter', geometry);
        evA(adunit.el, 'mouseleave', geometry);

        fire('geometry');	// start things moving
    });
    subscribe('geometry', function(){
        LOG("geometry updating");

        var w = adunit.win;
        var d = adunit.doc;
        var del = d.documentElement;
        adunit.doc_width  = WEBVIEW ? screen.availWidth  : w.innerWidth  || del.clientWidth  || d.body.clientWidth;
        adunit.doc_height = WEBVIEW ? screen.availHeight : w.innerHeight || del.clientHeight || d.body.clientHeight;

        adunit.rect = getRect(adunit.el);
        adunit.rect['visi'] = {
            'x': castInt(adunit.rect.width * Math.sqrt(tx_visi) / 2),
            'y': castInt(adunit.rect.height * Math.sqrt(tx_visi) / 2),
            'x2': castInt(adunit.rect.width * Math.sqrt(tx_visi2) / 2),
            'y2': castInt(adunit.rect.height * Math.sqrt(tx_visi2) / 2)
        };

        fire('rect');
    });

    var adunithunt_cycles = 0;
    subscribe('unload', function(){				// debug channel incase we cannot find the adunit
        if (killAd.state || !unloading || adunit.el)
            return;

        var page_uptime = window['performance'] ? boottime - windowhighest.performance.timing.navigationStart : 0;

        var d = myelement ? myelement : document.body;
        var t = myelement ? 'myel' : 'body';

        var msg = 'no wabbit [' + adunithunt_cycles + '@' + runtime() + ' {' + page_uptime + '}] (' + FLAGS.join('|') + '): ';
        var e = d.ownerDocument.body;

        if (e) {
            var r = getRect(e);
            var de = d.ownerDocument.documentElement;
            msg += t + '@{' + [r.left,r.right,r.top,r.bottom].join(',') + '} ('+de.clientWidth+'x'+de.clientHeight+')';
        } else {
            msg += 'no body';
        }

        if (top != window) {
            msg += ', frm@';

            try {
                var fd = frameElement(window);
                var fe = d.ownerDocument.body;

                if (fe) {
                    var fr = getRect(fe);
                    var de = fd.ownerDocument.documentElement;
                    msg += '{' + [fr.left,fr.right,fr.top,fr.bottom].join(',') + '} ('+de.clientWidth+'x'+de.clientHeight+')';
                } else {
                    msg += 'no body';
                }
            } catch(_) {
                msg += 'cross-origin';
            }
        }

        oops(msg);
    });

    var killAd = function(){
        if (!HOMEPAGE && !killAd.state) {
            if (VPAID) {
                if (!roll_state) VPAID['resumeAd']();
                VPAID['stopAd']();
                killAd.state = true;
            } else if (MRAID && MRAID['getPlacementType']() == 'interstitial') {
                MRAID.close();
                killAd.state = true;
            } else if (SAFEFRAME && typeof SAFEFRAME['host'] == 'object' && typeof SAFEFRAME['host']['nuke'] == 'function') {
                SAFEFRAME['host']['nuke']('*');
                killAd.state = true;
            } else if (adunit.proxy) {
                var whiteout = function(){
                    var s = getStyle(adunit.el);
                    var zIndex = Math.max(1000, (castInt(s['z-index']) || 0) + 1000);
                    adunit.proxy.style['z-index'] = '' + zIndex;
                    adunit.proxy.style['pointer-events'] = 'unset';
                    adunit.proxy.style['filter'] = 'unset';
                    adunit.proxy.style['opacity'] = 'unset';
                    adunit.proxy.style['background-color'] = 'white';

                    setStyle(adunit.proxy, adunit.proxy.style.cssText);	// IE8 redraw :-/
                };
                killAd.state = true;
           }
        }

        LOG('killAd: ', !!killAd.state);
        return !!killAd.state;
    };

    LOG("myelement", myelement);	// logged here as visite_id may change

    var hFlash = (function(){
        var hasFlash = false;
        try {
            var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (fo) {
                hasFlash = true;
            }
        } catch (e) {
            if (navigator.mimeTypes
                    && navigator.mimeTypes['application/x-shockwave-flash'] != undefined
                    && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
                hasFlash = true;
            }
        }
        return hasFlash ;
    })();
    var tagco_arr = {};
    var params_v3 = [];
    var params_opt = {};
    // extract tagco var from macro_ids
    var extract_tagco = function(m_ids){
        var tmp_macros = [];
        var str_tagco = "";
        if(typeof m_ids[0] == "undefined")
        {
            return NULL;
        }
        for(var i=0; i<m_ids.length ; i++){
            // need to keep empty values, to avoid offsets in the final id_editeur
            //if (!m_ids[i]) continue;
            if (typeof m_ids[i] == 'undefined' || m_ids[i] === false || m_ids[i] == NULL ) continue;
            var mtagco = m_ids[i].match(/^t(?:agco|c)_(.*)$/);
            if( mtagco ){
                var _m = m_ids[i].split("=");
                var _m_key = _m[0];
                _m.shift();
                str_tagco += "&"+_m_key + "=" + fixedEncodeURIComponent(_m.join("="));
                tagco_arr[mtagco[1]] = fixedEncodeURIComponent(_m.join("="));
            }else{
                var re = /(plat|plan|sup|adv)=/;
                if( m_ids[i].match(re) ){
                    params_v3.push(m_ids[i]);
                }else{
                    // version fw
                    var re_p = /_ap_[a-z]+=/;
                    if( m_ids[i].match(re_p) ){
                        var p_opt = m_ids[i].split('=');
                        var k = p_opt[0].slice(4,p_opt[0].length);
                        var v = p_opt[1];
                        params_opt[k] = v;
                    }else{
                        tmp_macros.push(m_ids[i]);
                    }
                }
            }
        }
        // if tagco_arr if empty, try to extract tagco vars from url parameters
        if ( tagco_arr.constructor === Object && Object.keys(tagco_arr).length === 0 ) {
            for(var j in url_params){
                var mtagco = j.match(/^t(?:agco|c)_(.*)$/);
                if (!mtagco) continue;

                var _m_key = j;
                var _m_val = fixedEncodeURIComponent(last(url_params[j]))
                str_tagco += "&" +_m_key + "=" + _m_val;
                tagco_arr[mtagco[1]] = _m_val;
            }
        }
        if(!m_ids)
            macro_ids = tmp_macros;

        return str_tagco;
    }
    var tagco_var = extract_tagco(macro_ids);
    var get_tagco_transparent = function(){
        var imgs = document.getElementsByTagName("img");
        for(var i=0; i<imgs.length; i++){
            var sc = imgs[i];
            var re = /^https?:\/\/[a-z]+\.adlooxtracking\.com\/ads\/transparent\.gif[#?](.*)/;
            var res = sc.src && sc.src.match(re);
            if (res) {
                var tvar = res[1];
                var tvars  = tvar.split("&");
                    for(var j=0; j<tvars.length; j++){
                        var _m = tvars[j].split("=");
                        var _m_key = _m[0];
                        var mtagco = _m_key.match(/^t(?:agco|c)_(.*)$/);
                        if(mtagco) {
                            _m.shift();
                            tagco_arr[mtagco[1]] = fixedEncodeURIComponent(_m.join("="));
                        }else{
                            macro_ids.push(_m_key);
                        }
                    }
                return tvar;
            }
        }
        return "";
    }
    if( tagco_var!=NULL)
    {
        if( tagco_var.match(/tagco_pixel/) ){
            tagco_var = get_tagco_transparent();
            extract_tagco(tagco_var);
        }
    }

    var send_to_tagco = function(tagc_arr){
        var t_dom = tagc_arr.domain;
        var t_ver = tagc_arr.version == 1 ? "" : tagc_arr.version;
        delete tagc_arr.domain;
        delete tagc_arr.version;
        tagc_arr['imp_id'] = visite_id;
        var tc_url = "https://"+t_dom+"/v"+t_ver+"/?"+o2qs(tagc_arr);
        sendPixel(tc_url);
    }
    if (tagco_var) {
        subscribe('visi', function(){
            var tagco_varO = qs2o(tagco_var.substr(1));

            last(tagco_varO, 'tagco_domain');
            var t_dom = tagco_varO['tagco_domain'];

            last(tagco_varO, 'tagco_version');
            var t_ver = tagco_varO['tagco_version'] == 1 ? "" : tagco_varO['tagco_version'];

            delete tagco_varO['tagco_domain'];
            delete tagco_varO['tagco_version'];

            var tagco_params = {};
            for (var k in tagco_varO) {
                last(tagco_varO, k);
                tagco_params[k.substring(k.match(/^tc_/) ? 3 : 6)] = fixedEncodeURIComponent(tagco_varO[k]);
            }

            tagco_params['imp_id'] = visite_id
            tagco_params['visible'] = 1;

            sendPixel("https://" + t_dom + "/w" + t_ver + "/?", tagco_params);
        });
    }

    var paramsUrlV3 = params_v3.length > 0 ? "&"+params_v3.join("&") : "";
    var bidprice = "";
    
    //fonction detectant si l'user a flash
    function hazF(){
        if (navigator.plugins != NULL && navigator.plugins.length > 0){
            return navigator.plugins["Shockwave Flash"] && true;
        }
        if(~navigator.userAgent.toLowerCase().indexOf("webtv")){
            return true;
        }
        if(~navigator.appVersion.indexOf("MSIE") && !~navigator.userAgent.indexOf("Opera")){
            try{
                return new ActiveXObject("ShockwaveFlash.ShockwaveFlash") && true;
            } catch(e){}
        }
        return false;
    }
    var str_alerte_ids = macro_ids.join("_ADLOOX_ID_").replace(/ /gi, "_");
    var adloox_deja_scan = adloox_deja_scan || 0;
    var uri_courant = function(){
        //custom function like php strrpos
        var adloox_strrpos = function (haystack, needle, offset) {
            var adloox_i = -1;
            if (offset) {
                adloox_i = (haystack + '').slice(offset).lastIndexOf(needle);
                if (adloox_i != -1) {
                    adloox_i += offset;
                }
            } else {
                adloox_i = (haystack + '').lastIndexOf(needle);
            }
            return adloox_i >= 0 ? adloox_i : false;
        }

        try {
            methode='1: parent.parent.location.href';
            return parent.parent.location.href;
        } catch (adloox_err) {
            try {
                methode='2: parent.location.href';
                return parent.location.href;
            } catch (adloox_err) {
                saute_title = true;
                if (adloox_strrpos(adloox_err.message, '<', 0)) {
                    return adloox_err.message.substring(adloox_strrpos(adloox_err.message, '<', 0) + 1, adloox_strrpos(adloox_err.message, '>', 0));
                } else {
                    methode='3:  location.href';
                    return location.href;
                }
            }
        }
    }() || "";
    var ancestorOrigins = (function(){
        var d = [];
        if (typeof location.ancestorOrigins == 'undefined')
            return d;
        if (!(location.ancestorOrigins instanceof DOMStringList)) // TODO record faking
            return d;
        var n = location.ancestorOrigins.length;
        while (n-->0)
            d.push(location.ancestorOrigins.item(n));
        return d;
    })();
    var user_p = (function(){
        var ob = {};
        var low_ua = navigator.userAgent.toLowerCase();
        if( low_ua.indexOf("linux") > 0 ){ ob.os = "Linux" }
        else if( low_ua.indexOf("mac") > 0 ){ ob.os = "Mac" }
        else if( low_ua.indexOf("win") > 0 ){ ob.os = "Windows" }
        else ob.os = "inconnu";
        if ( /Edge\/\d./i.test(navigator.userAgent)) { ob.browser = "edge" }
        else if( low_ua.indexOf("chrome") > 0 ){ ob.browser = "chrome" }
        else if( low_ua.indexOf("firefox") > 0 ){ ob.browser = "firefox" }
        else if( low_ua.indexOf("safari") > 0 ){ ob.browser = "safari" }
        else if( low_ua.indexOf("opera") > 0 ){ ob.browser = "opera" }
        else if( low_ua.indexOf("msie") > 0  || !!window['MSStream'] ){ ob.browser = "Internet Explorer" }
        else ob.browser = "inconnu";
        return ob;
    })();


    var old_uri_courant = uri_courant;
    if (IFRAME) {
        uri_courant = document.referrer;
        methode = "6: top != window -> document.referrer "+location.href;

        if(SAMEORIGIN)
        {
            uri_courant = location.href;
            methode = "7: top != window & friendly -> location.href "+document.referrer;
        }

        if (uri_courant == "about:blank") {
            uri_courant = location.href;
        }

        try {
            title=frameElement(window).id+'@'+location.href;
        } catch (err) {
            title='frame without title';
        }
    }
    if(uri_courant == ""){
        methode = '4: old_uri_courant';
        uri_courant = old_uri_courant;
    }

    // placé ici car utilisé dans firewall et alerte
    var maj = function (entree) {
        var minus = "aàâäbcçdeéèêëfghiîïjklmnoôöpqrstûuüvwxyz- ";
        var majus = "AAAABCCDEEEEEFGHIIIJKLMNOOOPQRSTUUUVWXYZ  ";
        var sortie = "";
        for (var i = 0; i < entree.length; i++) {
            var car = entree.substr(i, 1);
            sortie += (minus.indexOf(car) != -1) ? majus.substr(minus.indexOf(car), 1) : car;
        }
        return sortie;
    }

    //function calculant le hash unique
    var uniq_hash = function(){
        var plugins = function(){
            var found = {};

            var check = {
                'Flash': 'ShockwaveFlash.ShockwaveFlash.1',
                'PDF': 'AcroPDF.PDF',
                'Silverlight': 'AgControl.AgControl',
                'QuickTime': 'QuickTime.QuickTime'
            };

            if (window['ActiveXObject']) {
                var detect = function(name){
                    try {
                        var o = new ActiveXObject(name);
                        try {
                            return o.GetVariable('$version');
                        } catch (_) {
                            try {
                                return o['GetVersions']();
                            } catch(_) {
                                try {
                                    for (var i = 9; i > 0; i--)
                                        if (o['isVersionSupported'](i + '.0'))
                                            return i;
                                } catch(_) {}

                                return true;
                            }
                        }
                    } catch(_) {
                        return false;
                    }
                };

                for (var c in check) {
                    var d = detect(check[c]);
                    if (d) found[c] = d;
                }

                if (navigator['javaEnabled']()) found['java'] = '';
            } else {
                check['Java'] = undefined;	// undefined is minimised and we only need the key

                var list = navigator.plugins;
                for (var p in list) {
                    for (var c in check) {
                        var d = list[p].description;
                        if (!d || d.indexOf(c) == -1) continue;
                        var v = list[p].version;
                        found[c.toLowerCase()] = v ? v : (list[p].name + ' ' + d);
                    }
                }
            }

            for (var f in found) {
                var m = /[0-9]+/.exec(found[f]);
                found[f] = m ? m[0] : '';
            }
            return found;
        };

        var fonts = function(){
            var base = { 'monospace': undefined, 'sans-serif': undefined, 'serif': undefined };
            var fonts = ['cursive', 'monospace', 'serif', 'sans-serif', 'fantasy', 'default', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Bookman Old Style', 'Bradley Hand ITC', 'Century', 'Century Gothic', 'Comic Sans MS', 'Courier', 'Courier New', 'Georgia', 'Gentium', 'Impact', 'King', 'Lucida Console', 'Lalit', 'Modena', 'Monotype Corsiva', 'Papyrus', 'Tahoma', 'TeX', 'Times', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Verona'];

            var s = document.createElement('span');
            s.style['position'] = 'absolute';
            s.style['top'] = s.style['left'] = '-1000px';
            s.style['font-size'] = '72px';
            s.innerText = 'mmmmmmmmmmlli';
            document.body.appendChild(s);

            for (var n in base) {
                s.style['font-family'] = n;
                base[n] = [ s.offsetWidth, s.offsetHeight ];
            }

            var i = fonts.length;
            FONT: while (i-->0) {
               for (var n in base) {
                   s.style['font-family'] = fonts[i] + ',' + n;
                   if (s.offsetWidth != base[n][0] || s.offsetHeight != base[n][1]) {
                       fonts[i] = 't';
                       continue FONT;
                   }
               }
               fonts[i] = 'f';
            }

            document.body.removeChild(s);

            return fonts.join('');
        };

        var checksum = function(adloox_s) {
            if (!adloox_s.length)
                return adloox_hash;
            var adloox_hash = 0;
            for (var adloox_i = 0; adloox_i < adloox_s.length; adloox_i++) {
                var adloox_c = adloox_s.charCodeAt(adloox_i);
                adloox_hash = ((adloox_hash << 5) - adloox_hash) + adloox_c;
                adloox_hash = adloox_hash & adloox_hash;
            }
            return adloox_hash;
        };

        var timezone = /^.* ([^ ]+)(.{2}) [^ ]+$/.exec(new Date());
        timezone = timezone ? timezone.slice(1).join(':') : '';

        var pd = ''; try { pd = JSON.stringify(plugins()) } catch(_) {};	// can't use .join for legacy *workflow* reasons :(

        var result = checksum(timezone + pd) + fonts();
        uniq_hash = function(){ return result; };

        return result;
    };


        var search_keywords = function(array_words, in_content, callback, firewall){
        var alert_title = "";
        var alert_url = "";
        var alert_content = "";
        var maj_url = maj(uri_courant);
        var maj_title = maj(title);
        var url_words = [];

        // le split de l'url pour les alertes
        if(!firewall && !in_content){
            var n;

            url_words = url_words.concat(uri_courant.split(/[-_.&=/?+#]/));

            n = ancestorOrigins.length;
            while (n-->0)
                url_words = url_words.concat(ancestorOrigins[n].split(/[-_.]/));

            n = url_words.length;
            while (n-->0) {
                if (url_words[n] == "" || url_words[n].match(/^https?:$/)) {
                    url_words.splice(n, 1);
                    continue;
                }
                url_words[n] = url_words[n].toLowerCase();
            }
        }

        // on commence par chercher hors du contenu
        if( !in_content && !!Array.prototype.indexOf){
            // recherche dans le titre + url
            for ( var i = 0; i < array_words.length; i ++ ) {
                var word = array_words[i];
                var word_splitted = word.split("+");
                if( word_splitted.length > 1 ){

                    //tous les mots du tableau doivent etre dans le texte
                    var nb_occ_title = 0;
                    var nb_occ_url   = 0;
                    for ( var j = 0; j < word_splitted.length; j ++ ) {
                        if(firewall) nb_occ_url += maj_url.match(word_splitted[j]) ? 1 : 0;
                        else nb_occ_url += url_words.indexOf(word_splitted[j].toLowerCase()) >= 0 ? 1 : 0;
                        nb_occ_title += maj_title.indexOf(word_splitted[j]) >= 0 ? 1 : 0;
                    }

                    if(nb_occ_title == word_splitted.length){
                        alert_title = word;
                        if(firewall) callback( alert_title, alert_url, alert_content );
                        else {
                            if(IFRAME && !SAMEORIGIN) callback( alert_title, alert_url, alert_content, false);
                            else callback( alert_title, alert_url, alert_content, true);
                        }
                        return;
                    }
                    if(nb_occ_url == word_splitted.length){
                        alert_url = word;
                        if(firewall) callback( alert_title, alert_url, alert_content );
                        else {
                            if(IFRAME && !SAMEORIGIN) callback( alert_title, alert_url, alert_content, false);
                            else callback( alert_title, alert_url, alert_content, true);
                        };
                        return;
                    }

                }
                else{
                    // check url
                    if(firewall){
                        if( maj_url.indexOf( word ) >= 0 ){
                            alert_url = word;
                            callback(alert_title,alert_url,alert_content);
                            return;
                        }
                    }
                    // un mot dans l'url, true alert
                    else{
                        if(url_words.indexOf(word.toLowerCase()) >= 0){
                            alert_url = word;
                            if(IFRAME && !SAMEORIGIN) callback( alert_title, alert_url, alert_content, false);
                            else callback( alert_title, alert_url, alert_content, true);
                            return;
                        }
                    }

                    // un mot dans le titre, true alert
                    if( maj_title.indexOf( word ) >= 0 ){
                        alert_title = word;
                        if(firewall) callback( alert_title, alert_url, alert_content );
                        else {
                            if(IFRAME && !SAMEORIGIN) callback( alert_title, alert_url, alert_content, false);
                            else callback( alert_title, alert_url, alert_content, true);
                        };
                        return;
                    }
                }
            }
            // on attend que le contenu soit charge
            SETTIMEOUT(function(){search_keywords(array_words,true,callback,firewall)},4000);
        }
        else{
            alert_content = "";
            var count_content = 0;

            var inner_html_tmp = document.body;
            var content_final = typeof inner_html_tmp.textContent == "undefined" ? inner_html_tmp.innerText : inner_html_tmp.textContent;

            var reg = new RegExp("[ \t]{2,}","g");
            content_final = content_final.replace(reg, " ");

            var body_content = maj(content_final);

            for ( var i = 0; i < array_words.length; i ++ ) {
                var word = array_words[i];
                var word_splitted = word.split("+");
                if( word_splitted.length > 1 ){

                    var nb_occ   = 0;
                    //tous les mots du tableau doivent etre dans le texte
                    for ( var j = 0; j < word_splitted.length; j ++ ) {
                        nb_occ += body_content.indexOf(word_splitted[j]) > 0 ? 1 : 0;
                    }
                    if(nb_occ  == word_splitted.length){

                        alert_content += word+" ";
                        count_content++;

                        // mode balayage alerte
                        if(!firewall){
                            if(count_content >= 1){
                                if(IFRAME && !SAMEORIGIN) callback( alert_title, alert_url, alert_content, false);
                                else callback( alert_title, alert_url, alert_content, true);
                                return;
                            }
                        }
                        // mode keywords FW
                        else {
                            callback(alert_title,alert_url,alert_content);
                            return;
                        }

                    }

                }else{

                    word = ( typeof body_content != "object") ? " "+word+" " : word;
                    //mot sans +  ;
                    if( body_content.indexOf( word ) >= 0 ){
                        alert_content += word+" ";
                        count_content++;
                        // mode balayage alerte
                        if(!firewall){
                            if(count_content >= 2){
                                if(IFRAME && !SAMEORIGIN) callback( alert_title, alert_url, alert_content, false);
                                else callback( alert_title, alert_url, alert_content, true);
                                return;
                            }
                        }
                        // mode keywords FW
                        else {
                            callback(alert_title,alert_url,alert_content);
                            return;
                        }
                    }
                }
            }
        }

    };

    /**
     * Detect a potential fake browser
     * Returns a string taking the following values:
     *  - "fake=no" : no fake detected
     *  - "fake=fake_browser" : browser detected does not match the declared user agent
     *  - "fake=fake_screen" : if inside a iframe, the size of the screen is null
     * The last two values can be combined : "fake=fake_browserfake_screen"
     */
    var detectFake = function(){
        var fakeScreen = (screen.height == 0 && screen.width == 0) || window['devicePixelRatio'] == 0;

        return '' + ~~isOpera + ~~isChrome + ~~isFirefox + ~~isIE + ~~isSafari + ~~fakeScreen;
    };

    (function(){
    var alert_sent = false;
    var saute_title = 0;
    var alerte_desc;
    var array_words = ['USENET','VIDEO ADULTE','TVRIP','TUBE ITALIANO','CANAL','TUBEITALIANO','TROIAPORNO','TROIA+PORNO','TRASGREDENDO','TRANSSEXUEL','TRANSGENRE','TRANSEXUEL','TRANSEXUAL','TRANSEX','TRANSESSUALE','TRANNY','TRANNIES','TORRENZ','TORRENTZ','TORRENT','TOPWAREZ','THREESOME','TETTONE','TETTEGROSSE','TETTE GROSSE','TETONES','TETAS','SWINGER','SUCEUSE','STRIPTEASE','STREAMING','STOOORAGE','STARFUCKS','SQUIRTING','SQUIRT','SPERME','SPERM','SODOMY','SODOMIZE','SODOMIES','SODOMIE','SODOM','SHEMALE','SHEMALES','SHARKING','SEXYCULO','SEXYCHAT','SEXY CULO','SEXY CHAT','SEXY','SEXXX','SEXUPLOADER','SEXUELLEN','SEXUEL','SEXUAL','SEXTAPE','SEXORS','SEXKINO','SEXHARDCORE','SEXFILMCHEN','SEXES','SEXE','SEX TAPE','SEX HARDCORE','SESSOESTREMO','SEX','SESSUALE','SESSOGRATIS','SESSOAMATORIALE','SESSO GRATIS','SESSO ESTREMO','SESSO AMATORIALE','SCARICAREGRATIS','SCARICARE GRATIS','SBORRATE','SALOPES','SALOPE','SALES NOIRS','RIMMING','REDTUBE','RAPIDSHARE','RANAPORNO','RAGAZZEUBRIACHE','RAGAZZE UBRIACHE','PUTTANE','PUSSY','PUSSIES','PROGRAMASFULL','PORNSTAR','PORNPICS','PORNOX','PORNOVIZI','PORNOTUBO AMATEURSEX','PORNOTUBO','PORNOITALIANOGRATIS','PORNO X','PORNKOLT','PORNO','PORN VIDEO','PORN STAR','PORN PICS','PORN','POMPINO','POMPINI','PLUMPER','PIRATAGE','PHOTOX','PHOTOADULTE','PHOTO X','PHOTO ADULTE','PELICULASONLINEGRATIS','PELICULAS ONLINE GRATIS','PEDOPHILE','PEDOFILO','PECHOS','PANTYHOSE','ORGY','ORGIE','OLLYSPORN','OLLYS PORN','NUDISTE','NUDISTA','NUDIST','NUDISMO','NUDISME','NUDISM','NINFOMANA','NIGGER','NEWSGROUP','NETECHANGISME','NEGATIONNISME','NAZIS','NAZI','NATURISTE','NATURISTA','NATURIST','NATURISMO','NATURISME','NATURISM','MUYZORRAS','MOVIEX','MONSTERCOCK','MONSTER COCK','MONEYSLAVE','MILF','MICIPORN','MEGAUPLOAD','MEDIAFIRE','MASTURBIEREN','MASTURBATE','MASTURBARSI','MASTURBARSE','MAMANDOPOLLAS','MAMANDO POLLAS','LIVEJASMIN','LESBO','LESBIENNE','LESBICHE','LESBIAN','LADYBOY','LADY BOY','ITALIAWEBSHOP','ISOHUNT','INCULATE','INCESTI','INCESTE','HULKSHARE','HOTVOICE','HORNY','HOOKER','HITLER','HENTAI','HARDCORESEX','HARDCORE SEX','HANDJOB','HAND JOB','HACERGOZAS','HACER GOZAS','GROUPSEX','GROUP SEX','GRANDESVERGAS','GRANDES VERGAS','GORGE PROFONDE','GONZO','GOLDEN SHOWER','GANGBANG','GANG BANG','FULL-RIP','FULLRIP','FREEPORN','FREE PORN','FOTODESEXO','FOTO DE SEXO','FOLLAR','FOLLADAS','FISTING','FISTFUCKING','FILMINIAMATORIALI','FILMINI AMATORIALI','FILMGRATIS','FILMDIVX','FILMDDL','FILM GRATIS','FILM DIVX','FILM DDL','FILEJUNGLE','FETISH','FAMOSASDESNUDAS','FAMOSAS DESNUDAS','EXTREME SEX','ESCUALITA','ERWACHSENEFOTO','EROTISMO','ERWACHSENE FOTO','ENCULER','ENCULE','ENCULADAS','EJACULATE','ECHARUNPOLVO','ECHARUNACACHITA','ECHAR UNA CACHITA','ECHAR UN POLVO','EAT+PUSSY','DVDSCR','DVDRIP','DVD RIP','DOWNLOADZ','DOUJINSHI','DOUBLEPENETRATION','DOMINGAS','DOGGY STYLE','DOGGIE STYLE','DIRTY+WHORE','DIRECTDOWNLOAD','DIRECT DOWNLOAD','DILDO','DICKS','DESCARGAGRATIS','DESCARGA GRATIS','DESCARGA DIRECTA','DEPOSITFILE','DEEPTHROAT','DEEP THROAT','CUNNILINGUS','CUMSHOT','FKK + NUDIST','CORRIDASENLACARA','CORRIDAS EN LA CARA','CHICASFOLLANDO','CHICAS FOLLANDO','CHATCALIENTE','CHAT CALIENTE','CAZZIENORMI','CAZZI ENORMI','BRRIP','BRANLETTE','BRANLER','FKK + NUDE','BOOBS','BONJOURMADAME','BONDAGE','BLOWJOB','BLOW JOB','BITCH','BIGTITS','BIGCOKE','BIG TITS','BIG TIT','BIG COKE','BIATCH','BDSM','BDRIP','BBW','BARELYLEGAL','BARELY+LEGAL','BARELY LEGAL','BAREBACK','BAJAGRATIS','BAJA GRATIS','ATTRICIPORNO','ATTRICI PORNO','ASSHOLE','ANONYMOUS','ANAL+SEX','AMATORIALI','AMATEURSEX','AMATEUR+SEX','4SHARED','.CSO','CLUNGE','VIDEO AMATORIALI','VIDEO X','VIDEOADULTE','VIDEOAMATORIALI','VIDEOX','VOYEUR X','VOYEURX','WAREZ','WEBCAM X','WEBCAMX','XXX BLOG','XXXBLOG','YAOI','YOUNG+PORN','YOUPORN','ZOOPHILE','ZOOPHILIE','ZSHARE','NSFW','FKK + NATURIST','FKK + EROTI','FKK + CLUB','FKK + GIRLS','FKK+NUDE','FKK+NUDIST','FKK+NATURIST','FKK+EROTI','FKK+CLUB','FKK+GIRLS','FEMDOM','ESIBIZIONISTI','SEKSU','HARASSED','HAZING','RAPE','ASSAULT','SEXUAL VIOLENCE','SEXUALLY ASSAULTED','HARASSMENT'];

    var true_alert = "";

    var send_alert = function(alert_title,alert_url,alert_content,true_alert){
        var alert_desc = "";
        //on verifie que le image_alerte_contenu n'a pas ete envoye
        if( !alert_sent ){
            alert_desc += alert_url.length>0 ? "url: "+alert_url : "" ;
            alert_desc += alert_title.length>0 ? "titre: "+alert_title : "";
            alert_desc += alert_content.length>0 ? "content: "+alert_content : "";
            if( alert_desc.length > 0 ){
                var img_alert = document.createElement('img');
                var url = "//brandsafe.adlooxtracking.com/ads/image_alerte.php?client="+cname+"&type=regie_quotidienne&banniere=" + ban_id + "&campagne=" + cmp_id + "&methode=" + fixedEncodeURIComponent(methode) + "&fai=new1_" + fixedEncodeURIComponent(document.title) + "&alerte=0&alerte_desc=" + fixedEncodeURIComponent(alert_desc) + "&id_editeur=" + str_alerte_ids + "&url_referrer=" + fixedEncodeURIComponent(uri_courant) + "&iframe=" + (IFRAME ? (SAMEORIGIN ? 3 : 1) : 0) + "&true_alert=" + true_alert;
                img_alert.id = 'ads_alerte_contenu';
                img_alert.src = url;
                img_alert.width = 0;
                img_alert.height = 0;
                img_alert.style.display = 'none';
                document.body.appendChild(img_alert);
                alert_sent = true;
            }
        }
    };

    //lance la recherche des mot cles sur la liste alerte
    search_keywords(array_words,false,send_alert,false);

    // on attend 2s pour lancer la recherche dans le contenu
    //window.setTimeout(search_content, 2000);
})();

    
    
    (function(){

if (!VAST) return;

var wraps = 5;
var width, height, viewMode, desiredBitrate, creativeData, environmentVars, adCompanions;
var duration = -2, skip = Infinity, skippable = false, clickThrough;
var version = 2;
var mode = VAST.substr(0, 1) == ':' ? (VAST.substr(0, 2) == '::' ? 'video' : 'vpaid') : 'vast';
var vpaidTextAppend = ' [pre-AdLoaded]';	// flag non-allowed calls before AdLoaded
var player = false;

var listener = {};
var map = {
    'impression': 'AdImpression',
    'creativeView': 'AdStarted',
    //'mute': 'AdVolumeChange',			// FIXME
    //'unmute': 'AdVolumeChange',		// FIXME
    'start': 'AdVideoStart',
    'firstQuartile': 'AdVideoFirstQuartile',
    'midpoint': 'AdVideoMidpoint',
    'thirdQuartile': 'AdVideoThirdQuartile',
    'complete': 'AdVideoComplete',
    'click': 'AdClickThru',
    'acceptInvitation': 'AdUserAcceptInvitation',
    'collapse': 'AdUserMinimize',
    'close': 'AdUserClose',
    'pause': 'AdPaused',
    'resume': 'AdPlaying',
    'error': 'AdError',
    'skip': 'AdSkipped',
    'durationChange': 'AdDurationChange'	// INTERNAL
};

/**
 * @param {string} name
 * @param {Object=} ev
 */
var eventcb = function(name, ev){
    switch (name) {
    case 'AdLoaded':
        vpaidTextAppend = '';
        break;
    case 'AdClickThru':
        if (!player) ev = {
            'url': arguments[1],
            'id': arguments[2],
            'playerHandles': arguments[3]
        };
        break;
    case 'AdPaused':
    case 'AdVideoComplete':
    case 'AdStopped':
        roll_state = false;
        break;
    case 'AdPlaying':
        roll_state = true;
        break;
    case 'AdDurationChange':
        duration = adunit.videoslot['duration'];
        break;
    }

    var f = BINDER(fire, 'VPAID.'+name, ev);
    if (name == 'AdStopped') {
        SETTIMEOUT(f, 200);	// breathing room to get pixels out the door
    } else {
        f();
    }
};

subscribe('impression', function(){
    eventcb('AdImpression');
    eventcb('AdVideoStart');
});

subscribe('VPAID.AdPaused', BINDER(fire, 'sendvisi'));
subscribe('VPAID.AdPlaying', BINDER(fire, 'sendvisi'));
subscribe('VPAID.AdStopped', unload);

var _oops = function(code, message) {
    LOG(message);
    if (VPAID) VPAID['stopAd'].apply(VPAID);
    fire('VPAID.AdError', { 'code': code, 'message': message });
    return;	// leave this here for parseVAST to return correctly
};

var textContent = function(el) {
    return el.textContent.trim();
};

var js3rd = function(el){
    var i = document.createElement('iframe');
    i.src = 'javascript:false';	// IE makes it cross-origin otherwise
    i.style.display = 'none';
    i.onload = function(){
        var s = document.createElement('script');
        s.src = macros(textContent(el));
        var type = el.getAttribute('type');
        if (type) s.type = type;
        // IE makes document.head not safe
        i.contentWindow.document.getElementsByTagName('head')[0].appendChild(s);
    };
    insertAfter(i, myelement);
};

var playLinear = function(m) {
    LOG('playing', m);

    player = true;

    var r1, r2, r3;
    var events = {
	'durationchange':	function(){
				    if (adunit.videoslot.duration > 0 && adunit.videoslot['duration'] != duration)
				        eventcb('AdDurationChange');
				},
	'canplay':		function(){
				    eventcb('AdLoaded');
				},
	'playing':		function(){
				    // HACK should be in 'play' but missing event for some reason
				    if (!impression.state)
				        impression();
				    eventcb('AdPlaying');
				},
	'play':			function(){
				    eventcb('AdPlaying');
				},
	'pause':		function(){
				    eventcb('AdPaused');
				},
	'timeupdate':		function(){
				    if (!skippable) {
					skippable = skip < adunit.videoslot['currentTime'];
					if (skippable)
					    eventcb('AdSkippableStateChange');
				    }

				    if (version < 2)
					eventcb('AdRemainingTimeChange');

				    var ratio = adunit.videoslot['currentTime']/duration;

				    if (!r3 && ratio >= 0.75)
					r3 = true, eventcb('AdVideoThirdQuartile');
				    if (!r2 && ratio >= 0.50)
					r2 = true, eventcb('AdVideoMidpoint');
				    if (!r1 && ratio >= 0.25)
					r1 = true, eventcb('AdVideoFirstQuartile');
	},
	'ended':		function(){
				    eventcb('AdVideoComplete');
				    VPAID['stopAd']();
				},
	'error':		function(){
				    _oops(405, adunit.videoslot['error'] ? adunit.videoslot['error']['message'] : 'unable to load video');
        }
    };
    var click = function(){
        eventcb('AdClickThru', { 'url': clickThrough, 'playerHandles': true });
    };
    var cleanup = function(){
        for (var e in events)
            adunit.videoslot['removeEventListener'](e, events[e]);
        adunit.el['removeEventListener']('click', click);
        delete adunit.videoslot['src'];
    };

    VPAID = {};
    VPAID['subscribe'] = VPAID['unsubscribe'] = noop;	// handled by Proxy
    VPAID['startAd'] = function(){
        VPAID['startAd'] = function(){ return _oops(901, 'startAd already called'); }

        adunit.videoslot['play']();

        eventcb('AdStarted');
    };
    VPAID['stopAd'] = function(){
        VPAID['startAd'] = function(){ return _oops(901, 'stopAd already called'); }

        cleanup();
        eventcb('AdStopped');
    };
    VPAID['pauseAd'] = function(){
        adunit.videoslot['pause']();
    };
    VPAID['resumeAd'] = function(){
        adunit.videoslot['play']();
    };
    VPAID['expandAd'] = VPAID['collapseAd'] = noop;
    VPAID['skipAd'] = function(){
        if (!skippable)
            return;
        cleanup();
        eventcb('AdSkipped');
        if (version < 2)
            eventcb('AdStopped');
    };
    VPAID['getAdLinear'] = function(){
        return true;	// FIXME
    };
    VPAID['getAdWidth'] = function(){
        return width;
    };
    VPAID['getAdHeight'] = function(){
        return height;
    };
    VPAID['getAdExpanded'] = function(){
        return false;	// FIXME
    };
    VPAID['getAdSkippableState'] = function(){
        return skippable;
    };
    VPAID['getAdRemainingTime'] = function(){
        return duration - adunit.videoslot['currentTime'];
    };
    VPAID['getAdDuration'] = function(){
        return duration;
    };
    VPAID['getAdCompanions'] = function(){
        return adCompanions;
    };
    VPAID['getAdIcons'] = function(){
        return false;	// FIXME
    };

    for (var e in events)
        adunit.videoslot['addEventListener'](e, events[e]);
    if (clickThrough)
        adunit.el['addEventListener']('click', click);

    adunit.videoslot['src'] = typeof m == 'string' ? m : textContent(m);
    adunit.videoslot['preload'] = 'auto';

    adunit.videoslot['load']();

    return true;
};

var loadLinear = function(mediafiles) {
    LOG('loading linear');

    if (!mediafiles.length)
        return _oops(403, 'no supported assets');

    var err = BINDER(_oops, 400, 'no suitable media');

    for (var i = 0; i < mediafiles.length; i++) {
        var m = mediafiles[i];

        if (m.getAttribute('apiFramework'))
            continue;

        var t = m.getAttribute('type');
        var c = m.getAttribute('codec');
        if (c) t += ';codecs="'+c+'"';
        if (!adunit.videoslot['canPlayType'](t)) {
            err = BINDER(_oops, 405, 'unsupported mime/codec');
            continue;
        }

        return playLinear(m);
    }

    return err();
};

var loadVPAID = function(url) {
    LOG('loading VPAID', url);

    var iframe = document.createElement('iframe');
    iframe.src = 'javascript:false';	// IE makes it cross-origin otherwise
    iframe.style.display = 'none';
    iframe.onload = function(){
        var s = document.createElement('script');
        s.src = macros(url);
        s.onload = function(){
            var unit = iframe.contentWindow['getVPAIDAd'];
            if (typeof unit != 'function')
                return _oops(901, 'VPAID unit has no getVPAIDAd');

            VPAID = unit();

            for (var k in map) {
                var v = map[k];
                VPAID['subscribe'].apply(VPAID, [BINDER(eventcb, v), v, this]);
                delete listener[v];
            }
            for (var k in listener)
                VPAID['subscribe'].apply(VPAID, [BINDER(eventcb, k), k, this]);

            LOG('calling initAd(', width, height, viewMode, desiredBitrate, creativeData, environmentVars, ')');
            VPAID['initAd'].apply(VPAID, [width, height, viewMode, desiredBitrate, creativeData, environmentVars]);
        };
        iframe.contentWindow.document.body.appendChild(s);
    };
    myelement.parentNode.appendChild(iframe);
};

var parseVAST = function(xml){
    LOG('parsing VAST');

    if (xml.documentElement.tagName != 'VAST')
        return _oops(101, 'not a VAST tag');

    var ad = xml.getElementsByTagName('Ad')[0];
    if (!ad)
        return _oops(400, 'no Ad');

    var trackel = ad.getElementsByTagName('Tracking');
    var track = [];
    var n = trackel.length;
    while (n-->0) track.push(trackel[n]);

    var imp = ad.getElementsByTagName('Impression');
    n = imp.length;
    while (n-->0) {
        imp[n].setAttribute('event', 'impression');
        track.push(imp[n]);
    }

    var err = ad.getElementsByTagName('Error');
    n = err.length;
    while (n-->0) {
        err[n].setAttribute('event', 'error');
        track.push(err[n]);
    }

    var clicktracking = ad.getElementsByTagName('ClickTracking');
    n = clicktracking.length;
    while (n-->0) {
        clicktracking[n].setAttribute('event', 'click');
        track.push(clicktracking[n]);
    }

    n = track.length;
    while (n-->0) {
        var u = textContent(track[n]);
        if (!u.match(/^https?:/)) continue;

        var e = track[n].getAttribute('event');
        var v = map[e];

        if (!v) {
            LOG('unsupported VAST event "' + e + '", ignoring');
            continue;
        }

        subscribe('VPAID.' + v, BINDER(sendtracking, u));
    }

    var w = ad.getElementsByTagName('VASTAdTagURI')[0];
    if (w) {
        if (wraps--<0)
            return _oops(302, 'too many wrappers');
        loadVAST(textContent(w));
        return;
    }

    // FIXME handle <Linear>/<NonLinear>
    var linear = ad.getElementsByTagName('Linear');

    var so = linear[0].getAttribute('skipoffset');
    if (so)
        skip = Date.parse('1970-01-01 '+so+'Z') / 1000;

    var durationEl = linear[0].getElementsByTagName('Duration');
    if (durationEl.length)
        duration = Date.parse('1970-01-01 '+textContent(durationEl[0])+'Z') / 1000;

    // just boot anything we can :)
    var mediafiles = linear[0].getElementsByTagName('MediaFile');
    if (!mediafiles.length)
        return _oops(403, 'no media files');

    var js = ad.getElementsByTagName('Survey');
    n = js.length;
    while (n-->0)
        js3rd(js[n]);

    js = ad.getElementsByTagName('JavaScriptResource');
    n = js.length;
    while (n-->0)
        js3rd(js[n]);

    var ct = ad.getElementsByTagName('ClickThrough');
    if (ct.length) {
        var u = textContent(ct[0]);
        if (u.match(/^https?:/)) clickThrough = u;
    }

    for (var i = 0; i < mediafiles.length; i++) {
        var m = mediafiles[i];

        if (m.getAttribute('apiFramework') != 'VPAID' || m.getAttribute('type') != 'application/javascript')
            continue;

        creativeData = ad.getElementsByTagName('AdParameters');
        creativeData = { 'AdParameters': creativeData.length ? textContent(creativeData[0]) : '' };

        adCompanions = ad.getElementsByTagName('AdCompanions');
        adCompanions = adCompanions.length ? textContent(adCompanions[0]) : '';

        loadVPAID(textContent(m));

        return true;
    }

    return loadLinear(mediafiles);
};

/**
 * @param {string} url
 * @param {boolean=} withoutcredentials
 */
var loadVAST = function(url, withoutcredentials) {
    LOG('loading VAST', url);

    var q = new XMLHttpRequest();
    q.open('GET', macros(url));
    q.withCredentials = !withoutcredentials;
    q.onload = function() {
        if(this.readyState != 4)
            return;

        if(this.status >= 400)
            return _oops(300, 'failed to fetch VAST');

        var xml = parseXml(this.response);
        var vast;
        if (xml) {
            if (!parseVAST(xml))
                return;
        } else {
            return _oops(100, 'unable to parse XML');
        }
    };
    q.onerror = function(){
        if (withoutcredentials) {
            _oops(303, 'unable to download VAST');
        } else {
            LOG('suspected CORS withCredentials problem, retrying without cookies');
            loadVAST(url, true);
        }
    };
    q.ontimeout = BINDER(_oops, 301, 'timeout to download VAST');
    q.timeout = 5000;	// IE11 requires this to be after .open()
    q.send(NULL);
};

var VPAIDCreative = {
    'handshakeVersion': function(s){
        LOG('VPAID'+vpaidTextAppend, 'handshakeVersion', s);
        var v = castInt(s);
        if (v < 2) version = v;

        return version+'.0';
    },
    'initAd': function(w, h, v, d, c, e){
        LOG('VPAID', 'initAd', w, h, v, d, c, e);
        if (adunit.el)
            return _oops(901, 'initAd already called');

        width = w;
        height = h;
        viewMode = v;
        desiredBitrate = d;
        if (mode == 'vpaid')
            creativeData = c;
        environmentVars = e;

        adunit_found(e['slot']);

        adunit.videoslot = e['videoSlot'];

	switch (mode) {
	case 'vpaid':
		return loadVPAID(VAST.substr(1));
	case 'video':
		return playLinear(VAST.substr(2));
	case 'vast':
		return loadVAST(VAST);
	}
    },
    'subscribe': function(cb, name, that){
        LOG('VPAID', 'subscribe', name);
        var f;
        switch (name) {
        case 'AdError':
            f = function(ev){ cb.apply(that, [ev['message']]) };
            break;
        case 'AdClickThru':
            f = function(ev){ cb.apply(that, [ev['url'], ev['id'], ev['playerHandles']]) };
            break;
        default:
            f = cb.bind(that);
        }
        subscribe('VPAID.'+name, f);
        listener[name] = 1;
    },
    'unsubscribe': function(cb, name){	// cannot handle 'that' anyway...
        LOG('VPAID', 'unsubscribe', name);
        unsubscribe('VPAID.'+name, cb);
    },
    'getAdCompanions': function(){
        LOG('VPAID'+vpaidTextAppend, 'getAdCompanions');
        return mode == 'vpaid' ? adCompanions : VPAID['getAdCompanions'].apply(VPAID);
    },

    // Proxy
    'has': function(target, name){
        LOG('VPAID'+vpaidTextAppend, 'has', name);
        return VPAID ? !!VPAID[name] : true;
    },
    'get': function(target, name){
        var cb = function(){
            var args = [];
            var n = arguments.length;
            while (n-->0) args.unshift(arguments[n]);
            if (VPAID && VPAID[name]) {
                LOG('VPAID'+vpaidTextAppend, name, args);
                return VPAID[name].apply(VPAID, args);
            }

            LOG('VPAID'+vpaidTextAppend, name, '{DUMMY}', args);
            return;
        };

        return target && target[name] ? target[name] : BINDER(cb);
    },
    'set': function(target, name, value){
        return function(){
            LOG('VPAID'+vpaidTextAppend, 'set', name, value);
            if (VPAID) VPAID[name] = value;
            return !!VPAID;
        };
    }
};

if (window['getVPAIDAd'])
    return _oops(901, 'VPAID already in window');
window['getVPAIDAd'] = BINDER(function(){
    // created here as api is defined after this extension
    VPAIDCreative['getAdloox'] = myelement['getAdloox'];

    if (window['Proxy'])
        return new window['Proxy'](VPAIDCreative, VPAIDCreative);

    LOG('Proxy not supported, using fallback');

    var methods = [ 'resize', 'start', 'stop', 'pause', 'resume', 'expand', 'collapse', 'skip' ];
    var n = methods.length;
    while (n-->0) {
        var m = methods[n] + 'Ad';
        VPAIDCreative[m] = VPAIDCreative['get'](undefined, m);
    }

    var propertiesGet = [ 'Linear', 'Width', 'Height', 'Expanded', 'SkippableState', 'RemainingTime', 'Duration', 'Volume', 'Icons' ];
    n = propertiesGet.length;
    while (n-->0) {
        var m = 'getAd' + propertiesGet[n];
        VPAIDCreative[m] = VPAIDCreative['get'](undefined, m);
    }

    var propertiesSet = [ 'Volume' ];
    n = propertiesSet.length;
    while (n-->0) {
        var m = 'setAd' + propertiesSet[n];
        VPAIDCreative[m] = VPAIDCreative['set'](undefined, m);
    }

    return VPAIDCreative;
});

})();

    var hidden = NULL;	// assume visible (!null == !false)
    var visibilityState = 'visible';
    var hiddenPairs = [ '', 'moz', 'ms', 'webkit' ];
    for (var i = 0; i < hiddenPairs.length; i++) {
        var h = hiddenPairs[i] + (i ? 'H' : 'h') + 'idden';

        if (document[h] === undefined) continue;

        var v = hiddenPairs[i] + (i ? 'V' : 'v') + 'isibilityState';

        hidden = document[h];
        visibilityState = document[v];

        evA(document, hiddenPairs[i] + 'visibilitychange', function(){
            hidden = document[h];
            visibilityState = document[v];
            fire('pagevisi');
        });

        break;
    }

    var p_d_v, p_d_v_e;
    /**
     * @param {number} n
     * @param {boolean=} h
     */
    var p_d_v_cb = function(n, h){
        if (h === undefined) h = hidden;
        p_d_v += h ? 0 : n - p_d_v_e
        p_d_v_e = n;
    };
    subscribe('booted', function(){	// GT-230: after booted as this needs to be zero until rendered
        p_d_v = 0;
        p_d_v_e = now();
        subscribe('pagevisi', function(){
            p_d_v_cb(now(), !hidden);	// we need to increment on what the hidden state *was*
        });
    });

    var visi = {};
    subscribe('adunit', function(){
        // this whole file must be (and is) included inside an adunit event handler (which occurs after impression)

// we default to 'null' for the sensors for no results as JSON cannot represent 'undefined'

// ATF is senstive to the initial race where the ad may be playing
// but not all the sensors are booted so we use a semaphore
var booting = 0;

// though we consider MRAID/SafeFrame inputs, we do not consider them alone
// and require at least one of our own sensors inputs to state viewability
var measured = false;

// tests that at least one row of the initial viewport is still in view
// N.B. when in use, all other sensors (except active tab) are disabled!
var homepage = function(){
    booting--;
    measured = true;
    homepage = function(){
        homepage.hidden = getScroll(adunit.win).y > adunit.doc_height;
    };
    homepage();
};
homepage.hidden = NULL;
if (HOMEPAGE) {
    booting++;
    subscribe('rect', function(){ homepage() });
}

var rendered = function(){
    rendered.booting = 0;

    var elements = to_array(adunit.el.getElementsByTagName('*'));
    elements.push(adunit.el);

    var cb = function(){
        if (!--rendered.booting) booting--;
    };

    var watch = function(el){
        var src = '';

        switch (el.tagName) {
        case 'IMG': if (el.src) src = el.src;
            break;
        case 'DIV': var s = el.style['background-image'];
            if (s) {
                var m = s.match(/^url\("?([^")]+)"?\)$/);
                if (m) src = m[1];
            }
            break;
        default:	// not supported so we skip
            return;
        }

        if (!src.match(/^https?:/)) return;

        if (el.style.display == 'none' || el.style.visibility == 'none') return;

        var r = getRect(el);
        if (r.width < largeur || r.height < hauteur) return;

        if (!rendered.booting++) booting++;

        var i = new Image();
        i.onload = i.onerror = cb;
        i.src = src;
    };

    var n = elements.length;
    while (n-->0) watch(elements[n]);
};
if (!HOMEPAGE && !VAST) rendered();

// in focus (used with homepage)
// N.B. reports non-viewable when devtools has focus!
// N.B. things get weird in a webview so guard
var focus = function(){
    try {
        var win = top;
        var doc = win.document;
        focus.hidden = !doc.hasFocus();
        evA(win, 'focus', function(){ focus.hidden = false });
        evA(win, 'blur', function(){ focus.hidden = true });
    } catch(_) {}
};
focus.hidden = NULL;
if (!WEBVIEW) focus();

// window.IntersectionObserver
// Chrome 51+, Firefox 55+, Edge 15
var intersection = function(entries){
    if (intersection.timer) {
        window.clearTimeout(intersection.timer);
        delete intersection.timer;
        booting--;
        measured = true;
    }

    intersection.hidden = entries[0]['intersectionRatio'] < tx_visi;
    intersection.hidden2 = entries[0]['intersectionRatio'] < tx_visi2;
};
intersection.hidden = NULL, intersection.hidden2 = NULL;
if (!HOMEPAGE) {
    try {
        intersection.io = new IntersectionObserver(intersection, { 'threshold': [ tx_visi, tx_visi2 ] });
        intersection.io.observe(adunit.el);

        booting++;

        // .takeRecords() seems to not work so this is null until visible
        intersection.timer = SETTIMEOUT(function(){
            intersection([ { 'intersectionRatio': 0 } ]);
        }, 100);
    } catch(_) {}
}

// FIXME walk over parent iframes
var classic = function(){
    booting--;
    measured = true;
    classic = function(){
        var w = Math.min(adunit.doc_width - adunit.rect.left, adunit.rect.width);	// viewport
        w += Math.min(adunit.rect.left, 0);						// offset
        w = Math.max(w, 0);								// cap

        var h = Math.min(adunit.doc_height - adunit.rect.top, adunit.rect.height);
        h += Math.min(adunit.rect.top, 0);
        h = Math.max(h, 0);

        classic.ratio = (w * h) / (adunit.rect.width * adunit.rect.height);
    };
    classic();
};
classic.ratio = NULL;
if (!HOMEPAGE && !intersection.io) {
    booting++;
    subscribe('rect', function(){ classic(); });
}

// cross-origin in IE
var element = HOMEPAGE || !isIE ? noop : function(){
    var d = adunit.doc;
    var c = [adunit.rect['left'] + castInt(adunit.rect.width / 2), adunit.rect['top'] + castInt(adunit.rect.height / 2)];
    var s = !d.elementFromPoint(c[0], c[1]);	// shared middle pixel

    element.hidden = [
        !d.elementFromPoint(c[0] - adunit.rect['visi']['x'], c[1] - adunit.rect['visi']['y']),
        s,
        !d.elementFromPoint(c[0] + adunit.rect['visi']['x'], c[1] + adunit.rect['visi']['y'])
    ];
    element.hidden2 = [
        !d.elementFromPoint(c[0] - adunit.rect['visi']['x2'], c[1] - adunit.rect['visi']['y2']),
        s,
        !d.elementFromPoint(c[0] + adunit.rect['visi']['x2'], c[1] + adunit.rect['visi']['y2'])
    ];
};
// no need to test for intersection as IE does not support this
element.hidden = [NULL, NULL, NULL], element.hidden2 = [NULL, NULL, NULL];
if (!HOMEPAGE && isIE) {
    booting++;
    var cb = function(){
        cb = noop;
        booting--;
        measured = true;
    };
    subscribe('rect', function(){ cb(); });
}

var safeframe = function(){
    try {
        var ratio = castInt(SAFEFRAME['ext']['inViewPercentage']());
        if (!isNaN(ratio)) safeframe.ratio = ratio / 100;
    } catch(_) {}
    try {
        focus.hidden = !SAFEFRAME['ext']['winHasFocus']();	// recycle focus
    } catch(_) {}
};
// no need to check for HOMEPAGE as 'safeframe' will never fire
safeframe.ratio = NULL;
subscribe('safeframe', safeframe);

// main.php:impression() guarentees version is valid and .getState() != 'loading'
// http://www.iab.com/wp-content/uploads/2016/11/MRAID-V3_Draft_for_Public_Comment.pdf
var mraid = function(){
    var ready = false;
    var viewable = false;

    switch (castInt(MRAID['getVersion']())) {	// ignore decimal!
    case 3:
        // FIXME cannot find a method to get initial value
        evA(MRAID, 'exposureChange', function(r){ mraid.exposure = r/100 });
        // FALLTHROUGH!
    case 2:
        var ratio = function(){
            var p = typeof MRAID['getCurrentPosition'] == 'function' && MRAID['getCurrentPosition']();
            if (typeof p != 'object') {	// ffs...
                LOG("QUIRK MRAID .getCurrentPosition broken");
                p = { 'x': 0, 'y': 0 };
            }
            var s = typeof MRAID['getScreenSize'] == 'function' && MRAID['getScreenSize']();
            if (!s) {	// mopub is broken :-/
                LOG("QUIRK MRAID .getScreenSize broken");
                var d = adunit.doc.documentElement;
                s = { 'width': d.clientWidth, 'height': d.clientHeight };
            }

            var w = Math.max(Math.min(s['width'] - p['y'], 0), adunit.rect.width);
            var h = Math.max(Math.min(s['height'] - p['x'], 0), adunit.rect.height);

            mraid.ratio = (w * h) / (adunit.rect.width * adunit.rect.height);
        }
        subscribe('rect', ratio);
        // FALLTHROUGH!
    case 1:
    default:	// includes NaN!
        // http://www.iab.com/wp-content/uploads/2015/08/MRAID_Best_Practices_July2014.pdf
        var mraid_state_cb = function(s){ ready = (s != 'loading' && s != 'hidden'); mraid.hidden = !ready && !viewable };
        evA(MRAID, 'stateChange', mraid_state_cb);
        mraid_state_cb(MRAID['getState']());
        if (v < 3) {	// deprecated in V3
            var mraid_viewable_cb = function(s) { viewable = s; mraid.hidden = !ready && !viewable };
            evA(MRAID, 'viewableChange', mraid_viewable_cb);
            mraid_viewable_cb(MRAID['isViewable']());
        }
    }
};
// no need to check for HOMEPAGE as 'mraid' will never fire
mraid.exposure = NULL;
mraid.ratio = NULL;
mraid.hidden = NULL;
subscribe('mraid', mraid);

// window.requestAnimationFrame
// - inactive tab
//  - all browsers drops to 0hz
// - active tab:
//  - Firefox 45+ - throttled in any kind of iframe to 1hz when hidden
//  - Chrome 52+ - zero calls in cross origin iframe only but unthrottled in same origin
//  - Safari 9+ (inc iOS) in any iframe to 0.1hz
//  - Android 4.4 in a cross-origin iframe
// - does not work in any version of IE or Edge
// - does not work in Firefox Mobile
//
// this implementation creates a cross-origin iframe and runs the sensor in there so
// it should also work for those situations where where window == window.top too
//
// N.B. this has been structured to be edge trigged so it use far fewer CPU cycles!
var animation = function(data){
    var hidden = data['c'] ? animation.hidden2 : animation.hidden;

    if (animation.booting && hidden[data['i']] === NULL) {
        animation.booting--;

        if (!animation.booting)
            booting--, measured = true;
    }

    hidden[data['i']] = data['h'];
    if (!data['c'] && data['i'] == 1) animation.hidden2[1] = data['h'];	// shared
};
animation.init = function(){
    animation.sources = [];

    var adunit_proxy_win = adunit.proxy.contentWindow;
    var adunit_proxy_doc = adunit_proxy_win.document;
    var sensor = function(i, custom) {
        var f = adunit_proxy_doc.createElement('iframe');

        var r = function(){
            if (i == 1)
                f.style.top = f.style.left = '50%';
            else {
                var v = adunit.rect['visi'];
                var c = (50 - castInt((custom ? v['x2'] : v['x']) * 100 / adunit.rect.width)) + '%';
                if (i)
                    f.style.bottom = f.style.right = c
                else
                    f.style.top = f.style.left = c;
            }
        };
        subscribe('rect', r);
        if (adunit.rect) r();

        f.style.position = 'absolute';
        f.style.width = f.style.height = '4px';	// must have size
        f.style['pointer-events'] = 'none';
        f.style['border-style'] = 'none';
        f.style['background-color'] = 'transparent';
        f.style['background-image'] = 'none';

        var h = document.createElement('html');
        var hh = document.createElement('head');
        var s = document.createElement('script');

        // 50 is greater than 1000/60 (and 100 on the q(){ setTimeout } is significantly greater)
        // which lets us catch throttling.  The other setTimeout(100) paces to stop high CPU use.
        //
        // if the watchdog fires before requestAnimationFrame, we are always non-viewable
        // but note that *both* requestAnimationFrame and setTimeout are throttled so we are
        // unable to rely on a timer based check alone
        // N.B. we have to wait till onload to start, otherwise there is a race with .onmessage
        // N.B. requestAnimationFrame can (Edge/FF) fire non-deterministically on first call so we delay by one cycle
        s.innerText = 'var ta, tt, l, h = null, f = function(n){ cancelAnimationFrame(ta); clearTimeout(tt); var hh = n ? n - l > 50 : true; if (h != hh) { h = hh; parent.postMessage({ c: '+ custom + ', i: ' + i + ', h: h }, "*") }; setTimeout(q, 100) }, q = function(){ l = performance.now(), ta = requestAnimationFrame(f), tt = setTimeout(f, 100) }; onload = function(){ requestAnimationFrame(q) }';

        hh.appendChild(s);
        h.appendChild(hh);

        f.sandbox = 'allow-scripts';
        f.srcdoc = h.outerHTML;

        f.onload = function(){
            animation.sources.push(f.contentWindow);
        };

        adunit_proxy_doc.body.appendChild(f);
    };

    adunit_proxy_win.onmessage = function(e){
        var n = animation.sources.length;
        while (n-->0)
            if (animation.sources[n] === e.source)
                animation(e.data);
    };

    for (var i = 0; i < 3; i++) {
        sensor(i, false);
        if (tx_visi2 > 0) sensor(i, true);
    }
};
animation.hidden = [ NULL, NULL, NULL ], animation.hidden2 = [ NULL, NULL, NULL ];
// Does not work on IE/Edge, but due to the booting semaphore we skip booting it
// we skip running if intersection is present
if (!HOMEPAGE && !SANDBOX && typeof window.requestAnimationFrame == 'function' && !isIE && !intersection.io) {
    booting++;

    // we have a proxy element so then some sensors (eg. visi animation)
    // have something to attach to; and we make it an iframe for easy messaging
    adunit.proxy = adunit.doc.createElement('iframe');
    var adunit_proxy_unload = function(){
        YIELD(function(){	// so not to stall other things
            try { adunit.doc.body.removeChild(adunit.proxy); } catch(_) {}
            delete adunit.proxy;
        });
    };
    evA(adunit.proxy, 'load', function(){
        if (killAd.state) return;

        // iframe sandbox we test for with window.origin but document.domain can still be another reason
        if (!SANDBOX) {
            try {
                // effectively a NOOP but we have to use it or the minifier eats it
                SANDBOX = !adunit.proxy.contentWindow.document;
            } catch(_) {
                adunit_proxy_unload();
                booting--;
                return;
            }
        }
        subscribe('rect', function(){
            var r = adunit.rect;
            var scroll = getScroll(adunit.win);

            var style = adunit.proxy.style;
            style.display = 'block';
            style.top = (r.top + scroll.y) + 'px';
            style.left = (r.left + scroll.x) + 'px';
            style.width = r.width + 'px';
            style.height = r.height + 'px';
        });

        animation.booting = 3;		// iab
        if (tx_visi2 > 0)		// custom
            animation.booting += 2;	// center pixel shared
        animation.init();
    });

    adunit.proxy.setAttribute('data-adloox-type', 'proxy');
    adunit.proxy.setAttribute('data-adloox-sid', visite_id);
    adunit.proxy.className = 'x-adloox';	// LEGACY
    adunit.proxy.frameBorder = 0;		// IE8

    var s = getStyle(adunit.el);
    var zIndex = Math.min(-1000, (castInt(s['z-index']) || 0) - 1000);

    // do NOT set opacity to zero otherwise requestAnimationFrame will be throttled
    var style = '';
    style += 'display:none;';		// initially hidden so not to prematurely boot sensor
    style += 'position:absolute;';
    style += 'pointer-events:none;';	// IE11 or above only, affects less than 0.5% though
    style += 'z-index:' + zIndex + ';';	// 'pointer-events' does not work on Safari, so we use a negative z-index which seems not to affect animation sensor
    style += 'border-style:none !important;';
    style += 'filter:alpha(opacity=1) !important;';	// https://css-tricks.com/css-transparency-settings-for-all-broswers/
    style += 'opacity:0.01 !important;';
    style += 'background-color:transparent !important;';
    style += 'background-image:none !important;';

    setStyle(adunit.proxy, style);

    adunit.doc.body.appendChild(adunit.proxy);
    subscribe('unload', adunit_proxy_unload);
}

var booted_latch = function(){
    booted_latch = noop;
    fire('booted');
};
var visi_latch = function(){
    visi_latch = noop;
    fire('visi');
};
var visi2_latch = function(){
    visi2_latch = noop;
    fire('visi_custom');
};

var triplet = function(r, h){
    if (h[0] !== NULL && h[1] !== NULL && h[2] !== NULL)
        r.push(h[1] && (h[0] || h[2]));	// hidden when center and at least one outer pixel is hidden
};

var sensors_summary;
var metrics = function(){
    // set{Interval,Timeout} is throttled on inactive tabs
    var nowtime = now();
    var delta = nowtime - (metrics._prevtime || nowtime);
    metrics._prevtime = nowtime;

    if (!unloading && !killAd.state)
        window.setTimeout(metrics, 100);

    if (booting < 0) {
        oops('booting < 0, this should not happen!');
        booting = 0;
    }

    if (booting) return;

    booted_latch();

    // GT-230: after booted as this needs to be zero until rendered
    // we could do this on sendvisi but we want metrics populated
    p_d_v_cb(nowtime);

    // we want to report on the previous measurement
    // as latest usually is focus/page non-viewable
    sensors_summary = metrics.sensors_summary;
    metrics.sensors_summary = {
        'page':		hidden,
        'homepage':	homepage.hidden,
        'focus':	focus.hidden,
        'classic':	classic.ratio,
        'element':	element.hidden[0],
        'safeframe':	safeframe.ratio,
        'mraide':	mraid.exposure,
        'mraidr':	mraid.ratio,
        'mraidh':	mraid.hidden,
        'intersection':	intersection.hidden,
        'animation':	animation.hidden[0]
    };

    if (!measured) return;

    if (!roll_state) return;

    var results = [], results2 = [];

    // safe to push on uninitialised
    results.push(hidden), results2.push(hidden);

    results.push(homepage.hidden), results2.push(homepage.hidden);

    results.push(focus.hidden), results2.push(focus.hidden);

    if (classic.ratio !== NULL)
        results.push(classic.ratio < tx_visi), results2.push(classic.ratio < tx_visi2);

    element();				// we cannot get scroll events in an iframe :(
    triplet(results, element.hidden);
    triplet(results2, element.hidden2);

    if (SAFEFRAME) {
        safeframe();			// register is not avaliable to us
        if (safeframe.ratio !== NULL)
            results.push(safeframe.ratio < tx_visi), results2.push(safeframe.ratio < tx_visi2);
    }

    if (mraid.exposure !== NULL)
        results.push(mraid.exposure < tx_visi), results2.push(mraid.exposure < tx_visi2);
    if (mraid.ratio !== NULL)
        results.push(mraid.ratio < tx_visi), results2.push(mraid.ratio < tx_visi2);
    if (mraid.hidden !== NULL)
        results.push(mraid.hidden), results2.push(mraid.hidden);

    if (intersection.hidden !== NULL)
        results.push(intersection.hidden);
    if (intersection.hidden2 !== NULL)
        results2.push(intersection.hidden2);

    triplet(results, animation.hidden);
    triplet(results2, animation.hidden2);

    var ishidden = false, ishidden2 = false;
    for (var i = 0; i < results.length; i++) {
        if (!results[i]) continue;
        ishidden = true;
        break;
    }
    for (var i = 0; i < results2.length; i++) {
        if (!results2[i]) continue;
        ishidden2 = true;
        break;
    }

    metrics.hidden = ishidden;
    metrics.hidden2 = ishidden2;

    if (metrics.atf === NULL)
        metrics.atf = HOMEPAGE ? true : !ishidden;
    if (metrics.atf2 === NULL)
        metrics.atf2 = HOMEPAGE ? true : !ishidden2;

    if (ishidden) {
        metrics.run = 0;
    } else {
        metrics.exp += delta;
        metrics.run += delta;

        if (metrics.run > metrics.max)
            metrics.max = metrics.run;
    }
    if (ishidden2) {
        metrics.run2 = 0;
    } else {
        metrics.exp2 += delta;
        metrics.run2 += delta;

        if (metrics.run2 > metrics.max2)
            metrics.max2 = metrics.run2;
    }

    var viewable_orig = metrics.viewable;
    metrics.viewable = (metrics.max / 1000) >= sec_visi ? 2 : 0;
    if (viewable_orig != metrics.viewable) visi_latch();

    if (tx_visi2 > 0) {
        var viewable2_orig = metrics.viewable2;
        metrics.viewable2 = (metrics.max2 / 1000) >= sec_visi2 ? 2 : 0;
        if (viewable2_orig != metrics.viewable2) visi2_latch();
    }

    window['adloox_getVisi'] = !ishidden && !ishidden2;
    visi.metrics = {	// exposed by API
        'atf': [ metrics.atf, metrics.atf2 ],
        'dur': runtime(),
        'dat': p_d_v,	// activetab time after rendered
        'exp': [ metrics.exp, metrics.exp2 ],
        'max': [ metrics.max, metrics.max2 ],
        'run': [ metrics.run, metrics.run2 ],
        'vwb': [ metrics.viewable, metrics.viewable2 ],
        'hid': [ ishidden, ishidden2 ]
    };
    visi.sensors = {	// exposed by API
        'page': hidden,
        'homepage': homepage.hidden,
        'focus': focus.hidden,
        'classic': classic.ratio,
        'element': [ element.hidden, element.hidden2 ],
        'safeframe': safeframe.ratio,
        'mraide': mraid.exposure,
        'mraidr': mraid.ratio,
        'mraidh': mraid.hidden,
        'intersection': [ intersection.hidden, intersection.hidden2 ],
        'animation': [ animation.hidden, animation.hidden2 ]
    };
    if (haslistener('viewability')) {
        fire('viewability', {
            'delta': delta,
            'metrics': visi.metrics,
            'sensors': visi.sensors
        });
    }
};
// N.B. times are in milliseconds
metrics.hidden = NULL, metrics.hidden2 = NULL;	// hidden
metrics.atf = NULL, metrics.atf2 = NULL;	// above the fold
metrics.exp = 0, metrics.exp2 = 0;		// ad exposure
metrics.max = 0, metrics.max2 = 0;		// max continueous ad exposure period
metrics.run = 0, metrics.run2 = 0;		// continuous run (internal, not reported!)
metrics.viewable = 0, metrics.viewable2 = 0;

var logData = function(){
    var nowtime = now()
    if (nowtime - logData.lastsent < 1000) return;
    if (nowtime - metrics._prevtime > 300) metrics();	// Safari aggressively throttles on each iteration

    var o = {
        'adloox_transaction_id': window.transaction_id || NULL,
        'client': cname,
        'banniere': ban_id,
        'visite_id': visite_id,
        'url': uri_courant,
        'campagne': cmp_id_date,
        'p_d': runtime() / 1000,	// *not* page duration, but uptime of our JS
        'p_d_v': p_d_v / 1000,
        'browser': user_p.browser,
        'editeur_id': str_alerte_ids,
        'hash': uniq_hash(),
        'hash_adnxs': hash_adnxs,
        'visi_debug': 'booting: ' + booting + ' [' + [rendered.booting, animation.booting].join(',') + ']'
    };

    if (adunit.rect)
        o['size'] = adunit.rect.width+'x'+adunit.rect.height;

    if (!booting) {
        var visible = metrics.viewable ? 2 : 0;
        var visible2 = metrics.viewable2 ? 2 : 0;

        if (unloading) {
            var bridge_exp = visible ? ( (isNaN(metrics.exp) || metrics.exp == 0) ? 0 : metrics.exp / 1000 ) : 0;
            var bridge_dur = o['p_d'];
            var bridge_exp2= visible2 ? ( (isNaN(metrics.exp2) || metrics.exp2 == 0) ? 0 : metrics.exp2 / 1000 ) : 0;
            var bridge_atf = metrics.atf ? 2 : 0;
            var bridge_size= adunit.rect ? adunit.rect.width+'x'+adunit.rect.height : 0;

            try {
                onUnloadPage(bridge_exp, bridge_dur, visible, bridge_exp2, bridge_atf, bridge_size);
                onUnloadPage = noop;
            } catch(_) {}
        }

        // returns 0 for not used, 1 for viewable, 2 for non-viewable
        var sensors_summary_result = function(x){
            if (typeof x == 'number')
                return 1 + ~~(x < 0.5);
            else
                return x !== NULL ? 1 + ~~x : 0;
        };

        var sensors_summary_workset = sensors_summary || metrics.summary;
        var sensors_summary_serialised = [];
        for (var k in sensors_summary_workset)
            sensors_summary_serialised.push(k + '.' + sensors_summary_result(sensors_summary_workset[k]));
        o['visi_debug'] = sensors_summary_serialised.join('_');

        o['visible'] = visible;
        o['a_d'] = metrics.exp / 1000;
        o['wasatf'] = metrics.atf ? 2 : 0;

        if (tx_visi2 > 0) {
            o['visible2'] = visible2;
            o['a_d2'] = metrics.exp2 / 1000;
            o['wasatf2'] = metrics.atf2 ? 2 : 0;
        }
    }

    sendBeacon('https://' + servername + '/ads/iv2.php?', o);

    logData.lastsent = nowtime;
};
logData.lastsent = 0;

subscribe('booted', function(){
    subscribe('sendvisi', logData);
});
subscribe('unload', function(){
    unsubscribe('sendvisi', logData);
    logData();
});

// HACK some apps 'kill -9' the webview
if (WEBVIEW && !VAST) {
    subscribe('visi' + (tx_visi2 > tx_visi ? '_custom' : ''), function(){
        SETTIMEOUT(logData, Math.floor(Math.random() * 2000));	// oh its fraud... :-/
    });

    var t = 1;
    (function cb(){
        if (unloading || killAd.state) return;
        var f = t == 1 ? Math.random() * 2 : 0;			// oh its fraud... :-/
        SETTIMEOUT(function(){
            logData();
            cb();
        }, Math.floor((t + f) * 1000));
        t = Math.min(64, t * 2);
    })();
}

// last in the file as we need to provide an opportunity for the subscription hooks to be added
metrics();
    });
    subscribe('impression', function(){			// no point sending viewability with no impression
        // https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/
        evA(window, 'unload', BINDER(unload));
        evA(window, 'beforeunload', BINDER(unload));	// safari reload/url change
        evA(window, 'pagehide', BINDER(unload));	// safari navigate
    });

    
    /**
 * @constructor
 */
var AdlooxAPIv0 = function(){
    return {
        'config': {
            'visite_id': visite_id,
            'cname': cname,
            'platform': platform,
            'version': version,
            'date_regen': date_regen,
            'fwtype': has_fw,
            'creatype': type_crea,
            'targetelt': targetted_ids,
            'iframe': IFRAME ? (SAMEORIGIN ? 'same-origin' : 'cross-origin') : 'none',
            'features': {
                'safeframe': !!SAFEFRAME,
                'mraid': !!MRAID,
                'vast': !!VAST
            },
            'viewability': {
                'iab': {
                    'time': sec_visi,
                    'area': tx_visi
                },
                'custom': {
                    'time': sec_visi2,
                    'area': tx_visi2
                }
            }
        },
        'metrics': BINDER(function(){
            var v = visi && visi.metrics;
            return v ? {
                'hidden': v['hid'][0],
                'hidden_custom': v['hid'][1],
                'viewable': !!v['vwb'][0],
                'viewable_custom': !!v['vwb'][1],
                'atf': !!v['atf'][0],
                'atf_custom': !!v['atf'][1],
                'duration': v['dur'],
                'duration_activetab': v['dat'],
                'exposure': v['exp'][0],
                'exposure_custom': v['exp'][1],
                'exposure_max': v['max'][0],
                'exposure_max_custom': v['max'][1],
                'exposure_run': v['run'][0],
                'exposure_run_custom': v['run'][1]
            } : 'still booting';
        }),
        'sensors': BINDER(function(){
            var v = visi && visi.sensors;
            return v ? v : 'still booting';
        }),
        'impression': BINDER(function(){
            return impression.state;
        }),
        'adunit': BINDER(function(){
            // we return a new object to stop naughty people
            return {
                'el': adunit.el,
                'proxy': adunit.proxy,
                'rect': adunit.rect
            };
        }),
        'killAd': BINDER(killAd),

        'subscribe': BINDER(function(name, callback){
            subscribe(name, callback);
        }),
        'unsubscribe': BINDER(function(name, callback){
            unsubscribe(name, callback);
        })
    };
};

if (myelement) {
    myelement['getAdloox'] = BINDER(function(version){
        switch (version) {
        case 0:
        default:
            return new AdlooxAPIv0();
        }
    });
}

    subscribe('adunit', function(){
        var cb = BINDER(fire, 'sendvisi');
        subscribe('pagevisi', cb);

        if (MRAID) {
            evA(MRAID, 'viewableChange', cb);
            evA(MRAID, 'stateChange', cb);
        }
    });

    subscribe('impression', function(){
        roll_state = true;

        var timezoneOffset = 0;
        try {
            timezoneOffset = (new Date()).getTimezoneOffset();
        } catch(e) {}

        var ctitle = window['ctitle_atlas'] ? window['ctitle_atlas'] : '';
        //var methode = hFlash ? "hf" : "nof";

        var o = {
                        'adloox_io': 1,
                        'campagne': cmp_id,
            'banniere': ban_id,
            'plat': platform,
            'adloox_transaction_id': transaction_id,
            'bp': bidprice,
            'visite_id': visite_id,
            'client': cname,
            'ctitle': ctitle,
            'id_editeur': str_alerte_ids,
            'os': '',
            'navigateur': '',
            'appname': navigator.appName ? navigator.appName : 'unknown',
            'timezone': timezoneOffset,
            'fai': title,
            'alerte': alerte_finale,
            'alerte_desc': alerte_desc,
            'data': uniq_hash(),
            'js': myelement ? myelement.src : '',
            'commitid': version,
            'fw': has_fw,
            'version': fw_version,
            'iframe': IFRAME ? (SAMEORIGIN ? 3 : 1) : 0,
            'hadnxs': hash_adnxs,
            'ua': navigator.userAgent,
            'url_referrer': uri_courant,
            'resolution': resolution,
            'nb_cpu': nb_cpu,
            'nav_lang': nav_lang,
            'date_regen': date_regen,
            'debug': methode,
            'ao': ancestorOrigins[0] || '',
            'fake': detectFake(),	// function provided by the bot module
            'popup_history': Math.max(history.length, 9),
            'popup_visible': visibilityState == 'visible',
            'type_crea' : type_crea,
            'tagid' : tagid
        };

        var popup = function(x){ o['popup_'+x] = typeof window[x] == 'object' ? window[x].visible : -1 };
        popup('menubar');
        popup('locationbar');
        popup('personalbar');
        popup('scrollbars');
        popup('statusbar');
        popup('toolbar');

                for (var k in tab_adloox_tag)
            o[k] = o[k] || tab_adloox_tag[k];
        
        var paramsUrlV3O = qs2o(paramsUrlV3.substr(1));
        for (var k in paramsUrlV3O) {
            last(paramsUrlV3O, k);
            o[k] = o[k] || paramsUrlV3O[k];
        }
        if (params_opt['sizmek'])
            o['sizmek'] = params_opt['sizmek'];

        var url = 'https://' + servername + '/ads/' + v_ic + '?';
        sendScript(url, o);

        if(tagco_arr['domain'] && tagco_arr['version'])
            send_to_tagco(tagco_arr);
    });

    var impression = function(){
        impression.state = true;
        fire('impression');
    };

    var impression_pre = function(){
        subscribe('impression', function adunithunt(){
            if (unloading || killAd.state) return;

            adunithunt_cycles++;

            var el = NULL;
            if (HOMEPAGE) {
                try {
                    el = top.document.body;
                } catch(_) {
                    el = undefined;
                }
            } else {
                el = wabbit_hunter(myelement);
            }

            if (el) {
                adunit_found(el);
            } else if (el === NULL) {	// undefined means stop hunting
                LOG("adunit not found, polling...");
                SETTIMEOUT(adunithunt,  Math.min(5000, adunithunt_cycles * adunithunt_cycles * 200));
            } else {
                LOG("adunithunt, exploded");
                unload();
            }
        });

        if (!HOMEPAGE) {
            if (!SAMEORIGIN) {
                var a = parseUri(location);
                SAFEFRAME = winHunt('$sf', function(v, win){
                    if (a.hostname.match(/(?:^|\.)adnxs\.com$/)) return false;	// buggy live.com for gamned
                    return typeof v == 'object' && typeof v['ext'] == 'object';
                });
            }
            if (SAFEFRAME) {
                LOG("SafeFrame detected");
                FLAGS.push('SafeFrame');
                fire('safeframe');
            }

            MRAID = winHunt('mraid', function(v, win){
                // extra checks to ignore buggy implementations
                return typeof v == 'object' && typeof v['getVersion'] == 'function' && castInt(v['getVersion']()) && typeof v['getPlacementType'] == 'function' && typeof v['getState'] == 'function';
            });
            if (MRAID) {
                LOG("MRAID detected");
                FLAGS.push('MRAID');
                fire('mraid');
            }
        }

        if (!VPAID) {	// we can't do anything if we were async integrated anyway
            VPAID = winHunt('getVPAIDAd', function(v, win){
                if (typeof v != 'function') return false;
                // GT-81: 2mdn.net installs a VPAID object regardlessly :-/
                return typeof win['studio'] == 'undefined';
            });
            if (VPAID) {
                LOG("VPAID detected");
                FLAGS.push('VPAID');
                VPAID = VPAID();

                var v_paused = BINDER(function(){ LOG('VPAID paused'); roll_state = false; });
                var v_resume = BINDER(function(){ LOG('VPAID resume'); roll_state = true; });
                var v_unload = BINDER(unload);
                VPAID['subscribe'](v_paused, 'AdPaused');
                VPAID['subscribe'](v_resume, 'AdPlaying');
                VPAID['subscribe'](v_unload, 'AdStopped');
                VPAID['subscribe'](v_unload, 'AdVideoComplete');
                subscribe('unload', function(){
                    VPAID['unsubscribe'](v_paused, 'AdPaused');
                    VPAID['unsubscribe'](v_resume, 'AdPlaying');
                    VPAID['unsubscribe'](v_unload, 'AdStopped');
                    VPAID['unsubscribe'](v_unload, 'AdVideoComplete');
                });

                // race condition if we try waiting for AdImpression so we have to poll anyway
                var r = VPAID['getAdRemainingTime']();
                (function cb(){
                    if (unloading) return;
                    if (r != VPAID['getAdRemainingTime']()) {
                        impression();
                        return;
                    }
                    SETTIMEOUT(cb, 500);
                })();

                return;
            }
        }

        // we yield so to not to delay further DOMContentLoaded and cause interactively problems
        YIELD(impression);
    };

    var preconnect = function(){
        // https://www.igvita.com/2015/08/17/eliminating-roundtrips-with-preconnect/
        var hint = document.createElement('link');
        hint.rel = 'preconnect';
        hint.href = 'https://'+servername;
        document.getElementsByTagName('head')[0].appendChild(hint);
    };

    if (VAST) {
        preconnect();
        // impression() called in vast.js
    } else if (document.readyState === 'loading') {
        // DOMContentLoaded not affected by buggy publishers that document.open() and never close()
        document.addEventListener('DOMContentLoaded', impression_pre);
        preconnect();
    } else {
        impression_pre();
    }

} catch(_) {
    oops(_.stack || _.message);
}

}).call(this);
