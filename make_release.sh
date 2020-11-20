bundle exec jekyll build

rm -rv build
mkdir build

cp -vr  _site/assets build
cp -v  _site/index.html build

cd _site
zip -r ../maia-viz.zip index.html assets
