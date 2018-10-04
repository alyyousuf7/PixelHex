function gamma(factor, max_in, max_out) {
    const vals = [];

    for (let i = 0; i <= max_in; i++) {
        vals.push(Math.round(Math.pow(i / max_in, factor) * max_out));
    }
    return vals;
}

module.exports = gamma(2.8, 255, 255);
