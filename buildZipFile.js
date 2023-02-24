const AdmZip = require("adm-zip");
const fs = require("fs");
async function createZipArchive() {
  const zip = new AdmZip();

  //Add manifest
  zip.addLocalFile("manifest.json");

  //Add the dist folder, contains CSS and JavaScript
  zip.addLocalFolder("dist", "dist");
  zip.addLocalFile("content_script.js");

  //Add master style sheet
  zip.addLocalFile("style.css");
  //add logo
  zip.addLocalFile("ravencoin-rvn-logo.png");

  //Add popup.html
  zip.addLocalFile("popup.html");

  //Now output the ZIP file
  const outputFile = "extension.zip";
  zip.writeZip(outputFile);
  console.log(`Created ${outputFile} successfully`);
}

createZipArchive();
