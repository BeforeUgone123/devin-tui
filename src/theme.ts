/**
 * Central style tokens for the entire UI — the ONLY place styling is defined.
 *
 * The palette is data-driven: a `Theme` maps every semantic `Token` and
 * `Bg` region to a truecolor style. The default `mono` theme is grayscale
 * (Devin brand is black & white): depth comes from gray background shades,
 * never hue. Other bundled themes are opt-in (`--theme`,
 * `DEVIN_TUI_THEME`, config.json, `/theme`); `auto` follows the terminal's
 * background (mono on dark, light on light). If the terminal lacks
 * truecolor (COLORTERM not truecolor/24bit) every theme drops to the same
 * attribute-only `MONO` fallback (bold/dim/inverse). Within each theme,
 * hue is allowed only for the picker palette, success/fail dots and diff
 * +/- lines, $ command highlighting, and the bypass-mode tag.
 */

export const TRUECOLOR = /^(truecolor|24bit)$/i.test(process.env.COLORTERM ?? '');

export type Bg =
	| 'bg' // whole screen
	| 'panel' // input panel, user messages
	| 'overlay' // popups
	| 'raised' // inline code, inactive-selected
	| 'sel' // selection row background
	// picker palette — hue exception (Devin CLI /model picker)
	| 'pkSel' // selected model row
	| 'pkBlue' // FREE badge background
	// diff line backgrounds (CLI-matching hue exception)
	| 'diffAdd' // + lines
	| 'diffDel'; // − lines

export type Token =
	| 'plain' // default fg (terminal default in mono)
	| 'text' // body text
	| 'bright' // values, key names
	| 'muted' // labels
	| 'faint' // lowest-emphasis text
	| 'rule' // separators │ ─
	| 'accent' // bright + bold — mode name
	| 'title' // bright + bold — headings, section titles
	| 'strong' // bright + bold — **markdown bold**
	| 'sel' // selection row
	| 'code' // `inline code` — bright on raised
	| 'err' // failures, ✗, −M stats, failed text
	| 'ok' // ✓, completed dots, +N stats
	| 'cmdFlag' // -flags in $ command lines
	| 'cmdString' // "quoted strings" in $ command lines
	| 'thought' // muted italic — thinking
	| 'ghost' // faint — detail/thought tail
	| 'caret' // block cursor
	| 'spin' // muted spinner
	// picker palette (blue accent — allowed hue exception for /model)
	| 'pk' // selected name, chevron, filled bars, effort label
	| 'pkBold' // pk + bold — selected inline-permission row
	| 'pkDim' // pk, dim — ← → arrows
	| 'pkOff' // unfilled bars
	| 'pkGreen' // "New" badge + price-slider low end
	| 'pkYellow' // "Beta" badge + price-slider mid-low + bypass tag
	| 'pkOrange' // price-slider mid-high
	| 'pkPurple' // price-slider high end
	| 'pkBadge' // FREE badge (screen bg on pkBlue)
	// composer frame bezel + working shimmer
	| 'bezelHi' // top/left edge + ╭
	| 'bezelMid' // ╮ ╰ mixed corners
	| 'bezelLo' // bottom/right edge + ╯
	| 'shine1' // shimmer band head
	| 'shine2' // shimmer band mid
	| 'shine3'; // shimmer band tail

export interface StyleDef {
	fg?: string;
	bg?: Bg;
	ansi?: string; // ANSI color keyword used in the non-truecolor fallback
	ansiBg?: string;
	bold?: boolean;
	dim?: boolean;
	italic?: boolean;
	inverse?: boolean;
}

/** A truecolor palette: every token and every background region.
 *  A `null` `Bg` leaves that region unpainted — the terminal's own
 *  background shows through (light uses it for `bg`). */
export interface Theme {
	colors: Record<Token, StyleDef>;
	bgs: Record<Bg, string | null>;
}

