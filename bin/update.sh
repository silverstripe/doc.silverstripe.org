#!/bin/bash

dir=$1

if [ ! "$dir" ]; then
  echo "Usage: $0 /base/folder/to/docs"
  exit 1
fi

#=== FUNCTION ================================================================
# NAME: 		checkout
# DESCRIPTION:	Checks out a specific branch of a module into a folder. Not
#				particular good for taking up space, but at the moment separate
#				folders for each version we need will do.
#
#				The master branch will checked out by default
# PARAMETERS:
#				$1 - module path on github (e.g silverstripe/sapphire.git)
#				$2 - branch name (e.g 3.0)
#				$3 - module name (e.g sapphire)
#
#===============================================================================
# Parameters: github path
function checkout {
	# Create dirs
	if [ ! -d $dir/src ]; then
		mkdir $dir/src
	fi

	if [ ! -d $dir/src/$2_$3 ]; then
		echo "Cloning $1 branch $3"
		cd $dir/src
		git clone -b $3 --depth=100 git://github.com/$1 $dir/src/$2_$3 --quiet
	else
		echo "Updating $2 from branch $3"
		cd $dir/src/$2_$3
		git reset --hard -q
		git fetch origin -q
		git pull -q origin $3
	fi
}

# core
checkout 'silverstripe/silverstripe-framework.git' 'framework' 'master'
checkout 'silverstripe/silverstripe-framework.git' 'framework' '3'
checkout 'silverstripe/silverstripe-framework.git' 'framework' '3.3'
checkout 'silverstripe/silverstripe-framework.git' 'framework' '3.2'
checkout 'silverstripe/silverstripe-framework.git' 'framework' '3.1'
checkout 'silverstripe/silverstripe-framework.git' 'framework' '3.0' 
checkout 'silverstripe/silverstripe-framework.git' 'framework' '2.4'

echo "Done."