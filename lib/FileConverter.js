/**
 * Parses file names
 */
const path = require('path');

/**
 * Node File system
 */
const fs = require('fs');

/**
 * Handles the actual file conversion
 */
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobePath);

/**
 * Converts files and takes screenshots
 */
class FileConverter{

  constructor(inputPath, outputPath = false, formats = false){
    this.formats = formats === false ? ['ogv', 'webm', 'mp4'] : formats.split(',');
    this.file = path.basename(inputPath);
    this.format = path.extname(this.file);
    this.fileName = path.parse(this.file).name;
    this.conversion = ffmpeg(inputPath);
    this.outputPath = outputPath === false ? `${path.dirname(require.main.filename)}/converted-files/${this.fileName}` : `${outputPath}/${this.fileName}`;
  }

  /**
   * Converts the file into the specified formats
   */
  convert(){
    fs.mkdir(this.outputPath,() =>{

      //Loop through file formats
      this.formats.forEach((fileFormat) =>{
        //Check to see if the current file format matches the given file's format
        if(`.${fileFormat}` !== this.format){
          //Start the conversion
          this.conversion.output(`${this.outputPath}/${this.fileName}.${fileFormat}`)
            .on('end', () => console.log(`${this.file} has been converted to a ${fileFormat}`))
            .on('start', () =>{
              console.log(`${this.fileName}.${fileFormat} conversion started`);
            })
        }

        //If the file format matches the file's format, skip it and let us know.
        else{
          console.log(`Skipping ${this.fileName} conversion to ${fileFormat} as this file is already in the ${fileFormat} format.`);
        }
      });

      this.conversion.run();
    });
  }

  /**
   * Creates 6 screenshots taken throughout the video
   */
  getScreenshots(){
    this.conversion
      .on('filenames', filenames => console.log(`\n ${this.fileName} Will generate 6 screenshots, ${filenames.join('\n ')}`))
      .on('end', () =>{
        console.log(`\n Screenshots for ${this.fileName} complete.\n`)
      })
      .screenshots({
        count: 6,
        timestamps: [2, 5, '20%', '40%', '60%', '80%'],
        folder: this.outputPath,
        filename: `${this.fileName}-%s.png`
      })

  }
}

module.exports = FileConverter;