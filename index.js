const readline = require('readline');
const ansiEscapes = require('ansi-escapes');
const { exec } = require("child_process");

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
};

let input = '';

function keylogic(str, key, d, start){
    switch (key.name){
        case 'c':
            if (key.ctrl) {
                process.exit();
            }
            else {
                try {
                    input += str;
                    process.stdout.write(str);
                } catch {}
            }
            break;
        case 'backspace':
            input = input.slice(0, -1);
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(start + input);
            break;
        case 'return':
            if (input) {
                exec(input, (err, stdout, stderr) => {
                    if (stderr) {
                        process.stdout.write('\n' + stderr);
                        process.stdout.write(start);
                    }
                    else if (stdout) {
                        process.stdout.write('\n' + stdout);
                        process.stdout.write(start);
                    }
                    input = '';
                });
            }
            else {
                process.stdout.write('\n' + start);
            }
            break;
        default:
            if (str) {
                try {
                    input += str;
                    process.stdout.write(str);
                } catch {}
            }
            break;
    }

    let ln = start + input;
    if (input in d) {
        process.stdout.write(`\n${d[input]}`);
        process.stdout.write(ansiEscapes.cursorPrevLine + ansiEscapes.cursorForward(ln.length));
    }
    else if ((input.slice(0, -1)) in d || strcheck(key, input, d)) {
        process.stdout.write('\n');
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(ansiEscapes.cursorPrevLine + ansiEscapes.cursorForward(ln.length));
    }
}

function strcheck(key, input, d){
    for (i in d){
        if (input == i.slice(0, -1) && key.name === 'backspace'){
            return true;
        }
    }
    return false;
}

function key(d, start=''){
    if (!d) throw Error('You need to pass in input and output values');
    start += '> ';
    process.stdout.write(start);
    process.stdin.on('keypress', (str, key) => {
        return keylogic(str, key, d, start);
    });
}

module.exports = key;
