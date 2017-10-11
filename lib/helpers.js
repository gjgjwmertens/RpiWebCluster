Date.prototype.pad = function (n, width, z) {
   z = z || '0';
   n = n + '';
   return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

Date.prototype.formattedTime = function () {
   return this.pad(this.getHours(), 2) + ':' +
          this.pad(this.getMinutes(), 2) + ':' +
          this.pad(this.getSeconds(), 2) + ':' +
          this.pad(this.getMilliseconds(), 3);
};
