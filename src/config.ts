import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {DEFAULT_THEME, isThemeName, THEME_NAMES, type ThemeName} from './theme.js';

/** User preferences persisted at ~/.config/devin-tui/config.json
 *  (`DEVIN_TUI_CONFIG` overrides the path — tests). */
export interface UserConfig {
	theme?: string;
}

export function configPath(): string {
	return (
		process.env.DEVIN_TUI_CONFIG ||
		path.join(os.homedir(), '.config', 'devin-tui', 'config.json')
	);
}

/** Parsed config.json as an object; missing/unreadable/invalid → {}. */
function readRaw(): Record<string, unknown> {
	try {
		const v: unknown = JSON.parse(fs.readFileSync(configPath(), 'utf8'));
		return v !== null && typeof v === 'object' && !Array.isArray(v)
			? (v as Record<string, unknown>)
			: {};
	} catch {
		return {};
	}
}

export function readConfig(): UserConfig {
	const raw = readRaw();
	return typeof raw.theme === 'string' ? {theme: raw.theme} : {};
}

/** Merge `patch` into config.json, keeping unknown keys. Throws on I/O
 *  failure. */
export function writeConfig(patch: UserConfig): void {
	const file = configPath();
	fs.mkdirSync(path.dirname(file), {recursive: true});
	fs.writeFileSync(file, `${JSON.stringify({...readRaw(), ...patch}, null, 2)}\n`);
}

export interface ThemeChoice {
	name: ThemeName;
	/** set when the requested theme is unknown and `mono` was used */
	warning?: string;
}

/** `--theme` → `DEVIN_TUI_THEME` → config.json `theme` → mono. The first
 *  source that is set wins; an unknown name falls back to the default
 *  with a warning (never throws). */
export function resolveTheme(flag: string | undefined): ThemeChoice {
	const env = process.env.DEVIN_TUI_THEME;
	const [want, source] =
		flag !== undefined
			? [flag, '--theme']
			: env
				? [env, 'DEVIN_TUI_THEME']
				: [readConfig().theme, configPath()];
	if (want === undefined) return {name: DEFAULT_THEME};
	const name = want.trim().toLowerCase();
	if (isThemeName(name)) return {name};
	return {
		name: DEFAULT_THEME,
		warning: `unknown theme "${want}" (from ${source}) — using ${DEFAULT_THEME}; available: ${THEME_NAMES.join(', ')}`,
	};
}
