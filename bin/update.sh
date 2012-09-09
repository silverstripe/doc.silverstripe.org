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
	if [ ! -d $dir/src/$3 ]; then
		echo "Cloning $1 "
		cd $dir/src
		git clone --depth=100 -q git://github.com/$1 $3 --quiet
		cd $3
		git checkout master -q
	else
		cd $dir/src/$3
		git pull -q
		git checkout master -q
	fi

	echo "Checking out $2 from $1 into $3_$2"

	if [ -d $dir/src/$3_$2 ]; then
		cd $dir/src/$3_$2
	else
		cp -R $dir/src/$3 $dir/src/$3_$2
		cd $dir/src/$3_$2
	fi

	git reset --hard -q
	git checkout $2 -q
	git pull -q
}

checkout 'silverstripe/sapphire.git' '3.0' 'framework'
checkout 'silverstripe/sapphire.git' '2.4' 'framework'
checkout 'silverstripe/sapphire.git' '2.3' 'framework'

echo "Done."