/*
 * FloorButton
 */
class FloorButton {
  /** @type {number} */
  floor;
  /** @type {HTMLElement} */
  #btn;
  /** @type {FloorTimer} */
  timer;
  /** @type {string} */
  _state;

  /**
   * @param {number} floor 
   * @param {HTMLElement} btn 
   * @param {FloorTimer} timer 
   * @param {Function} onCall
   */
  constructor(floor, btn, timer, onCall) {
    this.floor  = floor;
    this.#btn   = btn;
    this.timer  = timer;
    this.state  = BTN_STATE.CALL;

    this.#btn.addEventListener('click', () => {
      if (this.state === BTN_STATE.CALL) onCall(this.floor);
    });
  }

  get state() { return this._state; }

  set state(newState) {
    this._state = newState;
    this.render();
  }

  /** Start the timer */
  startTimer() {
    this.timer.start();
  }

  /** Stop the timer */
  stopTimer() {
    setTimeout(() => {
      this.timer.stop();
    }, 200);
  }

  /** Apply state changes on the button */
  render() {
    this.#btn.classList.remove('btn-call-waiting', 'btn-call-arrived');

    switch (this.state) {
      case BTN_STATE.CALL:
        this.#btn.textContent = 'Call';
        this.#btn.disabled    = false;
        break;
      case BTN_STATE.WAITING:
        this.#btn.textContent = 'Waiting';
        this.#btn.classList.add('btn-call-waiting');
        this.#btn.disabled    = true;
        break;
      case BTN_STATE.ARRIVED:
        this.#btn.textContent = 'Arrived';
        this.#btn.classList.add('btn-call-arrived');
        this.#btn.disabled    = true;
        break;
    }
  }
}