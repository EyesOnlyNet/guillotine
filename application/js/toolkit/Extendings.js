Array.prototype.copy = function(position) {
    if (position) {
        return eval(this.toSource());
    }

    return eval(this[position].toSource());
}