Queue.direction = {
    ltr : 0,
    rtl : 1
}

Queue.startCount = 12;

function Queue() {
    this.direction  = Queue.direction.ltr;
    this.cards = [];
}