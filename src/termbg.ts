import type {TermBg} from './theme.js';

const OSC11 = /\x1b\]11;rgb:([0-9a-f]{1,4})\/([0-9a-f]{1,4})\/([0-9a-f]{1,4})/i;
const DA1 = /\x1b\[\?[\d;]*c/;

/** 0–1 relative luminance of an `rgb:RRRR/GGGG/BBBB` reply. */
function luminance(parts: string[]): number {
	const [r, g, b] = parts.map(h => parseInt(h, 16) / (16 ** h.length - 1));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** `COLORFGBG=fg;bg` (rxvt, Konsole, …): bg ANSI index 7 or 9–15 = light. */
function fromColorFgBg(v: string | undefined): TermBg | undefined {
	const bg = Number(v?.split(';').pop());
	if (!v || !Number.isInteger(bg)) return undefined;
	return bg === 7 || (bg >= 9 && bg <= 15) ? 'light' : 'dark';
}

/**
 * Detect the terminal's background: OSC 11 query, fenced by a DA1 query
 * (every terminal answers DA1, so its reply ends the wait even when OSC 11
 * is unsupported), else `COLORFGBG`. Runs before Ink owns stdin; never
 * throws.
 */
export function detectTermBg(timeoutMs = 500): Promise<TermBg | undefined> {
	const fallback = fromColorFgBg(process.env.COLORFGBG);
	const stdin = process.stdin;
	if (!stdin.isTTY || !process.stdout.isTTY) return Promise.resolve(fallback);
	return new Promise(resolve => {
		let buf = '';
		let done = false;
		const finish = () => {
			if (done) return;
			done = true;
			clearTimeout(timer);
			stdin.removeListener('data', onData);
			try {
				stdin.setRawMode(false);
			} catch {
				// not a raw-capable tty
			}
			stdin.pause();
			const m = OSC11.exec(buf);
			resolve(m ? (luminance(m.slice(1, 4)) > 0.5 ? 'light' : 'dark') : fallback);
		};
		const onData = (d: Buffer) => {
			buf += d.toString('latin1');
			if (DA1.test(buf)) finish();
		};
		const timer = setTimeout(finish, timeoutMs);
		try {
			stdin.setRawMode(true);
			stdin.on('data', onData);
			stdin.resume();
			process.stdout.write('\x1b]11;?\x1b\\\x1b[c');
		} catch {
			finish();
		}
	});
}
