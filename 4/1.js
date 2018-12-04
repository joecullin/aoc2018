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

    // Find the guard who slept the most.
    let sleepTotals = [];
    Object.entries(logData).forEach( ([guard,guardLog]) => {
        // console.log(`guard ${guard}`, guardLog);
        let began = 0, slept = 0, totalSlept = 0;
        guardLog.forEach( (logEntry) => {
            if (logEntry.event == 'begins'){
                began = logEntry.minutes;
            }
            else if (logEntry.event == 'falls asleep'){
                slept = logEntry.minutes;
            }
            else if (logEntry.event == 'wakes up'){
                woke = logEntry.minutes;
                totalSlept += (woke - slept);
                slept = 0;
            }
        });
        sleepTotals.push({"guard": guard, "total": totalSlept});
    });
    sleepTotals.sort((a, b) => b.total - a.total);
    let badGuard = sleepTotals[0].guard;

    // Find the bad guard's most frequent naptime.
    let minutes = [];
    minutes[119] = 0; minutes.fill(0,0,120); // initialize to all zeros from 11pm to 12:59am.
    let began = 0, slept = 0, totalSlept = 0;
    logData[badGuard].forEach( (logEntry) => {
        if (logEntry.event == 'begins'){
            began = logEntry.minutes;
        }
        else if (logEntry.event == 'falls asleep'){
            slept = logEntry.minutes;
        }
        else if (logEntry.event == 'wakes up'){
            woke = logEntry.minutes;
            for (var i=slept; i<woke; i++){
                minutes[i]++;
            }
            slept = 0;
        }
    });
    let mostSleptMinute = minutes.indexOf(Math.max(...minutes)) - 60;  // find max, then find index of max, then adjust base to 12:00.
    let answer = badGuard * mostSleptMinute;
    console.log(answer);
});
