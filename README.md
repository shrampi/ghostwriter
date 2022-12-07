# GhostWriter
Text suggestion from your favorite public domain authors

## Features
- App inserts words as you type them from a specified source
  - select your 'cowriter', type in the box, press enter. Can also have the app suggest a first word, or continue adding words.
  - Click on any word to see a list of cowriter suggestions organized by probability
 
 - It should dynamically load and process texts - could we visualize this process? 

## Issues
- figuring out the best data structure for the successor table weighted collection
- deciding where to put state / where to lift
- getting around CORS
- managing performance and bandwidth with such large JSON objects (what to send over network, what to store on user's pc, etc.)
- choosing whether to make something an effect hook, or make explicit calls