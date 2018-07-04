/**
 * Node File system
 */
const fs = require('fs');

/**
 * Parses file names
 */
const path = require('path');

/**
 * Allows us to filter out junk files in our results
 */
const junk = require('junk');

/**
 * Handles the actual file conversion of individual files
 * @type {FileConverter}
 */
const FileConverter = require('./FileConverter');

/**
 * converts files from a directory
 */
class MultiFileConverter{
  constructor(args = {}){
    //Set the argument object
    const defaults = {
      directory: false,
      formats: false
    };
    this.args = Object.assign(args, defaults);

    //Construct from the args object
    this.formats = this.args.formats;
    this.directory = this.args.directory === false ? `${path.dirname(require.main.filename)}/files-to-convert/` : this.args.directory;
  }

  /**
   * Constructs the files object
   * @returns {*}
   */
  getFiles(){
    if(this.files) return this.files;
    this.files = [];
    const files = fs.readdirSync(this.directory, {});
    //Loop through and construct the files from the specified directory
    files.filter(junk.not).forEach((file) =>{
      this.files.push(new FileConverter(this.directory + file, false, this.formats));
    });

    return this.files;
  }

  /**
   * Loops through and converts files
   */
  getVideos(){
    return this.getFiles().forEach(file => file.convert());
  }

  /**
   * Loops through and gets the screenshots
   */
  getScreenshots(){
    return this.getFiles().forEach(file => file.getScreenshots())
  }

  /**
   * Runs the complete converter, converting files and getting screenshots
   */
  runConverter(){
    return this.getFiles().forEach((file) =>{
      file.convert();
      file.getScreenshots();
    });
  }
}

module.exports = MultiFileConverter;