/**
 * Curates rogue decimals from a number.
 * 
 * @param {number} number Number with potential rogue decimals.
 * @param {number} decimals Max number of decimals desired.
 * @param {bool} forDisplay Whether the number sent will be shown on screen.
 * @return {number} Curated number with limited decimals.
 */
function prettify(number, decimals, forDisplay = false) {
    var normalizedDecimals = Math.pow(10, decimals);
    var newNumber = Math.round(number * normalizedDecimals) / normalizedDecimals;
    if (!forDisplay || newNumber < 10000) return newNumber;

    //Convert to readable output (string)
    //first turn our number to m * 1000^n
    var n = Math.floor(getBaseLog(newNumber, 1000));
    newNumber = newNumber / Math.pow(1000, n);
    var units = ["", "K", "M", "B", "T"];
    var unit = "";
    if (n < units.length) {
        unit = units[n];
    }
    else if (n == Infinity) {
        return "∞";
    }
    else {
        n -= units.length;
        //prefer not relying on ASCII table for number notations
        var alphabet = "abcdefghijklmnopqrstuvwxyz";
        var firstUnit = n / 26;
        var secondUnit = n % 26;
        unit = alphabet.charAt(firstUnit) + alphabet.charAt(secondUnit);
    }
    if (unit.length > 0) {
        newNumber = Math.floor(newNumber * 100);
        newNumber = prettify(newNumber / 100, 2);
    }
    return newNumber + unit;
}

/**
 * Returns the logarithmic function on a different base.
 * 
 * @param {number} number The original number (x) in our old equation ln(x)
 * @param {number} base The desired base (y) in our new equation log(x, y)
 */
function getBaseLog(number, base) {
    var number = Math.log(number) / Math.log(base)
    return prettify(number, 2);
}

/**
 * Gets the percentage represented by a number against a total value.
 * 
 * @param {number} number The number to check against.
 * @param {number} total The total value representing 100%.
 * @return {number} The percentage value between 0 and 100.
 */
function GetPercent(number, total) {
    if (number <= 0) return 0;
    if (number >= total) return 100;
    return prettify(number / total, 5) * 100;
}

/**
 * Returns the plural of a label if applicable
 * 
 * @param {object} what The type of object to label.
 */
function plural(what) {
    var label = "";
    if (!what || !what.label) return label;
    label += what.label;
    if (what.current <= 1) return label;
    if (what.label.endsWith("y")) {
        label = label.slice(0, -1);
        label += "ies";
    } else if (what.label.endsWith("ch")) {
        label += "es";
    } else {
        label += "s";
    }
    return label;
}