class Sniper {

  // constructor
  constructor(config = {}) {

    this.version = "0.1.0";

    // open modal
    $('#bidBtn_btn').click();
    
    // setup configs
    this.config = {
      maxBid: 0,
      dryRun: true,
      cantLose: false,
      timeWindow: 3,
      increments: 0.5,
      pollTime: 100,
      cantLosePercent: 0.25,
      percentOverBudget: 0.15,
      intervalsReport: [59, 30, 15, 10, 5, 4, 3, 2, 1],
      ...config
    };

    this.poll;
    this.bids = 0;
    this._maxBid = this.config.maxBid;

    // start polling
    this.initPoll();
  }

  // elements getters
  get $modal() {
    return $('#vilens-modal0');
  }
  get $time() {
    return this.$modal.find('#_counter_itemEndDate_timeLeft');
  }
  get $price() {
    return this.$modal.find('.app-bidlayer-price');
  }
  get $shipping() {
    return this.$modal.find('.placebid_layer_priceinfo_shipping');
  }
  get $input() {
    return this.$modal.find('#app-bidlayer-bidsection-input');
  }
  get $submit() {
    return this.$modal.find('.app-bidlayer-bidsection-custombid button.button-placebid');
  }
  get $dismiss() {
    return this.$modal.find('.vilens-modal-close');
  }

  // timing getters
  get time() {
    return this.$time.text().trim();
  }
  get _min() {
    return this.time.match(/(\d+)[m]/)
  }
  get min() {
    return this._min ? parseFloat(this._min[1]) : 0;
  }
  get _sec() {
    return this.time.match(/(\d+)[s]/);
  }
  get sec() {
    return this._sec ? parseFloat(this._sec[1]) : 0;
  }
  
  // price getters
  get shipping() {
    return parseFloat(this.$shipping.text().trim().substring(1)) || 0;
  }
  get _price() {
    return parseFloat(this.$price.text().trim().substring(4));
  }
  get price() {
    return this._price + this.config.increments;
  }
  get maxBid() {
    return this.round(this._maxBid - this.shipping);
  }
  set maxBid(bid) {
    this._maxBid = bid;
  }

  get newBid() {
    return this.round((this.maxBid + this.config.increments) * (1 + this.percentOverBudget));
  }
  get percentOverBudget() {
    return this.config.cantLose ? this.config.cantLosePercent : this.config.percentOverBudget;
  }
  get bidAlready() {
    return this.bids > 0;
  }

  // event
  clickBid(bid) {
    if (!this.config.dryRun) {
      console.log('Bid clicked: $' + bid);
      this.$submit.click();
    }
  }

  updateInput(bid) {
    this.$input.val(bid);
    console.log('Input: $' + bid);
  }

  makeBid(bid) {
    this.updateInput(bid);
    this.clickBid(bid);
    this.bids++;
  }

  // logic
  checkPrice() {
    return this.price <= this.maxBid;
  }

  checkPercentDiff() {
    return 1 - this.maxBid / this._price;
  }

  checkNewPrice() {
    return this.price > this.maxBid && this.checkPercentDiff() < this.percentOverBudget;
  }

  checkTime(window) {
    return this.min === 0 ? this.sec <= window : false;
  }

  // helpers
  round(num, decimalPlaces = 2) {
    num = Math.round(num + "e" + decimalPlaces);
    return Number(num + "e" + -decimalPlaces);
  }

  clearPoller() {
    clearInterval(this.poll);
    console.log('Script complete.');
  }
  
  tminus() {
    if (!this.min) {
      for (let sec of this.config.intervalsReport) {
        if (this.sec === sec) {
          console.log('T-minus', sec, 'seconds');
        }
      }
    }
  }

  // pull trigger
  pullTrigger() {    
    // check if submit button present
    if (this.$submit.length) {

      // did not bid yet
      if (!this.bidAlready && this.checkPrice()) {
        console.log('Initial bid');
        this.makeBid(this.maxBid);
        return true;
      }
      
      // check again at 1 sec and stop script
      if (this.checkTime(1)) {
        this.clearPoller();

        // already bid or don't want to lose this item
        if ((this.bidAlready || !this.checkPrice())) {
          console.log('------');
          console.log(this.price);
          console.log(this.maxBid);
          console.log(this.checkPercentDiff());
          console.log(this.percentOverBudget);
          console.log('------');
          if (this.checkNewPrice()) {
            
            // was outbid, go up by %
            console.log('Final bid');
            this.makeBid(this.newBid);
            return true;
          }

          // just exit
          console.log('Too much! price:', this.price, '> maxbid:', this.maxBid, '  newBid:', newBid);
          return;
        }
      }

    }

    return;
  }
  
  // initiate poller
  initPoll() {
    this.poll = setInterval(function(that) {
      
      // get time element to see if modal is available
      if (that.$time.length > 0) {

        // report back current time
        that.tminus();

        // only pull trigger in time window
        if (that.checkTime(that.config.timeWindow)) {
          that.pullTrigger();
        }
      }
    }, this.config.pollTime, this);
  }
}
