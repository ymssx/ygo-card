rm -rf packages/browser/dist/*
rm -rf packages/node/dist/*

npm run build

cd packages/browser
npm publish

cd ../node
npm publish