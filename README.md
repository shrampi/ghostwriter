# cowriter
Text suggestion from your favorite public domain authors

## Features
- App inserts words as you type them from a specified source
  - select your 'cowriter', type in the box, press enter. Can also have the app suggest a first word, or continue adding words.
  - Click on any word to see a list of cowriter suggestions organized by probability
 
 - It should dynamically load and process texts - could we visualize this process? 

## Algorithm

Parse the text into an array by word/punctuation.

We create a successors table keyed by word.
Word.total tells us the total count of words that follow it. 
Word.next gives us the succeeding words, along with their weights. 

{
  ...
  big: {
    total: 7,
    successors: {
      dog: 2,
      cat: 4,
      hat: 1
    }
  }
  ...
}


First word always added to '.', meaning it's the beginning of a sentence. 

for each word currentWord in the array:
  check if currentWord is in our dict 
    if not, add it
  If currentWord is in prevWord.successors, increase it's weight and the prevWord total
  If not, add it (and increment prevWord.total)

DON'T add punctuation to successors. Let the user decide when to put in commas, periods, etc. 

After creating this weighted successor table, we need to sort each successors object by weights. 
- if this takes too long, only sort each one when getSuccessor() is called on that respective word. Have a flag or something saying 'isSorted'. 

getSuccessor(word) {
  let r be a random num between [0, word.total)
  for each thing in word.successors, check if their weight is greater than r
    if so, return it
  return the final word
}
