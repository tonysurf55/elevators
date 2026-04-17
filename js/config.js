// Application Constants
// Matches some css values in variables.css

const NUM_FLOORS = 10;
const NUM_COL    = 5;

// Height of one floor
const FLOOR_HEIGHT = 50;
const CELL_WIDTH = 100;
const LABEL_WIDTH = 100;
const TIMER_WIDTH = 64;
const ELEVATOR_WIDTH = 30;

// Time (ms) for the elevator to travel one floor
const MS_PER_FLOOR   = 1000;

// Time (ms) the elevator stays at the floor */
const ARRIVED_WAIT_MS = 2000;

// Elevator status
const ELEVATOR_STATUS = {
  IDLE:    'idle',
  MOVING:  'moving',
  ARRIVED: 'arrived',
};

// Button states
const BTN_STATE = {
  CALL:    'call',
  WAITING: 'waiting',
  ARRIVED: 'arrived',
};