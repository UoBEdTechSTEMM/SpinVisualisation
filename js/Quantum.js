function Complex(a_,b_) {
  var self=this;
  this.a=a_||0;
  this.b=b_||0;
  this.times = function(sec) {
    return new Complex(self.a*sec.a-self.b*sec.b,self.a*sec.b+self.b*sec.a);
  };
  this.conj = function() {
    return new Complex(self.a,-self.b);
  };
  this.mod = function() {
    return Math.sqrt(self.a*self.a+self.b*self.b);
  };
}

function State(up_,down_) {
  var self = this;
  this.up=up_|| new Complex(1,0); //defaults to up
  this.down = down_ || new Complex(0,0);

  this.dot = function(sec) {
    return new Complex(self.up.times(sec.up.conj()),self.down.times(sec.down.conj()));
  };

  this.probabilityWith = function(sec) {
    return Math.pow(self.dot(sec).mod(),2);
  };
}
