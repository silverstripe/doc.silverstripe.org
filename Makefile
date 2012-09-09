all:
	@echo "Available commands:"
	@grep "^[^#[:space:]].*:$$" Makefile

update:
	@make fetch
	@make index

fetch:
	@./bin/update.sh $(CURDIR)

index:
	@mkdir -p $(CURDIR)/silverstripe-cache/
	@php framework/cli-script.php dev/tasks/RebuildLuceneDocsIndex flush=1

test:
	$(MAKE) QUERYSTRING="$(QUERYSTRING)&SkipTests=RestfulServiceTest" -C sapphire test

