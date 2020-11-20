bundle exec jekyll build

cd _site
zip -r ../maia-viz.zip index.html assets
