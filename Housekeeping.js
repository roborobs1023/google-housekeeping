/*
Script Title: Google Housekeeping
Version: 1.0
Creation Date: 5/12/2020 
Author: Robert C. Tucker
Description: The Google Drive Housekeeping script is a google script designed to cull through a folder on Google Drive and delete any folders older than a specified date. 
Notes: This Script must be run at script.google.com, unless you have a standard hosted google project with drive api access. 
*/

//GetFolderByDate Function searches for all folders in a single parent folder and returns the Folder IDs in an array called arrFolderIDs.
function GetFolderByDate() {

//Declare all variables.
var arrFolderIDs = [];
var arrFolderNames = [];
var arrLastUpdated = [];
var arrListNames = [];
var arrSearchFolders = [];
var arrIgnoredFolders = [];

//Set Threshold date for removal.
var Threshold = new Date().getTime()-600*1000*24*30;

/* 
30 is the number of days 
(3600 seconds = 1 hour, 1000 milliseconds = 1 second, 24 hours = 1 day and 30 days is the duration you wanted 
Must be in yr-month-day format.
This will give you your Cull Date or Date at which items need to be removed. 
*/

var CullDate = new Date(Threshold);
var strCullDate = Utilities.formatDate(CullDate, "America/New_York", "MMMM-dd-yyyy");

var FolderID = "";
var FolderName = "";
var LastUpdated = "";

var strFolderNames = "";
var strRemovedFolderNames = "";
var strSearchFolders = "";
var strIgnoredFolders = "";

//Replace FolderIDs iin arrSearchFolderIDs with IDs of the folders you wish to search within. This can be obtained by going to your desired folder and copying everything in the URL after https://drive.google.com/drive/folders/

var arrSearchFolderIDs = ['1Lhv1roc77_-iOEAkPMQG3O6xeaOd034X','17Lj8wUSGy21_RIycBG9YkRJOvqSVpGi1'];

Logger.log('\n' + 'CullDate: ' + strCullDate + '\n');

for (var i = 0; i < arrSearchFolderIDs.length; i++) {
  var SearchFolder = DriveApp.getFolderById(arrSearchFolderIDs[I]);     
  var SearchFolderName = SearchFolder.getName();      
  arrSearchFolders.push(SearchFolderName);

  //Set Folder as a variable containing folders within search folder.
  var Folders = SearchFolder.getFolders();
  
  //While statment to search for all folders within the search folder.   
  while (Folders.hasNext()) {
    
    var Folder = Folders.next();
    FolderID = Folder.getId();
    FolderName = Folder.getName();
    LastUpdated = Folder.getLastUpdated();
    
    //Replace Templates with folders you would like the script to ignore and not remove.
    //Put the ID of each Folder into the arrFolderIDs array and the Name for each folder into the FolderNames Array.
    if (FolderName != "Templates"){
      if (LastUpdated < CullDate){
          arrFolderIDs.push(FolderID);
          arrFolderNames.push(SearchFolderName + '/' + FolderName);
          arrLastUpdated.push(LastUpdated);
      }
      //Check if Last Updated date is later than the cull date. If so, push string to array(arrIgnoredFolders).
      if (LastUpdated > CullDate){
        arrIgnoredFolders.push(FolderName + 'Last Updated: ' + Utilities.formatDate(LastUpdated, "America/New_York", "MM-dd-yyyy"));
      }  
    }
  }
} 

//Sort Arrays Alphabetically
arrIgnoredFolders.sort();
arrListNames.sort();
arrSearchFolders.sort();

//Place string of all Ignored folders into an string variable, strIgnoredFolders.
for ( i = 0; i < arrIgnoredFolders.length; i++){
  strIgnoredFolders += '\n' + arrIgnoredFolders[i];
}

//Place string of all Search folders into an string variable, strSearchFolders.
for (var sf = 0; sf < arrSearchFolders.length; sf++){
  strSearchFolders += '\n' + arrSearchFolders[sf];
}    

//Place change date of all selected folders into an string variable, strChangeDate.
//Arrange Folder Name and Last Updated into array for later use.
for (i = 0; i < arrFolderNames.length; i++){
  var strChangedDate = Utilities.formatDate(arrLastUpdated[i], "America/New_York", "MM-dd-yyyy");
  
  arrListNames.push(arrFolderNames[f] + ' Last Modified: ' + strChangedDate); 
}

//Convert array of Removed Folders (arrListNames) to string (strRemovedFolderNames).
for (i = 0; i < arrFolderIDs.length; i++) {
  strRemovedFolderNames += '\n' + arrListNames[i];

}

Logger.log('\n' + '\n' + 'Ignored Folders: ' + strIgnoredFolders + '\n' + '\n');//List of Ignored Folders
Logger.log('\n' + '\n' + 'Search Folders: ' + strSearchFolders + '\n' + '\n'); //List of folders searched.
Logger.log('\n' + '\n' + 'Folders: ' + strRemovedFolderNames + '\n' + '\n'); //List of all Folders to be removed within Search Folder and Date last updated for each folder.

//For each value in array arrFolderIDs output Folder Name to be removed to log.     
for (i = 0; i < arrFolderIDs.length; i++) {
    strFolderNames += '\n' + arrFolderNames[i];
  }

Logger.log('\n' + '\n' + 'Folders To Be Removed: ' + strFolderNames + '\n'); //List all Folders to be removed. 

return arrFolderIDs;

};

//Funtion to Empty Trashcan.
function emptydrivetrash() {
  Drive.Files.emptyTrash();
}

//Main Function to Delete old folders to trashcan per schedule.
function DeleteFolderByDate() {

  //Retrieves arrFolderID array into an array variable arrayIDs
  var arrayIDs = GetFolderByDate();
  
  //Sets new Date for removal - Settings below show for 15 days after initial run. - triggered by seperate trigger in scripts dashboard.
  var RunDate = new Date().getTime()+3600*1000*24*15;
  var RemovalDate = new Date(RunDate);
  var strRemovalDate = Utilities.formatDate(RemovalDate, "America/New_York", "MMMM dd, yyyy");
  /* 
  30 is the number of days 
  (3600 seconds = 1 hour, 1000 milliseconds = 1 second, 24 hours = 1 day and 30 days is the duration you wanted
  needed in yr-month-day format
  */

  for (var i = 0; i < arrayIDs.length; i++) {
  //  Logger.log('arrayIDs[i]: ' + arrayIDs[i]);     
    var DelResponse = DriveApp.getFolderById(arrayIDs[i]).setTrashed(true);
  }
  
  //Send email to Administrator - Replace email with that of the desired contact. Email will come from the google account associated with the script.
  var recipient = "rtucker@cmslaser.com";
  var subject = 'Folders to be Removed from Google Drive on ' + strRemovalDate;
  var body = Logger.getLog();
  MailApp.sendEmail(recipient, subject, body);

};