
# Elevator exercise

This app simulate a 10 floors building with 5 elevators. Each floor has it's own call elevator button and a timer which display the time for an elevator to reach the floor.



## Installation

Since the app is in native JavaScript and there is no specificframework. No installation is needed. Also in order to keep it simple I choose not to use compiled SCSS but only some nested CSS. 
    
## Run Locally

Only open the file **index.html** into your browser to launch the app.


## Usage

The duration time for the elevator to travel one floor is 1 second.
If you wish to slow down the elevators then increase the time of the MS_PER_FLOOR variable. 

#### js/config.js

```javascript
// Time (ms) for the elevator to travel one floor
const MS_PER_FLOOR   = 1000;
```