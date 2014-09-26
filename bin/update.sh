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
#				$1 - module path on github (e.g silverstripe/silverstripe.git)
#				$2 - branch name (e.g 3.0)
#				$3 - module name (e.g framework)
#
#===============================================================================
# Parameters: github path
function checkout {
	echo "Checking out $2/$3 from $1"
	mkdir -p $dir/src
	
	if [ ! -d $dir/src/$2 ]; then
		echo "Cloning git://github.com/$1 into $dir/src/$2"
		cd $dir/src
		git clone -q git://github.com/$1 $2
		cd ../
	else
		cd $dir/src/$2
		git fetch origin
		git reset --hard -q
		cd ../../
	fi

	if [ $# == 3 ]; then
		if [ -d $dir/src/$2_$3 ]; then
			cd "$dir/src/$2_$3"
		else
			cp -R "$dir/src/$2" "$dir/src/$2_$3"
			cd "$dir/src/$2_$3"
		fi

		git reset --hard origin/$3 -q
		cd ../../
	fi
}

# core
checkout 'silverstripe/silverstripe-framework.git' 'framework' 'master' 
checkout 'silverstripe/silverstripe-framework.git' 'framework' '3.1' 
checkout 'silverstripe/silverstripe-framework.git' 'framework' '3.0' 
checkout 'silverstripe/silverstripe-framework.git' 'framework' '2.4'
checkout 'silverstripe/silverstripe-framework.git' 'framework' '2.3' 

# core modules with docs
checkout 'silverstripe/silverstripe-cms.git' 'cms' '3.0'

# checkout 'silverstripe/silverstripe-docsviewer.git' 'docsviewer'
# checkout 'silverstripe/silverstripe-forum.git' 'forum'
# checkout 'silverstripe/silverstripe-translatable.git' 'translatable'
# checkout 'silverstripe/silverstripe-subsites.git' 'subsites'

# popular labs projects
# checkout 'silverstripe-labs/silverstripe-staticpublisher.git' 'staticpublisher'

echo "Done."