// Create a solution that will store event occurrences in memory and enable event counts
// to be retrieved across a set of time slices given a start time, end time, and slice
// duration.  All time values are to be represented as integers (assume milliseconds
// since some "epoch").  You may assume that all events are added sequentially (i.e.
// you do not need worry about concurrency) and in order.  More than one event can
// occur at the same time.  The startTime is inclusive and the endTime is exclusive.

// store model
// {
// '44': {
//     'click': 2,
// },
// '45': {
//     'scroll': 1
// },
// '46': {
//     'click': 1
// }
// }

// store events and their number of occurrences
const store = {} 

function addEvent(event, time) {
  if (!event || !time) return undefined;

  // if the timestamp doesn't exist in store yet, add it with 1 event occurance
  if (!store[time]) {
    store[time] = {
      [event]: 1
    }
  } 
  // if the timestamp already exists in the map, check its contents
  else {
    // if the timestamp doesn't include this event yet, initialize at 1
    if (!store[time][event]) {
      store[time][event] = 1
    } 
    // if the timestamp already includes an occurence of this event, increment by 1
    else {
      store[time][event]++;
    }
  }
}

function countEvents(event, startTime, endTime, sliceDuration) {
  if (endTime < startTime) return undefined;
  if (startTime < 0 || endTime < 0) return undefined;
  if (sliceDuration <= 0) return undefined;
  
  let numSlices = (endTime - startTime) / sliceDuration;
  const slices = [];
  const results = [];
  let start = startTime;

  if (startTime === endTime) numSlices = 1;

  // generate a 2d array with slices[timestamps[]]
  // ex: [[40,41,42], [43,44]]
  for (var i = 0; i < numSlices; i++) {
    let sliceEnd;

    // set sliceEnd and ensure we don't go out of bounds
    if ((start + sliceDuration - 1) >= endTime) {
      sliceEnd = endTime - 1;
    } else {
      sliceEnd = start + sliceDuration - 1;
    }

    // add each 1s timestamp into the nested array
    const slice = [];
    for (var j = start; j <= sliceEnd; j++) {
      slice.push(j);
    }

    // add each slice into the parent array
    slices.push(slice);

    // move the start forward for the next slice
    start = start + sliceDuration;
  }

  // For each slice and each timestamp, look into the storage map and count how many occurrences of the desired event
  slices.forEach(slice => {
    let occurrences = 0;

    slice.forEach(timestamp => {
        if (store[timestamp]) {
          if (store[timestamp][event]) {
            occurrences = occurrences + store[timestamp][event];
          }
        }
    })

    results.push(occurrences);
  })

  return results;
}


  // Sample usage:
addEvent('refresh', 42);
addEvent('click', 44);
addEvent('click', 44);
addEvent('scroll', 45);
addEvent('click', 46);

console.log(countEvents('click', 40, 50, 5));
// returns [2, 1]
console.log(countEvents('scroll', 40, 50, 5));
// returns [0, 1]
console.log(countEvents('refresh', 40, 50, 5));
// returns [1, 0]
console.log(countEvents('refresh', 40, 44, 3));
// returns [1, 0]
console.log(countEvents('refresh', 42,42,1));
// returns [0] (endTime is exclusive)
console.log(countEvents('refresh', 42, 43, 1));
// returns [1]
console.log(countEvents('click', 40, 49, 6))
// returns [2, 1]
console.log(countEvents('click', 40,50, 1));
// returns [0,0,0,0,2,0,1,0,0,0]
console.log(countEvents('click', -10, -200, 5));
// returns undefined (invalid times)
console.log(countEvents('click', 40, 50, 0));
// returns undefined (invalid slice duration)
console.log(countEvents('click', 50,40,1));
// returns undefined (invalid range)
