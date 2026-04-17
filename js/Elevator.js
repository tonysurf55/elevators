/**
 * Elevator
 *
 * Manages an elevator: its position, state and transition.
 * Emits an onIdle callback when it becomes free so the Dispatcher can
 * assign the next queued call.
 */
class Elevator {
  /** @type {number} Index of this elevator (1 is first column) */
  id;
  /** @type {number} Current floor (0 is ground) */
  currentFloor;
  /** @type {string} One of ELEVATOR_STATUS.IDLE | MOVING | ARRIVED */
  status;
  /** @type {HTMLElement} The elevator DOM node */
  #el;
  /** @type {SoundManager} */
  sound;
  /** @type {Function|null} Called from this elevator when it becomes idle */
  onIdle;

  /**
   * @param {number}      id       Elevator index
   * @param {HTMLElement} el       The elevator DOM element
   * @param {Function}    onIdle   Dispatcher callback fired when elevator is free
   */
  constructor(id, el, onIdle) {
    this.id           = id;
    this.#el          = el;
    this.currentFloor = 0;
    this.status       = ELEVATOR_STATUS.IDLE;
    this.sound        = new SoundManager();
    this.onIdle       = onIdle;

    this.initCol();
    this.applyPosition(0, '0ms');
    this.setStatus(this.status);
  }
  
  get isIdle()  { return this.status === ELEVATOR_STATUS.IDLE; }

  /**
   * Move the elevator to the targetFloor
   * Called from the displatcher
   * Returns a Promise which resolves after the arrival wait period ends
   *
   * @param {number}   targetFloor
   * @param {Function} onArrived   Building callback called when elevator reaches floor
   * @returns {Promise<void>}
   */
  moveTo(targetFloor, onArrived) {
    const distance = Math.abs(targetFloor - this.currentFloor);
    const travelMs = distance === 0 ? 100 : distance * MS_PER_FLOOR;

    this.setStatus(ELEVATOR_STATUS.MOVING);
    this.applyPosition(targetFloor, `${travelMs}ms`);

    return new Promise((resolve) => {
      // Wait for CSS transition to finish
      setTimeout(() => {
        this.currentFloor = targetFloor;
        this.setStatus(ELEVATOR_STATUS.ARRIVED);
        this.sound.playArrival();
        if (typeof onArrived === 'function') onArrived();

        // Wait at floor before becoming idle
        setTimeout(() => {
          this.setStatus(ELEVATOR_STATUS.IDLE);
          resolve();
          if (typeof this.onIdle === 'function') this.onIdle(this);
        }, ARRIVED_WAIT_MS);
      }, travelMs);
    });
  }

  /**
   * Set bottom CSS and the transition time so the elevator gets to the correct floor.
   *
   * @param {number} floor
   * @param {string} duration CSS duration ex:'1000ms'
   */
  applyPosition(floor, duration) {
    const bottomPx = floor * FLOOR_HEIGHT + (FLOOR_HEIGHT - this.#el.offsetHeight) / 2;
    const transition = `bottom ${duration} ease-in-out`;
    this.#el.style.setProperty('transition', transition);
    this.#el.style.bottom = `${bottomPx}px`;
  }

  /**
   * Change the status class
   * @param {string} status 
   */
  setStatus(status) {
    this.status = status;
    this.#el.classList.remove(
      'elevator-idle',
      'elevator-moving',
      'elevator-arrived'
    );
    this.#el.classList.add(`elevator-${this.status}`);
  }

  /** Set left CSS - Place the elevator in the shaft */
  initCol() {
    const col = this.id;
    const left = LABEL_WIDTH + ((col - 1) * CELL_WIDTH) + (CELL_WIDTH / 2) - (ELEVATOR_WIDTH / 2);
    this.#el.style.left = `${left}px`;
  }
}