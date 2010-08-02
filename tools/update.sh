url='git@github.com:chillu/silverstripe-doc-restructuring.git'
base=`dirname $0`
if [ ! -d "$base/../src/github" ]; then
	mkdir $base/../src/
	git clone $url $base/../src/github
fi

cd $base/../src/github/
git pull origin
