/*
Script Title: Google Housekeeping - ConvertFiles to PDF
Version: 1.0
Creation Date: 5/22/2020 
Author: Robert C. Tucker
Description: The Google Drive Housekeeping - ConvertFiles to PDF script is a google script designed to cull through a folder on Google Drive and convert Google Docs to PDF files
for syncing to local server. 
Notes: This Script must be run at script.google.com, unless you have a standard hosted google project with drive api access. 
*/

function ConvertFilesToPDF(folder, file) {

    //Declare all FolderIDs iin arrSearchFolderIDs. Replace with IDs of the folders you wish to search within. 
    //This can be obtained by going to your desired folder and copying everything in the URL after https://drive.google.com/drive/folders/
    var arrSearchFolderIDs = [
    //'1Lhv1roc77_-iOEAkPMQG3O6xeaOd034X',
    '17Lj8wUSGy21_RIycBG9YkRJOvqSVpGi1'
    ];
  
    for (var i = 0; i < arrSearchFolderIDs.length; i++) {
      var SearchFolder = DriveApp.getFolderById(arrSearchFolderIDs[i]);
      
      //Set Folder as a variable containing folders within search folder.
      var Folders = SearchFolder.getFolders();
    
      //While statment to search for all folders within the search folder.   
      while (Folders.hasNext()) {
        
        var Folder = Folders.next();
        var FolderID = Folder.getId();
        var FolderName = Folder.getName();
  
        var hasFolder = Folder.getFolders().hasNext();     // get the list of folders in the root of that folder       
  
        //Replace Templates with folders you would like the script to ignore and not remove.
        if (FolderName != "Templates"){
            //Get all google docs by File Type 
            var Files = Folder.getFilesByType(MimeType.GOOGLE_DOCS);
            while (Files.hasNext()){
                Logger.log ('\n' + "Search Folder: " + FolderName)
                Logger.log ('\n' + FolderName + "Folder has no child folders.")
    
                var gdoc = Files.next();
                var FileID = gdoc.getId();
                var FileName = gdoc.getName();
    
                Logger.log ('\n' + FileName + " is being converted to PDF for sync to Server." + '\n' + "File ID: " + FileID)
                
                //Convert to PDF
                var docPDF = DocumentApp.openById(FileID).getAs('application/pdf').setName(FileName);
                Folder.createFile(docPDF);
                var PDFName = docPDF.getName();
    
                Logger.log ('\n' + "PDF Converted" + '\n' + "PDF Name: " + PDFName + ".pdf");
                
                //Delete original File
                gdoc.setTrashed(true);        
            }
        if (hasFolder){
          //Logger.log ('\n' + FolderName + "Folder has child folders. Added to Search Array")
          arrSearchFolderIDs.push(FolderID);
        }
        }
      }
    }
  //Send email to Administrator - Replace email with that of the desired contact. Email will come from the google account associated with the script.
  var recipient = "rtucker@cmslaser.com";
  var subject = 'Files have been converted to PDFs.';
  var body = Logger.getLog();
  MailApp.sendEmail(recipient, subject, body); 
  
  }