function Muvis(path, options=null){
 
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var options = options || {};
  var dataMax = options.dataMax || 10;
  var bufferSource, analyzer, frequency, fileData;
  var self = this;
  
  self.isPlaying = false;
  
  function loadFile(){
    var request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    request.onload = fileLoaded;
    request.onerror = fileError;
    request.send();
  }
  
  function fileLoaded(e){
    fileData = e.target.response;
    if(options.onLoad) options.onLoad(fileData);
  }
  
  function fileError(){
    if(options.onError) options.onError('Unable to load file.');
  }
  
  function onAudioDecode(buffer){
    bufferSource = context.createBufferSource();
    analyzer = context.createAnalyser();
    frequency = new Uint8Array(analyzer.frequencyBinCount);
    
    bufferSource.buffer = buffer;
    bufferSource.connect(context.destination);
    bufferSource.connect(analyzer);
    bufferSource.onended = function(){
      self.stop();
      if(options.onEnded) options.onEnded(self);
    }
    bufferSource.start(0);
    if(options.onReady) options.onReady(self);
    render();
  }
  
  function onAudioDecodeError(){
    if(options.onError) options.onError('Unable to decode audio.');
  }
  
  function render(){
    if(self.isPlaying){
      requestAnimationFrame(render);
      analyzer.getByteFrequencyData(frequency);
      if(options.onData) options.onData(frequency.slice(0,dataMax));
    }
  }
  
  self.play = function(){
    if(!self.isPlaying){
      context.decodeAudioData(fileData, onAudioDecode, onAudioDecodeError);
      
      self.isPlaying = true;
    }
  }
  
  self.stop = function(){
    if(self.isPlaying){
      bufferSource.stop();
      self.isPlaying = false;
    }
  }

  loadFile();
}