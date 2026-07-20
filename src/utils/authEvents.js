/**
 * Simple event emitter for auth lifecycle events.
 * Used by axiosClient (outside React tree) to signal session expiry
 * so the React app can handle it with toast + soft navigation.
 */

const listeners = {};

const authEvents = {
  on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
    return () => {
      listeners[event] = listeners[event].filter((cb) => cb !== callback);
    };
  },

  emit(event, data) {
    if (listeners[event]) {
      listeners[event].forEach((cb) => cb(data));
    }
  },
};

export default authEvents;
