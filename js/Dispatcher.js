/**
 * Dispatcher
 *
 * Receives floor call requests, finds the closest idle elevator,
 * and queues calls when all elevators are busy.
 */
class Dispatcher {
  /** @type {Elevator[]} */
  elevators;
  /** @type {FloorTimer[]} */
  floorTimers;
  /** @type {Array<{floor: number, onArrived: Function}>} */
  queue;

  /**
   * @param {Elevator[]}    elevators   All elevator instances
   * @param {FloorTimer[]}  floorTimers All timers instances
   */
  constructor(elevators, floorTimers) {
    this.elevators    = elevators;
    this.floorTimers  = floorTimers;    
    this.queue        = [];
  }

  /**
   * Call an elevator.
   * If no idle elevator is found then the call is added to the queue
   *
   * @param {number}   floor
   * @param {Function} onArrived  Called when an elevator reaches the floor
   */
  call(floor, onArrived) {
    const elevator = this.findClosestIdle(floor);

    if (elevator) {
      this.dispatch(elevator, floor, onArrived);
    } else {
      this.queue.push({ floor, onArrived });
    }
  }

  /**
   * Called by an Elevator via its onIdle callback.
   * Pops the next queued call if any.
   *
   * @param {Elevator} elevator
   */
  onElevatorIdle(elevator) {
    if (this.queue.length === 0) return;
    const { floor, onArrived } = this.queue.shift();
    this.dispatch(elevator, floor, onArrived);
  }

  /**
   * Find the nearest idle elevator to floor.
   * Returns null if they are all already busy.
   *
   * @param {number} floor
   * @returns {Elevator|null}
   */
  findClosestIdle(floor) {
    const idle = this.elevators.filter(e => e.isIdle);
    if (idle.length === 0) return null;

    return idle.reduce((best, e) => {
      const bestDist = Math.abs(best.currentFloor - floor);
      const eDist    = Math.abs(e.currentFloor - floor);

      return eDist < bestDist ? e : best;
    });
  }

  /**
   * Send an elevator to a floor.
   *
   * @param {Elevator}  elevator
   * @param {number}    floor
   * @param {Function}  onArrived
   */
  dispatch(elevator, floor, onArrived) {
    const timer = this.floorTimers[floor];
    timer.foundElevator(elevator);
    elevator.moveTo(floor, onArrived);
  }
}