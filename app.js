const NodeMediaServer = require('node-media-server');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 80;

const app = express();

app.get('/', (req, res) => {

  res.end(`
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js"></script>
        <style>
            video {
                width: 600px;
                margin: 30px;
            }
    
            .videoElement__wrapp {
                display: flex;
            }
        </style>
      </head>
      <body>
        
        <div class="videoElement__wrapp">
            <video id="videoElement"></video>
    
            <video id="videoElement2"></video>
        </div>
    
    
        
      <script>
        if (flvjs.isSupported()) {
          var videoElement = document.getElementById("videoElement");
          var flvPlayer = flvjs.createPlayer({
            type: "flv",
            url: "ws://95.213.224.3:5000/cctv/stream.flv",
            //url: "ws://localhost:5000/cctv/stream.flv",
          });
          flvPlayer.attachMediaElement(videoElement);
          flvPlayer.load();
        }
  
        var videoElementBnt = document.querySelector('#videoElement');
        videoElementBnt.onclick = function(){
          flvPlayer.play();
        }
  
  
        if (flvjs.isSupported()) {
          var videoElement2 = document.getElementById("videoElement2");
          var flvPlayer2 = flvjs.createPlayer({
            type: "flv",
            url: "ws://95.213.224.3:5000/cctv/stream2.flv",
            //url: "ws://localhost:5000/cctv/stream2.flv",
          });
          flvPlayer2.attachMediaElement(videoElement2);
          flvPlayer2.load();
        }
  
        var videoElement2Bnt = document.querySelector('#videoElement2');
        videoElement2Bnt.onclick = function(){
          flvPlayer2.play();
        }
  
        </script>
      </body>
    </html>
  `);

});

app.listen(PORT, () => {
  console.log('server is start...');
})

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 5000,
    allow_origin: '*'
  },
  relay: {
    ffmpeg: `/usr/bin/ffmpeg`,
    // ffmpeg: 'C:/Users/mds/Desktop/media/ffmpeg.exe',
    tasks: [
      {
        app: 'cctv',
        mode: 'static',
        // edge: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
        edge: 'rtsp://freja.hiof.no:1935/rtplive/definst/hessdalen03.stream',
        name: 'stream',
        rtsp_transport: 'tcp' //['udp', 'tcp', 'udp_multicast', 'http']
      },
      {
        app: 'cctv',
        mode: 'static',
        // edge: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
        edge: 'rtsp://freja.hiof.no:1935/rtplive/definst/hessdalen03.stream',
        name: 'stream2',
        rtsp_transport: 'tcp' //['udp', 'tcp', 'udp_multicast', 'http']
      },
      // {
      //   app: 'cctv',
      //   mode: 'static',
      //   // edge: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
      //   edge: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
      //   name: 'BigBuckBunny',
      //   rtsp_transport: 'tcp' //['udp', 'tcp', 'udp_multicast', 'http']
      // },
      // {
      //   app: 'mv',
      //   mode: 'static',
      //   edge: 'C:/Users/mds/Desktop/media-stream/1.mp4',
      //   name: 'dq'
      // }
    ]
  }
};

var nms = new NodeMediaServer(config)
nms.run();