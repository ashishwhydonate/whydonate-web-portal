# !/bin/bash
if [ "$CF_PAGES_BRANCH" == "main" ]; then
  # Run the "production" script in `package.json` on the "production" branch
  # "production" should be replaced with the name of your Production branch
  npm run build-prod

elif [ "$CF_PAGES_BRANCH" == "master" ]; then
  npm run build-master


elif [ "$CF_PAGES_BRANCH" == "develop" ]; then
  # Run the "staging" script in `package.json` on the "staging" branch
  # "staging" should be replaced with the name of your specific branch
  npm run build-staging

elif [ "$CF_PAGES_BRANCH" == "features" ]; then
  npm run build-features

else
  # Else run the dev script
  npm run build-staging
fi
