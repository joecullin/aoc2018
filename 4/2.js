#!/usr/local/bin/node

const getInput = () => {
    return new Promise( (resolve, reject) => {
        let logData = {};
        const getStdin = require('get-stdin');
        getStdin().then(input => {
            let lines = input.split("\n").sort();
            let guardRE = /^\[(\d\d\d\d-\d\d-\d\d \d\d:\d\d)\] Guard #(\d+) begins shift/;
            let eventRE = /^\[(\d\d\d\d-\d\d-\d\d \d\d:\d\d)\] ([wf].*)/;
            let minutesRE = /^\d\d\d\d-\d\d-\d\d (\d\d):(\d\d)/;
            let guard = 0;
            lines.forEach( (line) => {
                let event = '';
                let timestamp = '';
                let guardMatch = line.match(guardRE);
                let eventMatch = line.match(eventRE);
                if (guardMatch != null){
                    timestamp = guardMatch[1];
                    guard = guardMatch[2];
                    event = 'begins';
                }
                else if (eventMatch != null){
                    timestamp = eventMatch[1];
                    event = eventMatch[2];
                }
                let timestampData = timestamp.match(minutesRE);
                let hour = parseInt(timestampData[1]);
                let minutes = parseInt(timestampData[2]);
                // we can ignore year, month, and day by using an offset from 11pm.
                let minutesSince11pm = hour==11 ? minutes : (60 + minutes);
        
                if (logData[guard] === undefined){
                    logData[guard] = [];
                }
                logData[guard].push({
                                    "timestamp": timestamp,
                                    "minutes": minutesSince11pm,
                                    "event": event
                                });
            });
            resolve(logData);
        });
    });
}

getInput()
.then( (logData) => {
    let sleepiestMinute = [];
    Object.entries(logData).forEach( ([guard,guardLog]) => {
        let minutes = [];
        minutes[119] = 0; minutes.fill(0,0,120); // initialize to all zeros from 11pm to 12:59am.
        let slept = 0, woke = 0;
        guardLog.forEach( (logEntry) => {
            if (logEntry.event == 'falls asleep'){
                slept = logEntry.minutes;
            }
            else if (logEntry.event == 'wakes up'){
                woke = logEntry.minutes;
                for (var i=slept; i<woke; i++){
                    minutes[i]++;
                }
            }
        });
        sleepiestMinute.push({
                    "guard": guard,
                    "minute": minutes.indexOf(Math.max(...minutes)) - 60,  // index of max, then back to midnight base.
                    "count": Math.max(...minutes)
                    });
    });
    sleepiestMinute.sort((a, b) => b.count - a.count);
    let answer = sleepiestMinute[0].guard * sleepiestMinute[0].minute;
    console.log(answer);
});
