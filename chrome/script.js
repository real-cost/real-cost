var DETAILS_ = [
    {
        'mult': 1/50,
	'text': 'children',
	'link': 'http://www.independent.co.uk/news/world/africa/plumpynut-the-lifesaver-that-costs-well-peanuts-8783650.html'
    },
    {
	'mult': 9,
	'text': 'meals',
	'link': 'http://www.feedingamerica.com'
    }
];

var isAmazon = function() {
    return document.URL.indexOf("http://www.amazon.com") != -1;
};

var isWalmart = function() {
    return document.URL.indexOf("http://www.walmart.com") != -1;
};

var fixPrice = function() {
    var details = DETAILS_[1];
    if (isAmazon()) {
	fixPriceAmazon(details);
    } else if (isWalmart()) {
	fixPriceWalmart(details);
    } else {
	console.log("Unknown site: " + document.URL);
    }
};

/**
 * @param value The current value in dollars
 * @param elt The HTML element to replace content for
 * @param details The details about the replacement
 */
var setPrice = function(value, elt, details) {
    var newValue = value * details.mult;
    elt.innerHTML = value + " <a style='text-decoration: underline' href='" + details.link + "'>" + details.text + "</a>";
};

var fixPriceWalmart = function (details) {
    var elts = document.getElementsByClassName("camelPrice");
    if (!elts) {
	return;
    }
    for (var i = 0; i < elts.length; ++i) {
	if (!elts.item(i).children[1]) {
	    continue;
	}
        // TODO: handle SWFPrice here.
	var price = null;
	for (var j = 1; j < elts.item(i).children.length; ++j) {
	    price = elts.item(i).children[j].textContent;
	    if (price.indexOf("$") != -1) {
		break;
	    }
	}
	if (price.indexOf("$") == -1) {
	    continue;
	}
	var match = price.match("[0-9]+\.");
	if (!match) {
	    continue;
	}

        setPrice(parseInt(match), elts.item(i), details);
    }
    elts = document.getElementsByClassName("WasPrice");
    if (!elts) {
	return;
    }
    for (var i = 0; i < elts.length; ++i) {
	var price = elts.item(i).textContent;
	if (price.indexOf("$") == -1) {
	    continue;
	}
	var match = price.match("[0-9]+\.[0-9][0-9]");
	if (!match) {
	    continue;
	}
        setPrice(parseInt(match), elts.item(i), details);
    }
};

var fixPriceAmazon = function(details) {
    var elt = document.getElementById('buyingPriceValue');
    if (!elt) {
	elt = document.getElementById('actualPriceValue');
    }    
    if (!elt) {
        return;
    }
    priceElt = elt.children[0];
    var price = priceElt.textContent;
    if (price.indexOf("$") == -1) {
	return;
    }
    var match = price.match("[0-9]+\.[0-9][0-9]");
    setPrice(parseInt(match), priceElt, details);
};

var installObservers = function() {
    // This is to catch Amazon's hover over price changes when there are
    // multiple different price options.
    if (isAmazon()) {
	document.addEventListener('DOMNodeInserted', fixPrice);
    }
};

chrome.runtime.sendMessage({}, function(response) {
    if (response.active) {
	fixPrice();
	installObservers();
    }
});