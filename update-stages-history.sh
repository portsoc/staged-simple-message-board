#!/bin/bash

if ! git diff-index --quiet HEAD --
then
    echo "there are uncommitted changes in the working copy, bailing"
    exit 1
fi

stagesdir=stages
branch=stages
branchprep="${branch}-prep"

# branchprep is the name of the branch we'll delete, create; and the directory in which we'll work too

# move stages out to prepare a clean commit
rm -rf ./"$branchprep"
mkdir ./"$branchprep"
mv ./"$stagesdir"/*/ ./"$branchprep"
rm -rf ./"$stagesdir"
mkdir ./"$stagesdir"

echo -e "\n$branchprep" >> .gitignore

# start the branch
git branch -D "$branchprep"
git checkout -b "$branchprep"
git add -A ./"$stagesdir"
git commit -m "empty starting point"

for dir in ./"$branchprep"/*/
do
  stagename=$(basename ${dir})
  rm -rf ./"$stagesdir"
  mkdir ./"$stagesdir"
  mv "$dir"/* ./"$stagesdir"/
  mv "$dir"/.??* ./"$stagesdir"/

  git add -A ./"$stagesdir"
  git commit -m "stage ${stagename}"
  git tag -f -a "stage-$stagename" -m "stage $stagename"
done

git branch -D "$branch"
git branch -m "$branch"


git checkout -- .gitignore

echo
echo "done, branch ${branch} created"
echo "you probably want to do the following:"
echo
echo "git push -f --set-upstream origin ${branch} --tags"
echo "git checkout master"
