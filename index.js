const readline = require('readline');
const ansiEscapes = require('ansi-escapes');
const { exec } = require("child_process");

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
};

let start = '> ';
process.stdout.write(start);

let d = {
    "hello": "hi there",
    "bye": "see you"
};

let input = '';

process.stdin.on('keypress', (str, key) => {
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
            try {
                input += str;
                process.stdout.write(str);
            } catch {}
            break;
    }

    if (input in d) {
        let ln = start + input;
        process.stdout.write(`\n${d[input]}`);
        process.stdout.write(ansiEscapes.cursorPrevLine + ansiEscapes.cursorForward(ln.length));
    }
    else {
        let ln = start + input;
        process.stdout.write('\n');
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(ansiEscapes.cursorPrevLine + ansiEscapes.cursorForward(ln.length));
    }
});
