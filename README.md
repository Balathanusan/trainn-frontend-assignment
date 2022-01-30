# Trainn-frontend-assignment
##### By Balathanusan Jeyarajah

### Project setup
```
npm install
npm run serve or npm run build
```

### Features Implemented so far:
1. Drag and Drop files or folders directly
2. Upload file button for single file
3. Upload folder button for Directory upload
4. Create new folder button
5. Drag and Move files and folder inside Interface
6. Right click to open context menu
7. Right click on folder to Rename or Delete
8. Right click on file to Delete
9. Right click on Background to create new folder
10. Breadcrumbs for navigation
11. View mode [Grid view or List view]
12. Sorting of files and folder [Name, Large size, Small size, Latest, Oldest]

### Features I wished / not added: 
1. Copying files in the interface
2. Upload files by dropping over the existsing folder
3. Multiple selection of files and folders
4. Calculating folder size
5. While moving items inside subdirectory, hover over the previous breadcrumb to get back of the path hierarchy.
6. Searching files

### How I came this far
At starting i was very confused on choosing the folder/file structure as it can go any deep. We have to choose the structure where only requested folder should be viewed and sub directories should not be loaded.
So i chose only two level of nesting by having, root and childrens as main key. In this structure, be it any number of sub directories, it will be splitted into different nodes by referencing parent node. So maximum it will have two levels of nesting. (Anyway it is only for simulation files structure in local).
To show file preview, i have to read the file first. For that i used indexedDB because file entry cannot be stored in localstorage.
The app state is splitted into two, indexs of Folders and files(localstorage) and fileData(indexDb).
Used Vuex for state management.

### Testing
1. Working in macOs - Chrome
2. Working in macOs - safari with some bugs
3. Working in windows - Chrome
4. Working in windows - Edge

### Note
This might have bugs here and there. As i had less time (hardly 1.5 to 2 days),  i rushed to complete the functionality. So code might not look optimized. 
# Thanks. Happy to hear any Feedback!
