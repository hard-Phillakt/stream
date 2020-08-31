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
            width: 800px;
            margin: 30px;
          }
    
          .videoElement__wrapp {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
    
          .videoElement__wrapp .control {
            display: flex;
            justify-content: center;
          }
    
          button {
            cursor: pointer;
            margin: 0 15px;
            padding: 5px 50px;
          }
    
          #play {
            background: green;
            color: #fff;
          }
    
          #pause {
            margin: 0 15px;
            background: red;
            color: #fff;
          }
        </style>
      </head>
      <body>
        <div class="videoElement__wrapp">
          <video id="videoElement"></video>
          <div class="control">
            <button id="play">Play</button>
            <button id="pause">Pause</button>
          </div>
        </div>
    
        <script>
          if (flvjs.isSupported()) {
            var videoElement = document.getElementById("videoElement");
            var flvPlayer = flvjs.createPlayer({
              type: "flv",
              url: "ws://95.213.224.3:5000/cctv/stream.flv",   
            });
            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
          }
    
          var play = document.querySelector("#play");
          var pause = document.querySelector("#pause");
    
          play.onclick = function () {
            flvPlayer.play();
          };
    
          pause.onclick = function () {
            flvPlayer.play();
          };
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
        edge: 'rtsp://operator:Operator46!@188.170.54.115:554/cam/realmonitor?channel=1&subtype=0',
        name: 'stream',
        rtsp_transport: 'tcp' //['udp', 'tcp', 'udp_multicast', 'http']
      },
      // {
      //   app: 'cctv',
      //   mode: 'static',
      //   // edge: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
      //   edge: 'rtsp://freja.hiof.no:1935/rtplive/definst/hessdalen03.stream',
      //   name: 'stream2',
      //   rtsp_transport: 'tcp' //['udp', 'tcp', 'udp_multicast', 'http']
      // },
      // url: "ws://localhost:5000/cctv/stream.flv",
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