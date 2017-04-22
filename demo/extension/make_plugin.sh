# File Watcher to build Chrome Plugin
#
# Arguments:
# "$ProjectFileDir$" "$FileDirRelativeToProjectRoot$"
#
# $ProjectFileDir$ must be in the form:
# /home/alykoshin/projects/odesk/5 -  WebRTC for TeleHealth/source
#
# $FileDirRelativeToProjectRoot$ must be in the form:
# plugins/desktopCapture/source
# to extract 2nd level directory to find out the name of plugin
#

#ProjectFileDir=$1
#FileDirRelativeToProjectRoot=$2
ProjectFileDir="."
#FileDirRelativeToProjectRoot="plugins/desktopCapture/source"

#pluginname=`echo "$FileDirRelativeToProjectRoot" | cut -d "/" -f 2`
pluginname=inline-install-demo
echo "Plugin name: $pluginname"

#_basedir="/home/alykoshin/projects/odesk/05-WebRTC for TeleHealth/source/plugins/desktopCapture"
#basedir="$ProjectFileDir"/plugins/$pluginname
basedir=.

#dir=`echo $ProjectFileDir | cut -d "/" -f 3`

sourcedir="$basedir/source"
outputdir="$basedir/output"
backupdir="$basedir/backup"


#basedir=`dirname "$sourcedir"`

fname=pluginname
#fname=desktopCapture
#
echo === Archiving Chrome Extension...

mkdir -p "$backupdir"

now=$(date +"%Y%m%d-%H%M%S")

#if [ -f "$sourcedir"/key.pem ]; then
#  rm
#fi

# -d   delete entries in zipfile
# -j   junk (don't record) directory names
# -r   recurse into directories
zip -j -r "$outputdir/$fname-$now.zip" "$sourcedir"

cp "$outputdir/$fname-$now.zip" "$backupdir/$fname-$now.zip"

echo === Packing Chrome Extension...

mkdir -p "$outputdir"
if [ -f "$sourcedir"/key.pem ]; then
  google-chrome --pack-extension="$sourcedir" --pack-extension-key="$outputdir/$fname.pem"
else
  google-chrome --pack-extension="$sourcedir"
  mv "$basedir/source.pem" "$outputdir/$fname.pem"
fi
mv "$basedir/source.crx" "$outputdir/$fname.crx"

echo === Result files:

ls "$outputdir/$fname-$now.zip"
ls "$outputdir/$fname.crx"