/** Default — the grayscale Devin palette. */
const mono: Theme = {
	colors: {
		plain: {},
		text: {fg: '#d4d4d4'},
		bright: {fg: '#ffffff'},
		muted: {fg: '#7a7a7a'},
		faint: {fg: '#4a4a4a'},
		rule: {fg: '#2a2a2a'},
		accent: {fg: '#ffffff', bold: true},
		title: {fg: '#ffffff', bold: true},
		strong: {fg: '#ffffff', bold: true},
		sel: {fg: '#0a0a0a', bg: 'sel'},
		code: {fg: '#ffffff', bg: 'raised'},
		err: {fg: '#e06c6c'},
		ok: {fg: '#3ddc84'},
		cmdFlag: {fg: '#6cb6ff'},
		cmdString: {fg: '#e5a07a'},
		thought: {fg: '#7a7a7a', italic: true},
		ghost: {fg: '#4a4a4a'},
		caret: {fg: '#0a0a0a', bg: 'sel'},
		spin: {fg: '#7a7a7a'},
		pk: {fg: '#4db8ff'},
		pkBold: {fg: '#4db8ff', bold: true},
		pkDim: {fg: '#4db8ff', dim: true},
		pkOff: {fg: '#5f6b78'},
		pkGreen: {fg: '#3ddc84'},
		pkYellow: {fg: '#e6d17a'},
		pkOrange: {fg: '#e5a07a'},
		pkPurple: {fg: '#b48ead'},
		pkBadge: {fg: '#0a0a0a', bg: 'pkBlue'},
		bezelHi: {fg: '#6a6a6a'},
		bezelMid: {fg: '#4a4a4a'},
		bezelLo: {fg: '#2e2e2e'},
		shine1: {fg: '#ffffff'},
		shine2: {fg: '#cfcfcf'},
		shine3: {fg: '#9a9a9a'},
	},
	bgs: {
		bg: '#0a0a0a',
		panel: '#141414',
		overlay: '#1a1a1a',
		raised: '#202020',
		sel: '#e8e8e8',
		pkSel: '#1c2530',
		pkBlue: '#4db8ff',
		diffAdd: '#12261a',
		diffDel: '#2a1414',
	},
};

/** Light grayscale — dark text on the terminal's own background
 *  (`bg` unpainted); region shades for panels, popups, code. */
const light: Theme = {
	colors: {
		plain: {fg: '#2a2a2a'},
		text: {fg: '#2a2a2a'},
		bright: {fg: '#000000'},
		muted: {fg: '#6e6e6e'},
		faint: {fg: '#a3a3a3'},
		rule: {fg: '#d4d4d4'},
		accent: {fg: '#000000', bold: true},
		title: {fg: '#000000', bold: true},
		strong: {fg: '#000000', bold: true},
		sel: {fg: '#fafafa', bg: 'sel'},
		code: {fg: '#000000', bg: 'raised'},
		err: {fg: '#cf222e'},
		ok: {fg: '#1a7f37'},
		cmdFlag: {fg: '#0550ae'},
		cmdString: {fg: '#953800'},
		thought: {fg: '#6e6e6e', italic: true},
		ghost: {fg: '#a3a3a3'},
		caret: {fg: '#fafafa', bg: 'sel'},
		spin: {fg: '#6e6e6e'},
		pk: {fg: '#0969da'},
		pkBold: {fg: '#0969da', bold: true},
		pkDim: {fg: '#0969da', dim: true},
		pkOff: {fg: '#b6c2cf'},
		pkGreen: {fg: '#1a7f37'},
		pkYellow: {fg: '#9a6700'},
		pkOrange: {fg: '#bc4c00'},
		pkPurple: {fg: '#8250df'},
		pkBadge: {fg: '#fafafa', bg: 'pkBlue'},
		bezelHi: {fg: '#8a8a8a'},
		bezelMid: {fg: '#b0b0b0'},
		bezelLo: {fg: '#d4d4d4'},
		shine1: {fg: '#000000'},
		shine2: {fg: '#404040'},
		shine3: {fg: '#737373'},
	},
	bgs: {
		bg: null,
		panel: '#f0f0f0',
		overlay: '#e8e8e8',
		raised: '#dcdcdc',
		sel: '#262626',
		pkSel: '#dbe9fb',
		pkBlue: '#0969da',
		diffAdd: '#dafbe1',
		diffDel: '#ffebe9',
	},
};

