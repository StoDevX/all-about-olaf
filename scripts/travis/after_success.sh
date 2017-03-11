#!/bin/bash
set -ev

# todo: test this on a forked build w/maintainer access to the branch
if [[ $JS && $TRAVIS_PULL_REQUEST != false && $PUSH_BRANCH = 1 ]]; then
  set -x
  git checkout "$BRANCH"
  git push "$SSH_REPO" "$BRANCH"
  git checkout "$TRAVIS_COMMIT"
  set +x
fi

if [[ $JS ]]; then
  set -x
  npm install coveralls
  ./node_modules/.bin/coveralls < ./coverage/lcov.info
  set +x
fi
