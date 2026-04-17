/**
 * Application entry point.
 * Waits for the DOM to load.
 */
document.addEventListener('DOMContentLoaded', () => {
  const building = new Building();
  building.init();
});