/** Nord — Polar Night shades, Snow Storm text, Frost picker accent. */
const nord: Theme = {
	colors: {
		plain: {fg: '#d8dee9'},
		text: {fg: '#d8dee9'},
		bright: {fg: '#eceff4'},
		muted: {fg: '#8891a5'},
		faint: {fg: '#616e88'},
		rule: {fg: '#434c5e'},
		accent: {fg: '#eceff4', bold: true},
		title: {fg: '#eceff4', bold: true},
		strong: {fg: '#eceff4', bold: true},
		sel: {fg: '#2e3440', bg: 'sel'},
		code: {fg: '#eceff4', bg: 'raised'},
		err: {fg: '#bf616a'},
		ok: {fg: '#a3be8c'},
		cmdFlag: {fg: '#81a1c1'},
		cmdString: {fg: '#d08770'},
		thought: {fg: '#8891a5', italic: true},
		ghost: {fg: '#616e88'},
		caret: {fg: '#2e3440', bg: 'sel'},
		spin: {fg: '#8891a5'},
		pk: {fg: '#88c0d0'},
		pkBold: {fg: '#88c0d0', bold: true},
		pkDim: {fg: '#88c0d0', dim: true},
		pkOff: {fg: '#4c566a'},
		pkGreen: {fg: '#a3be8c'},
		pkYellow: {fg: '#ebcb8b'},
		pkOrange: {fg: '#d08770'},
		pkPurple: {fg: '#b48ead'},
		pkBadge: {fg: '#2e3440', bg: 'pkBlue'},
		bezelHi: {fg: '#7b88a1'},
		bezelMid: {fg: '#616e88'},
		bezelLo: {fg: '#4c566a'},
		shine1: {fg: '#eceff4'},
		shine2: {fg: '#d8dee9'},
		shine3: {fg: '#a0aabd'},
	},
	bgs: {
		bg: '#2e3440',
		panel: '#3b4252',
		overlay: '#434c5e',
		raised: '#4c566a',
		sel: '#d8dee9',
		pkSel: '#3e4d61',
		pkBlue: '#88c0d0',
		diffAdd: '#374536',
		diffDel: '#4a3439',
	},
};

export const THEMES = {mono, light, nord} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof THEMES;

export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];

export const DEFAULT_THEME: ThemeName = 'mono';

/** A user preference: a bundled theme, or `auto` (follow the terminal). */
export type ThemePref = ThemeName | 'auto';

export const THEME_PREFS: ThemePref[] = [...THEME_NAMES, 'auto'];

/** One-line descriptions for the /theme picker. */
export const THEME_DESC: Record<ThemeName, string> = {
	mono: 'grayscale (default)',
	light: 'light on terminal bg',
	nord: 'Nord polar night',
};

export function isThemePref(name: string): name is ThemePref {
	return name === 'auto' || Object.hasOwn(THEMES, name);
}

export type TermBg = 'dark' | 'light';

let termBg: TermBg | undefined;
let activePref: ThemePref = DEFAULT_THEME;
let active: Theme = THEMES[DEFAULT_THEME];

/** Record the detected terminal background that `auto` follows. */
export function setTermBg(bg: TermBg | undefined): void {
	termBg = bg;
	if (activePref === 'auto') setTheme('auto');
}

export function terminalBg(): TermBg | undefined {
	return termBg;
}

/** The bundled theme a preference renders with. */
export function themeFor(pref: ThemePref): ThemeName {
	if (pref !== 'auto') return pref;
	return termBg === 'light' ? 'light' : DEFAULT_THEME;
}

/** Switch the palette `segStyle` reads — takes effect on the next render. */
export function setTheme(pref: ThemePref): void {
	activePref = pref;
	active = THEMES[themeFor(pref)];
}

export function themePref(): ThemePref {
	return activePref;
}

/** Truecolor fg of a token in the active theme (gradient stops). */
export function themeFg(t: Token): string | undefined {
	return active.colors[t].fg;
}

/** Non-truecolor fallback — shared by every theme. */
const MONO: Record<Token, StyleDef> = {
	plain: {},
	text: {},
	bright: {bold: true},
	muted: {dim: true},
	faint: {dim: true},
	rule: {dim: true},
	accent: {bold: true},
	title: {bold: true},
	strong: {bold: true},
	sel: {inverse: true},
	code: {inverse: true},
	err: {ansi: 'red'},
	ok: {ansi: 'green'},
	cmdFlag: {ansi: 'blue'},
	cmdString: {ansi: 'yellow'},
	thought: {dim: true, italic: true},
	ghost: {dim: true},
	caret: {inverse: true},
	spin: {dim: true},
	pk: {ansi: 'blueBright'},
	pkBold: {ansi: 'blueBright', bold: true},
	pkDim: {ansi: 'blueBright', dim: true},
	pkOff: {dim: true},
	pkGreen: {ansi: 'green'},
	pkYellow: {ansi: 'yellow'},
	pkOrange: {ansi: 'red'},
	pkPurple: {ansi: 'magenta'},
	pkBadge: {ansi: 'black', ansiBg: 'blueBright'},
	bezelHi: {dim: true},
	bezelMid: {dim: true},
	bezelLo: {dim: true},
	shine1: {bold: true},
	shine2: {},
	shine3: {},
};

/** Ink <Text> props for a token + optional region background override;
 *  `hex` replaces the fg under truecolor only (gradient cells). */
