/*
Script Title: Google Housekeeping - Clean Folder Names
Version: 1.0
Creation Date: 5/22/2020 
Author: Robert C. Tucker
Description: The Google Drive Housekeeping - Clean Folder Names script is a google script designed to cull through a folder on Google Drive and remove punctuation from Folder Names. 
Notes: This Script must be run at script.google.com, unless you have a standard hosted google project with drive api access. 
*/


function CleanFolderNames (folder) {
  //Declare all variables.
  var SearchFolder = "";
  var FolderID = "";
  var FolderName = "";
    
  //Replace FolderIDs iin arrSearchFolderIDs with IDs of the folders you wish to search within. This can be obtained by going to your desired folder and copying everything in the URL after https://drive.google.com/drive/folders/
    
  var arrSearchFolderIDs = [
    '1Lhv1roc77_-iOEAkPMQG3O6xeaOd034X',
    '17Lj8wUSGy21_RIycBG9YkRJOvqSVpGi1'
  ];

 for (var i = 0; i < arrSearchFolderIDs.length; i++) {
    SearchFolder = DriveApp.getFolderById(arrSearchFolderIDs[i]);
      
    var SearchFolderName = SearchFolder.getName();      
    arrSearchFolders.push(SearchFolderName);
  
    //Set Folder as a variable containing folders within search folder.
    var Folders = SearchFolder.getFolders();
    
    //While statment to search for all folders within the search folder.   
    while (Folders.hasNext()) {
        
      var Folder = Folders.next();
      FolderID = Folder.getId();
      FolderName = Folder.getName();
      
      //Replace Templates with folders you would like the script to ignore and not remove.
      //Put the ID of each Folder into the arrFolderIDs array and the Name for each folder into the FolderNames Array.
      if (FolderName != "Templates"){
        var hasFolder = Folder.getFolders().hasNext();               // get the list of files in the root of that folder
        
      //  Logger.log ('\n' + "Search Folder: " + FolderName)
      //Determine if a Folder has child Folders or not. If not, Check Folder name for periods and rename folder if periods found. 
        if (!hasFolder) {   
          Logger.log ('\n' + "Folder name is: " + FolderName)         
          var strCleanName = FolderName.replace(/[.]/g, "");
          Folder.setName(strCleanName)
          FolderName = Folder.getName();
          Logger.log ('\n' + FolderName + " Has No Child Folders and has had all . removed from name.(CleanFolderNames)" + '\n')
          
        }
      //If Folder has child folder add folder ID to the arrSearchFolderIDs array and continue.
        if (hasFolder){
          Logger.log ('\n' + FolderName + "Folder has child folders. Added to Search Array")
          arrSearchFolderIDs.push(FolderID);
        }
      }
    }
  }
    return arrSearchFolderIDs
}