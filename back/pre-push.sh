#!/bin/sh
echo "executing pre-push"
git stash -q --keep-index
./run_tu.sh
RESULT=$?
echo "exit "$RESULT
git stash pop -q
[ $RESULT -ne 0 ] && exit 1
exit 0