export function segStyle(
	t: Token | undefined,
	bg?: Bg,
	hex?: string,
): {
	color?: string;
	backgroundColor?: string;
	bold?: boolean;
	dimColor?: boolean;
	italic?: boolean;
	inverse?: boolean;
} {
	const d = (TRUECOLOR ? active.colors : MONO)[t ?? 'plain'];
	const out: {
		color?: string;
		backgroundColor?: string;
		bold?: boolean;
		dimColor?: boolean;
		italic?: boolean;
		inverse?: boolean;
	} = {};
	if (TRUECOLOR) {
		if (d.fg) out.color = d.fg;
		if (hex) out.color = hex;
		const b = bg ?? d.bg;
		const v = b ? active.bgs[b] : undefined;
		if (v) out.backgroundColor = v;
	} else {
		if (d.ansi) out.color = d.ansi;
		if (d.ansiBg) out.backgroundColor = d.ansiBg;
		// picker selected row falls back to inverse
		if (bg === 'pkSel') out.inverse = true;
	}
	if (d.bold) out.bold = true;
	if (d.dim) out.dimColor = true;
	if (d.italic) out.italic = true;
	if (d.inverse) out.inverse = true;
	return out;
}

export const VERSION = 'v0.2.0';

export const BRAILLE_LOGO = [
	'⠀⣴⣾⣶⡄⠀⠀⠀⠀',
	'⠀⠛⠿⠟⠻⣶⣾⣶⡄',
	'⠀⣤⣶⣦⣴⠿⢿⠿⠃',
	'⠀⠻⢿⠿⠃⠀⠀⠀⠀',
];

const BIT_LEFT = [0x01, 0x02, 0x04, 0x40];
const BIT_RIGHT = [0x08, 0x10, 0x20, 0x80];

function brailleDot(ch: string | undefined, x: number, y: number): boolean {
	if (!ch) return false;
	const cp = (ch.codePointAt(0) ?? 0) - 0x2800;
	const bit = (x % 2 === 0 ? BIT_LEFT : BIT_RIGHT)[y % 4];
	return (cp & bit) !== 0;
}

/** Decode each braille char to a 2×4 dot grid, nearest-neighbor 2×, re-encode. */
export function scaleBraille2x(rows: string[]): string[] {
	const chars = rows.map(r => [...r]);
	const W = Math.max(...chars.map(r => r.length));
	const H = chars.length;
	const src = (dx: number, dy: number) =>
		brailleDot(chars[Math.floor(dy / 4)]?.[Math.floor(dx / 2)], dx, dy);
	const out: string[] = [];
	for (let cy = 0; cy < H * 2; cy++) {
		let line = '';
		for (let cx = 0; cx < W * 2; cx++) {
			let bits = 0;
			for (let dx = 0; dx < 2; dx++) {
				for (let dy = 0; dy < 4; dy++) {
					const ox = cx * 2 + dx;
					const oy = cy * 4 + dy;
					// nearest neighbor: each output dot maps to half its position
					if (src(Math.floor(ox / 2), Math.floor(oy / 2))) {
						bits |= (dx === 0 ? BIT_LEFT : BIT_RIGHT)[dy];
					}
				}
			}
			line += String.fromCodePoint(0x2800 + bits);
		}
		out.push(line);
	}
	return out;
}

export const LOGO_2X = scaleBraille2x(BRAILLE_LOGO);

export const SPINNER = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

export const TOOL_GLYPHS: Record<string, string> = {
	read: '◇',
	edit: '✎',
	delete: '⌫',
	move: '⇄',
	search: '⌕',
	execute: '$',
	think: '∴',
	fetch: '⇣',
	switch_mode: '⇄',
	other: '·',
};

/** Kind labels for tool calls whose title doesn't start with a Capitalized verb. */
export const TOOL_LABELS: Record<string, string> = {
	read: 'Read',
	edit: 'Edit',
	delete: 'Delete',
	move: 'Move',
	search: 'Search',
	execute: 'Run',
	think: 'Think',
	fetch: 'Fetch',
	switch_mode: 'Switch',
	other: 'Tool',
};

export const PLACEHOLDER =
	'Ask Devin to build features, fix bugs, or work on your code';

export interface Tip {
	key: string;
	text: string;
}

export const TIPS: Tip[] = [
	{key: 'ctrl+p', text: 'opens the command panel'},
	{key: '/', text: 'shows slash commands'},
	{key: 'shift+tab', text: 'cycles agent modes'},
	{key: 'esc', text: 'cancels the running turn'},
	{key: '/help', text: 'lists every command and key'},
	{key: 'ctrl+b', text: 'toggles the plan block'},
];
