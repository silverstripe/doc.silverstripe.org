update:
	# remove any existing sapphire master locations, as we renamed from sapphire to framework
	if [ -d $(CURDIR)/src/sapphire_master ]; then rm -rf $(CURDIR)/src/sapphire_master; fi

	# framework master
	if [ -d $(CURDIR)/src/framework_master ]; then cd $(CURDIR)/src/framework_master; git pull -q; else git clone -q git://github.com/silverstripe/sapphire.git $(CURDIR)/src/framework_master; fi

	# sapphire 3.0
	if [ -d $(CURDIR)/src/sapphire_3.0 ]; then cd $(CURDIR)/src/sapphire_3.0; git pull -q; else git clone -q --branch 3.0 git://github.com/silverstripe/sapphire.git $(CURDIR)/src/sapphire_3.0; fi

	# sapphire 2.4
	if [ -d $(CURDIR)/src/sapphire_2.4 ]; then cd $(CURDIR)/src/sapphire_2.4; git pull -q; else git clone -q --branch 2.4 git://github.com/silverstripe/sapphire.git $(CURDIR)/src/sapphire_2.4; fi

	# sapphire 2.3
	if [ -d $(CURDIR)/src/sapphire_2.3 ]; then cd $(CURDIR)/src/sapphire_2.3; git pull -q; else git clone -q --branch 2.3 git://github.com/silverstripe/sapphire.git $(CURDIR)/src/sapphire_2.3; fi

	# build index
	cd $(CURDIR); php sapphire/cli-script.php dev/tasks/RebuildLuceneDocsIndex flush=1

test:
	$(MAKE) QUERYSTRING="$(QUERYSTRING)&SkipTests=RestfulServiceTest" -C sapphire test

