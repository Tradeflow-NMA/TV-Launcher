# How to undo Nasrudin Home

Nothing here needs a factory reset. Your TCL launcher is never removed or switched off, so it is always still there to go back to.

## On the TV itself (no PC needed)

- If the Home button override is on, switch it off first (TV Settings → Accessibility → Nasrudin Home – Home button → Off).
- TV Settings → Apps → See all apps → Nasrudin Home → Clear defaults (or Uninstall), then press Home.
- Or: Launcher settings → Use another home screen → pick the TV's own home.
- Switch the Home-button override off: TV Settings → Accessibility → Nasrudin Home – Home button → Off (or uninstall the app).
- Launcher settings → "Open the TV's own home screen" (also in the "Nasrudin Home stopped working" screen) opens it now and pauses the Home-button override for 10 minutes.

## From a PC

Run commands in a Windows terminal. `adb` is at `C:\platform-tools\adb.exe` (use `C:\platform-tools\adb.exe` in place of `adb` if it is not on your PATH). Replace `<TV_IP>` with the TV's IP address (TV Settings > Network). Connect first:

```
adb connect <TV_IP>:5555
```

If the Home button override is on, switch it off first (TV Settings → Accessibility → Nasrudin Home – Home button → Off).

## First: find the TCL home package

Run this once and write down the result. It lists every home screen on the TV; the TCL one is the entry that is not `no.nasrudin.tvhome`.

```
adb -s <TV_IP>:5555 shell cmd package query-activities -a android.intent.action.MAIN -c android.intent.category.HOME --components
```

Look for a line like `com.something.tcl/.HomeActivity`. Below, that is written `<tcl.package/.Activity>`.

## (a) Open the home-app picker

On the TV itself: All Apps → Launcher settings → Use another home screen (or hold OK on the Settings chip). Or from the PC:

```
adb -s <TV_IP>:5555 shell am start -a android.settings.HOME_SETTINGS
```

## (b) Make the TCL launcher the default again

```
adb -s <TV_IP>:5555 shell cmd package set-home-activity <tcl.package/.Activity>
```

This works on Android 10 and newer. If the TV refuses it, use the picker from (a) and choose the TCL launcher.

## (c) Uninstall Nasrudin Home

```
adb -s <TV_IP>:5555 uninstall no.nasrudin.tvhome
```

The TV falls back to the TCL launcher. Your app row layout is deleted with the app.

## (d) Go back to an earlier build

Every build is kept in `releases\` as `nasrudin-home-<N>.apk` (N is the version number). To go back to build 1:

```
adb -s <TV_IP>:5555 install -r -d releases\nasrudin-home-1.apk
```

`-r` replaces the installed one, `-d` allows going to an older version.

Rolling back to builds 1–3 and back again: row changes made while on the old build are not carried forward into the profiles.

## (e) The TV starts into a broken home screen

1. The launcher has a crash guard: after 3 crashes within a minute it shows a "Nasrudin Home stopped working" screen. Choose "Open the TV's own home screen".
2. Otherwise press the Home button on the remote. If Android asks which home screen to use, choose the TCL one.
3. From the PC, start the TCL launcher directly:

```
adb -s <TV_IP>:5555 shell am start -a android.intent.action.MAIN -c android.intent.category.HOME -n <tcl.package/.Activity>
```

4. If it keeps coming back, do (b) or (c).

Also: clearing the app's data (Settings > Apps > Nasrudin Home > Clear data) restores the default app row.

## Do not use

| Command | Why not |
|---|---|
| `pm disable` / `pm disable-user` on the TCL launcher | If the TCL launcher is off and ours breaks, the TV has no home screen to fall back to. |
| `pm hide` on the TCL launcher | Same: it removes your safety net and is hard to undo. |
| `pm uninstall --user 0` on the TCL launcher | Removes the stock home for good on many TVs; only a factory reset brings it back. |
