# build the demo page to be deploied to the github pages

basePath=$(dirname $0 | xargs realpath)
echo "basePath: $basePath"

# clean the demo repo
cd $basePath/../../gantt-resource-allocator-demo
rm -f index.html
rm -rf assets

cd $basePath/../
npm run build-demo

# then commit and push to the gh-pages branch
