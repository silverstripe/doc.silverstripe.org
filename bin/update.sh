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
	if [ ! -d $dir/src/$2 ]; then
		echo "Cloning $1 "
		mkdir $dir/src
		cd $dir/src
		git clone --depth=100 -q git://github.com/$1 $2 --quiet
		cd $2
		git checkout -q origin/master
	else
		cd $dir/src/$2
		git pull -q origin master
		git checkout -q origin/master 
	fi

	if [ $# == 3 ]; then
		echo "Checking out $2 from $1 into $2_$3"

		if [ -d $dir/src/$2_$3 ]; then
			cd $dir/src/$2_$3
		else
			cp -R $dir/src/$2 $dir/src/$2_$3
			cd $dir/src/$2_$3
		fi

		git reset --hard -q
		git checkout $3 -q
		git pull -q
	else
		echo "Checking out $2 from $1 into $2"
	fi
}

# core
checkout 'silverstripe/sapphire.git' 'framework' 'master' 
checkout 'silverstripe/sapphire.git' 'framework' '3.0' 
checkout 'silverstripe/sapphire.git' 'framework' '2.4'
checkout 'silverstripe/sapphire.git' 'framework' '2.3' 

# core modules with docs
checkout 'silverstripe/silverstripe-cms.git' 'cms' '3.0'

# checkout 'silverstripe/silverstripe-docsviewer.git' 'docsviewer'
# checkout 'silverstripe/silverstripe-forum.git' 'forum'
# checkout 'silverstripe/silverstripe-translatable.git' 'translatable'
# checkout 'silverstripe/silverstripe-subsites.git' 'subsites'

# popular labs projects
# checkout 'silverstripe-labs/silverstripe-staticpublisher.git' 'staticpublisher'

echo "Done."