# Nasrudin Home

Android TV home-screen launcher (`no.nasrudin.tvhome`). See `docs/spec.md`.

Build (JDK 17): `gradlew.bat assembleDebug testDebugUnitTest`

Keep a rollback copy: `gradlew.bat copyApk` writes `releases/nasrudin-home-<versionCode>.apk`
(APKs stay on disk, git-ignored). Bump `versionCode` in `app/build.gradle.kts` per build.

Home screen design ported from couch-tv by Seagey, MIT licence (https://github.com/Seagey/couch-tv), see `licenses/couch-tv-MIT.txt`.
Fonts: Inter and Antonio, SIL OFL, see `licenses/OFL-Inter.txt` and `licenses/OFL-Antonio.txt`.
Wallpaper: photo by Tom Moser on Unsplash (https://unsplash.com/photos/uR6VahqorEk).
