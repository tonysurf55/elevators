/* 
 * FloorTimer 
 */
class FloorTimer {
  /** @type {number} */
  floor;
  /** @type {HTMLElement} */
  #timer;
  /** @type {number|null} */
  intervalId = null;
  /** @type {number} */
  startTime = 0;
  /** @type {number} */
  col = 0;

  /**
   * @param {number} floor 
   * @param {HTMLElement} timer 
   */
  constructor(floor, timer) {
    this.floor   = floor;
    this.#timer = timer;
  }

  /** Timer starts on call with or without assigned elevator */
  start() {
    this.startTime = Date.now();
    this.#timer.textContent = '0 Sec.';
    this.#timer.classList.add('floor-timer-visible');

    // Timer is updated every second
    this.intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = (elapsed % 60).toString();
      let timerText = '';
      if (m > 0) {
        timerText = `${m} min. ${s} Sec.`;
      } else {
        timerText = `${s} Sec.`;
      }
      this.#timer.textContent = timerText;
    }, 1000);
  }

  /** Timer stops when the elevator arrived */
  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.#timer.textContent = '';
    setTimeout(() => {
      this.#timer.classList.remove('floor-timer-visible');
      this.col = 0;
      this.placeTimer();
    }, 500);
  }

  /** An elevator has been dispatched for the required floor */
  foundElevator(elevator) {
    if (elevator) {
      this.col = elevator.id;
    }

    this.placeTimer();
  }

  /** Set left CSS - Align the timer to the corresponding elevator */
  placeTimer() {
    const left = !this.col ? 0 
        : LABEL_WIDTH + ((this.col - 1) * CELL_WIDTH) 
          + (CELL_WIDTH / 2) - (TIMER_WIDTH / 2);
    
    this.#timer.style.left = `${left}px`;
  }
}