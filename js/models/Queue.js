Queue.direction = {
    ltr : 1,
    rtl : 2
};

function Queue() {
    this.direction = Queue.direction.ltr;
    this.cards = [];
}
