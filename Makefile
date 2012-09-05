update:
	@echo "Cleaning up existing folders..";
	@if [ -d $(CURDIR)/src/sapphire_master ]; then rm -rf $(CURDIR)/src/sapphire_master; fi

	@echo "Checking out SilverStripe (Framework)..";
	@if [ ! -d $(CURDIR)/src/framework ]; then cd $(CURDIR)/src/framework; git clone --depth=100 -q git://github.com/silverstripe/sapphire.git; fi

	@echo "-- master";
	@if [ -d $(CURDIR)/src/framework_master ]; then cd $(CURDIR)/src/framework_master; git pull -q; else cp -R $(CURDIR)/src/framework $(CURDIR)/src/framework_master; cd $(CURDIR)/src/framework_master; git pull -q; fi

	@echo "-- 3.0";
	@if [ -d $(CURDIR)/src/framework_3.0 ]; then cd $(CURDIR)/src/framework_3.0; git pull -q; else cp -R $(CURDIR)/src/framework $(CURDIR)/src/framework_3.0; cd $(CURDIR)/src/framework_3.0; git pull -q; fi

	@echo "-- 2.4";
	@if [ -d $(CURDIR)/src/framework_2.4 ]; then cd $(CURDIR)/src/framework_2.4; git pull -q; else cp -R $(CURDIR)/src/framework $(CURDIR)/src/framework_2.4; cd $(CURDIR)/src/framework_2.4; git pull -q; fi

	@echo "-- 2.3";
	@if [ -d $(CURDIR)/src/framework_2.3 ]; then cd $(CURDIR)/src/framework_2.3; git pull -q; else cp -R $(CURDIR)/src/framework $(CURDIR)/src/framework_2.3; cd $(CURDIR)/src/framework_2.3; git pull -q; fi

	@echo "Building index";
	@cd $(CURDIR); php framework/cli-script.php dev/tasks/RebuildLuceneDocsIndex flush=1

test:
	$(MAKE) QUERYSTRING="$(QUERYSTRING)&SkipTests=RestfulServiceTest" -C sapphire test

