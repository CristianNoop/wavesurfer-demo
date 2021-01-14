import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import WaveSurfer from 'wavesurfer.js'
import * as WaveSurferRegions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import { faPlay, faStepBackward, faStepForward, faStop, faPause, faTrash } from '@fortawesome/free-solid-svg-icons';
import WaveSurferCursor from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js';
import WaveSurferTimeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js';
import { MatSliderChange } from '@angular/material/slider';
import { FileServiceService } from '../file-service.service';
import { FileObject } from '../file-object';



@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @ViewChild('currentTime') currentTimeElement: ElementRef;
  @ViewChild('totalTime') totalTimeElement: ElementRef;
  @ViewChild('commentInput') commentInputElement: ElementRef;
  @ViewChild('loopCheckbox') loopCheckboxElement: ElementRef;
  //
  playbackSpeed: number = 1;
  isPlaying: boolean = false;

  // region
  showComments: boolean = false;
  activeRegion: any = null;

  // from backend
  fileList: FileObject[];

  // fa icons
  faStepBackward = faStepBackward;
  faStepForward = faStepForward;
  faStop = faStop;
  faPlay = faPlay;
  faTrash = faTrash;
  faPause = faPause;

  // wavesurfer
  waveSurfer: any = null;
  leftGain: any = null;
  rightGain: any = null;

  constructor(private fileService: FileServiceService) { }

  loadFile(fileName: string) {
    // For file streaming
    // let audio = document.createElement('audio');
    // audio.src = this.fileService.getBaseUrl() + `/getFile?fileName=${fileName}`;
    // // Set crossOrigin to anonymous to avoid CORS restrictions
    // audio.crossOrigin = 'anonymous';
    // this.waveSurfer.load(audio);

    this.waveSurfer.load(this.fileService.getBaseUrl() + `/getFile?fileName=${fileName}`)
  }

  loadFileList() {
    this.fileService.findAll().subscribe(data => {
      this.fileList = data;
    })
  }

  deleteFile(file: FileObject) {
    // var index = this.fileList.indexOf(file);
    // this.fileList.splice(index,1);
    this.fileService.deleteFile(file.name).subscribe(response => {
      this.loadFileList()
    });
  }

  fileUploadEvent(event: Event) {
    const target= event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.fileService.upload(file).subscribe(response => {
      //console.log(response)
      this.loadFileList();
    })
  }

  fileChangeEvent(event: Event) {
    const target= event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    this.waveSurfer.loadBlob(file);
  }

  togglePlay() {
    // this.waveSurfer.play(this.waveSurfer.getCurrentTime(), this.waveSurfer.getDuration());
    this.waveSurfer.play()
    this.isPlaying = true;
  }

  togglePause() {
    this.waveSurfer.pause();
    this.isPlaying = false;
  }
  
  stopPlayback() {
    this.waveSurfer.stop();
    this.isPlaying = false;
  }

  skipForward() {
    this.waveSurfer.skipForward();
    //NB player stops when skipping
    if (this.isPlaying) {
      this.waveSurfer.play();
    }
  }

  skipBackward() {
    this.waveSurfer.skipBackward();
    //NB player stops when skipping
    if (this.isPlaying) {
      this.waveSurfer.play();
    }
  }

  onLeftVolumeChange(event: MatSliderChange) {
    const value = event.value / 100;
    this.leftGain.gain.value = value;
  }

  onRightVolumeChange(event: MatSliderChange) {
    const value = event.value / 100;
    this.rightGain.gain.value = value;
  }

  onPlaybackSpeedChangeEvent(event: MatSliderChange) {
    const value = event.value;
    this.playbackSpeed = value;
    this.waveSurfer.setPlaybackRate(value)
  }
  updateTotalTime() {
    const time = this.formatSeconds(this.waveSurfer.getDuration());
    this.totalTimeElement.nativeElement.innerText = time;
  }

  updateCurrentTime() {
    const time = this.formatSeconds(Math.floor(this.waveSurfer.getCurrentTime()))
    this.currentTimeElement.nativeElement.innerText = time;
  }

  onCommentsChange() {
    this.activeRegion.comments = this.commentInputElement.nativeElement.value
  }

  toggleLoopRegion(event: any) {
    this.activeRegion.loop = event.target.checked;
  }

  formatSeconds(seconds: number) {
    const format = (val: number) => `0${Math.floor(val)}`.slice(-2)
    const hours = seconds / 3600
    const minutes = (seconds % 3600) / 60

    if(hours >= 1) {
      return [hours, minutes, seconds % 60].map(format).join(':')
    }

    return [minutes, seconds % 60].map(format).join(':')
  }



  ngOnInit(): void {
    // load file list from backend
    this.loadFileList();

    // create wavesurfer object
    this.waveSurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
      splitChannels: true,
      scrollParent: true,
      skipLength: 5,
      // for file streaming
      // backend: 'MediaElementWebAudio',
      plugins: [
        WaveSurferCursor.create({
          showTime: true,
          opacity: 1,
        }),
        WaveSurferRegions.create({
            regions: [],
            dragSelection: {
              // sensitivity to mouse dragging
                slop: 5
            }
        }),
        WaveSurferTimeline.create({
          container: "#timeline"
        })
      ]
    });

    // create volume options for seperate channels
    const splitter = this.waveSurfer.backend.ac.createChannelSplitter(2);
    const merger = this.waveSurfer.backend.ac.createChannelMerger(2);
    this.leftGain = this.waveSurfer.backend.ac.createGain();
    this.rightGain = this.waveSurfer.backend.ac.createGain();
    splitter.connect(this.leftGain, 0);
    splitter.connect(this.rightGain, 1);
    this.leftGain.connect(merger, 0, 0);
    this.rightGain.connect(merger, 0, 1);
    this.waveSurfer.backend.setFilters([splitter, this.leftGain, merger]);

    // on playback finished
    this.waveSurfer.on('finish', () => {
      this.isPlaying = false;
    })

    // on wavesurfer player loaded
    this.waveSurfer.on('ready', () => {
      this.updateTotalTime();

      // disable region dragging (resizing is enough)
      this.waveSurfer.enableDragSelection({
        drag: false,
      })
    })

    // fires continuously on audio playing
    this.waveSurfer.on('audioprocess', () => {
      this.updateCurrentTime();
    })

    this.waveSurfer.on('region-mouseenter', () => {
      this.waveSurfer.toggleInteraction();
    })

    this.waveSurfer.on('region-mouseleave', () => {
      this.waveSurfer.toggleInteraction();
    })

    this.waveSurfer.on('interaction', () => {
      // TODO: When setting the progress bar while playing, interaction shoots too early and gets the last played time..
      this.updateCurrentTime()
    })

    // on region created
    this.waveSurfer.on('region-update-end', (region: any) =>{  

      var regionEl = region.element;
      this.activeRegion = region;
      this.showComments = true;
      this.commentInputElement.nativeElement.value = "";

      // need to know state to prevent click event after delete
      region.isDeleted=false;

      //initialize comments
      if(!region.hasComments) {
        region.comments = "";
        region.hasComments = true;
      }
    
      // add play and delete buttons to region
      if(!region.hasDeleteButton) {    
        var deleteButton = regionEl.appendChild(document.createElement('button'));
        deleteButton.innerHTML = "&#10060";

        deleteButton.addEventListener('click', () => {
          region.remove();
          setTimeout(() => {
            this.waveSurfer.toggleInteraction();
        }, 500);
        });
  
        var css = {
          display: 'block',
          float: 'right',
          cursor: 'pointer',
          color: '#129fdd',
        };
      
        region.style(deleteButton, css);
        region.hasDeleteButton = true;
      }
      regionEl.addEventListener('click', () => {
        // click event still gets fired after region delete
        if(!region.isDeleted) {
          this.activeRegion = region;
          this.showComments = true;
          this.commentInputElement.nativeElement.value = this.activeRegion.comments;
          this.loopCheckboxElement.nativeElement.checked = this.activeRegion.loop;
        }
      })

      region.on('remove', () => {
        this.activeRegion = null;
        this.showComments = false;
        region.isDeleted=true;
      })
    });

  }
}
