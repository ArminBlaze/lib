function debounce (f, ms) {
  var timer;

  return function() {
    if(timer) clearTimeout(timer);

    var self = this;
    var args = [].slice.call(arguments);

    timer = setTimeout(function() {
      f.apply(self, args);
    }, ms, args);
  };
};