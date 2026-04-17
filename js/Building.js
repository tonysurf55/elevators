/*
 * Building entry point
 *
 * Instantiate FloorButtons, FloorTimers, Elevators and Dispatcher
 */
class Building {
  /** @type {FloorButton[]} */
  floorButtons = [];
  /** @type {FloorTimer[]} */
  floorTimers  = [];
  /** @type {Elevator[]} */
  elevators    = [];
  /** @type {Dispatcher} */
  dispatcher;

  constructor() {}

  init() {
    this.initFloorRows();
    this.initElevators();
    this.dispatcher = new Dispatcher(this.elevators, this.floorTimers);
  }

  /** Initialise the buttons and timers for each floor. */
  initFloorRows() {
    for (let floor = 0; floor < NUM_FLOORS; floor++) {
      this.initTimer(floor);
      this.initFloorButton(floor);
    }
  }

  /** Initialise a timer */
  initTimer(floor) {
    const timer = document.getElementById(`timer-${floor}`);
    this.floorTimers[floor] = new FloorTimer(
      floor, timer
    );
  }

  /** Initialise a button */
  initFloorButton(floor) {
    const btn = document.getElementById(`floor-btn-${floor}`);
    const timer = this.floorTimers[floor];

    this.floorButtons[floor] = new FloorButton(
      floor, btn, timer,
      (f) => this.onCall(f)
    );
  }

  /** Initialise the elevators */
  initElevators() {
    for (let col = 1; col <= NUM_COL; col++) {
      const el = document.getElementById(`elevator-${col}`);

      this.elevators[col] = new Elevator(
        col, el,
        (e) => this.dispatcher?.onElevatorIdle(e)
      );
    }
  }

  /** Button call Callback */
  onCall(floor) {
    const floorBtn = this.floorButtons[floor];
    floorBtn.state = BTN_STATE.WAITING;

    this.dispatcher.call(floor, () => this.onArrived(floor));
    floorBtn.startTimer();
  }

  /** 
   * Elevator Callback
   * called when an elevator arrived its destination floor
   */
  onArrived(floor) {
    const floorBtn = this.floorButtons[floor];
    floorBtn.stopTimer();
    floorBtn.state = BTN_STATE.ARRIVED;
    
    setTimeout(() => {
      floorBtn.state = BTN_STATE.CALL;
    }, ARRIVED_WAIT_MS);
  }
}